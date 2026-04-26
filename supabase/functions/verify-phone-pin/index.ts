// Verify the last 4 digits of an attendee's phone number, then mint an
// anonymous Supabase session for that attendee.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!

const GENERIC_FAIL = { ok: false, reason: 'invalid' }

function digitsOnly(v: string | null | undefined): string {
  return (v || '').replace(/\D/g, '')
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { slug, pin } = await req.json()
    const normalizedSlug = typeof slug === 'string' ? slug.trim().toLowerCase() : ''
    const normalizedPin = digitsOnly(typeof pin === 'string' ? pin : String(pin || '')).slice(-4)
    if (!normalizedSlug || normalizedPin.length !== 4) return json({ ok: false, reason: 'bad_request' }, 400)

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: attendee, error } = await admin
      .from('afterparty_attendees')
      .select('id, phone, pin_attempts, pin_locked_until, auth_user_id')
      .eq('slug', normalizedSlug)
      .maybeSingle()

    if (error || !attendee) return json(GENERIC_FAIL, 401)

    const now = new Date()
    if (attendee.pin_locked_until && new Date(attendee.pin_locked_until) > now) {
      return json({ ok: false, reason: 'locked' }, 429)
    }

    const phoneDigits = digitsOnly(attendee.phone)
    if (phoneDigits.length < 4) {
      return json({ ok: false, reason: 'no_phone' }, 400)
    }

    const last4 = phoneDigits.slice(-4)
    if (last4 !== normalizedPin) {
      const attempts = (attendee.pin_attempts || 0) + 1
      const updates: Record<string, unknown> = { pin_attempts: attempts }
      if (attempts >= 5) {
        updates.pin_locked_until = new Date(Date.now() + 30 * 60 * 1000).toISOString()
      }
      await admin.from('afterparty_attendees').update(updates).eq('id', attendee.id)
      return json(GENERIC_FAIL, 401)
    }

    // Match. If this card already belongs to the caller's current browser
    // session, do not mint a second anonymous user. This removes the main
    // source of "correct number, still can't edit" failures.
    const authHeader = req.headers.get('Authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const userClient = createClient(SUPABASE_URL, ANON_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
        global: { headers: { Authorization: authHeader } },
      })
      const { data: userData } = await userClient.auth.getUser()
      if (userData.user?.id) {
        await admin.from('afterparty_attendees').update({
          auth_user_id: userData.user.id,
          pin_attempts: 0,
          pin_locked_until: null,
        }).eq('id', attendee.id)
        return json({ ok: true, attendee_id: attendee.id })
      }
    }

    // No usable caller session — mint a fresh anonymous session for this attendee.
    const anon = createClient(SUPABASE_URL, ANON_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
    const { data: signInData, error: signInErr } = await anon.auth.signInAnonymously({
      options: { data: { attendee_id: attendee.id, slug: normalizedSlug } },
    })
    if (signInErr || !signInData.user || !signInData.session) {
      console.error('anon signin failed', signInErr)
      return json({ ok: false, reason: 'session_failed' }, 500)
    }

    await admin.from('afterparty_attendees').update({
      auth_user_id: signInData.user.id,
      pin_attempts: 0,
      pin_locked_until: null,
    }).eq('id', attendee.id)

    return json({
      ok: true,
      access_token: signInData.session.access_token,
      refresh_token: signInData.session.refresh_token,
      attendee_id: attendee.id,
    })
  } catch (e) {
    console.error('verify-phone-pin error', e)
    return json({ ok: false, reason: 'server_error' }, 500)
  }
})
