

# Fix Photo Placement: Rotation-Aware Clipping

## Problem
The green-detection approach finds an axis-aligned bounding box around a **rotated** green rectangle. This mismatch means the clip region is the wrong shape — it's wider and shorter than the actual tilted polaroid photo area, causing photos to either show green gaps or get cropped incorrectly.

## Solution
Use green detection only to find the **center point and dimensions** of the green area, then apply the clip as a **rotated rectangle** matching the polaroid's -5° tilt. This gives us automatic coordinate detection AND correct clipping.

## Changes

| File | Change |
|------|--------|
| `src/pages/GenerateCards.tsx` | Update the photo drawing block (~lines 203-269) |

## New logic (replacing current green detection + clip):

1. Scan for green pixels the same way (to find the center of the green area)
2. From the bounding box, calculate the **center point** (`gcx`, `gcy`)
3. Instead of clipping to the axis-aligned bounding box, **translate to the center, rotate by -5°**, then clip a rectangle sized to the polaroid's inner photo area (use slightly reduced bounding box dimensions to account for the rotation expansion)
4. Cover-fit the photo into that rotated clip region

The key difference: `ctx.rotate(rotRad)` is applied before the `ctx.rect()` clip, so the clipping rectangle is tilted to match the actual polaroid frame. The detected center ensures we're positioned correctly regardless of template.

Dimensions are shrunk by `cos(5°)` factor (~0.996 for width, adjusted for height) from the detected bounding box to compensate for the bounding box being inflated by the rotation.

