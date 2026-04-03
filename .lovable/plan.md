

# Fix Photo Placement in Large Polaroid

## Problem
The expert photo extends too far, not sitting properly within the green area of the large polaroid. It should have an equally wide green border visible on all four sides.

## Fix
Reduce the photo clipping area (`w` and `h` in `layout.photo`) by ~40-50px on each side across all 4 template layouts. This keeps the green border visible as a uniform frame around the photo. The center point (`cx`, `cy`) may also need slight adjustment to center the photo within the green rectangle.

## Changes

| File | Change |
|------|--------|
| `src/pages/GenerateCards.tsx` | Reduce `photo.w` and `photo.h` values in all 4 LAYOUTS entries (e.g. from `535×555` to `~490×510`) to create uniform green border padding around the photo |

No other files or database changes needed.

