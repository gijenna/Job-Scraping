// Matching engine for the Creator After Party.
// Pure functions — easy to test and run live in the browser.

export interface AfterPartyAttendee {
  id: string;
  attendee_number: number;
  full_name: string;
  slug: string;
  email: string | null;
  photo_url: string | null;
  cartoon_url?: string | null;
  role: "creator" | "brand";
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

// Social intents that allow same-role pairing when shared
const SOCIAL_INTENTS = new Set([
  "make friends in the industry",
  "find a creator to collab with",
  "find a travel partner",
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
  } else {
    if (a.company) n++;
    if (a.brand_seeking?.length) n++;
    if (a.brand_fit_notes) n++;
    if (a.budget_range) n++;
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

function scorePair(me: AfterPartyAttendee, them: AfterPartyAttendee): { score: number; reasons: string[]; brandPriority: boolean } {
  let score = 0;
  const reasons: string[] = [];
  let brandPriority = false;

  const sharedNiches = intersect(me.niches, them.niches);
  if (sharedNiches.length) {
    score += 5 * sharedNiches.length;
    reasons.push(`You're both into ${sharedNiches.slice(0, 2).join(" & ")}`);
  }

  // Social intents (warmer copy)
  const sharedSocial = sharedSocialIntents(me, them);
  if (sharedSocial.length) {
    score += 6 * sharedSocial.length;
    const intent = sharedSocial[0];
    if (intent === "find a travel partner" && sharedNiches.length) {
      reasons.push(`You both want to find a travel buddy in ${sharedNiches[0].toLowerCase()}`);
    } else if (intent === "make friends in the industry") {
      reasons.push(`Both here to make industry friends`);
    } else if (intent === "find a creator to collab with") {
      reasons.push(`Both open to creator collabs`);
    }
  }

  const sharedLooking = intersect(me.looking_for, them.looking_for).filter(
    (x) => !SOCIAL_INTENTS.has(norm(x)) && norm(x) !== VIBE_INTENT,
  );
  if (sharedLooking.length) {
    score += 5 * sharedLooking.length;
    reasons.push(`Both looking for ${sharedLooking[0]}`);
  }

  // Brand → Creator fit
  if (me.role === "brand" && them.role === "creator") {
    const seeking = (me.brand_seeking || []).map(norm);
    const theirTypes = (them.creator_types || []).map((t) => CREATOR_TYPE_TO_BRAND_SEEKING[norm(t)] || norm(t));
    const matchedTypes = theirTypes.filter((t) => seeking.includes(t));
    if (matchedTypes.length) {
      score += 10 * matchedTypes.length;
      reasons.unshift(`You're looking for ${matchedTypes[0]} — they are one`);
      brandPriority = true;
    }
    if (them.brands_wishlist && me.company && them.brands_wishlist.toLowerCase().includes(me.company.toLowerCase())) {
      score += 8;
      reasons.push(`They named ${me.company} as a dream brand`);
    }
  }

  // Creator → Brand fit (mirror) — also flags brandPriority so the brand
  // actively seeking this creator's type jumps to the top of THEIR list too
  if (me.role === "creator" && them.role === "brand") {
    const seeking = (them.brand_seeking || []).map(norm);
    const myTypes = (me.creator_types || []).map((t) => CREATOR_TYPE_TO_BRAND_SEEKING[norm(t)] || norm(t));
    const matchedTypes = myTypes.filter((t) => seeking.includes(t));
    if (matchedTypes.length) {
      score += 10 * matchedTypes.length;
      reasons.unshift(`They're looking for ${matchedTypes[0]} — that's you`);
      brandPriority = true;
    }
    if (me.brands_wishlist && them.company && me.brands_wishlist.toLowerCase().includes(them.company.toLowerCase())) {
      score += 8;
      reasons.push(`You named ${them.company} as a dream brand`);
    }
  }

  // Shared platforms (creators)
  const sharedPlatforms = intersect(me.platforms, them.platforms);
  if (sharedPlatforms.length) {
    score += 2 * sharedPlatforms.length;
  }

  // Same-role pairing: only penalize if NO shared social intent + niche
  if (me.role === them.role) {
    const sameRoleAllowed = sharedSocial.length > 0 && sharedNiches.length > 0;
    if (!sameRoleAllowed) {
      score = Math.floor(score * 0.6);
    }
  }

  return { score, reasons, brandPriority };
}

export function computeMatchesFor(me: AfterPartyAttendee, all: AfterPartyAttendee[], topN = 5): MatchResult[] {
  const meVibing = isJustVibing(me);

  const scored = all
    .filter((a) => a.id !== me.id)
    .filter((them) => {
      // Vibers excluded from others' lists unless mutual
      if (isJustVibing(them) && !meVibing) return false;
      return true;
    })
    .map((them) => {
      const { score, reasons, brandPriority } = scorePair(me, them);
      // De-emphasize matches for vibers
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
      // Brand-first override applies for both directions now
      if (a.brandPriority !== b.brandPriority) {
        return a.brandPriority ? -1 : 1;
      }
      if (b.score !== a.score) return b.score - a.score;
      // Tiebreaker: profile completeness
      return b.completeness - a.completeness;
    });

  // Brand-rep diversity cap: at most 1 person per company in the top N
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
