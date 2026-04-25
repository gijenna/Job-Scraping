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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { slug, pin } = await req.json()
    if (!slug || !pin || typeof pin !== 'string' || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return new Response(JSON.stringify(GENERIC_FAIL), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: attendee, error } = await admin
      .from('afterparty_attendees')
      .select('id, phone, pin_attempts, pin_locked_until, auth_user_id')
      .eq('slug', slug)
      .maybeSingle()

    if (error || !attendee) {
      return new Response(JSON.stringify(GENERIC_FAIL), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const now = new Date()
    if (attendee.pin_locked_until && new Date(attendee.pin_locked_until) > now) {
      return new Response(JSON.stringify({ ok: false, reason: 'locked' }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const phoneDigits = digitsOnly(attendee.phone)
    if (phoneDigits.length < 4) {
      return new Response(JSON.stringify({ ok: false, reason: 'no_phone' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const last4 = phoneDigits.slice(-4)
    if (last4 !== pin) {
      const attempts = (attendee.pin_attempts || 0) + 1
      const updates: Record<string, unknown> = { pin_attempts: attempts }
      if (attempts >= 5) {
        updates.pin_locked_until = new Date(Date.now() + 30 * 60 * 1000).toISOString()
      }
      await admin.from('afterparty_attendees').update(updates).eq('id', attendee.id)
      return new Response(JSON.stringify(GENERIC_FAIL), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Match — mint a fresh anonymous session for this attendee
    const anon = createClient(SUPABASE_URL, ANON_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
    const { data: signInData, error: signInErr } = await anon.auth.signInAnonymously({
      options: { data: { attendee_id: attendee.id, slug } },
    })
    if (signInErr || !signInData.user || !signInData.session) {
      console.error('anon signin failed', signInErr)
      return new Response(JSON.stringify({ ok: false, reason: 'session_failed' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    await admin.from('afterparty_attendees').update({
      auth_user_id: signInData.user.id,
      pin_attempts: 0,
      pin_locked_until: null,
    }).eq('id', attendee.id)

    return new Response(JSON.stringify({
      ok: true,
      access_token: signInData.session.access_token,
      refresh_token: signInData.session.refresh_token,
      attendee_id: attendee.id,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('verify-phone-pin error', e)
    return new Response(JSON.stringify({ ok: false, reason: 'server_error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
