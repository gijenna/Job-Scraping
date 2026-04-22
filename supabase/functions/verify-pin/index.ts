// Verify a 4-digit PIN, then mint an anonymous Supabase session for that attendee.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import bcrypt from 'https://esm.sh/bcryptjs@2.4.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!

const GENERIC_FAIL = { ok: false, reason: 'invalid' }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { slug, pin } = await req.json()
    if (!slug || !pin || typeof pin !== 'string' || pin.length !== 4) {
      return new Response(JSON.stringify(GENERIC_FAIL), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: attendee, error } = await admin
      .from('afterparty_attendees')
      .select('id, full_name, email, pin_hash, pin_expires_at, pin_attempts, pin_locked_until, auth_user_id')
      .eq('slug', slug)
      .maybeSingle()

    if (error || !attendee) {
      return new Response(JSON.stringify(GENERIC_FAIL), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const now = new Date()
    if (attendee.pin_locked_until && new Date(attendee.pin_locked_until) > now) {
      return new Response(JSON.stringify(GENERIC_FAIL), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!attendee.pin_hash || !attendee.pin_expires_at || new Date(attendee.pin_expires_at) < now) {
      return new Response(JSON.stringify(GENERIC_FAIL), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const ok = await bcrypt.compare(pin, attendee.pin_hash)
    if (!ok) {
      const attempts = (attendee.pin_attempts || 0) + 1
      const updates: Record<string, unknown> = { pin_attempts: attempts }
      if (attempts >= 5) {
        updates.pin_locked_until = new Date(Date.now() + 30 * 60 * 1000).toISOString()
        updates.pin_hash = null
        updates.pin_expires_at = null
      }
      await admin.from('afterparty_attendees').update(updates).eq('id', attendee.id)
      return new Response(JSON.stringify(GENERIC_FAIL), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // PIN valid — ensure an auth user exists for this attendee
    let authUserId = attendee.auth_user_id

    if (!authUserId) {
      // Create an anonymous user via the anon client
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
      authUserId = signInData.user.id

      // Persist the link + clear PIN + mark verified
      await admin.from('afterparty_attendees').update({
        auth_user_id: authUserId,
        pin_hash: null,
        pin_expires_at: null,
        pin_attempts: 0,
        pin_locked_until: null,
        email_verified: true,
      }).eq('id', attendee.id)

      return new Response(JSON.stringify({
        ok: true,
        access_token: signInData.session.access_token,
        refresh_token: signInData.session.refresh_token,
        attendee_id: attendee.id,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Returning attendee — generate a fresh session for the existing user
    const anon = createClient(SUPABASE_URL, ANON_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
    const { data: signInData, error: signInErr } = await anon.auth.signInAnonymously({
      options: { data: { attendee_id: attendee.id, slug } },
    })
    if (signInErr || !signInData.user || !signInData.session) {
      console.error('anon resignin failed', signInErr)
      return new Response(JSON.stringify({ ok: false, reason: 'session_failed' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    await admin.from('afterparty_attendees').update({
      auth_user_id: signInData.user.id,
      pin_hash: null,
      pin_expires_at: null,
      pin_attempts: 0,
      pin_locked_until: null,
      email_verified: true,
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
    console.error('verify-pin error', e)
    return new Response(JSON.stringify({ ok: false, reason: 'server_error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
