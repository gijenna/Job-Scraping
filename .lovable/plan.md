# Oakley invite refinements

Two scoped changes, both Oakley-only (no impact on other invite variants).

## 1. Opening sequence — make the glasses readable

File: `src/components/afterparty/BasecampMatchPopflyLogo.tsx`

**Slow it down (~2x on screen)**
- Increase the burst animation duration from `1900ms` to `3800ms` so each medallion holds visibly through its arc.
- Push the splash-stage fade-out (`STAGE_OUT_DELAY_S`) and the reveal `setTimeout` (`8800ms`) out by ~1.9s so the lockup doesn't cover the burst mid-flight.
- Slightly extend the burst stars' "hold" keyframe in `bmpStarBurst` so 55%→85% sits longer at full opacity before collapsing inward.

**Make glasses bigger**
- Bump `photoSize` cap: from `min(120, max(70, s.size + 30))` to `min(220, max(150, s.size + 80))`. That roughly doubles their on-screen footprint.
- Strengthen the medallion ring/glow so they read against the dark stage at the new size.

**Weight photos higher than stars (~70/30)**
- Replace the alternating `i % 2 === 1` selector with a deterministic 70% selection (e.g. every index where `i % 10 < 7` becomes a photo). With 16 burst slots this yields ~11 product photos and ~5 stars.
- Cycle through the 8 product images so each appears at least once, with a few repeats at varied sizes.

## 2. Venue showcase — horizontal carousel

File: `src/components/afterparty/OakleyRinoVenueShowcase.tsx`

Restructure from a tall vertical stack into a compact card the height of the "25 people coming" panel:

```text
┌──────────────────────────────────────┐
│ THE VENUE   Oakley RiNo              │
│ 2660 Walnut St, Unit 3 · Denver, CO  │
├──────────────────────────────────────┤
│  ◀  [ photo carousel — 1 visible ]  ▶│
│         · · • · ·  (dots)            │
├──────────────────────────────────────┤
│ Brand-new next-gen retail hub in     │
│ RiNo. Brutalist architecture, Prizm  │
│ wall, rooftop lounge…                │
└──────────────────────────────────────┘
```

- Replace the vertical `flex flex-col gap-2` photo stack with a single-photo-visible horizontal carousel (CSS opacity stacking per the project rule — no `AnimatePresence`).
- Auto-advance every 4s; pause on hover.
- Left/right chevron arrows + small dot indicators below for manual control.
- Photos use `aspectRatio: 16/10` so total card height roughly matches the matches panel.
- Reorder content: header/address → carousel → blurb (so the layout reads "25 people coming → photos → words", matching your description of the side rail).

No new dependencies, no schema changes, no impact on other routes.

## Files touched
- `src/components/afterparty/BasecampMatchPopflyLogo.tsx`
- `src/components/afterparty/OakleyRinoVenueShowcase.tsx`