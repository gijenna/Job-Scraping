// Matching engine for the Creator After Party.
// Pure functions — easy to test and run live in the browser.

export interface AfterPartyAttendee {
  id: string;
  attendee_number: number;
  full_name: string;
  slug: string;
  photo_url: string | null;
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

const norm = (s: string) => s.trim().toLowerCase();

function intersect(a: string[] | null, b: string[] | null): string[] {
  if (!a || !b) return [];
  const setB = new Set(b.map(norm));
  return a.filter((x) => setB.has(norm(x)));
}

function scorePair(me: AfterPartyAttendee, them: AfterPartyAttendee): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  const sharedNiches = intersect(me.niches, them.niches);
  if (sharedNiches.length) {
    score += 5 * sharedNiches.length;
    reasons.push(`Both into ${sharedNiches.slice(0, 2).join(" & ")}`);
  }

  const sharedLooking = intersect(me.looking_for, them.looking_for);
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
      reasons.push(`You're looking for ${matchedTypes[0]} — they are one`);
    }
    if (them.brands_wishlist && me.company && them.brands_wishlist.toLowerCase().includes(me.company.toLowerCase())) {
      score += 8;
      reasons.push(`They named ${me.company} as a dream brand`);
    }
  }

  // Creator → Brand fit (mirror)
  if (me.role === "creator" && them.role === "brand") {
    const seeking = (them.brand_seeking || []).map(norm);
    const myTypes = (me.creator_types || []).map((t) => CREATOR_TYPE_TO_BRAND_SEEKING[norm(t)] || norm(t));
    const matchedTypes = myTypes.filter((t) => seeking.includes(t));
    if (matchedTypes.length) {
      score += 10 * matchedTypes.length;
      reasons.push(`They're looking for ${matchedTypes[0]} — that's you`);
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

  // Cap same-role pairings to encourage cross-pollination
  if (me.role === them.role) {
    score = Math.floor(score * 0.6);
  }

  return { score, reasons };
}

export function computeMatchesFor(me: AfterPartyAttendee, all: AfterPartyAttendee[], topN = 5): MatchResult[] {
  const results = all
    .filter((a) => a.id !== me.id)
    .map((them) => {
      const { score, reasons } = scorePair(me, them);
      return { attendee_id: me.id, match_attendee_id: them.id, score, reasons };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map((r, i) => ({ ...r, rank: i + 1 }));
  return results;
}

export function computeAllMatches(all: AfterPartyAttendee[], topN = 5): MatchResult[] {
  return all.flatMap((me) => computeMatchesFor(me, all, topN));
}
