## Update Edges First / Nemo sponsor callout

**1. Use uploaded logos (not Clearbit)**
- Copy `user-uploads://edges-first-logo_1-2.png` → `src/assets/edges-first-logo.png`
- Copy `user-uploads://nemoLogo_600x_1.webp` → `src/assets/nemo-logo.webp`
- In `ExpertSponsorCallout.tsx`, import both as ES6 modules and replace the `clearbitFromUrl`/`faviconFromUrl` lookup. Remove the cream background tile behind the Edges logo so the blue mark sits cleanly on the coral gradient (keep a soft container only if needed for contrast).

**2. Link "Stargaze chairs" text**
- Wrap the phrase "Stargaze chairs" inside the Nemo credit line in an anchor to:
  `https://www.nemoequipment.com/products/stargaze-reclining-camp-chair?srsltid=AfmBOooCxukfQY4K6rdxrMAaOlplT0WGO3zluKCeakLezu11lq-eGcl3`
- Since `EditableText` renders plain text, split the Nemo credit into: editable lead text ("Seats provided by Nemo. Chat with experts in comfy ") + an `EditableLink` for "Stargaze chairs" (textKey `denver_nemo_chair_text`, urlKey `denver_nemo_chair_url`) + trailing period.

**3. Embed Kelly's card inside the sponsor box (Compact / type C)**
- Add a new prop `kellyExpert?: Expert | null` to `ExpertSponsorCallout`.
- Restructure the callout into a 2-column layout on md+ screens:
  - Left column: logo + eyebrow + headline + blurb + CTAs (Visit edgesfirst.co, and the "Meet Kelly" text — see step 4).
  - Right column: `<ExpertCardCompact expert={kellyExpert} />` wrapped in the same coral ring + "Made this possible" badge as currently shown on her main grid card.
- On mobile, stack: text block → Kelly card → Nemo credit.
- `EventOutsideDays26.tsx`: pass `kellyExpert={kellyExpert}` to the callout. Keep `sponsorExpertSlug` pass-through so her card in the main grid still gets the ring + badge (per request "keep her card in the main area too").

**4. Replace "Meet Kelly Below" button with inline text pointer**
- Remove the bordered button. Replace with a short inline sentence next to the "Visit edgesfirst.co" CTA, e.g. "→ Meet Kelly, right here." (editable via `denver_expert_sponsor_meet_kelly_text`). No anchor jump needed since her card is now in the same box. Drop the word "Below".

**5. No other changes**
- Keep all other experts' rendering, the main grid sponsor ring/badge on Kelly, and admin editability untouched.
- No backend or schema changes.

### Files touched
- `src/assets/edges-first-logo.png` (new, copied)
- `src/assets/nemo-logo.webp` (new, copied)
- `src/components/event/ExpertSponsorCallout.tsx` (refactor: imported logos, 2-col layout, embed `ExpertCardCompact`, inline Stargaze link, drop "Meet Kelly Below" button)
- `src/pages/EventOutsideDays26.tsx` (pass `kellyExpert` prop)
