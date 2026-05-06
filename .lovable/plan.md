## Goal

Make it feel like one continuous Oakley/RiNo graffiti mural lives behind the "Your matches" list, but is **only visible through the match bars themselves**. The dark gaps between bars stay as the page background, so the mural appears as horizontal slices, like sunlight cutting through window blinds.

## What gets removed

- The floating graffiti accent currently positioned to the right of the matches in `MyCardSection.tsx` (the `<img>` block with `oakley-rino-graffiti-accent.png`). The match section will no longer have a visible accent image hanging off the side.

## What gets added

### 1. A new mural image

Generate one wide horizontal Oakley-vibe RiNo mural at roughly 1600x900px and save to `public/oakley-rino/oakley-rino-mural-strips.jpg`.

Direction:
- Spray-paint, sticker-bombed, dripping-paint RiNo wall energy
- Tasteful nod to Oakley: motorsports/performance edges, the iconic "O" silhouette woven in subtly (not a logo slap), Thermonuclear Protection-era color hits, lens-shaped highlights catching light
- Dominant palette pulled from the existing page: dark teal base, coral, mustard yellow, cream highlights, with grimy concrete grays so it reads as graffiti not pop art
- Composition spread evenly top-to-bottom so any horizontal slice still feels rich (no dead bands)

### 2. Bars become "windows" onto the mural

In `MatchesPanel.tsx`, the matches list is wrapped in a positioned container that knows its own height. Each match button (the bar) gets:

- The mural as `background-image`
- `background-attachment` set so the mural appears anchored to the matches container, not to each bar individually
- `background-size` and `background-position` calculated so all the bars together look like one image

Approach: wrap the list in a `relative` container, then on each bar use `background-image: url(...)` with `background-size: 100% [containerHeight]px` and `background-position: 0 -[barOffsetY]px`. The bar's own offset within the container shifts the image up by exactly that amount, so each bar reveals just its slice. The gaps between bars (the `space-y-3` gutters) show no image because they aren't part of any bar's background.

A small `useLayoutEffect` measures the container height and each bar's offset on mount and on resize, then writes those numbers into inline styles. This keeps it pixel-accurate at any viewport.

On top of the mural inside each bar, a dark translucent overlay (around 60-70% opacity of the existing `#111111`) keeps text legible. The mural reads as a textured glow behind the names rather than competing with them. The mutual-boost gold left border stays.

### 3. Subtle edge treatment

To make the slicing feel intentional and Oakley-crisp rather than accidental:
- Each bar keeps its `rounded-xl` corners, so the mural slices have rounded edges — like portholes onto the wall
- Border stays at the existing `rgba(255,255,255,0.09)` so bars still feel like cards, not raw image crops
- A very faint inner shadow (1-2px) at the top of each bar gives a tiny sense of depth where the slice meets the dark gap

## Files to edit

- `src/components/afterparty/MyCardSection.tsx` — remove the floating accent image
- `src/components/afterparty/MatchesPanel.tsx` — accept a `muralSrc?: string` prop, add the measurement logic, apply the sliced background to each bar
- `src/pages/GuestList.tsx` — pass `muralSrc="/oakley-rino/oakley-rino-mural-strips.jpg"` into `MatchesPanel` only when `venueShowcase === "oakley-rino"` (Note: `MatchesPanel` is rendered inside `MyCardSection`, so the prop is threaded `GuestList → MyCardSection → MatchesPanel`)

## New asset

- `public/oakley-rino/oakley-rino-mural-strips.jpg` — the single mural image

## Acceptance check

- Looking at the matches list, each bar shows a different horizontal stripe of the mural; mentally stacking the bars (closing the gaps) reproduces the original mural
- The dark page background shows through cleanly between bars
- Names, role pills, and "why it worked" snippets remain fully legible
- The previous floating accent on the right side of the matches section is gone
- Non-Oakley guest lists are unchanged
