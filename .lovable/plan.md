

## Splash → invite reveal: PB monogram morphs into the lockup

Reworking the intro on `/afterparty` so the PB monogram fully owns the screen first, then physically transforms — letters fly out of it into the Basecamp Match and Popfly logos in their final positions, and the monogram itself shrinks down to become the "presents" mark above "The Creator After Party". After the choreography lands, the rest of the page (event details + CTA) cascades up into view.

No layout, no copy, no schema, no matching logic changes — only the intro choreography, typography, and a few text-color cleanups.

### 1. New uploaded PB asset

- Save the new uploaded monogram to `src/assets/pb-monogram-v2.png` (transparent, large, coral). Replaces references to the prior `pb-monogram.png` inside the splash component only — the small "presents" placement keeps using the same file so it reads as the same mark throughout.

### 2. Choreographed intro (rewrite of `BasecampMatchPopflyLogo.tsx`)

Single self-contained component. Pure CSS keyframes + a tiny `useState` gate so the rest of the invite (event details, CTA, lookup) only mounts after the intro lands. Honors `prefers-reduced-motion` by snapping straight to the final state and immediately revealing the rest of the page.

Timeline (≈ 4.8s total, slow enough to admire):

1. **0.0–2.0s — Solo splash.** Only the PB monogram is on screen. It sits centered at ~70vh height, with a slow pulse + subtle rumble (tiny rotational shake, ±0.6°, on a 180ms loop) and a soft amber glow halo. Background is the existing dark teal — no logos, no text, nothing else. The page below is hidden (`opacity:0; pointer-events:none`).
2. **2.0–2.4s — Wind-up.** Rumble intensifies briefly (amplitude doubles, glow brightens), telegraphing the transform.
3. **2.4–3.6s — Letters fly out.**
   - A Basecamp Match SVG mark and a Popfly SVG mark are absolutely positioned **directly on top of the monogram**, scaled to roughly match the monogram's stroke width and starting at `opacity:0`.
   - At 2.4s they fade in inside the monogram (as if "extracted" from the P and B), then translate outward along arcs (Basecamp Match drifts left + slightly up, Popfly drifts right + slightly up) using `cubic-bezier(.22,.9,.3,1)` over 1.2s, scaling up from ~0.35 to 1.0 and unrotating to level. They land in the exact slots the current logo row uses (same flex layout below — once the animation ends they hand off to the static logo row, position is identical so there's no jump).
   - During the same window, the central monogram shrinks (`scale 1 → 0.18`) and translates **down** into the small "presents" slot below the logo row, ending at the same size and position the mini monogram occupies today.
4. **3.6–4.2s — Title + divider settle.** The `× / divider` flourish fades in between the now-landed logos. "The Creator After Party" title fades up below the small monogram. The small monogram gets a one-time soft pulse to confirm it's the same mark.
5. **4.2s — Reveal page.** Component flips an internal `revealed` state to true and calls an `onRevealed?: () => void` prop. The parent (`AfterPartyInvite.tsx`) uses that callback to fade/slide the rest of the page content (event details, CTA, "See who's coming" link, lookup) up from `opacity:0; translateY(16px)` over 600ms with a 60ms stagger between sections. Final layout is **visually identical** to today — only the entrance is new.

Implementation notes:

- All motion is keyframes on absolutely-positioned layers, no JS rAF loops. One `setTimeout` at 4200ms flips `revealed`.
- The two flying logos use the existing `BasecampMatchAnimated` component and the existing `popfly-logo-neon.png` — the splash just renders them as overlays during the transform, then the steady-state logo row (already in the component) takes over.
- For the "letters extract" feel without doing per-glyph SVG morphing: the logos start centered on the monogram with a clip-path ellipse mask that opens outward as they translate, so they appear to bloom out of it rather than just slide in. Pure CSS — no morph library.
- Final steady state of this component is **identical** to today's render: amber/neon glow logos on either side of `×` divider, small PB monogram centered below, "The Creator After Party" title beneath it.

### 3. Typography + color cleanup

Two small style passes, scoped to `/afterparty` only:

- **Cream, not white**: replace any `text-white` / `#FFFFFF` text in `AfterPartyInvite.tsx`, `BasecampMatchPopflyLogo.tsx`, `MatchesPanel.tsx`, `GuestCard.tsx` (afterparty-only usage), and the event details / CTA blocks with the existing brand cream token (`text-events-cream` / `#F5E6D3`). Body copy, headings, button labels, switch labels, "See who's coming →" link.
- **Kill the black boxes**: remove the dark/translucent backdrop pills currently sitting behind hero text and the event-details rows (e.g. `bg-black/40`, `bg-background/60` wrappers introduced for the about section). The hero background is already dark enough; text sits directly on it. Keeps the cream-on-teal contrast clean.
- **Cooler heading font**: introduce one new display font for the afterparty page only — **Unbounded** (Google Fonts, weights 500/700). It's geometric, slightly unexpected, very legible, has elegant proportions, and pairs with the existing Glacial Indifference body. Loaded via a `<link>` in `index.html` and added as a Tailwind font family `font-afterparty` in `tailwind.config.ts`. Applied to: "The Creator After Party" title, "An invite-only night in RiNo" heading, the "Create my card" CTA label, and the matches/section headings on `/afterparty`. Body copy stays Glacial. No other pages affected.
  - If the user prefers a different vibe (e.g. **Fraunces** for editorial-serif elegance, or **Space Grotesk** for techy-cool), it's a one-line swap — Unbounded is the recommended default for "cool but elegant + legible."

### 4. Files touched

- `src/assets/pb-monogram-v2.png` (new — copied from upload)
- `src/components/afterparty/BasecampMatchPopflyLogo.tsx` (rewrite intro choreography, add `onRevealed` prop, swap to v2 monogram for the splash, cream text)
- `src/pages/AfterPartyInvite.tsx` (gate page content behind `revealed` state from splash, cascade-in animation for sections, cream text, remove black backdrop pills)
- `src/components/afterparty/MatchesPanel.tsx` (white → cream text only, no structural change)
- `src/components/afterparty/GuestCard.tsx` (white → cream text only, no structural change)
- `tailwind.config.ts` (add `afterparty: ['Unbounded', 'sans-serif']` font family)
- `index.html` (add Unbounded Google Fonts `<link>` — only one new font, weights 500/700)

### Out of scope

No changes to matching logic, intake form, schema, edge functions, guest list filtering, splash on other pages, or any non-afterparty surface.

