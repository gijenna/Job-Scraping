## Build `/minneapolis26` (Basecamp Lounge × OR Gatherings, MN)

A single new page. Surgical, additive. No existing files touched except `App.tsx` (one new route) and `supabase/functions/og-meta/index.ts` (one new SLUG_MAP entry for crawler share previews).

### Files to create

1. **`src/pages/EventMinneapolis26.tsx`** — page shell, 6 sections, uses `EditableTextProvider pageSlug="minneapolis26"` + `PageMetaApplier` like other event pages so the OG meta can be managed without code edits later.
2. **`src/components/minneapolis/MNHero.tsx`** — Section 1 (forest hero, kicker, headline, sub, date line, coral CTA pill → `https://basecampoutdoor.typeform.com/ORgatherings`, secondary apply link → `https://basecampoutdoor.typeform.com/MNExperts`).
3. **`src/components/minneapolis/MNWhatIsThis.tsx`** — Section 2 (cream, 3 audience cards, pull-quote box).
4. **`src/components/minneapolis/MNTwoSessions.tsx`** — Section 3 (forest, two clickable cards: Happy Hour Thu Aug 20 3-5pm, Women's Brunch Fri Aug 21 10am-12pm).
5. **`src/components/minneapolis/MNExpertGrid.tsx`** — Section 4. Fetches via existing pattern: `expert_city_assignments` join `industry_experts` where `city_slug = 'minneapolis'` AND `published = true` AND `expert_type != 'brand_rep'` (matches `useDenverExperts` exactly). Renders with the existing **`ExpertCard`** component (the polaroid Type A used in `ExpertGrid`/OutsideDays26), in `ExpertGrid` layout (4/3/2 cols). Empty-state copy + apply link as specced.
6. **`src/components/minneapolis/MNSponsors.tsx`** — Section 5 (cream, 4 placeholder name tiles: REI, QBP, Adidas, The Dyrt; code comment that Jenna will swap real logos later; mailto Jenna CTA).
7. **`src/components/minneapolis/MNFinalCTA.tsx`** — Section 6 (coral band, register CTA).

### Files to edit

- **`src/App.tsx`** — add `import EventMinneapolis26` and `<Route path="/minneapolis26" element={<EventMinneapolis26 />} />` above the catch-all. Nothing else changes.
- **`supabase/functions/og-meta/index.ts`** — add `"/minneapolis26": "minneapolis26"` to `SLUG_MAP` so social crawlers get OG tags. (One-line addition; existing function logic unchanged.)

### Data source confirmed

`expert_city_assignments.city_slug` already supports `'minneapolis'` (verified). Reuses the existing schema and the existing `ExpertCard` polaroid component verbatim — no schema change, no card redesign. Spec mentioned `event_slug = 'minneapolis26'`; the project's actual filter dimension is `city_slug` on assignments, so we use the existing pattern (same as Denver and Portland). Calling this out so Jenna knows MN experts get added via the normal expert assignment flow.

### Design tokens

Inline brand hex values per spec (`#1A2520`, `#F2E7D5`, `#E8836B`, `#F4D03F`, `#A8B5A0`) rather than introducing new global tokens — keeps the page self-contained and avoids touching `tailwind.config.ts` / `index.css`. Josefin Sans is already loaded sitewide. No em dashes in any copy (project rule).

### Out of scope (not touched)

`/afterparty`, `/OutsideDays26`, `/PNW26`, Denver, all `/admin` pages, Connect, candidate/expert intake, Google Sheets sync, expert-og function, existing card components, navigation menu structure (spec says only add if a nav menu with event links exists; the site has no such global menu, so nothing to add).

### Acceptance

- `/minneapolis26` renders all 6 sections; CTAs open Typeform in new tab.
- Expert grid uses existing `ExpertCard` (Type A polaroid) and shows empty state when no MN-assigned published experts exist.
- OG meta served to crawlers via existing `og-meta` edge function with the new slug.
- No other route or component modified.
