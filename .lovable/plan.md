
Fix the large-polaroid photo placement by removing the current centroid detection and returning to a fully deterministic frame definition per template.

## What to change
1. In `src/pages/GenerateCards.tsx`, remove the green-pixel centroid scan from the large photo drawing block.
2. Calibrate `layout.photo` so it represents the actual inner green window of each template:
   - `cx/cy` = true visual center of the green opening
   - `w/h` = true visible opening size, not an expanded value
3. Draw the expert photo into that fixed rotated frame using centered cover-fit cropping.
4. Reduce or eliminate the extra clip “bleed” that is currently making the visible border uneven.
5. Keep the rest of the generator logic unchanged.

## Why this should fix it
The current centering is drifting because the scan is averaging green pixels from more than just the photo opening. That makes the translate point inconsistent. On top of that, the clip area is slightly oversized, so the white/green border can look different on each side. A fixed inner-frame per template is more reliable because the templates themselves are fixed.

## Implementation approach
- Keep the rotated clip pipeline: `translate -> rotate -> rect -> clip`
- Use `layout.photo` directly for centering
- Use a source-side centered crop:
  - compare source aspect ratio vs target aspect ratio
  - crop from the center of the uploaded image
  - draw that crop into the exact frame
- If needed, support tiny per-template nudges (`offsetX`, `offsetY`) rather than scanning pixels dynamically

## Files
- `src/pages/GenerateCards.tsx`

## Technical details
- Remove this logic entirely:
  - temporary scan canvas
  - green pixel centroid calculation
  - `gcx/gcy` fallback flow
- Replace with:
  - `const { cx, cy, w, h } = layout.photo`
  - clip exactly to `w/h` or with only a very small overscan
  - compute `sx/sy/sw/sh` from the source image for a true centered cover crop
- Likely also tighten the `LAYOUTS` photo values slightly so the frame matches the visible green opening more precisely across the 2/3/4/5-logo templates

## QA
Validate with at least:
- a portrait with lots of white space near the edges
- a tightly framed headshot
- a landscape-ish photo
Check that:
- no green shows inside the large polaroid
- left/right visible margins look equal
- the photo stays centered consistently across all template variants
