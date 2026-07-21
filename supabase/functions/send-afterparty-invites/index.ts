// Admin-triggered: sends a personalized invite email to every attendee with status='invited'
// (or to specific IDs if attendee_ids[] is provided).
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PUBLISHED_BASE = 'https://basecampoutdoorevents.com'
const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Admin-only: require @wearetheoutdoorindustry.com JWT
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
  const userClient = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } })
  const { data: userData } = await userClient.auth.getUser()
  const email = userData?.user?.email?.toLowerCase() || ''
  if (!email.endsWith('@wearetheoutdoorindustry.com')) {
    return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  let body: { attendee_ids?: string[]; only_invited?: boolean } = { only_invited: true }
  try { body = { ...body, ...(await req.json()) } } catch { /* empty OK */ }

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  let query = supabase.from('afterparty_attendees').select('*').order('attendee_number')
  if (body.attendee_ids?.length) {
    query = query.in('id', body.attendee_ids)
  } else if (body.only_invited !== false) {
    query = query.eq('status', 'invited')
  }
  const { data: attendees, error } = await query
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let sent = 0, skipped = 0
  const errors: string[] = []
  for (const a of (attendees || [])) {
    if (!a.email) { skipped++; continue }
    const inviteUrl = `${PUBLISHED_BASE}/afterparty/${a.slug || slugify(a.full_name)}`
    const { error: sendErr } = await supabase.functions.invoke('send-transactional-email', {
      body: {
        templateName: 'afterparty-invite',
        recipientEmail: a.email,
        idempotencyKey: `afterparty-invite-${a.id}`,
        templateData: {
          recipientName: a.full_name.split(' ')[0],
          attendeeNumber: a.attendee_number,
          inviteUrl,
          role: a.role,
        },
      },
    })
    if (sendErr) errors.push(`${a.email}: ${sendErr.message}`)
    else sent++
  }

  return new Response(JSON.stringify({ sent, skipped, errors, total: attendees?.length || 0 }), {
    status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
