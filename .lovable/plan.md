## 1. Matches mural — back to "sliced strips inside the bars," but right-side only and brighter

File: `src/components/afterparty/MatchesPanel.tsx`

- Keep the original horizontal `oakley-rino-mural-strips.jpg` (revert from the vertical mural). All bars together reveal one continuous mural, with gaps between bars showing the page background — exactly the first version.
- Constrain that sliced mural to a **right-side region** of each bar (roughly the right ~45% on desktop, right ~40% on mobile) instead of spanning full bar width. Implementation:
  - Render the mural as an absolutely-positioned `div` inside each bar, pinned to `right: 0`, `top: 0`, `bottom: 0`, with width `40%` (mobile) / `45%` (desktop).
  - `backgroundImage: url(mural)`, `backgroundSize: ${barsListWidth}px ${totalH}px`, `backgroundPosition: right -${offsets[i]}px` so the right edge stays aligned across all bars and they collectively reveal one image.
  - Add a soft fade on the mural's left edge: `maskImage: linear-gradient(to right, transparent 0, #000 25%, #000 100%)` so it dissolves into the dark bar instead of cutting hard.
- Brightness boost: drop the previous `linear-gradient(rgba(17,17,17,0.78)...)` overlay on top. Use a much lighter overlay only on the bottom edge (`linear-gradient(to top, rgba(17,17,17,0.35), transparent 40%)`) for legibility of the secondary "why it worked" line if it ever creeps right. Add `filter: saturate(1.15) contrast(1.05) brightness(1.05)` on the mural div.
- Content layout protection — guarantee the mural never sits under the number badge, avatar, name, role pill, or reason text:
  - Wrap the existing content row in a `relative z-10` container with `pr-[42%] md:pr-[47%]` so the actual flex content is always confined to the left half. The mural strip lives in the negative space to the right of the role pill and reason text.
  - The `truncate` already in place keeps the name and reason from spilling into the mural area.
- Remove the `oakley-rino-mural-vertical.jpg` reference from `MyCardSection.tsx`; switch back to `/oakley-rino/oakley-rino-mural-strips.jpg`.
- Delete the now-unused `oakley-rino-mural-vertical.jpg` asset.

## 2. Background mural — Oakley eyewear on the figure(s)

File: `public/oakley-rino/oakley-rino-graffiti-bg.jpg`

- Use `imagegen--edit_image` to subtly retouch any visible graffiti figures (the helmeted character in the screenshot, plus any other faces) so they wear Oakley sunglasses or goggles with a clear but small "O" detail on the temple. Keep the spray-paint aesthetic, palette, and composition unchanged. Same file path so all existing references keep working.

## 3. Community partners section — neon coral with dark backdrop on Oakley pages

Files: `src/pages/GuestList.tsx`, `src/pages/AfterPartyInvite.tsx` (and any shared community-partners component if one exists; will confirm during implementation by `rg`-ing for "community partners" / "Community Partners").

- For both `/guestsoakley` and `/afterpartyoakley` (i.e. when `venueShowcase === "oakley-rino"`):
  - Wrap the community partners heading + body copy in a translucent dark panel: `bg-[rgba(8,8,8,0.72)] backdrop-blur-sm rounded-xl px-4 py-3` (mobile-first, responsive `sm:px-5 sm:py-4`).
  - Switch heading + paragraph color to neon coral: `color: #ED7660`, with a subtle text shadow for the heading (`textShadow: "0 0 12px rgba(237,118,96,0.45)"`) so it reads "neon" against the graffiti.
  - Logo grid stays untouched.
- Verify on mobile (375–414 px) by checking the existing layout to make sure the panel doesn't push partner logos off-screen.

## Files touched

- `src/components/afterparty/MatchesPanel.tsx` — restore sliced strip, constrain to right region, brighter mural, no full-bar background
- `src/components/afterparty/MyCardSection.tsx` — `muralSrc` back to `oakley-rino-mural-strips.jpg`
- `public/oakley-rino/oakley-rino-graffiti-bg.jpg` — AI-edited to add Oakley eyewear on visible figures
- `public/oakley-rino/oakley-rino-mural-vertical.jpg` — deleted
- `src/pages/GuestList.tsx`, `src/pages/AfterPartyInvite.tsx` (and any shared partners component) — neon-coral text + dark backdrop panel for the Community Partners block when on the Oakley venue
