

# Fix Photo Centering Within Polaroid

## Problem
The `cx` values in the `LAYOUTS` array don't precisely match the true center of the green area on each template. This causes the photo to be drawn slightly off-center — visible as uneven white margins on the left vs. right side of photos with light backgrounds.

## Solution
Use the green-pixel detection approach **only to find the center point** (`gcx`, `gcy`) of the green area — not the dimensions. Keep the fixed `w`/`h` values from `LAYOUTS` for the clip size, which already work well. This gives us:
- **Reliable centering** — auto-detected from the actual template pixels
- **Reliable dimensions** — kept as fixed values that we've already tuned

The detection for center point is much more robust than for edges, since even if we pick up a few extra green pixels the average/center is barely affected.

## Changes

| File | Change |
|------|--------|
| `src/pages/GenerateCards.tsx` | In the photo drawing block (~lines 203-232): after drawing the template, scan the left half for green pixels and compute their centroid (`sumX/count`, `sumY/count`). Use that as the translate point instead of `layout.photo.cx/cy`. Keep `layout.photo.w/h` for clip dimensions. |

## Logic
```text
1. After ctx.drawImage(templateImg, ...) — scan left-half region
2. For each green-ish pixel, accumulate sumX, sumY, count
3. gcx = sumX/count, gcy = sumY/count  (centroid of green mass)
4. Use gcx/gcy instead of cx/cy for translate
5. Keep w/h from LAYOUTS for clip rect + bleed
```

Falls back to hardcoded `cx/cy` if no green pixels found.

