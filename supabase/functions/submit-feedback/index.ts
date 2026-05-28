// Accepts feedback from any logged-in or anonymous user on the Outside Days
// pages, optionally uploads a screenshot to the public event-photos bucket,
// and enqueues the feedback email directly with replyTo set to the sender so
// Jenna can just hit Reply in her inbox.
import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { template as feedbackFromUserTemplate } from '../_shared/transactional-email-templates/feedback-from-user.tsx'

const SITE_NAME = 'Jenna from Basecamp'
const SENDER_DOMAIN = 'notify.basecampoutdoorevents.com'
const FROM_DOMAIN = 'basecampoutdoorevents.com'
const FEEDBACK_RECIPIENT = 'jenna@wearetheoutdoorindustry.com'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
  const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY')
    return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  let body: any
  try { body = await req.json() } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  const message = String(body.message || '').trim().slice(0, 5000)
  const senderEmail = String(body.senderEmail || '').trim().toLowerCase().slice(0, 200)
  const senderName = String(body.senderName || '').trim().slice(0, 200)
  const subjectType = String(body.subjectType || '').trim().slice(0, 50)
  const pageUrl = String(body.pageUrl || '').trim().slice(0, 500)
  const userAgent = String(body.userAgent || '').trim().slice(0, 300)
  const screenshotBase64 = typeof body.screenshotBase64 === 'string' ? body.screenshotBase64 : null
  const screenshotMime = String(body.screenshotMime || 'image/png').slice(0, 50)

  if (!message) {
    return new Response(JSON.stringify({ error: 'message is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
  if (!senderEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(senderEmail)) {
    return new Response(JSON.stringify({ error: 'valid senderEmail is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  // Optional screenshot upload
  let screenshotUrl: string | undefined
  if (screenshotBase64) {
    try {
      const clean = screenshotBase64.replace(/^data:[^;]+;base64,/, '')
      const bytes = Uint8Array.from(atob(clean), (c) => c.charCodeAt(0))
      const MAX = 8 * 1024 * 1024
      if (bytes.byteLength > MAX) {
        return new Response(JSON.stringify({ error: 'Screenshot is larger than 8MB' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
      const ext = screenshotMime.includes('jpeg') ? 'jpg' : screenshotMime.includes('webp') ? 'webp' : 'png'
      const path = `feedback/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`
      const { error: upErr } = await supabase.storage.from('event-photos').upload(path, bytes, {
        contentType: screenshotMime,
        upsert: false,
      })
      if (upErr) {
        console.error('screenshot upload failed', upErr)
      } else {
        const { data: pub } = supabase.storage.from('event-photos').getPublicUrl(path)
        screenshotUrl = pub.publicUrl
      }
    } catch (e) {
      console.error('screenshot decode failed', e)
    }
  }

  const normalizedRecipient = FEEDBACK_RECIPIENT.toLowerCase()
  const { data: suppressed, error: suppressionError } = await supabase
    .from('suppressed_emails')
    .select('id')
    .eq('email', normalizedRecipient)
    .maybeSingle()

  if (suppressionError) {
    console.error('suppression check failed', suppressionError)
    return new Response(JSON.stringify({ error: 'Failed to send feedback' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  const messageId = crypto.randomUUID()
  const templateName = 'feedback-from-user'

  if (suppressed) {
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: templateName,
      recipient_email: FEEDBACK_RECIPIENT,
      status: 'suppressed',
    })
    return new Response(JSON.stringify({ success: false, reason: 'email_suppressed' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  let unsubscribeToken: string
  const { data: existingToken, error: tokenLookupError } = await supabase
    .from('email_unsubscribe_tokens')
    .select('token, used_at')
    .eq('email', normalizedRecipient)
    .maybeSingle()

  if (tokenLookupError) {
    console.error('token lookup failed', tokenLookupError)
    return new Response(JSON.stringify({ error: 'Failed to send feedback' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  if (existingToken && !existingToken.used_at) {
    unsubscribeToken = existingToken.token
  } else if (!existingToken) {
    unsubscribeToken = generateToken()
    const { error: tokenError } = await supabase
      .from('email_unsubscribe_tokens')
      .upsert(
        { token: unsubscribeToken, email: normalizedRecipient },
        { onConflict: 'email', ignoreDuplicates: true }
      )

    if (tokenError) {
      console.error('failed to create unsubscribe token', tokenError)
      return new Response(JSON.stringify({ error: 'Failed to send feedback' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const { data: storedToken, error: reReadError } = await supabase
      .from('email_unsubscribe_tokens')
      .select('token')
      .eq('email', normalizedRecipient)
      .maybeSingle()

    if (reReadError || !storedToken) {
      console.error('failed to confirm unsubscribe token', reReadError)
      return new Response(JSON.stringify({ error: 'Failed to send feedback' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    unsubscribeToken = storedToken.token
  } else {
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: templateName,
      recipient_email: FEEDBACK_RECIPIENT,
      status: 'suppressed',
      error_message: 'Unsubscribe token already used',
    })
    return new Response(JSON.stringify({ success: false, reason: 'email_suppressed' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  const templateData = {
    senderName: senderName || senderEmail,
    senderEmail,
    subjectType,
    pageUrl,
    userAgent,
    message,
    screenshotUrl,
  }
  const html = await renderAsync(React.createElement(feedbackFromUserTemplate.component, templateData))
  const text = await renderAsync(React.createElement(feedbackFromUserTemplate.component, templateData), { plainText: true })
  const subject = typeof feedbackFromUserTemplate.subject === 'function'
    ? feedbackFromUserTemplate.subject(templateData)
    : feedbackFromUserTemplate.subject

  await supabase.from('email_send_log').insert({
    message_id: messageId,
    template_name: templateName,
    recipient_email: FEEDBACK_RECIPIENT,
    status: 'pending',
  })

  const { error: enqueueError } = await supabase.rpc('enqueue_email', {
    queue_name: 'transactional_emails',
    payload: {
      message_id: messageId,
      to: FEEDBACK_RECIPIENT,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      reply_to: senderEmail,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text,
      purpose: 'transactional',
      label: templateName,
      idempotency_key: `feedback-${messageId}`,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  })

  if (enqueueError) {
    console.error('enqueue feedback email failed', enqueueError)
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: templateName,
      recipient_email: FEEDBACK_RECIPIENT,
      status: 'failed',
      error_message: enqueueError.message || 'Failed to enqueue email',
    })
    return new Response(JSON.stringify({ error: 'Failed to send feedback' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  return new Response(JSON.stringify({ success: true, screenshotUrl }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
})
