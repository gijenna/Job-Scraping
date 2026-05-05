# Oakley Blurb + RiNo Mural Background for `/guestsoakley`

## 1. Blurb copy update

In `src/components/afterparty/OakleyRinoVenueShowcase.tsx`, replace the current paragraph with:

> The Oakley store in Denver's River North Arts District blurs the line between performance and culture, creating an immersive space built for the athletes, artists, and creators of RiNo. Designed as a premier destination for gear, storytelling, and community, the store brings the Oakley experience to life in the heart of Denver.

(Apostrophe stays as `'`. No em dashes per project rule.)

## 2. RiNo mural artwork — strategy

You asked for artsy/expressive RiNo graffiti energy that fills **dead space** (especially beside "Your Matches" and outer page margins) without competing with content.

### Generation
Use the Lovable AI Gateway (`google/gemini-3-pro-image-preview`) to generate **3 vertical mural panels** as transparent-edged PNGs:

1. `rino-mural-left.png` — tall vertical RiNo-style spray-paint mural strip (wheatpaste textures, bold color blocks, abstracted lettering — no readable words to avoid distraction). Muted in the project palette (teal, coral, cream, mustard) so it ties to the brand.
2. `rino-mural-right.png` — companion strip, different composition, same palette family.
3. `rino-mural-corner.png` — small square paint-splash / sticker-bomb accent for corners.

Saved to `public/oakley-rino/` so they're served statically. (Generation runs once via a `/tmp` script; only the resulting PNGs are committed.)

### Placement on `/guestsoakley` (in `src/pages/GuestList.tsx`, gated by `venueShowcase === "oakley-rino"`)

Add a non-interactive decorative layer rendered behind page content:

```text
┌──────────────────────────────────────────────┐
│ [mural-left]                  [mural-right]  │
│  fixed,                          fixed,      │
│  left edge,                      right edge, │
│  ~30vw wide,                     ~30vw wide, │
│  ~70vh tall,                     ~70vh tall, │
│  opacity .35,                    opacity .35,│
│  pointer-events:none             mix-blend:  │
│                                  soft-light  │
│                                              │
│         [PAGE CONTENT — unchanged]           │
│                                              │
│ [corner accent]               [corner accent]│
└──────────────────────────────────────────────┘
```

Specifics:
- Wrapped in `<div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">`.
- Murals use `position: absolute`, anchored to outer edges with negative offsets so they bleed off-screen.
- Hidden under `md` breakpoint (`hidden md:block`) — on a 768px viewport they'd crowd content.
- Subtle parallax-free; pure CSS, no JS.
- Page content already sits in centered `max-w` containers, so the murals naturally fill the dead margin including the empty space next to "Your Matches".

### Tone controls (so it doesn't overpower)
- Opacity 0.30–0.40
- `mix-blend-mode: soft-light` so colors harmonize with the dark teal background instead of fighting it
- Slight blur (`filter: blur(0.5px)`) to push it visually behind text

## 3. Files touched

- `src/components/afterparty/OakleyRinoVenueShowcase.tsx` — blurb text only
- `src/pages/GuestList.tsx` — add decorative mural layer behind content (only when `venueShowcase === "oakley-rino"`)
- `public/oakley-rino/rino-mural-left.png` (new, AI-generated)
- `public/oakley-rino/rino-mural-right.png` (new, AI-generated)
- `public/oakley-rino/rino-mural-corner.png` (new, AI-generated)

## Questions / assumptions

- **Scope**: Murals appear only on `/guestsoakley`, not on the standard `/guests`. Confirmed by your wording.
- **No readable graffiti words** in the murals — keeps it abstract and avoids competing copy. If you'd rather see actual stylized words (e.g., "RiNo", "DENVER"), say the word and I'll regenerate with text.
- **Mobile**: hidden below `md` to keep the phone view clean. Tell me if you want a lighter mobile version instead.
