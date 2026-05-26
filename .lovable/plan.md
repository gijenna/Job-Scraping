## 1. Clicking the Expert Zone on the map opens an experts-only panel

Currently when the Expert Zone tile is clicked, it opens `MapBrandPanel` (the same panel used for brand cards), which doesn't show the industry experts list.

**Change in `src/pages/EventOutsideDays26.tsx`:**
- In the `EventMapCanvas` `onClick` handler, branch on `brand.name === "Industry Expert Zone"`. If it's the expert zone, open a new dedicated panel instead of `MapBrandPanel`.

**Create `src/components/event/MapExpertZonePanel.tsx`:**
- A right-side sheet (same visual treatment as `MapBrandPanel`) that:
  - Receives the same `industryExperts` array already loaded on the page (passed in as a prop — no extra fetch, identical to the "Industry Pros You'll Meet in Person" section).
  - Header: "Industry Expert Zone" + small caption "Free thanks to Edges First" with the cream Edges First wordmark (reuse the asset/filter already used in `ExpertSponsorCallout`).
  - Body: grid of `ExpertCardMinimal` cards (one per industry expert).
  - Kelly's card (matched by `full_name` starting with "Kelly"): rendered first, with a coral ring `ring-2 ring-events-coral animate-pulse` and a small "Made this possible" badge — same glow treatment we already use in `ExpertSponsorCallout`.

## 2. Remove industry experts from the VF (and other brand) card "Team" list

Daniel Mattie, Natalie Viragh, and Jessica Paul are stored as `expert_type = 'industry_expert'`, but `MapBrandPanel` matches reps by company name only and shows them under VF Corp.

**Change in `src/components/event/MapBrandPanel.tsx`:**
- In the `fetchReps` effect, when mapping `assignData` to reps, keep only rows where `d.expert_type === 'brand_rep'`. Industry experts will no longer appear on any brand card — they belong in the Expert Zone only.

## Out of scope

- No DB/schema changes (the three people are already classified correctly as industry experts).
- No changes to `MapExpertZone` admin tool, `MapExpertZoneGroup` rendering on the map, or the "Industry Pros You'll Meet in Person" section itself.
