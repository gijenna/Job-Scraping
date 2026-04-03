
Update the `/generate` card renderer so the large polaroid photo uses a true “cover/fill” fit instead of the current padded “contain” fit.

## What to change
1. In `src/pages/GenerateCards.tsx`, replace the current photo drawing logic inside `generateCard()`.
2. Remove the inset/padding-based math:
   - remove `frameInset`
   - stop using `availableW/availableH`
   - stop using `Math.min(...)`
3. Draw the uploaded image so it fully fills the clipped green photo area:
   - keep the existing clip rectangle and rotation
   - switch to `Math.max(w / photoImg.width, h / photoImg.height)` so the image covers the full green area
   - center the image within that clipped rectangle
4. Leave the name/title/logo/small-polaroid logic as-is.

## Why this fixes it
Right now the code is intentionally preserving a visible green border by scaling the image down to fit inside the green area. That is the opposite of your request. The result is empty green space around the photo.

Using a cover-fit makes the uploaded image occupy the entire green photo region, with any excess cropped off at the edges, which matches “fill the green space with the provided image.”

## Technical notes
Current behavior:
```ts
const scale = Math.min(availableW / photoImg.width, availableH / photoImg.height);
```

Planned behavior:
```ts
const scale = Math.max(w / photoImg.width, h / photoImg.height);
const dw = photoImg.width * scale;
const dh = photoImg.height * scale;
const dx = -dw / 2;
const dy = -dh / 2;
```

This keeps the image centered while ensuring there is no leftover green showing inside the clipped photo region.

## Files
- `src/pages/GenerateCards.tsx` — update the large-photo canvas compositing logic only

## Expected result
On `/generate`, the expert photo will fully occupy the large green polaroid image area instead of sitting inside it with a border.
