# Polish Oakley pages + guest cards

## 1. Community Partners — make subheaders pop
File: `src/components/afterparty/AfterPartySpotlights.tsx`

The category labels ("Brands", "Beverages", "Food", "Giveaways & Swag") currently use `CREAM_FAINT` (rgba(245,230,211,0.5)) which disappears against the mural on mobile.

- Change category labels to neon coral `#ED7660` with bold weight (700), uppercase, and a soft text-shadow glow `0 0 10px rgba(237,118,96,0.5)`.
- Slightly darken the section's existing translucent backdrop so the labels stay legible: bump section panel and add a per-category mini-backdrop (`rgba(8,8,8,0.55)` with `backdrop-blur-sm`, rounded, small inline padding) so each label sits on its own readable strip.

## 2. Mural — subdue on desktop, hide on mobile
File: `src/components/afterparty/MatchesPanel.tsx`

- Lower mural intensity: drop filter to `saturate(1.05) contrast(1.0) brightness(0.95)` and add a subtle dark overlay tint via mask gradient stop (`linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 18%, rgba(0,0,0,0.2) 100%)`).
- Hide the mural strip entirely on mobile: gate the strip `<div>` and the `pr-[42%] md:pr-[47%]` padding behind a `useIsMobile()` check (or Tailwind `hidden md:block` on the strip and conditional padding `md:pr-[47%]` only).
- Result: mobile match bars become full-width text again; desktop keeps the mural but quieter.

## 3. Revert /afterpartyoakley to sunset background (whole page)
File: `src/pages/AfterPartyInvite.tsx`

- Remove the `venueShowcase === "oakley-rino"` branch in the page background style block (lines ~330–340). Always use `/bg-sunset.jpg` with the existing `afterparty-page-bg` class and `bg-center md:bg-top`.
- Keep the `venueShowcase` prop wiring intact (it still drives the venue showcase card and `rinoMural` strip in MyCardSection on desktop), just stop applying the graffiti page background.

## 4. Stop invite content flashing before splash
File: `src/pages/AfterPartyInvite.tsx`

The page renders the full invite + cards immediately while the `BasecampMatchPopflyLogo` splash mounts on top, so on slow first paint users see the invite for a frame before the splash covers it.

- Add a `splashReady` state (default `false`) toggled `true` after the first animation frame of `BasecampMatchPopflyLogo` (or simply on its `onMounted` callback; if not present, gate via `useEffect(() => requestAnimationFrame(() => setSplashReady(true)), [])`).
- Wrap the invite body (`<div className="mx-auto px-5 ...">` content below the splash logo) in a sibling that renders a lightweight skeleton (existing `SkeletonMatches` + a gray-ish title block on dark BG) while `!splashDone`. The splash itself stays mounted so it can run.
- Net effect: until `splashDone` (logo finishes), users see only the splash + a neutral skeleton, never the real invite cards.

## 5. Mobile guest card improvements
File: `src/components/afterparty/GuestCard.tsx`

Use `useIsMobile()` to gate mobile-only behaviour.

a. **Social icons compact on mobile**
- When mobile: render Instagram and LinkedIn as icon-only buttons (no `@handle`, no "LinkedIn" text), stacked vertically (`flex-col` with `gap-1`) instead of horizontal. Smaller pill (icon-only, `w-7 h-7` round button).
- Desktop: keep current horizontal pills with labels.

b. **Cap niche/creator chips**
- Show at most 3 chips combined from `niches + creator_types`. If more, append a `+N` chip (no expansion needed).
- Reduce chip padding slightly (`px-1 py-0.5`, `text-[10px]`) and tighten `mr-1 mb-1` → `mr-0.5 mb-0.5` so cards aren't tall and narrow.

## 6. Re-sort guest list by detail richness
File: `src/pages/GuestList.tsx`

Replace the current "newest" default sort with a detail-priority sort applied to BOTH `/guestsoakley` and `/afterpartyoakley` listings (the matches panel on the invite already sorts by match score; we sort the public roster).

Compute a `detailScore` per guest:
- has photo (`cartoon_url` present) → +100
- "detail richness" = count of populated fields among: `mind_blowing_fact`, `niches?.length`, `creator_types?.length`, `looking_for?.length`, `company`, `social_links.instagram`, `social_links.linkedin` → each non-empty +10

Sort tiers (descending):
1. Photo + most detail
2. Photo + less detail
3. No photo + most detail
4. No photo + least detail

Implementation: single comparator `(b.score - a.score)` where `score = (hasPhoto ? 100 : 0) + detailFieldCount * 10`. Drop the existing `attendee_number` ordering preference. Apply same comparator to the matches list in `MatchesPanel.tsx` after the existing match-score sort if needed (confirm via reading code before changing — likely matches sort is score-based already, so only the public roster changes).

## Files touched
- `src/components/afterparty/AfterPartySpotlights.tsx` — coral category labels + mini backdrops
- `src/components/afterparty/MatchesPanel.tsx` — subdued + mobile-hidden mural strip
- `src/pages/AfterPartyInvite.tsx` — revert hero to sunset; gate body behind splash with skeleton
- `src/components/afterparty/GuestCard.tsx` — mobile icon-only socials stacked, capped + smaller chips
- `src/pages/GuestList.tsx` — new detail-priority sort as default
