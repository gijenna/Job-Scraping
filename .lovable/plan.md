

# Plan: Admin Logo Management, Expert Card Styles, Copy Fixes

## 1. Make ALL logos admin-manageable (add/delete/hyperlink/reorder) without credits

Currently the pages have hardcoded brand arrays plus DB logos merged in. The approach: **move all hardcoded logos into the `event_logos` DB table** via a seed migration, then render purely from DB. This way every logo is manageable through the existing `AdminLogoManager` panel.

### Database seed migration
Insert all hardcoded brands from:
- `EventPNW26.tsx` pnwBrands (16 items) → event_slug `pnw26`
- `EventOutsideDays26.tsx` denverBrands (15 items) → event_slug `denver26`
- `GatherPNW.tsx` pnwBrands (19 items) → event_slug `gather-pnw`
- `GatherDenver.tsx` denverBrands (22 items) → event_slug `gather-denver`

Each with `name`, `domain`, `display_order`, and `url` where applicable (e.g. Peak Design careers link).

### Remove hardcoded arrays
In all 4 pages, remove the `const xxxBrands = [...]` arrays. Instead, use `useEventLogos(slug)` directly. The pages become purely DB-driven.

### Enhance AdminLogoManager
- Add an **inline URL edit** field — click a logo in the admin panel to set/edit its hyperlink
- The existing add/delete/reorder already works

### Pass DB logos to sub-components
- **`EventOutsideDays26.tsx`**: Pass DB logos to `RegistrantDenverStats` and `DenverByTheNumbers` (via `EventLogoTicker` already gets `allBrands`). Both `DenverByTheNumbers` and `RegistrantDenverStats` have hardcoded `brandLogos` arrays — replace these with a prop that receives the DB logos.
- **`DenverByTheNumbers.tsx`**: Change `brandLogos` from hardcoded to a required prop `logos`. The `LogoBubble` component will use `logo_url` if available, falling back to favicon. Wrap in `<a>` if `url` is set.
- **`RegistrantDenverStats.tsx`**: Same — accept logos as prop, remove hardcoded array.
- **`EventLogoTicker.tsx`**: Already accepts brands as prop. Add support for `logo_url` and `url` fields — wrap logo in `<a>` if url exists, use `logo_url` if provided instead of favicon.

### Drag-to-reorder for /PNW26
Replace the up/down arrows in `AdminLogoManager` with drag-and-drop using `@dnd-kit/core` and `@dnd-kit/sortable`. This gives smooth drag reordering on all pages.

**Files**: `EventPNW26.tsx`, `EventOutsideDays26.tsx`, `GatherPNW.tsx`, `GatherDenver.tsx`, `DenverByTheNumbers.tsx`, `RegistrantDenverStats.tsx`, `EventLogoTicker.tsx`, `AdminLogoManager.tsx`, `useEventLogos.ts`, migration SQL

---

## 2. Fix "Industry Expert" on one line in ExpertInvite hero

In `ExpertInvite.tsx` lines 253-259, the non-personalized hero has:
```
Become an<br />
<span>Industry Expert</span><br />
at {eventTitle}.
```
Remove the `<br />` before "Industry Expert" so "Become an Industry Expert" flows on one line, with "at {eventTitle}." below.

**File**: `src/pages/ExpertInvite.tsx`

---

## 3. Card display style switcher (A/B/C) for expert & brand cards

Add an admin-only toggle on `/PNW26` and `/OutsideDays26` that lets you pick between 3 card styles for the expert/brand rep sections. Store the selection in a new DB table `event_settings` (key-value per event_slug) so it persists without credits.

### Card styles:
- **A (Polaroid)**: Current `ExpertCard` — photo with Polaroid frame, expandable details
- **B (Compact)**: Horizontal card — small round photo left, name + title + company right, no expand
- **C (Minimal)**: Grid of circular photos with name underneath, company logo badge

### Implementation:
- New table `event_settings`: `id`, `event_slug`, `setting_key` (text), `setting_value` (text)
- RLS: public SELECT, authenticated INSERT/UPDATE/DELETE
- New `ExpertCardCompact` and `ExpertCardMinimal` components
- In `PnwWhosComing` and `DenverAttendeeSections`, read `card_style` from `event_settings` for the slug, and render the matching card component
- Admin-only floating style picker (A/B/C buttons) appears on those sections when authenticated

**Files**: `ExpertCardCompact.tsx`, `ExpertCardMinimal.tsx`, `PnwWhosComing.tsx`, `DenverAttendeeSections.tsx`, `CardStylePicker.tsx`, migration SQL

---

## Summary

| File | Changes |
|------|---------|
| Migration | Seed `event_logos` with all hardcoded brands; create `event_settings` table |
| `EventPNW26.tsx` | Remove hardcoded brands, use DB logos only |
| `EventOutsideDays26.tsx` | Remove hardcoded brands, pass DB logos to stats components |
| `GatherPNW.tsx` | Remove hardcoded brands, add `AdminLogoManager` + `useEventLogos` |
| `GatherDenver.tsx` | Remove hardcoded brands, add `AdminLogoManager` + `useEventLogos` |
| `DenverByTheNumbers.tsx` | Accept logos prop, support `logo_url` and `url` |
| `RegistrantDenverStats.tsx` | Accept logos prop, support `logo_url` and `url` |
| `EventLogoTicker.tsx` | Support `logo_url` and `url` fields |
| `AdminLogoManager.tsx` | Add inline URL edit, drag-and-drop reorder |
| `useEventLogos.ts` | Add `updateLogo` method for URL editing |
| `ExpertInvite.tsx` | Fix "Industry Expert" line break |
| `ExpertCardCompact.tsx` | New compact card variant |
| `ExpertCardMinimal.tsx` | New minimal card variant |
| `CardStylePicker.tsx` | Admin-only A/B/C style toggle |
| `PnwWhosComing.tsx` | Read card style from DB, render matching component |
| `DenverAttendeeSections.tsx` | Read card style from DB, render matching component |

