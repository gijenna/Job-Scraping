
# Slow Roll x Basecamp — single-page event site

New standalone page at `/slow-roll` (and alias `/slowroll`), styled as a sibling of the existing Minneapolis event pages but using the exact color/typography spec provided (forest/rust/cream, Inter). Linked from the main Basecamp events hub.

## Route & files

- Add route `/slow-roll` (+ alias `/slowroll`) in `src/App.tsx` → new `src/pages/EventSlowRoll.tsx`.
- New folder `src/components/slowroll/` with focused section components:
  - `SlowRollHero.tsx`
  - `SlowRollWhat.tsx`
  - `SlowRollTheme.tsx`
  - `SlowRollGuide.tsx`
  - `SlowRollPartners.tsx`
  - `SlowRollDetails.tsx`
  - `SlowRollWatch.tsx`
  - `SlowRollFooterCTA.tsx`
- Wrap page in `EditableTextProvider pageSlug="slow-roll"` and `PageMetaApplier` so all copy is admin-editable via existing `EditableText` system (consistent with other event pages, avoids credit burn on copy tweaks).
- Reuse existing `AdminLogoManager` + `useEventLogos("slow-roll-partners")` for the partners row so logos can be added/reordered without code changes. Seed with ALSO (existing asset), Slow Roll MSP, and QBP placeholder.

## Design system (page-local, matches spec exactly)

Inline the palette as CSS custom properties scoped to the page root so it doesn't disturb global tokens used by other event pages:

```
--sr-forest:#2f4a3c; --sr-forest-dark:#1e332a; --sr-rust:#c1602f;
--sr-cream:#faf7f2; --sr-ink:#22261f; --sr-muted:#5b5f57; --sr-line:#e2ddd2;
```

Inter loaded via Google Fonts link in `index.html` head (400/500/600/700). Cards: `bg-white rounded-[12px] border border-[--sr-line] p-6 md:p-7`. Buttons: rust bg, white text, medium weight, rounded, generous padding. Badges: uppercase, tracked, rust bg or rust outline.

Mobile-first: stacked single column under `md`, two-column where noted at `md:`, generous vertical rhythm (`py-20 md:py-28`).

## Section-by-section

1. **Hero** — Full-bleed forest-green background. Rust pill "OFFICIAL OUTDOOR RETAILER EVENT" at top. Eyebrow "Basecamp Outdoor x Slow Roll". H1 "Slow Roll x Basecamp". Subline with date/city/evening. Distinct rust bold line "Only 100 riders. Bring your bike or borrow one." Short paragraph pitch (curated 90-min ride, stories on public land/equity/culture, DJ + meal, no OR badge required). Primary rust CTA → Typeform.

2. **What it is** — Cream background, single centered column. Explains Critical Mass-style format, ~90 min, route unknown to riders, volunteers holding intersections, story stops, DJ + free meal end. Small footnote-style line about happening during Black Bike Week (context, not headline).

3. **The theme** — "The story of Minneapolis, told from a bike." Warm editorial voice paraphrased from Anthony's framing. Four short story blocks as light bordered cards in a 2-col grid on desktop:
   - Public waterway access
   - Segregated pools history (handled directly, not sanitized)
   - Reclaimed urban waterway + prairie housing example
   - Music history + rails-to-trails (lighter thread)
   Intro line frames as "here's what's here, and here's the story behind it." All copy in `EditableText`.

4. **Meet your guide** — Two-column card. Left: Anthony's headshot (Trust for Public Land URL). Right: name, credentials (Slow Roll Twin Cities founder w/ Cultural Wellness Center, Major Taylor Bicycling Club of MN co-founder, equity & mobility justice advocate), bio paragraph. Second smaller image below or offset (MSR action photo). HTML comment in JSX noting press-photo provenance + permission pending.

5. **Partners** — Section with logo cards backed by `useEventLogos("slow-roll-partners")`. Each card: logo, name, one-line description (editable via logo manager's existing description field, or hard-coded initial copy in `EditableText` slots keyed by partner). Seed rows: Slow Roll MSP / Cultural Wellness Center, ALSO (uses existing `also-logo.webp` asset), QBP (placeholder pending). Grid supports 3+ without breaking.

6. **The details** — Cream, single card or two-column info list: Date, Time (evening, TBD), Start location (near MCC, TBD), Capacity 100, What to bring (own bike or ALSO loaner e-bike), Free & open. Rust CTA → Typeform.

7. **Watch** — Section with responsive 16:9 iframe wrapper (`aspect-video w-full max-w-3xl mx-auto rounded-[12px] overflow-hidden`) embedding the MPR News YouTube video. Short caption below crediting MPR News.

8. **Footer CTA** — Forest-dark bg. "Come ride with us." Rust CTA → Typeform. Reiterate 100-spot cap. Small "Official Outdoor Retailer Event" mark. Contact jenna@… Small "Presented by Basecamp Outdoor and Slow Roll MSP."

## Editability & content

- Every headline, subhead, paragraph, button label, and detail-field value wrapped in `<EditableText>` with a stable settingKey prefixed `sr_` (e.g. `sr_hero_headline`, `sr_theme_card1_body`, `sr_details_time`).
- Typeform URL wrapped with `EditableLink` so it can be swapped later without a code push.
- Partner logos managed through existing admin logo manager UI already present on other event pages.

## Linking

- Add a link/card on the main events hub (`src/pages/Events.tsx` or the Basecamp landing hub used to surface events) pointing to `/slow-roll`. Confirm which page you want the entry point on before wiring, but default plan: add to `Events.tsx` events list.
- All internal `<Link>`s stay same-origin (basecampoutdoorevents.com). No `lovable.app` URLs anywhere in copy or share strings.

## Head metadata

`PageMetaApplier` title: "Slow Roll x Basecamp · Minneapolis · Aug 19, 2026". Description highlighting 100-rider community ride during OR Minneapolis. Canonical `https://basecampoutdoorevents.com/slow-roll`. og:title/og:url/og:description matching. No og:image set (per project rule — hosting injects one).

## Out of scope

- No changes to `/minneapolis26`, `/MNexperts`, Denver, Portland, or any Type A/B/C card systems.
- No new backend tables or edge functions. Reuses existing `event_settings` (EditableText), `event_logos`, and `page_meta` infra.
- No new photo uploads to CDN in this pass — Anthony's images are referenced by direct external URL with a code comment noting they should be swapped for cleared assets once permission lands.
