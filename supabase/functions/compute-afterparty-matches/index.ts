// Server-side wrapper around the matching algorithm.
// Two modes:
//   1. POST {} — pulls live attendees from the DB and returns everyone's top 5
//   2. POST { attendees: [...], topN?: 5 } — runs against fake attendees you paste in
// Mirrors src/lib/afterparty-matching.ts including completeness 0–15 + mutual boost pass.
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Attendee {
  id: string
  attendee_number?: number
  full_name: string
  role: 'creator' | 'brand' | 'industry_expert' | string
  niches?: string[] | null
  looking_for?: string[] | null
  creator_types?: string[] | null
  platforms?: string[] | null
  brands_wishlist?: string | null
  company?: string | null
  brand_seeking?: string[] | null
  photo_url?: string | null
  cartoon_url?: string | null
  audience_size?: string | null
  mind_blowing_fact?: string | null
  brand_fit_notes?: string | null
  budget_range?: string | null
  email?: string | null
}

const CREATOR_TYPE_TO_SEEKING: Record<string, string> = {
  videographer: 'videographers', photographer: 'photographers',
  influencer: 'influencers', writer: 'writers',
  podcaster: 'podcasters', athlete: 'athletes',
}
const SOCIAL_INTENTS = new Set([
  'make friends in the industry',
  'find a creator to collab with',
  'find a travel partner',
])
const VIBE_INTENT = 'just here to vibe'
const norm = (s: string) => s.trim().toLowerCase()
const intersect = (a?: string[] | null, b?: string[] | null) => {
  if (!a || !b) return []
  const set = new Set(b.map(norm))
  return a.filter((x) => set.has(norm(x)))
}
const isVibing = (a: Attendee) => (a.looking_for || []).some((x) => norm(x) === VIBE_INTENT)
const sharedSocial = (me: Attendee, them: Attendee) => {
  const mine = (me.looking_for || []).map(norm).filter((x) => SOCIAL_INTENTS.has(x))
  const theirs = new Set((them.looking_for || []).map(norm))
  return mine.filter((x) => theirs.has(x))
}

// Tiebreaker integer (used for sort/diversity ordering only)
function profileCompleteness(a: Attendee): number {
  let n = 0
  if (a.photo_url) n++
  if (a.niches?.length) n++
  if (a.looking_for?.length) n++
  if (a.mind_blowing_fact) n++
  if (a.role === 'creator') {
    if (a.creator_types?.length) n++
    if (a.platforms?.length) n++
    if (a.brands_wishlist) n++
    if (a.audience_size) n++
  } else {
    if (a.company) n++
    if (a.brand_seeking?.length) n++
    if (a.brand_fit_notes) n++
    if (a.budget_range) n++
  }
  return n
}

// New 0–15 score that feeds directly into the match score.
function completenessScore(them: Attendee): number {
  let pts = 0
  if (them.role) pts += 2
  if (them.niches && them.niches.length > 0) pts += 2
  if (them.creator_types && them.creator_types.length > 0) pts += 2
  if (them.looking_for && them.looking_for.length > 0) pts += 2
  if (them.mind_blowing_fact && them.mind_blowing_fact.length >= 50) pts += 3
  if (them.photo_url) pts += 2
  if (them.cartoon_url) pts += 2
  return pts
}

function scorePair(me: Attendee, them: Attendee) {
  let score = 0
  const reasons: string[] = []
  let brandPriority = false
  const sharedNiches = intersect(me.niches, them.niches)
  if (sharedNiches.length) {
    score += 5 * sharedNiches.length
    reasons.push(`You're both into ${sharedNiches.slice(0, 2).join(' & ')}`)
  }
  const social = sharedSocial(me, them)
  if (social.length) {
    score += 6 * social.length
    const intent = social[0]
    if (intent === 'find a travel partner' && sharedNiches.length) {
      reasons.push(`You both want to find a travel buddy in ${sharedNiches[0].toLowerCase()}`)
    } else if (intent === 'make friends in the industry') {
      reasons.push(`Both here to make industry friends`)
    } else {
      reasons.push(`Both open to creator collabs`)
    }
  }
  const sharedLooking = intersect(me.looking_for, them.looking_for).filter(
    (x) => !SOCIAL_INTENTS.has(norm(x)) && norm(x) !== VIBE_INTENT,
  )
  if (sharedLooking.length) {
    score += 5 * sharedLooking.length
    reasons.push(`Both looking for ${sharedLooking[0]}`)
  }
  if (me.role === 'brand' && them.role === 'creator') {
    const seeking = (me.brand_seeking || []).map(norm)
    const types = (them.creator_types || []).map((t) => CREATOR_TYPE_TO_SEEKING[norm(t)] || norm(t))
    const matched = types.filter((t) => seeking.includes(t))
    if (matched.length) {
      score += 10 * matched.length
      reasons.unshift(`You're looking for ${matched[0]}, they are one`)
      brandPriority = true
    }
    if (them.brands_wishlist && me.company && them.brands_wishlist.toLowerCase().includes(me.company.toLowerCase())) {
      score += 8
      reasons.push(`They named ${me.company} as a dream brand`)
    }
  }
  if (me.role === 'creator' && them.role === 'brand') {
    const seeking = (them.brand_seeking || []).map(norm)
    const types = (me.creator_types || []).map((t) => CREATOR_TYPE_TO_SEEKING[norm(t)] || norm(t))
    const matched = types.filter((t) => seeking.includes(t))
    if (matched.length) {
      score += 10 * matched.length
      reasons.unshift(`They're looking for ${matched[0]}, and that's you`)
      brandPriority = true
    }
    if (me.brands_wishlist && them.company && me.brands_wishlist.toLowerCase().includes(them.company.toLowerCase())) {
      score += 8
      reasons.push(`You named ${them.company} as a dream brand`)
    }
  }
  score += 2 * intersect(me.platforms, them.platforms).length
  // 0–15 completeness contribution
  score += completenessScore(them)
  if (me.role === them.role) {
    const sameRoleAllowed = social.length > 0 && sharedNiches.length > 0
    if (!sameRoleAllowed) score = Math.floor(score * 0.6)
  }
  return { score, reasons, brandPriority }
}

interface Scored {
  them: Attendee
  score: number
  reasons: string[]
  brandPriority: boolean
  completeness: number
  is_mutual_boost?: boolean
}

function scoreCandidates(me: Attendee, all: Attendee[]): Scored[] {
  const meVibing = isVibing(me)
  return all
    .filter((a) => a.id !== me.id)
    .filter((them) => (isVibing(them) && !meVibing ? false : true))
    .map((them) => {
      const { score, reasons, brandPriority } = scorePair(me, them)
      return {
        them,
        score: meVibing ? Math.floor(score * 0.5) : score,
        reasons, brandPriority, completeness: profileCompleteness(them),
      }
    })
    .filter((r) => r.score > 0)
}

function rankAndCap(scored: Scored[], topN: number): Scored[] {
  const sorted = [...scored].sort((a, b) => {
    if (a.brandPriority !== b.brandPriority) return a.brandPriority ? -1 : 1
    if (b.score !== a.score) return b.score - a.score
    return b.completeness - a.completeness
  })
  const seen = new Set<string>()
  const capped: Scored[] = []
  for (const r of sorted) {
    const key = r.them.company ? norm(r.them.company) : null
    if (key) {
      if (seen.has(key)) continue
      seen.add(key)
    }
    capped.push(r)
    if (capped.length >= topN) break
  }
  return capped
}

function toMatchRows(scored: Scored[]) {
  return scored.map((r, i) => ({
    match_attendee_id: r.them.id,
    match_name: r.them.full_name,
    match_number: r.them.attendee_number,
    match_role: r.them.role,
    match_company: r.them.company,
    score: r.score,
    reasons: r.reasons,
    rank: i + 1,
    is_mutual_boost: r.is_mutual_boost ?? false,
  }))
}

// Two-pass: build top-10 per attendee, apply mutual boost, then take top-N.
function runPipeline(attendees: Attendee[], topN: number) {
  const scoredById = new Map<string, Scored[]>()
  const topTen = new Map<string, Set<string>>()
  for (const me of attendees) {
    const s = scoreCandidates(me, attendees)
    scoredById.set(me.id, s)
    const t10 = rankAndCap(s, 10)
    topTen.set(me.id, new Set(t10.map((r) => r.them.id)))
  }
  for (const me of attendees) {
    const myTop10 = topTen.get(me.id)
    if (!myTop10) continue
    const myScored = scoredById.get(me.id)!
    for (const cand of myScored) {
      if (!myTop10.has(cand.them.id)) continue
      const theirTop10 = topTen.get(cand.them.id)
      if (theirTop10 && theirTop10.has(me.id)) {
        cand.score += 10
        cand.is_mutual_boost = true
      }
    }
  }
  const final = new Map<string, Scored[]>()
  for (const me of attendees) {
    final.set(me.id, rankAndCap(scoredById.get(me.id) || [], topN))
  }
  return final
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let body: { attendees?: Attendee[]; topN?: number; meId?: string } = {}
  try { body = await req.json() } catch { /* empty body OK */ }

  let attendees = body.attendees
  if (!attendees || !attendees.length) {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const { data, error } = await supabase.from('afterparty_attendees').select('*').order('attendee_number')
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    attendees = (data || []) as Attendee[]
  }

  const topN = body.topN || 5
  const pipeline = runPipeline(attendees, topN)

  if (body.meId) {
    const me = attendees.find((a) => a.id === body.meId)
    if (!me) {
      return new Response(JSON.stringify({ error: 'meId not found in attendees' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    return new Response(JSON.stringify({
      me: { id: me.id, name: me.full_name, role: me.role, company: me.company },
      matches: toMatchRows(pipeline.get(me.id) || []),
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  const all = attendees.map((me) => ({
    attendee_id: me.id,
    name: me.full_name,
    number: me.attendee_number,
    role: me.role,
    company: me.company,
    matches: toMatchRows(pipeline.get(me.id) || []),
  }))
  return new Response(JSON.stringify({ count: all.length, results: all }), {
    status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
