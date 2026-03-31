

# Preview a Single V1 "Sunset Doodle" Card Before Full Rollout

## What I'll do

Generate **one preview card** for a single confirmed expert so you can approve the exact design before I update all cards.

## Design: V1 Sunset Doodle (matching your approved reference)

- **Background**: Warm sunset gradient (`#F4A261` → `#E76F51` → `#264653`) with hand-drawn doodle overlay elements (mountain silhouettes, tree shapes, campfire as SVG paths)
- **Left side**: Large B&W expert photo in a polaroid-style frame (white border, slight tilt)
- **Below photo**: "CAREER JOURNEY" row — mini tilted polaroid circles with company logos (earliest → current, left to right)
- **Right side**: 
  - "NETWORK WITH ME IN PORTLAND" (or city) — bold yellow display font
  - Expert name — large coral
  - Job title + company
  - Years badge: "[X] years in the outdoor industry"
  - Italic "ask me about" quote
- **Bottom bar**: Campfire circle logo + "Register free · basecampoutdoorevents.com"

## Approach

1. **Rewrite `buildSvgCard()` in `supabase/functions/expert-og/index.ts`** with the V1 Sunset Doodle design (sunset gradient background, doodle SVG paths, polaroid photo frame, career journey logos, yellow CTA)
2. **Deploy the updated edge function**
3. **Trigger a single card generation** for one confirmed expert (e.g., Emmy or another confirmed expert with a real photo) using the `?generate=1` parameter to clear the old cache and produce a fresh PNG
4. **Share the generated card URL** with you for review before proceeding to regenerate all cards

## Files to modify

| File | Change |
|------|--------|
| `supabase/functions/expert-og/index.ts` | Rewrite `buildSvgCard()` to V1 Sunset Doodle design |

No other files change at this stage — this is preview only. Once you approve the design, I'll add the "Regenerate All" button and run all cards.

