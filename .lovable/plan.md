

# Fix Photo Centering: Pixel-Perfect Calibration via Script

## Problem
The hardcoded `cx`/`cy` values in `LAYOUTS` are approximate guesses that don't match the true center of the green photo area in each template. This causes uneven white borders (wider on one side than the other) and in some cases green bleeding through.

## Solution
Run a **one-time Python calibration script** against the 4 template PNGs to measure the exact green area bounding box in each. Then update the `LAYOUTS` array with the precise `cx`, `cy`, `w`, `h` values. Additionally, add a small bleed (4px) to `w`/`h` to prevent any green slivers at edges due to anti-aliasing.

## Steps

1. **Run calibration script** — A Python/PIL script that:
   - Loads each `solid_green_N.png` template
   - Scans the left 60% of pixels for green (G > 100, G > 1.5×R, G > 1.5×B)
   - Computes the bounding box (minX, minY, maxX, maxY) of those green pixels
   - Outputs the center and dimensions for each template
   - This runs once at build-time, not at render-time

2. **Update LAYOUTS** — Replace the current approximate values with the measured ones plus a 4px bleed on each side

3. **No render-time scanning** — Keep the current deterministic pipeline (translate → rotate → rect → clip → cover-fit draw)

## Files
- `src/pages/GenerateCards.tsx` — update `LAYOUTS` photo values only (4 objects)

## Why this works
The templates are static PNGs that never change. A one-time measurement gives us ground-truth pixel coordinates. The previous attempts failed because:
- Hardcoded values were eyeballed
- Runtime scanning was noisy (background green contaminated the centroid)

A controlled Python scan with PIL on the raw template files will give exact bounds without browser canvas anti-aliasing issues.

