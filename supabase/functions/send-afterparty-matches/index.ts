// Admin-triggered email blast: sends each After Party attendee their top 5 matches.
// Computes matches server-side then invokes send-transactional-email per attendee.
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

function score(me: Attendee, them: Attendee): { score: number; reason: string } {
  let s = 0
  let reason = 'Worth saying hi to'
  const sharedNiches = intersect(me.niches, them.niches)
  if (sharedNiches.length) {
    s += 5 * sharedNiches.length
    reason = `Both into ${sharedNiches.slice(0, 2).join(' & ')}`
  }
  const sharedLooking = intersect(me.looking_for, them.looking_for)
  if (sharedLooking.length) {
    s += 5 * sharedLooking.length
    reason = `Both looking for ${sharedLooking[0]}`
  }
  if (me.role === 'brand' && them.role === 'creator') {
    const seeking = (me.brand_seeking || []).map((x) => x.toLowerCase())
    const types = (them.creator_types || []).map((t) => CREATOR_TYPE_TO_SEEKING[t.toLowerCase()] || t.toLowerCase())
    const matched = types.filter((t) => seeking.includes(t))
    if (matched.length) {
      s += 10 * matched.length
      reason = `You're looking for ${matched[0]} — they are one`
    }
    if (them.brands_wishlist && me.company && them.brands_wishlist.toLowerCase().includes(me.company.toLowerCase())) {
      s += 8
      reason = `They named ${me.company} as a dream brand`
    }
  }
  if (me.role === 'creator' && them.role === 'brand') {
    const seeking = (them.brand_seeking || []).map((x) => x.toLowerCase())
    const types = (me.creator_types || []).map((t) => CREATOR_TYPE_TO_SEEKING[t.toLowerCase()] || t.toLowerCase())
    const matched = types.filter((t) => seeking.includes(t))
    if (matched.length) {
      s += 10 * matched.length
      reason = `They're looking for ${matched[0]} — that's you`
    }
    if (me.brands_wishlist && them.company && me.brands_wishlist.toLowerCase().includes(them.company.toLowerCase())) {
      s += 8
      reason = `You named ${them.company} as a dream brand`
    }
  }
  s += 2 * intersect(me.platforms, them.platforms).length
  if (me.role === them.role) s = Math.floor(s * 0.6)
  return { score: s, reason }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

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
  let sent = 0
  let skipped = 0
  const errors: string[] = []

  for (const me of all) {
    if (!me.email) { skipped++; continue }
    const top5 = all
      .filter((a) => a.id !== me.id)
      .map((them) => ({ them, ...score(me, them) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)

    if (!top5.length) { skipped++; continue }

    const inviteUrl = `${PUBLISHED_BASE}/afterparty/${slugify(me.full_name)}`
    const matches = top5.map((r) => ({
      number: r.them.attendee_number,
      name: r.them.full_name + (r.them.role === 'brand' && r.them.company ? ` (${r.them.company})` : ''),
      role: r.them.role,
      reason: r.reason,
    }))

    const { error: sendErr } = await supabase.functions.invoke('send-transactional-email', {
      body: {
        templateName: 'afterparty-matches',
        recipientEmail: me.email,
        idempotencyKey: `afterparty-matches-${me.id}-${Date.now()}`,
        templateData: {
          recipientName: me.full_name.split(' ')[0],
          attendeeNumber: me.attendee_number,
          matches,
          inviteUrl,
        },
      },
    })
    if (sendErr) {
      errors.push(`${me.email}: ${sendErr.message}`)
    } else {
      sent++
    }
  }

  return new Response(
    JSON.stringify({ sent, skipped, errors }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  )
})
