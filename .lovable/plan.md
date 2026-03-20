

# Plan: Admin-Editable Copy & Restrict Signup Domain

## Overview

Two changes:
1. **Editable text on all pages** — build an inline-editing system so admins can click on any text block and edit it directly, stored in the existing `event_settings` table.
2. **Restrict signups** — change `ALLOWED_DOMAINS` to only `@wearetheoutdoorindustry.com`.

## 1. Restrict admin signup to @wearetheoutdoorindustry.com only

Simple one-line change in `src/pages/AdminLogin.tsx` — remove `@basecampjobs.com` from `ALLOWED_DOMAINS`.

## 2. Admin-editable copy system

### Approach: `<EditableText>` wrapper component

Create a reusable `EditableText` component that:
- **Non-admin visitors** see normal text (zero overhead — just renders children)
- **Admins** see a subtle pencil icon on hover; clicking opens an inline editor (textarea/input)
- On save, the text is stored in `event_settings` with a unique key like `page:section:field` (e.g. `gather-denver:hero:tagline`)
- On load, if a saved value exists it overrides the hardcoded default

This leverages the existing `event_settings` table and `useEventSettings` hook — no database changes needed.

### Component: `src/components/EditableText.tsx`

```
Props:
- pageSlug: string (e.g. "events", "gather-denver", "pnw26")
- settingKey: string (e.g. "hero_tagline", "cta_headline")
- defaultText: string (the current hardcoded text)
- as?: "h1" | "h2" | "h3" | "p" | "span" (HTML element to render)
- className?: string (pass through styling)
- multiline?: boolean (textarea vs input)
```

Behavior:
- Uses `useEventSettings(pageSlug)` to check for saved overrides
- Checks auth state to determine if admin
- Admin mode: hover shows edit icon, click opens inline edit with save/cancel
- Saves via `setSetting(settingKey, newValue)`
- Falls back to `defaultText` if no saved value exists

### Integration across pages

Wrap existing hardcoded text strings in `<EditableText>` across all pages. Each page already has (or will get) a page slug. Key pages and sections:

| Page | Slug | Sections to make editable |
|------|------|--------------------------|
| `/events` | `events` | Hero headline/subtitle, newsletter CTA text, pre-footer CTA |
| `/gather-denver` | `gather-denver` | Hero tagline, section headings, CTA text, body copy |
| `/gather-pnw` | `gather-pnw` | Same pattern as Denver |
| `/pnw26` | `pnw26` | Hero details, section headings, testimonials intro |
| `/outsidedays26` | `outsidedays26` | Same pattern as PNW26 |
| `/` (Index) | `index` | Hero, value props, CTA sections |

Components with hardcoded text that will be updated:
- `EventsHero`, `DenverHero`, `PnwHero`, `RegistrantHero`
- `DenverPowerfulPremium`, `PnwPowerfulPremium`
- `DenverHowItWorks`, `PnwHowItWorks`
- `DenverByTheNumbers`, `PnwByTheNumbers`
- `DenverWhoAttends`, `PnwWhoAttends`
- `EventNotHiringCallout`, `DenverFestivalPartner`, `PnwUOPartner`
- `EventLogoTicker` headline
- `JobSeekerTestimonials`, `BasecampEventsGallery`
- `PartnerSection`, `SiteFooter`
- CTA sections on each page

### Performance note

`useEventSettings` fetches once per page slug and caches in state. Multiple `EditableText` components on the same page share the same hook instance via a shared context provider (`EditableTextProvider`) placed at the page level, so there's only one DB call per page.

### File changes summary

| File | Change |
|------|--------|
| `src/pages/AdminLogin.tsx` | Remove `@basecampjobs.com` from allowed domains |
| `src/components/EditableText.tsx` | **New** — inline-editable text component |
| `src/components/EditableTextProvider.tsx` | **New** — context provider for shared settings per page |
| `src/pages/Events.tsx` | Wrap hardcoded text in `EditableText` |
| `src/components/events/EventsHero.tsx` | Accept pageSlug prop, wrap text |
| `src/components/event/DenverHero.tsx` | Wrap headings/tagline |
| `src/components/event/PnwHero.tsx` | Wrap headings/tagline |
| `src/components/event/DenverPowerfulPremium.tsx` | Wrap section text |
| `src/components/event/PnwPowerfulPremium.tsx` | Wrap section text |
| `src/components/event/DenverHowItWorks.tsx` | Wrap steps text |
| `src/components/event/PnwHowItWorks.tsx` | Wrap steps text |
| `src/components/event/DenverByTheNumbers.tsx` | Wrap stats/headings |
| `src/components/event/PnwByTheNumbers.tsx` | Wrap stats/headings |
| `src/components/event/DenverWhoAttends.tsx` | Wrap text |
| `src/components/event/PnwWhoAttends.tsx` | Wrap text |
| `src/components/event/EventNotHiringCallout.tsx` | Wrap text |
| `src/components/event/DenverFestivalPartner.tsx` | Wrap text |
| `src/components/event/PnwUOPartner.tsx` | Wrap text |
| `src/components/event/RegistrantHero.tsx` | Accept optional overrides |
| `src/components/event/JobSeekerTestimonials.tsx` | Wrap heading |
| `src/components/event/BasecampEventsGallery.tsx` | Wrap heading |
| `src/components/events/PartnerSection.tsx` | Wrap text |
| `src/pages/GatherDenver.tsx` | Add `EditableTextProvider` wrapper |
| `src/pages/GatherPNW.tsx` | Add `EditableTextProvider` wrapper |
| `src/pages/EventPNW26.tsx` | Add `EditableTextProvider` wrapper |
| `src/pages/EventOutsideDays26.tsx` | Add `EditableTextProvider` wrapper |
| `src/pages/Index.tsx` | Add `EditableTextProvider` wrapper |

No database changes needed — uses existing `event_settings` table.

