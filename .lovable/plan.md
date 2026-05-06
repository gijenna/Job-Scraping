## Goals

1. Make match text readable again by removing the mural from behind the text. Keep the Oakley "O" / graffiti vibe, but only in the empty zone on the right of each bar.
2. Apply the same Oakley RiNo graffiti background to `/afterpartyoakley` (and `/afterpartyoakley/:name`), including behind the intro animations.
3. Remove the leftover floating graffiti PNG that sits just above the matches list (under the "Edit your card" button area).

---

## 1. MatchesPanel: narrow right-side mural strip

File: `src/components/afterparty/MatchesPanel.tsx`

- Keep the dynamic measurement of total container height + per-bar offsets.
- Stop painting the mural across the full bar width. Instead, render the mural inside a dedicated absolutely-positioned strip on the right edge of each bar:
  - Strip width: ~64px on mobile, ~84px on desktop (≈ width of an Oakley "O").
  - Strip sits to the right of all content (right-aligned, flush to the bar's right edge with a small inset).
  - Content row gets `pr-[80px] md:pr-[100px]` so the name / role pill / "why it worked" line never overlaps the strip.
- Use a *vertical* slicing strategy so the mural reads as one continuous tall image stitched together across the bars:
  - `backgroundSize: ${stripWidth}px ${totalH}px`
  - `backgroundPosition: 0 -${offsets[i]}px`
  - `backgroundRepeat: no-repeat`
- No dark overlay on the strip (brighter mural, since no text sits behind it). Add a subtle left-edge gradient (`linear-gradient(to right, #111 0%, transparent 24%)`) inside the strip so it fades into the bar instead of looking pasted on.
- Bar itself goes back to flat `#111111` (no mural background), restoring text legibility.

A new tall, vertical-friendly mural asset will replace the current horizontal one:
- New file: `public/oakley-rino/oakley-rino-mural-vertical.jpg` (portrait, ~600×2400, RiNo spray-paint palette with prominent Oakley "O" silhouettes stacked down the image so each bar reveals one O / motif).
- Update the `muralSrc` passed from `MyCardSection` to point at this new asset.

## 2. Remove leftover graffiti accent

File: `src/components/afterparty/MyCardSection.tsx`

- Delete the `{rinoMural && <img src="/oakley-rino/oakley-rino-graffiti-accent.png" ... />}` block (lines ~478–489) that floats above the matches list. The new strip-in-bars is the only graffiti accent inside the card.

## 3. Graffiti background on /afterpartyoakley

Files: `src/pages/AfterPartyInvite.tsx`, `src/App.tsx`

- Add an optional `venueShowcase?: "oakley-rino"` prop to `AfterPartyInvite` (mirroring `GuestList`).
- Pass `venueShowcase="oakley-rino"` from both Oakley routes in `App.tsx`.
- In `AfterPartyInvite`, when the prop is set, render the same fixed background layer used on `GuestList`:
  - Root wrapper gets the `linear-gradient(rgba(8,8,8,0.06), rgba(8,8,8,0.5)), url('/oakley-rino/oakley-rino-graffiti-bg.jpg')` background, `bg-cover`, `bg-center md:bg-top`.
  - A second `fixed inset-0 -z-10` layer with the slightly darker overlay so the background persists through the intro animation (when content is animating in over a transparent foreground).
  - Skip the existing solid page background only when `venueShowcase === "oakley-rino"`; otherwise keep current behavior intact.
- Verify the existing intro/animation containers don't paint an opaque background that would hide the mural; if any do, switch them to transparent only inside the Oakley branch.

## Technical notes

- Strip width and content padding live in one constant in `MatchesPanel` so they can be tweaked together.
- `useLayoutEffect` + `ResizeObserver` continues to recompute `totalH` and `offsets` so the vertical mural stays aligned when the list reflows or the viewport changes.
- No changes to matching logic, data model, or routing other than the new prop on `AfterPartyInvite`.

## Files touched

- `src/components/afterparty/MatchesPanel.tsx` — strip-only mural, padding for content
- `src/components/afterparty/MyCardSection.tsx` — remove leftover accent PNG, swap mural asset path
- `src/pages/AfterPartyInvite.tsx` — accept `venueShowcase`, render Oakley background layers
- `src/App.tsx` — pass `venueShowcase="oakley-rino"` to both `/afterpartyoakley` routes
- `public/oakley-rino/oakley-rino-mural-vertical.jpg` — new tall mural asset
