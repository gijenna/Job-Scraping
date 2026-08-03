import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const url = Deno.env.get('SUPABASE_URL')!
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const body = await req.json().catch(() => ({}))
  const recipient = body.recipient || 'jenna@wearetheoutdoorindustry.com'
  const slug = body.slug || 'jenna-celmer'
  const name = body.name || 'Jenna'

  const resp = await fetch(`${url}/functions/v1/send-transactional-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
    },
    body: JSON.stringify({
      templateName: 'mn-expert-published',
      recipientEmail: recipient,
      idempotencyKey: `mn-expert-published-test-${Date.now()}`,
      templateData: { recipientName: name, expertSlug: slug },
    }),
  })
  const text = await resp.text()
  return new Response(JSON.stringify({ status: resp.status, body: text }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
