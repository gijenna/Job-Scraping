## Goal

Make /MNexperts (expert invite landing) and /minneapolis26 (public event page) reflect the **OR Gatherings × Basecamp Outdoor** partnership, surface past Denver + Portland experts, capture each expert's session preference (Aug 20 happy hour and/or Aug 21 women's brunch), and give admin full control over copy, ordering, hiding, and card style.

## 1. Assets & branding

- Upload the two attached PNGs (`GATHER logos (5).png` stacked, `GATHER logos (4).png` horizontal) to Lovable Assets under `src/assets/mn26/`.
- Use the **horizontal lockup** in the `/minneapolis26` hero block and the `/MNexperts` hero. Use the **stacked lockup** in the OR Gatherings explainer section.
- Update all visible labels from "Basecamp Outdoor Lounge × Minneapolis" to **"Basecamp Outdoor @ OR Gatherings · Minneapolis"** (each line still EditableText, so admin can override).
- `expert_cities.event_title` for `minneapolis` → "Basecamp Outdoor @ OR Gatherings". Page meta + `<title>` updated.

## 2. New "OR Gatherings" explainer section (both pages)

Insert a section pulling the framing from the OR press release (paraphrased, all EditableText):

> Outdoor Retailer introduces **OR Gatherings**: intentional, intimate conversations on the show floor designed to spark meaningful industry dialogue. Basecamp Outdoor is hosting two of them in Minneapolis.

Includes the OR Outdoor Retailer logo, the OR Gatherings lockup, and a "Presented with Outdoor Retailer" caption. Added as `mn_or_gatherings` to the OrderedSections list on `/minneapolis26` and as a top section on `/MNexperts`.

## 3. Two-session selector

### Schema (migration)
Add to `expert_city_assignments`:
- `attend_aug20_happyhour boolean default false`
- `attend_aug21_brunch boolean default false`
- `hidden_on_mn boolean default false` (used by past-experts section only)

### Expert intake (MN only)
In `ExpertIntakeForm.tsx`, when `citySlug === "minneapolis"`, render a two-checkbox block:
- ☐ Aug 20 · Happy Hour (3–5 PM) — open to all
- ☐ Aug 21 · Women's Brunch (10 AM–12 PM) — women only

Both can be selected. Persists onto the MN assignment row. Existing forms for Denver/Portland are untouched.

### Public page filter tabs
On `/minneapolis26`, the expert grid gets a tab bar: **All · Aug 20 Happy Hour · Aug 21 Women's Brunch**. Each expert card shows small session chips. Tabs filter client-side on the loaded list.

### Two Sessions block
The existing `MNTwoSessions` component updates to the confirmed dates/times and adds a "Both welcome" note.

## 4. Past experts section (both pages, combined grid)

New component `MNPastExpertsSection.tsx`:
- Query `expert_city_assignments` where `city_slug IN ('denver','portland')` AND `published = true`, joined to `industry_experts`.
- Dedupe by expert id (an expert who did both cities appears once).
- Exclude any expert with a row in new `mn_past_expert_hidden` table.
- Renders the grid using the existing `IndustryExpertCardsSection` pattern (Type A polaroid / B compact / C minimal) driven by an `event_settings` key `card_style_mn_past_experts` so admin gets the same A/B/C picker.
- Each card has a small city tag ("Denver '25" / "Portland '25").
- Admin sees an eye-toggle on each card to hide from this section only (page-scoped). Hides persist in `mn_past_expert_hidden(expert_id pk, hidden_at)`.

Heading (EditableText): "Who's shown up before" · subhead: "Experts from past Basecamp Outdoor activations in Denver and Portland."

CTA at bottom links to `/minneapolis26`: "See who's confirmed for Minneapolis →" (only on /MNexperts; on /minneapolis26 it links to the upcoming expert grid section anchor).

## 5. Admin controls (matching OutsideDays26 / PNW pattern)

Both pages already use `EditableTextProvider` and `OrderedSections`. Confirm and extend:
- **Reorder & hide sections**: `OrderedSections` already supports drag + hide via `event_settings` (`section_order_minneapolis26`, `section_hidden_<key>`). Add the new sections (`mn_or_gatherings`, `mn_past_experts`) to its registry.
- **Edit copy without credits**: every new heading, paragraph, button label uses `<EditableText>` / `<EditableLink>` already wired to `event_settings`.
- **Link click counts**: existing `LinkTracker` + `link_clicks` table. Wrap the new OR Retailer link, past-experts CTA, and 2-session apply links. Admin already has the count overlay.
- **Card style A/B/C**: `CardStylePicker` reused for the past-experts grid (`card_style_mn_past_experts`) and confirm the main MN expert grid uses one (`card_style_mn_experts`).

## 6. /MNexperts page-level changes

`ExpertInvite.tsx` Minneapolis branch:
- Hero swaps in OR Gatherings horizontal lockup + updated tagline.
- Adds the OR Gatherings explainer block.
- Adds the new past-experts section.
- Adds a "View the public event page →" link to `/minneapolis26` (LinkTracker).
- Two-session selector now shown in the intake form when an invited expert lands here.

## 7. Out of scope

- No changes to Denver, Portland, /afterparty, /OutsideDays26, Connect, brand dashboard, existing card components, or Google Sheets sync.
- Women-only enforcement on Aug 21 is honor-system via the checkbox label — no gender field added to experts.
- No emails sent from this change.

## Technical summary

- **Migration 1**: `ALTER TABLE expert_city_assignments ADD attend_aug20_happyhour bool default false, attend_aug21_brunch bool default false`.
- **Migration 2**: `CREATE TABLE mn_past_expert_hidden(expert_id uuid pk references industry_experts on delete cascade, hidden_at timestamptz default now())` + GRANTs (`select` to anon for public read, full to authenticated/service_role) + RLS (public select, authenticated full).
- **New files**: `src/components/minneapolis/MNORGatherings.tsx`, `src/components/minneapolis/MNPastExperts.tsx`, `src/assets/mn26/or-gatherings-horizontal.png.asset.json`, `src/assets/mn26/or-gatherings-stacked.png.asset.json`.
- **Edited files**: `src/pages/EventMinneapolis26.tsx` (register new sections), `src/pages/ExpertInvite.tsx` (MN-only branch), `src/components/minneapolis/MNHero.tsx` (lockup), `src/components/minneapolis/MNTwoSessions.tsx` (confirmed times), `src/components/minneapolis/MNExpertGrid.tsx` (session tabs + chips), `src/components/experts/ExpertIntakeForm.tsx` (MN session checkboxes), `src/components/event/IndustryExpertCardsSection.tsx` (reuse for past experts — or thin wrapper).
- No changes to existing card components themselves.
