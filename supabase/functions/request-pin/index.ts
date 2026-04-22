// Generate and email a 4-digit PIN to an attendee's email on file.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import bcrypt from 'https://esm.sh/bcryptjs@2.4.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!local || !domain) return '•••••'
  const head = local.slice(0, 1)
  return `${head}${'•'.repeat(Math.max(3, local.length - 1))}@${domain}`
}

function generatePin(): string {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return String(1000 + (buf[0] % 9000))
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { slug } = await req.json()
    if (!slug || typeof slug !== 'string') {
      return new Response(JSON.stringify({ ok: false, reason: 'bad_request' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: attendee, error } = await admin
      .from('afterparty_attendees')
      .select('id, full_name, email, slug_opened_at, pin_locked_until')
      .eq('slug', slug)
      .maybeSingle()

    if (error || !attendee) {
      // Generic response — never leak whether slug exists
      return new Response(JSON.stringify({ ok: true, masked_email: null }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (attendee.pin_locked_until && new Date(attendee.pin_locked_until) > new Date()) {
      return new Response(JSON.stringify({ ok: false, reason: 'locked' }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!attendee.email) {
      return new Response(JSON.stringify({ ok: false, reason: 'no_email' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Generate + hash PIN
    const pin = generatePin()
    const hash = await bcrypt.hash(pin, 10)
    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const updates: Record<string, unknown> = {
      pin_hash: hash,
      pin_expires_at: expires,
      pin_attempts: 0,
    }
    if (!attendee.slug_opened_at) updates.slug_opened_at = new Date().toISOString()

    const { error: updErr } = await admin
      .from('afterparty_attendees')
      .update(updates)
      .eq('id', attendee.id)

    if (updErr) {
      console.error('update failed', updErr)
      return new Response(JSON.stringify({ ok: false, reason: 'server_error' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Send PIN via transactional email
    const { error: emailErr } = await admin.functions.invoke('send-transactional-email', {
      body: {
        templateName: 'afterparty-pin',
        recipientEmail: attendee.email,
        idempotencyKey: `afterparty-pin-${attendee.id}-${Date.now()}`,
        templateData: { pin, name: attendee.full_name?.split(' ')[0] || null },
      },
    })

    if (emailErr) {
      console.error('email send failed', emailErr)
      // Don't fail the request — PIN is stored. Surface a soft error.
      return new Response(JSON.stringify({ ok: false, reason: 'email_failed' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({
      ok: true,
      masked_email: maskEmail(attendee.email),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('request-pin error', e)
    return new Response(JSON.stringify({ ok: false, reason: 'server_error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
