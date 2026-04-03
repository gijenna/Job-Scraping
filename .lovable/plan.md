
Use a deterministic photo-placement pipeline instead of scanning the template for green pixels. The templates are fixed, so the reliable way to make this consistent is: fixed photo frame per template + orientation-aware centered cover-crop of the provided image.

## What to change

1. Remove the green-detection logic in `src/pages/GenerateCards.tsx`.
   - It is not reliable here because the background and the inner photo area are too visually similar, so the detected box can drift and create odd crops like Wendy’s.

2. Go back to explicit `layout.photo` coordinates for each template.
   - Keep one calibrated inner-photo frame per template.
   - Add a tiny overscan/bleed so no green sliver shows at the edges.

3. Normalize image orientation before drawing.
   - Load photos in a way that respects EXIF orientation so phone images do not render sideways or with misleading dimensions.

4. Replace the current large-photo draw step with a centered source-crop “cover” algorithm.
   - Compute the frame aspect ratio from `layout.photo`
   - Crop the source image from the center to that aspect ratio
   - Draw that cropped region into the rotated photo frame
   - This keeps the photo centered in the green area, then crops outward as needed

## File

- `src/pages/GenerateCards.tsx` — update the large polaroid photo rendering block only

## Technical details

- Keep the rotated clip: `translate -> rotate -> rect -> clip`
- Change the image fitting to source-side crop math, not detection-based destination math
- Use orientation-aware image loading first; if unavailable, keep the same centered crop math as fallback
- Optionally add a small bleed (for example 6–12px) when drawing into the clipped frame so there are no visible edges

## Expected result

The large polaroid photo will be placed the same way every time:
- centered within the green area
- filling the entire green space
- cropped as needed from the outside
- no template-driven drift
- no odd thin-strip crop on wide or phone-originated photos
