// Sends the 9am "See you tonight @ Oakley RiNo" blast to every after-party registrant.
// Computes top-5 matches server-side and invokes send-transactional-email per attendee.
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PUBLISHED_BASE = 'https://basecampoutdoorevents.com'

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

interface Attendee {
  id: string
  attendee_number: number
  full_name: string
  email: string | null
  slug?: string | null
  role: 'creator' | 'brand'
  niches: string[] | null
  looking_for: string[] | null
  creator_types: string[] | null
  platforms: string[] | null
  brands_wishlist: string | null
  company: string | null
  brand_seeking: string[] | null
}

const CREATOR_TYPE_TO_SEEKING: Record<string, string> = {
  videographer: 'videographers',
  photographer: 'photographers',
  influencer: 'influencers',
  writer: 'writers',
  podcaster: 'podcasters',
  athlete: 'athletes',
}

function intersect(a: string[] | null, b: string[] | null): string[] {
  if (!a || !b) return []
  const set = new Set(b.map((x) => x.toLowerCase().trim()))
  return a.filter((x) => set.has(x.toLowerCase().trim()))
}

function score(me: Attendee, them: Attendee): number {
  let s = 0
  s += 5 * intersect(me.niches, them.niches).length
  s += 5 * intersect(me.looking_for, them.looking_for).length
  if (me.role === 'brand' && them.role === 'creator') {
    const seeking = (me.brand_seeking || []).map((x) => x.toLowerCase())
    const types = (them.creator_types || []).map((t) => CREATOR_TYPE_TO_SEEKING[t.toLowerCase()] || t.toLowerCase())
    s += 10 * types.filter((t) => seeking.includes(t)).length
    if (them.brands_wishlist && me.company && them.brands_wishlist.toLowerCase().includes(me.company.toLowerCase())) s += 8
  }
  if (me.role === 'creator' && them.role === 'brand') {
    const seeking = (them.brand_seeking || []).map((x) => x.toLowerCase())
    const types = (me.creator_types || []).map((t) => CREATOR_TYPE_TO_SEEKING[t.toLowerCase()] || t.toLowerCase())
    s += 10 * types.filter((t) => seeking.includes(t)).length
    if (me.brands_wishlist && them.company && me.brands_wishlist.toLowerCase().includes(them.company.toLowerCase())) s += 8
  }
  s += 2 * intersect(me.platforms, them.platforms).length
  if (me.role === them.role) s = Math.floor(s * 0.6)
  return s
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
  const userClient = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } })
  const { data: userData } = await userClient.auth.getUser()
  const adminEmail = userData?.user?.email?.toLowerCase() || ''
  if (!adminEmail.endsWith('@wearetheoutdoorindustry.com')) {
    return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  // Optional body params: { testEmail?: string, attendeeId?: string }
  let testEmail: string | undefined
  let attendeeIdFilter: string | undefined
  try {
    const body = await req.json()
    if (body?.testEmail && typeof body.testEmail === 'string') testEmail = body.testEmail.trim()
    if (body?.attendeeId && typeof body.attendeeId === 'string') attendeeIdFilter = body.attendeeId
  } catch { /* no body is fine */ }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, serviceKey)

  const { data: attendees, error } = await supabase
    .from('afterparty_attendees')
    .select('*')
    .order('attendee_number')

  if (error || !attendees) {
    return new Response(JSON.stringify({ error: error?.message || 'Failed to load attendees' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const all = attendees as Attendee[]

  // Choose recipient list:
  // - test mode: send a single email to testEmail using attendeeIdFilter (or first attendee) as data source
  // - normal: every attendee with an email
  let recipients: Array<{ me: Attendee; deliverTo: string }> = []
  if (testEmail) {
    const source = attendeeIdFilter
      ? all.find((a) => a.id === attendeeIdFilter)
      : all.find((a) => a.attendee_number === 36) || all[0]
    if (!source) {
      return new Response(JSON.stringify({ error: 'No attendees to use as test source' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    recipients = [{ me: source, deliverTo: testEmail }]
  } else {
    recipients = all.filter((a) => !!a.email).map((a) => ({ me: a, deliverTo: a.email! }))
  }

  let sent = 0
  let skipped = 0
  const errors: string[] = []

  for (const { me, deliverTo } of recipients) {
    const top5 = all
      .filter((a) => a.id !== me.id)
      .map((them) => ({ them, score: score(me, them) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)

    const slug = (me as any).slug || slugify(me.full_name)
    const guestsUrl = `${PUBLISHED_BASE}/guests?slug=${slug}`
    const matches = top5.map((r) => ({
      number: r.them.attendee_number,
      name: r.them.full_name + (r.them.role === 'brand' && r.them.company ? ` (${r.them.company})` : ''),
      role: r.them.role,
    }))

    const { error: sendErr } = await supabase.functions.invoke('send-transactional-email', {
      body: {
        templateName: 'afterparty-tonight',
        recipientEmail: deliverTo,
        idempotencyKey: `afterparty-tonight-${me.id}-${testEmail ? 'test' : 'blast'}-${Date.now()}`,
        templateData: {
          recipientName: me.full_name.split(' ')[0],
          attendeeNumber: me.attendee_number,
          matches,
          guestsUrl,
        },
      },
    })
    if (sendErr) {
      errors.push(`${deliverTo}: ${sendErr.message}`)
      skipped++
    } else {
      sent++
    }
  }

  return new Response(
    JSON.stringify({ sent, skipped, errors, test: !!testEmail }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  )
})
