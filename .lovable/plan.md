

## Plan: Generate 10 OG Card Design Options

### Approach
Use the AI image generation skill to create 10 distinct card mockups (1200x630px) as downloadable PNGs. Each will use a sample expert's data and follow the visual language from your uploaded "Expert Sessions" references: bold black background, B&W photo, large modern typography, campfire logo, and the cream/coral/yellow brand palette.

Once you pick your favorite(s), I'll implement the winning design as a deterministic SVG template in the edge function.

### What each card will include (your required elements)
- Expert's photo (B&W treatment like your references)
- Full name (large, bold)
- Job title and current company
- Previous brand logos (as actual images)
- Years in industry
- "Ask me about" answer
- Event CTA ("Network with me @ Gather PNW")
- Basecamp Outdoor logo (actual logo image)
- Registration URL

### The 10 design directions

1. **Expert Sessions Clone** — Direct adaptation of your uploaded style: black bg, huge cream "NETWORK WITH ME" text, B&W photo right-aligned, campfire logo in the O, yellow title, first name large
2. **Split Panel Bold** — Left half: full-bleed B&W photo. Right half: black bg with stacked cream/coral/yellow type. Logos in a row at bottom
3. **Diagonal Slice** — Black bg with photo in a diagonal parallelogram shape. Info left-aligned with massive name in cream. Yellow accent bar
4. **Cream Clean** — Cream (#F5E6D3) background, photo in rounded rectangle, dark teal text, coral name, minimal and airy like the "organic business card" reference
5. **Photo Frame Border** — Outdoor/forest border frame (like the fitness QR card reference), B&W photo centered, info overlaid at bottom with semi-transparent dark bar
6. **Magazine Cover** — Full-bleed photo with dark gradient overlay from bottom. Large white name, yellow subtitle, logos at bottom. Editorial feel
7. **Two-Tone Block** — Top 60% black with photo and name. Bottom 40% coral with job details and logos in cream. Bold geometric divide
8. **Polaroid Stack** — Tilted polaroid-style photo frame on dark teal bg. Info beside it in cream/yellow. Playful, matches your existing card style
9. **Gradient Sunset** — Dark teal fading to coral gradient bg. B&W photo with coral tint. White name, yellow details. Warm, outdoor feel
10. **Bold Stripe** — Black bg. Thick vertical coral stripe on left edge. Photo in circle. Horizontal info layout with large tracking on name. Ultra-modern

### Implementation steps

1. Copy the AI image generation script to /tmp
2. Generate all 10 cards using a representative expert profile (e.g., "Sholeh — Director of Product @ YETI" from your reference images)
3. Save all 10 to /mnt/documents/ for your review
4. You pick your favorite(s)
5. I implement the chosen design as an SVG template in the edge function

### Files involved (later, after selection)
- `supabase/functions/expert-og/index.ts` — rewrite `buildSvgCard()` with chosen design

