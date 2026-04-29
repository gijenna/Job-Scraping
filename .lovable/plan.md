## Oakley Invite + Guests Page Updates

Three changes, all isolated to the Oakley variant. Nothing on the default `/afterparty` or `/guests` is touched.

### 1. Opening sequence — product photos in the snowflake burst

**You'll need to upload 6–10 Oakley product photos** (mix of sunglasses + goggles, ideally on transparent or clean backgrounds). I'll save them to `src/assets/oakley-products/` and import them.

In `BasecampMatchPopflyLogo.tsx`:
- Add a new optional prop `burstImages?: string[]`.
- Replace roughly half the `burstStars` entries (alternating ones) with circular masked product photos using the same orbital `bmpStarBurst` animation, so timing/feel is identical.
- Photos render as ~70–110px circles with a subtle cream ring + soft glow so they sit naturally next to the remaining stars.

Wire the prop through `AfterPartyInvite` → only the `/afterpartyoakley` routes pass `burstImages`. Default route stays unchanged.

### 2. Logo placement + neon cream Oakley mark

- Copy `user-uploads://Oakley-Logo-1997-present.png` into `src/assets/`, then generate a cream-tinted version (recolor black → `#F5E6D3`) using the AI image edit gateway. Save as `oakley-logo-cream.png`.
- In `AfterPartyInvite.tsx`, **remove** the current `presenter` block (lines ~366–385) that sits above the sparkle row.
- Add a new stacked treatment **directly under the Basecamp x Popfly lockup** (replacing the "presents" wordmark area inside `BasecampMatchPopflyLogo.tsx`, gated by an `presenterLogoUrl` prop so only Oakley shows it):
  ```
        @
   [OAKLEY logo cream]
        RiNo
  ```
  - `@` and `RiNo` in `font-afterparty`, cream, small (~13–15px), letter-spaced.
  - Logo ~h-10 sm:h-12, cream, with the same `bmpNeonPulse` glow filter the other neon elements use (cream-tinted drop-shadow).
  - Whole block links to https://www.oakley.com.

### 3. New hidden route `/guestsoakley`

- Add route in `App.tsx` pointing at the existing `GuestList` page with a new prop `venueShowcase?: boolean` (or a slim wrapper component `GuestListOakley`).
- Page reads from the **same** `afterparty_attendees` data — no fork. New RSVPs flow into both.
- Top-right card (replacing the current info/legend area) becomes a venue showcase panel taking ~half the page width on desktop, full-width stacked on mobile:
  - Header: "Oakley Performance Center, RiNo"
  - Address with map link (need exact street address — see Open Question)
  - Scrollable photo gallery (vertical scroll on desktop, horizontal swipe on mobile) of the storefront, interior, and **at least one alley shot**
  - Short blurb pulled from the Prezly post about the next-gen retail hub
  - Editable via `EditableText` so you can tweak copy later
- Not linked from anywhere — accessible only by typing the URL.

**Photos**: I'll fetch the Prezly press page and pull 5–7 images (storefront, interior, alley). If any fail to load, I'll fall back to AI-generated placeholders styled to match.

### Technical Details

Files touched:
- `src/components/afterparty/BasecampMatchPopflyLogo.tsx` — burst images + presenter slot
- `src/pages/AfterPartyInvite.tsx` — remove old presenter block, pass new props
- `src/App.tsx` — add `/guestsoakley` route, pass burst images prop on Oakley afterparty routes
- `src/pages/GuestList.tsx` (or new `GuestListOakley.tsx` wrapper) — venue showcase panel
- `src/assets/oakley-logo-cream.png` (new)
- `src/assets/oakley-products/*.{jpg,png}` (new, from your uploads)
- `src/assets/oakley-rino/*.jpg` (new, scraped from Prezly)

### Open Questions / Risks

1. **Product photos** — please upload them in your next message so I can wire them in. Without them I'll be blocked on step 1.
2. **Exact RiNo address** — the Prezly post may or may not include it. Do you have the street address handy, or should I just use "RiNo Arts District, Denver" until you confirm?
3. **Image scraping risk** — the Prezly press page may have hot-linked or CDN-protected images that can't be reliably embedded. If that happens I'll download and re-host them under `src/assets/oakley-rino/` (the safer route either way). Worst case, I use 2–3 confirmed-working ones plus an AI-generated complementary shot.
4. **"Cream-tinted Oakley logo" via AI recolor** — usually clean on a flat black-on-white logo like this, but if the result has artifacts I'll fall back to a CSS `filter: invert + sepia` trick on the original PNG, which gives a true cream tone without re-rendering.
5. The neon glow on the cream logo will be cream-toned (matching the logo color) rather than coral/yellow like the other neon, so it reads as Oakley's own glow rather than fighting the lockup colors. Let me know if you want it to glow yellow/coral instead.
