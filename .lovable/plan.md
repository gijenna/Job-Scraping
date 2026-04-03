

# Update Card Generator: Add Text Overlays to Right Side

## What Changes

The `generateCard()` function in `src/pages/GenerateCards.tsx` currently only renders the photo, name/title in the polaroid white area, company logo, and small polaroid logos. It needs three new text elements drawn on the right side of the canvas (on top of the template's dark teal area):

1. **"NETWORK WITH ME IN [CITY]"** — Yellow bold text, uppercase, positioned to the right of the large polaroid (~x: 850+, y: ~200-350). City name comes from the assignment's `city_name` (already passed as `_cityName` param but unused for this).

2. **"[X] YEARS IN THE OUTDOOR INDUSTRY"** — Orange pill with fully rounded corners. Uses `expert.years_in_industry`. Drawn as a rounded rectangle filled with ~`#ED7660` (the coral/orange), white bold text inside.

3. **"Ask me about: [topics]"** — Cream/off-white italic text (~`#F5E6D3`), matching the doodle/drawing color on the templates. Uses `expert.ask_me_about`.

## What Stays the Same
- Photo cover-fit in green area ✓
- Small polaroid company logos (oldest→current, left→right) ✓
- Name + title in polaroid white area ✓
- Current company logo in polaroid white area ✓
- Template selection based on company count ✓

## Technical Details

In `generateCard()`, after the existing polaroid rendering, add three new drawing blocks:

**Yellow heading** (~line 245+):
- `ctx.fillStyle = "#E6C742"`, bold ~40-48px, uppercase
- Split "NETWORK WITH ME" and "IN [CITY]" across two lines
- Position: ~x:880, y:250 (no rotation, drawn on the teal background area)
- Use `fitText` to handle long city names

**Orange pill** (~after heading):
- Draw rounded rect with `ctx.roundRect()` or manual arc paths, filled `#ED7660`
- White bold text inside: `${years_in_industry} YEARS IN THE OUTDOOR INDUSTRY`
- Position below the yellow heading, ~y:380
- Auto-width based on text measurement + padding

**Ask me about** (~after pill):
- `ctx.fillStyle = "#F5E6D3"` (cream), italic ~24px
- Text: `Ask me about: ${ask_me_about}`
- Word-wrap if needed to stay within ~500px width
- Position below pill, ~y:450

## Files

| File | Change |
|------|--------|
| `src/pages/GenerateCards.tsx` | Add 3 text overlay blocks in `generateCard()`, rename `_cityName` to `cityName` |

No database or other file changes needed.

