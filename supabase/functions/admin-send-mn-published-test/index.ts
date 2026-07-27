// One-off admin trigger to send the MN expert published test email.
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null)
  const url = Deno.env.get('SUPABASE_URL')!
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const body = await req.json().catch(() => ({}))
  const recipient = body.recipient || 'jenna@wearetheoutdoorindustry.com'
  const slug = body.slug || 'jenna-celmer'
  const name = body.name || 'Jenna'

  const supabase = createClient(url, key)
  const { data, error } = await supabase.functions.invoke('send-transactional-email', {
    body: {
      templateName: 'mn-expert-published',
      recipientEmail: recipient,
      idempotencyKey: `mn-expert-published-test-${Date.now()}`,
      templateData: { recipientName: name, expertSlug: slug },
    },
  })
  return new Response(JSON.stringify({ data, error }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
