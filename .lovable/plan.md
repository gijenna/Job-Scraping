

# Three Changes: Newsletter CTAs, Clickable Event Links, and Registrant Page Navigation

## 1. Add newsletter/event signup CTAs on `/` and `/events`

Both routes render `<Events />`. Add signup calls-to-action linking to `https://basecampoutdoor.typeform.com/Basecamp` in two places:

**A) After the hero** — a slim banner with a "Sign up for events & our weekly newsletter" CTA button.

**B) Before the footer** — replace or augment the existing `PartnerSection` bottom area with a newsletter signup row.

**Files changed:**
- `src/pages/Events.tsx` — add a new `<NewsletterBanner />` component inline (or import) after `<EventsHero />` and before `<SiteFooter />`

The CTA will be a simple styled section: headline like "Stay in the loop" with a button linking to the Typeform.

## 2. Make event location badges clickable in the intake form

In `ExpertIntakeForm.tsx`, the "Event Location(s)" badges (e.g. "Denver", "Portland") are currently static. Make each badge a clickable link to the corresponding event page so invitees can learn more.

Map city slugs to event URLs:
- `denver` → `/OutsideDays26`
- `portland` → `/PNW26`
- `minneapolis` → `/OR26` (or wherever applicable)

Each badge gets wrapped in a `<Link>` that opens in a new tab, with a small external-link icon.

**Files changed:**
- `src/components/experts/ExpertIntakeForm.tsx` — update the badge rendering in the "Event Location(s)" section to include clickable links

## 3. Add SponsorPageNav to `/pnw26` and `/outsidedays26`, move Basecamp Match logo to top-right

Currently these registrant pages have a fixed Basecamp Match logo in the top-left linking to basecampjobs.com. Replace that with:

**Top-left**: The same `<SponsorPageNav />` hamburger menu used on `/gather-denver` and `/gather-pnw`, configured with links to:
- Basecamp Outdoor (external)
- Basecamp Match (external)
- Events Hub (`/events`)
- The other event (Denver shows "Gather PNW → /PNW26", Portland shows "Outside Days Denver → /OutsideDays26")

**Top-right**: Move the Basecamp Match logo+link to `fixed top-4 right-4` instead of left.

**Files changed:**
- `src/pages/EventPNW26.tsx` — import `SponsorPageNav`, replace top-left logo with nav, add Basecamp Match logo to top-right
- `src/pages/EventOutsideDays26.tsx` — same treatment

## Summary

| File | Change |
|------|--------|
| `src/pages/Events.tsx` | Add two newsletter/signup CTA sections with Typeform link |
| `src/components/experts/ExpertIntakeForm.tsx` | Make event location badges clickable links to event pages |
| `src/pages/EventPNW26.tsx` | Add SponsorPageNav, move Basecamp Match logo to top-right |
| `src/pages/EventOutsideDays26.tsx` | Add SponsorPageNav, move Basecamp Match logo to top-right |

