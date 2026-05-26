## Goal
On `/outsidedays26` give Kelly Bleck / Edges First a prominent, hard-to-miss sponsor callout above the Industry Experts section, plus add a Nemo "seats provided by" credit. Add a glowing ring around Kelly's expert card so visitors find her immediately.

## What to build

### 1. New `ExpertSponsorCallout` component (mirrors the /connect treatment, but bigger and more visual)
Renders a wide card directly above the Industry Experts grid in the existing `denver_industry_experts` section. Includes:

- Edges First logo (auto-fetched from edgesfirst.co via the existing logo fallback util) inside a coral ring.
- Headline (editable): "Industry Experts brought to you by Edges First"
- Sub-blurb (editable, defaults to Kelly's provided copy, condensed): "Edges First is a digital experience and web shop founded by Kelly Bleck, built for the outdoor + community-impact world. Kelly made this entire Industry Expert program possible — go say thanks and check out her work."
- Two CTAs:
  - "Visit edgesfirst.co" → https://edgesfirst.co/ (editable URL via EditableLink)
  - "Meet Kelly" → scrolls to / pulses her expert card (uses existing `?expert=<slug>` highlight mechanism by setting the hash)
- Secondary line with Nemo wordmark logo (auto from nemoequipment.com) + editable text: "Seats provided by Nemo — chat with experts in comfy Stargaze chairs."

All copy uses `EditableText` / `EditableLink` with new `setting_key`s so Jenna can edit later. Per project rule: all new copy must be admin-editable.

### 2. Glow ring on Kelly's expert card
Extend `IndustryExpertCardsSection` with an optional `sponsorExpertSlug` prop. When a card matches that slug, wrap it in an absolutely positioned glowing coral ring (animated subtle pulse, similar to the existing `featured-bubble-list-glow` style in ConnectHome). The glow is independent of the existing `highlightExpert` query-param effect, so it's always on for Kelly.

Pass `sponsorExpertSlug="kelly-bleck"` from `EventOutsideDays26.tsx` (the slug will be confirmed from the experts list at render time by matching `e.full_name` starting with "kelly" → take its `slug`, same pattern already used in `ConnectHome.tsx`).

### 3. Wire-up in `EventOutsideDays26.tsx`
- Compute `kellyExpert` and its slug from `industryExperts` (same pattern as ConnectHome).
- Render the new `<ExpertSponsorCallout>` inside the `denver_industry_experts` section, immediately above the cards grid (handled by passing it as a `header` slot prop or by inserting it inside the section component — I'll add a `headerSlot?: ReactNode` prop to `IndustryExpertCardsSection` so order/styling stays consistent).
- Pass `sponsorExpertSlug={kellyExpert?.slug}`.

### 4. Editable keys created
- `denver_expert_sponsor_headline`
- `denver_expert_sponsor_blurb`
- `denver_expert_sponsor_cta_text` / `denver_expert_sponsor_cta_url` (default https://edgesfirst.co/)
- `denver_expert_sponsor_meet_kelly_text`
- `denver_nemo_seats_text` (default "Seats provided by Nemo — chat with experts in comfy Stargaze chairs.")
- `denver_nemo_url` (default https://www.nemoequipment.com/)

No DB migration needed — `event_settings` rows are created on first edit, defaults render inline.

## Files touched
- `src/components/event/ExpertSponsorCallout.tsx` (new)
- `src/components/event/IndustryExpertCardsSection.tsx` (add `sponsorExpertSlug` + `headerSlot` props, glow ring wrapper)
- `src/pages/EventOutsideDays26.tsx` (compute kelly, render callout, pass slug)
- `src/index.css` (one new `@keyframes` + class for the coral pulse ring if not reusable)

## Optional extra visibility (your "any other way?" question)
Two low-effort additions I'd recommend, but will skip unless you say yes:
- (a) Add Edges First as a featured bubble in the "Meet the Teams" bubble cloud (it's already in `edgesFirstBrand` on the Connect side).
- (b) Add a small "Site by Edges First" credit in the `SiteFooter` linking to edgesfirst.co.

Say "yes do both" / "just a" / "just b" / "skip" and I'll include it in the build.
