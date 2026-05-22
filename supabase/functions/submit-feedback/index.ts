// Accepts feedback from any logged-in or anonymous user on the Outside Days
// pages, optionally uploads a screenshot to the public event-photos bucket,
// and triggers send-transactional-email with replyTo set to the sender so
// Jenna can just hit Reply in her inbox.
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
  const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

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

  // Send email via existing transactional pipeline
  const { error: sendErr } = await supabase.functions.invoke('send-transactional-email', {
    body: {
      templateName: 'feedback-from-user',
      recipientEmail: 'jenna@wearetheoutdoorindustry.com',
      idempotencyKey: `feedback-${crypto.randomUUID()}`,
      replyTo: senderEmail,
      templateData: {
        senderName: senderName || senderEmail,
        senderEmail,
        subjectType,
        pageUrl,
        userAgent,
        message,
        screenshotUrl,
      },
    },
  })

  if (sendErr) {
    console.error('send-transactional-email failed', sendErr)
    return new Response(JSON.stringify({ error: 'Failed to send feedback' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  return new Response(JSON.stringify({ success: true, screenshotUrl }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
})
