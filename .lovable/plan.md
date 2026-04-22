

## Matching algorithm: completeness score + mutual boost

Three additive changes. No UI restructuring, no form changes, no schema changes beyond one column.

### Where the matching code actually lives

The live matching that powers the invite page and the admin "Lock matches" action runs in **`src/lib/afterparty-matching.ts`** (browser-side). The edge function `compute-afterparty-matches` mirrors the same algorithm for server-side testing and email blasts. Both will be updated identically so scores stay consistent.

### Change 1 — Completeness as a 0–15 score

In `src/lib/afterparty-matching.ts` (and mirror in `supabase/functions/compute-afterparty-matches/index.ts`):

- Replace the existing `completenessScore(them)` (currently a 0/2/5 step value derived from a counting helper) with a new computation that returns 0–15:
  - Role selected → 2
  - At least 1 niche → 2
  - At least 1 content type (`creator_types`) → 2
  - At least 1 intent (`looking_for`) → 2
  - `mind_blowing_fact` length ≥ 50 chars → 3
  - `photo_url` present → 2
  - `cartoon_url` present → 2
- This score is added to each pair's score in place of the old completeness term. All other dimensions (Intent 35 / Niche 27 / Format 19 / Role 14) stay untouched.
- The old `profileCompleteness` helper stays only as the tiebreaker integer used in sort comparison (unchanged), since it's also used for diversity ordering. The new 15-point score is what feeds into the score itself.

### Change 2 — Mutual matching boost (second pass)

In `computeAllMatches` (and the edge function's batch path):

1. First pass: for every attendee A, score every candidate and keep their **top 10** (not 5) — using the existing sort and brand-diversity cap, but at `topN=10`.
2. Build a lookup: `topTen[attendeeId] = Set<candidateId>`.
3. Second pass: for each pair (A, B) where B is in A's top 10 **and** A is in B's top 10:
   - Add 10 to A→B score and 10 to B→A score.
   - Mark both rows `is_mutual_boost = true`.
4. Re-sort each attendee's candidates by updated score, re-apply the brand-diversity cap, and slice to top 5.

`computeMatchesFor` (single-attendee live preview on the invite page) gets a lightweight version: it now needs the full attendee set anyway, so it internally runs the same two-pass routine and returns just `me`'s top 5. This keeps the live preview consistent with what gets locked.

### Change 3 — DB column + UI border

- **Migration**: add `is_mutual_boost boolean NOT NULL DEFAULT false` to `afterparty_matches`. The admin "Lock matches" path (`afterparty-admin` edge function, `lock_matches` action) already inserts match rows; it'll start writing this column. No RLS or type changes beyond regen.
- **Type updates**: `MatchResult` interface gains `is_mutual_boost?: boolean` and is propagated from both the lib and the edge function.
- **UI** (`src/components/afterparty/MatchesPanel.tsx`): the only visual change is on each match row's outer button — when `match.is_mutual_boost` is true, set its left border to `2px solid #BA7517` (overriding just the left edge of the existing 1px border). No badge, label, tooltip, ordering change, or copy change.

### Files touched

- `supabase/migrations/<ts>_match_mutual_boost.sql` — adds `is_mutual_boost` column
- `src/lib/afterparty-matching.ts` — new completeness scoring + mutual-boost two-pass; `MatchResult.is_mutual_boost`
- `supabase/functions/compute-afterparty-matches/index.ts` — same algorithm changes mirrored
- `supabase/functions/afterparty-admin/index.ts` — when locking matches, persist `is_mutual_boost` from incoming match rows
- `src/components/afterparty/MatchesPanel.tsx` — amber left border when `is_mutual_boost` is true

### Out of scope

No changes to forms, schema fields beyond one boolean column, scoring weights for intent/niche/format/role, brand-diversity cap, vibe-mode discount, or any other component.

