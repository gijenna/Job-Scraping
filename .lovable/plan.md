

# Fix Photo Centering: Detect Green Area From Template

## Problem
The photo placement uses hardcoded `cx`/`cy` coordinates that were guessed from visual inspection. Every adjustment moves the photo in one direction but misaligns it in another. The templates have slight variations, making manual pixel-picking unreliable.

## Solution
Instead of guessing coordinates, **sample the template image at render time** to find the actual green rectangle, then place the photo precisely within it.

## How It Works

In `generateCard()`, after drawing the template onto the canvas:

1. **Scan the canvas pixel data** in the large polaroid region (roughly left half, `x: 100-800, y: 80-720`) to find all pixels matching the green fill color (`#2D5A3D` or similar — sample it from the template).
2. Compute the **bounding box** (minX, minY, maxX, maxY) of those green pixels — this gives the exact green rectangle on this specific template.
3. Use that bounding box as the clip region and center point for the photo, instead of the hardcoded `cx/cy/w/h`.

This means the photo will always be centered and sized to exactly fill the green area, regardless of which template is used or minor pixel shifts between templates.

## Changes

| File | Change |
|------|--------|
| `src/pages/GenerateCards.tsx` | Replace hardcoded `layout.photo` usage with a green-detection function that scans the rendered template to find the exact green rectangle, then clips and cover-fits the photo into that detected region. The `photo` field in `LAYOUTS` can be removed or kept as fallback. |

## Detection approach (pseudocode)
```text
1. Draw template to canvas
2. getImageData() over the left-half region
3. For each pixel, check if it's "green enough" (high G, low R/B)
4. Track min/max x/y of green pixels → bounding box
5. Use bounding box center + dimensions for clip + cover-fit
```

The rotation (`-5°`) is already applied — the scan happens on the already-drawn (rotated) template, so the detected region naturally accounts for the tilt.

No database changes needed.

