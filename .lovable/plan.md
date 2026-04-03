

# Fix Photo Centering in Large Polaroid

## Problem
The last coordinate adjustment moved the photo center (`cx`) too far left, making the photo visibly off-center within the green polaroid area. The photo needs to be centered properly.

## Fix
Revert the `cx` values back closer to the original (~445) across all 4 layouts while keeping the expanded `w`/`h` dimensions that successfully fill the green area. The photo rendering logic (cover-fit with clip) is correct — only the center point coordinates need adjustment.

## Changes

| File | Change |
|------|--------|
| `src/pages/GenerateCards.tsx` | Restore `photo.cx` to ~445 and `photo.cy` to ~390 across all 4 LAYOUTS entries, keeping `w: 540, h: 560` dimensions |

Specific coordinate updates:
- Layout 0 (2 polaroids): `cx: 445, cy: 390`
- Layout 1 (3 polaroids): `cx: 445, cy: 390`
- Layout 2 (4 polaroids): `cx: 440, cy: 390`
- Layout 3 (5 polaroids): `cx: 435, cy: 390`

No other files or logic changes needed.

