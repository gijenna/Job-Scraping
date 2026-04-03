

# Replace Template Images with Clean "No Words" Versions

## Problem
The current templates (`solid_green_2.png` through `solid_green_5.png`) have pre-baked text on them (name, title, city, etc.), which conflicts with the programmatic text overlays the code now generates — resulting in doubled/overlapping text.

## Solution
Replace the 4 template assets with the uploaded clean versions that have empty polaroids and no pre-rendered text:

| Upload | Replaces | Small polaroids |
|--------|----------|-----------------|
| `2_no_words.png` | `src/assets/solid_green_2.png` | 2 |
| `3_no_words.png` | `src/assets/solid_green_3.png` | 3 |
| `4_no_words.png` | `src/assets/solid_green_4.png` | 4 |
| `5_no_words_v2.png` | `src/assets/solid_green_5.png` | 5 |

## What changes
- Copy the 4 uploaded images to `src/assets/`, overwriting the existing template files
- No code changes needed — the imports and filenames remain identical

## What stays the same
- All canvas rendering logic (photo placement, text overlays, logo compositing)
- Template selection based on company count
- Layout coordinates in `LAYOUTS` array

**Note:** The layout pixel coordinates (`LAYOUTS`) may need minor tweaks if the new templates have slightly different polaroid positions. If so, that will be a follow-up adjustment after visual testing.

