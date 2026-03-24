

# Admin-Hideable Sections + Editable Bubble Logos

## 1. Reusable `HideableSection` wrapper component

Create a single reusable component `src/components/event/HideableSection.tsx` that:
- Takes a `sectionKey` (string), `pageSlug` (string), and `children`
- Uses `useEventSettings` to check if `hide_{sectionKey}` is `"true"`
- If hidden and not admin: renders nothing
- If hidden and admin: renders at 30% opacity with a "Show Section" button
- If visible and admin: shows a small "Hide Section" button in the top-right corner
- Replaces the existing one-off `HideableStats` pattern in `EventOutsideDays26.tsx`

## 2. Wrap every section on every page

Apply `HideableSection` around each distinct section on all pages:

**EventOutsideDays26.tsx** (~6 sections): Hero, LogoTicker, AttendeeSections, Stats, HowToTapIn, Venue, FestivalPartner, Final CTA

**EventPNW26.tsx** (~8 sections): Hero, LogoTicker, WhosComing, HowToTapIn, Brands grid, Testimonials, Gallery, What to Expect, UO Partner, Venue, Final CTA

**EventOutsideDaysCOS.tsx**: Same as Denver plus Confluence Spotlight

**GatherDenver.tsx** (~8 sections): Hero, LogoTicker, NotHiringCallout, FestivalPartner, PowerfulPremium, ByTheNumbers, Testimonials, HowItWorks, Gallery, WhoAttends, CTA

**GatherPNW.tsx** (~8 sections): Hero, LogoTicker, NotHiringCallout, UOPartner, PowerfulPremium, ByTheNumbers, Testimonials, HowItWorks, WhoAttends, CTA

Each section gets a unique key like `denver_hero`, `denver_ticker`, `pnw_venue`, etc.

## 3. Editable bubble logos (CascadingLogoBubbles)

Currently the bubbles pull from `tickerLogos` (the same `event_logos` list used for the ticker). To make the bubble logos independently editable:

- Add a new logo list slug for each page's bubbles: `denver26-bubbles` and `pnw26-bubbles`
- Add these to the `AdminLogoManager` `lists` prop on both pages
- Update `DenverAttendeeSections` and `PnwWhosComing` to accept a `bubbleLogos` prop (from `useEventLogos`) instead of deriving from `tickerLogos`
- If the dedicated bubble logo list is empty, fall back to ticker logos (backward compatible)

## Files Changed

| File | Change |
|------|--------|
| `src/components/event/HideableSection.tsx` | **New** — reusable hide/show wrapper |
| `src/pages/EventOutsideDays26.tsx` | Wrap all sections with `HideableSection`; remove one-off `HideableStats`; add `denver26-bubbles` to AdminLogoManager; pass bubble logos |
| `src/pages/EventPNW26.tsx` | Wrap all sections; add `pnw26-bubbles` to AdminLogoManager; pass bubble logos |
| `src/pages/EventOutsideDaysCOS.tsx` | Wrap all sections |
| `src/pages/GatherDenver.tsx` | Wrap all sections |
| `src/pages/GatherPNW.tsx` | Wrap all sections |
| `src/components/event/DenverAttendeeSections.tsx` | Accept optional `bubbleLogos` prop |
| `src/components/event/PnwWhosComing.tsx` | Accept optional `bubbleLogos` prop |

No database changes needed — uses existing `event_settings` table.

