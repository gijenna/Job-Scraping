

# /generate Page — Social Media Card Generator (Public During Dev)

## Overview

A page at `/generate` that creates social media preview cards for each expert using the 4 solid green templates. Auto-selects the correct template based on company count. **No auth check initially** — will be restricted to admin after editing is complete.

## Template Selection

| Total companies | Template | Small polaroids |
|---|---|---|
| 0–1 (current only) | solid_green_2, 1 glowing polaroid only | 1 |
| 2 | solid_green_2 | 2 |
| 3 | solid_green_3 | 3 |
| 4 | solid_green_4 | 4 |
| 5+ | solid_green_5 (cap at 5, use 4 most recent previous + current) | 5 |

## Data Mapping

**Large polaroid:**
- Expert photo fills green area
- Line 1: `[Full Name]` — bold, left-aligned with image edge
- Line 2: `[Job Title, Current Company]` — regular, left-aligned
- Upper-right of white area: current company logo

**Right side (drawn over template):**
- "NETWORK WITH ME IN [CITY]" — yellow bold uppercase
- "[X] YEARS IN THE OUTDOOR INDUSTRY" — coral pill
- "Ask me about: [text]" — cream italic

**Small polaroids (bottom row):**
- Company logos oldest → current, left to right
- Rightmost (current) has orange glow
- `previous_companies` parsed from comma-separated string

## UI

- List all confirmed experts with "Generate" button per expert + "Generate All"
- City selector for multi-city experts
- Download as PNG per card
- **No login required** — page is publicly accessible during development

## Files

| File | Action |
|---|---|
| `src/assets/solid_green_*.png` | Upload 4 template PNGs as assets |
| `src/pages/GenerateCards.tsx` | New page — canvas-based card generator, no auth gate |
| `src/App.tsx` | Add public route `/generate` |

No database changes needed.

