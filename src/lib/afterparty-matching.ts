// Matching engine for the Creator After Party.
// 100-point weighted system: Intent 35 · Niche 27 · Format 19 · Role 14 · Completeness 5

export interface AfterPartyAttendee {
  id: string;
  attendee_number: number;
  full_name: string;
  slug: string;
  email: string | null;
  photo_url: string | null;
  cartoon_url?: string | null;
  role: "creator" | "brand" | "industry_expert" | string;
  niches: string[] | null;
  looking_for: string[] | null;
  creator_types: string[] | null;
  audience_size: string | null;
  platforms: string[] | null;
  brands_wishlist: string | null;
  mind_blowing_fact: string | null;
  company: string | null;
  company_role: string | null;
  brand_seeking: string[] | null;
  budget_range: string | null;
  brand_fit_notes: string | null;
}

export interface MatchResult {
  attendee_id: string;
  match_attendee_id: string;
  score: number;
  reasons: string[];
  rank: number;
}

const CREATOR_TYPE_TO_BRAND_SEEKING: Record<string, string> = {
  videographer: "videographers",
  photographer: "photographers",
  influencer: "influencers",
  writer: "writers",
  podcaster: "podcasters",
  athlete: "athletes",
};

// Niche adjacency map (case/space insensitive lookup via norm)
const NICHE_ADJACENCY: Record<string, string[]> = {
  fishing: ["fly fishing", "waterfowl"],
  "fly fishing": ["fishing"],
  hunting: ["archery", "waterfowl"],
  archery: ["hunting"],
  waterfowl: ["hunting", "fishing"],
  hiking: ["camping", "overlanding", "backpacking", "trail running"],
  camping: ["hiking", "overlanding", "backpacking"],
  overlanding: ["camping", "hiking"],
  backpacking: ["hiking", "camping"],
  "trail running": ["hiking"],
  climbing: ["hiking"],
  skiing: ["snowboarding"],
  snowboarding: ["skiing"],
  cycling: ["mountain biking"],
  "mountain biking": ["cycling"],
};

const SOCIAL_INTENTS = new Set([
  "make friends in the industry",
  "find a creator to collab with",
  "find a travel partner",
  "collab with another creator",
  "make friends",
]);
const VIBE_INTENT = "just here to vibe";

const norm = (s: string) => s.trim().toLowerCase();

function intersect(a: string[] | null, b: string[] | null): string[] {
  if (!a || !b) return [];
  const setB = new Set(b.map(norm));
  return a.filter((x) => setB.has(norm(x)));
}

function profileCompleteness(a: AfterPartyAttendee): number {
  let n = 0;
  if (a.photo_url) n++;
  if (a.niches?.length) n++;
  if (a.looking_for?.length) n++;
  if (a.mind_blowing_fact) n++;
  if (a.role === "creator") {
    if (a.creator_types?.length) n++;
    if (a.platforms?.length) n++;
    if (a.brands_wishlist) n++;
    if (a.audience_size) n++;
  } else if (a.role === "brand") {
    if (a.company) n++;
    if (a.brand_seeking?.length) n++;
    if (a.brand_fit_notes) n++;
    if (a.budget_range) n++;
  } else {
    if (a.company) n++;
    if (a.mind_blowing_fact) n++;
  }
  return n;
}

function isJustVibing(a: AfterPartyAttendee): boolean {
  return (a.looking_for || []).some((x) => norm(x) === VIBE_INTENT);
}

function sharedSocialIntents(me: AfterPartyAttendee, them: AfterPartyAttendee): string[] {
  const mine = (me.looking_for || []).map(norm).filter((x) => SOCIAL_INTENTS.has(x));
  const theirs = new Set((them.looking_for || []).map(norm));
  return mine.filter((x) => theirs.has(x));
}

function nicheScore(me: AfterPartyAttendee, them: AfterPartyAttendee): { points: number; reason: string | null } {
  const exact = intersect(me.niches, them.niches);
  if (exact.length) {
    return { points: 27, reason: `You're both into ${exact.slice(0, 2).join(" & ")}` };
  }
  // Adjacency check
  const myNiches = (me.niches || []).map(norm);
  const theirNiches = new Set((them.niches || []).map(norm));
  for (const mine of myNiches) {
    const adj = NICHE_ADJACENCY[mine] || [];
    for (const a of adj) {
      if (theirNiches.has(a)) {
        return { points: 15, reason: `Adjacent niches: ${mine} & ${a}` };
      }
    }
  }
  return { points: 0, reason: null };
}

function intentScore(
  me: AfterPartyAttendee,
  them: AfterPartyAttendee,
): { points: number; reasons: string[]; brandPriority: boolean } {
  let points = 0;
  const reasons: string[] = [];
  let brandPriority = false;

  // Brand → Creator strong fit
  if (me.role === "brand" && them.role === "creator") {
    const seeking = (me.brand_seeking || []).map(norm);
    const theirTypes = (them.creator_types || []).map((t) => CREATOR_TYPE_TO_BRAND_SEEKING[norm(t)] || norm(t));
    const matched = theirTypes.filter((t) => seeking.includes(t));
    if (matched.length) {
      points = Math.max(points, 35);
      reasons.unshift(`You're looking for ${matched[0]} — they are one`);
      brandPriority = true;
    }
    if (them.brands_wishlist && me.company && them.brands_wishlist.toLowerCase().includes(me.company.toLowerCase())) {
      points = Math.max(points, 35);
      reasons.push(`They named ${me.company} as a dream brand`);
    }
  }

  if (me.role === "creator" && them.role === "brand") {
    const seeking = (them.brand_seeking || []).map(norm);
    const myTypes = (me.creator_types || []).map((t) => CREATOR_TYPE_TO_BRAND_SEEKING[norm(t)] || norm(t));
    const matched = myTypes.filter((t) => seeking.includes(t));
    if (matched.length) {
      points = Math.max(points, 35);
      reasons.unshift(`They're looking for ${matched[0]} — that's you`);
      brandPriority = true;
    }
    if (me.brands_wishlist && them.company && me.brands_wishlist.toLowerCase().includes(them.company.toLowerCase())) {
      points = Math.max(points, 35);
      reasons.push(`You named ${them.company} as a dream brand`);
    }
  }

  // Shared social intents
  const sharedSocial = sharedSocialIntents(me, them);
  if (sharedSocial.length && points < 35) {
    points = Math.max(points, 20);
    const intent = sharedSocial[0];
    if (intent === "find a travel partner") reasons.push("Both want to find a travel partner");
    else if (intent.includes("friend")) reasons.push("Both here to make industry friends");
    else if (intent.includes("collab")) reasons.push("Both open to creator collabs");
  }

  // Generic shared looking_for
  const sharedLooking = intersect(me.looking_for, them.looking_for).filter(
    (x) => !SOCIAL_INTENTS.has(norm(x)) && norm(x) !== VIBE_INTENT,
  );
  if (sharedLooking.length && points < 20) {
    points = Math.max(points, 15);
    reasons.push(`Both looking for ${sharedLooking[0]}`);
  }

  return { points, reasons, brandPriority };
}

function formatScore(me: AfterPartyAttendee, them: AfterPartyAttendee): number {
  // Brand seeks specific creator type that matches creator's type → 19
  if (me.role === "brand" && them.role === "creator") {
    const seeking = (me.brand_seeking || []).map(norm);
    const types = (them.creator_types || []).map((t) => CREATOR_TYPE_TO_BRAND_SEEKING[norm(t)] || norm(t));
    if (types.some((t) => seeking.includes(t))) return 19;
  }
  if (me.role === "creator" && them.role === "brand") {
    const seeking = (them.brand_seeking || []).map(norm);
    const types = (me.creator_types || []).map((t) => CREATOR_TYPE_TO_BRAND_SEEKING[norm(t)] || norm(t));
    if (types.some((t) => seeking.includes(t))) return 19;
  }
  // General format alignment via shared platforms or shared creator_types
  const sharedTypes = intersect(me.creator_types, them.creator_types);
  const sharedPlatforms = intersect(me.platforms, them.platforms);
  if (sharedTypes.length || sharedPlatforms.length) return 10;
  return 0;
}

function roleComplementarity(me: AfterPartyAttendee, them: AfterPartyAttendee): number {
  const r1 = me.role, r2 = them.role;
  if ((r1 === "brand" && r2 === "creator") || (r1 === "creator" && r2 === "brand")) return 14;
  if ((r1 === "creator" && r2 === "industry_expert") || (r1 === "industry_expert" && r2 === "creator")) return 8;
  if ((r1 === "brand" && r2 === "industry_expert") || (r1 === "industry_expert" && r2 === "brand")) return 8;
  if (r1 === r2) {
    // same-role baseline = 5, bumped to 14 if mutual social intent
    const sharedSocial = sharedSocialIntents(me, them);
    return sharedSocial.length > 0 ? 14 : 5;
  }
  return 5;
}

function completenessScore(them: AfterPartyAttendee): number {
  const c = profileCompleteness(them);
  if (c >= 7) return 5;
  if (c >= 4) return 2;
  return 0;
}

function scorePair(me: AfterPartyAttendee, them: AfterPartyAttendee): {
  score: number;
  reasons: string[];
  brandPriority: boolean;
} {
  const reasons: string[] = [];
  const intent = intentScore(me, them);
  reasons.push(...intent.reasons);

  const niche = nicheScore(me, them);
  if (niche.reason) reasons.push(niche.reason);

  const fmt = formatScore(me, them);
  const role = roleComplementarity(me, them);
  const completeness = completenessScore(them);

  const score = intent.points + niche.points + fmt + role + completeness;
  return { score, reasons, brandPriority: intent.brandPriority };
}

export function computeMatchesFor(me: AfterPartyAttendee, all: AfterPartyAttendee[], topN = 5): MatchResult[] {
  const meVibing = isJustVibing(me);

  const scored = all
    .filter((a) => a.id !== me.id)
    .filter((them) => {
      if (isJustVibing(them) && !meVibing) return false;
      return true;
    })
    .map((them) => {
      const { score, reasons, brandPriority } = scorePair(me, them);
      const finalScore = meVibing ? Math.floor(score * 0.5) : score;
      return {
        attendee_id: me.id,
        match_attendee_id: them.id,
        score: finalScore,
        reasons,
        brandPriority,
        completeness: profileCompleteness(them),
      };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => {
      if (a.brandPriority !== b.brandPriority) return a.brandPriority ? -1 : 1;
      if (b.score !== a.score) return b.score - a.score;
      return b.completeness - a.completeness;
    });

  // Brand-rep diversity cap: max 1 per company
  const seenCompanies = new Set<string>();
  const capped: typeof scored = [];
  for (const r of scored) {
    const them = all.find((a) => a.id === r.match_attendee_id);
    const companyKey = them?.company ? norm(them.company) : null;
    if (companyKey) {
      if (seenCompanies.has(companyKey)) continue;
      seenCompanies.add(companyKey);
    }
    capped.push(r);
    if (capped.length >= topN) break;
  }

  return capped.map((r, i) => ({
    attendee_id: r.attendee_id,
    match_attendee_id: r.match_attendee_id,
    score: r.score,
    reasons: r.reasons,
    rank: i + 1,
  }));
}

export function computeAllMatches(all: AfterPartyAttendee[], topN = 5): MatchResult[] {
  return all.flatMap((me) => computeMatchesFor(me, all, topN));
}
