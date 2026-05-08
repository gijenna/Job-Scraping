# Phase 4 — Brand Dashboard

Build the post-login experience at `/outsidedays26/dashboard`. Brand reps already authenticate via the existing `BrandDashboard.tsx` shell (lookup → phone → last4 → signed in); right now once signed in they see a placeholder card. We replace that placeholder with the real dashboard.

## What to build

### 1. Backend — new edge function `supabase/functions/brand-dashboard/index.ts`

Service-role function gated by the existing `od_sid` brand_rep session cookie (reuses `_shared/connect-session.ts`). Resolves the rep's brand by looking up the rep's `current_company` and matching it against `event_map_brands.name` for `denver26` (case-insensitive); falls back to first brand the rep is assigned to. Actions:

- `summary` → returns `{ brand, rep, totals: { registered, visited, sent_note, starred, flagged } }`. `registered` = count of `candidates`. `visited` / `sent_note` / `flagged` = counts from `connections` filtered by `brand_id`. `starred` = count from `candidate_starred_brands`.
- `list` → input: `filters` (object), `search` (string), `sort` (enum), `page` (int), `page_size` (default 50). Returns paged candidate rows + per-candidate engagement flags (visited, sent_note, role_flagged, starred, note text, last_activity_at). Server-side filter logic for every chip in the spec; full-text search across `first_name`, `last_name`, `the_hook`, `the_pitch`, `dream_role_title`, `areas_of_expertise`, `niche_experience`. Also writes one row to `filter_logs` per call (brand_rep_id, filters_applied, keyword_search, results_count).
- `candidate` → input: `id`. Returns the full candidate row plus all connections this brand has with that candidate, plus a short-lived signed URL for `resume_url` if present.
- `wishlist` → input: `query`. Inserts a `filter_logs` row with `wishlist_query` populated, no other fields.

All responses follow the existing CORS / cookie pattern in `brand-rep-auth`.

### 2. Client helpers — extend `src/lib/connect-session.ts`

Add `dashboardSummary()`, `dashboardList(params)`, `dashboardCandidate(id)`, `dashboardWishlist(query)`.

### 3. Replace the placeholder in `src/pages/outsidedays/BrandDashboard.tsx`

When `mode === "signed_in"`, render the new `<DashboardWorkspace rep={me} />` instead of the current "ships in the next phase" card. Keep all the auth flow above it untouched.

### 4. New components in `src/components/connect/dashboard/`

- `DashboardWorkspace.tsx` — top-level layout. Desktop: 320px sticky filter sidebar on the left, list+detail on the right. Mobile: filter chips collapse into a sticky `<Sheet>` triggered by a "Filters" button. Header strip shows brand logo + name, rep avatar + name, and the four metric pills from `summary`.
- `DashboardFilters.tsx` — every filter from the spec rendered as named clickable chips (using existing `Badge`/`Toggle` styling), with `Slider` for ranges, `Select` only where laddered (field → focus). Search bar at top. "Wishlist query" textarea + Send button at the bottom in muted styling. Filter state lives in a single typed object passed up via `onChange`. Debounced 300ms.
- `CandidateCard.tsx` — the hero scan card per spec: large cream Hook, polaroid photo, name/stage/location/years, full Pitch, niche/expertise pill badges, engagement badges ("Visited my table", "Sent you a note", "Flagged a role"), quoted note block when present, resume download button. Tap opens `<CandidateProfileDrawer>`.
- `CandidateProfileDrawer.tsx` — `Sheet` (mobile) / `Dialog` (desktop, max-w-3xl) showing every candidate field read-only. Sections: Header (photo, hook, contact incl. LinkedIn link, resume button), Pitch, Career (current + `prior_careers`), Looking for (job types, location, remote, relocation, pay, workplace types), Expertise (areas + niches as bubbles), Outdoor / Management experience, DEI block (only the fields they filled in), Connections-with-this-brand block.
- `VirtualCandidateList.tsx` — uses `@tanstack/react-virtual` (already in lock; if not, install) to render only ~50 cards in DOM. Triggers next page from `dashboardList` on scroll-near-bottom. Sort dropdown lives in the list header.

### 5. UX details

- Default sort: `most_recent_activity` desc using `GREATEST(updated_at, created_at)`.
- Pre-event mode: nothing special in code. Engagement counts are just zero until connections roll in. The "Visited my table" filter shows a small "(0 so far)" hint when summary.visited === 0.
- Wishlist Send → toast "Thanks. We're using this to make search smarter." (no em dash).
- All copy hand-checked for em dashes; use periods/commas/parentheses instead.
- Mobile: filter sheet, single-column card list, drawer slides up. Desktop ≥ md: two-column.

## Files

**New**
- `supabase/functions/brand-dashboard/index.ts`
- `src/components/connect/dashboard/DashboardWorkspace.tsx`
- `src/components/connect/dashboard/DashboardFilters.tsx`
- `src/components/connect/dashboard/CandidateCard.tsx`
- `src/components/connect/dashboard/CandidateProfileDrawer.tsx`
- `src/components/connect/dashboard/VirtualCandidateList.tsx`

**Modified**
- `src/lib/connect-session.ts` (add dashboard helpers)
- `src/pages/outsidedays/BrandDashboard.tsx` (mount workspace when signed in)

## Out of scope for this phase

- Brand-side "send follow-up email back to candidate" (queued for phase 5).
- Editing a candidate profile (read-only by design).
- Cross-brand admin analytics dashboard.
- Saved filter presets.

## Open question

The brand → rep mapping today is heuristic (rep's `current_company` matches `event_map_brands.name`). For Denver this works because the company strings are clean, but a multi-rep brand with messy strings could mis-resolve. Two options:

- **A (proposed):** Ship with the heuristic now. If it mis-resolves for any rep at the event, we add a tiny admin override field (`event_map_brands.rep_ids uuid[]`) in phase 5.
- **B:** Add the `rep_ids` column now via migration and an admin picker on the map. Adds scope but removes ambiguity.

Defaulting to **A** unless you say otherwise.
