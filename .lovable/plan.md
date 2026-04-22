

## Splash intro + event details for Creator After Party

Two-part change to `/afterparty`:

### 1. PB monogram splash → animated reveal

- Save the uploaded coral PB monogram to `src/assets/pb-monogram.png` (transparent).
- Update `BasecampMatchPopflyLogo.tsx` to play a 3-stage intro on first paint:
  1. **0–1.4s**: Only the PB monogram is visible, centered, gently pulsing (scale + glow). Basecamp Match and Popfly logos are hidden (off-screen left/right).
  2. **1.4–2.4s**: The two side logos "flutter" in to their final positions (slight rotation + ease, layered on the existing `bmpFromLeft`/`bmpFromRight` motion). PB monogram shrinks/fades to occupy the slot where the "presents" kicker currently sits.
  3. **2.4s+**: PB monogram becomes the "presents" mark itself — replacing the current `presents` text. "The Creator After Party" title fades in below it, as today.
- Net result: the old `presents` text is removed; the PB monogram permanently lives where it used to be (small, centered, between the logo row and the title).
- All animation pure CSS keyframes, no new libraries. Honors `prefers-reduced-motion` by snapping to final state.

### 2. Event details section + opt-in gating

Currently the intake form only shows in edit mode for verified attendees. Add a new "About the event" section in `AfterPartyInvite.tsx`, rendered between the hero copy and the lookup/matches area, visible to everyone:

- Heading: "An invite-only night in RiNo"
- Body copy (admin-editable via `EditableText`, multiline): "A curated evening for brands, creators, and Outside Days festival sponsors — hosted in one of RiNo's newest, coolest spots. Address shared after RSVP."
- Three small detail rows (date, neighborhood, dress) using `EditableText` keys so Jenna can edit.
- Primary CTA button: **"Create my card"** — scrolls to / reveals the existing name lookup + (for invited attendees) intake form. Secondary link: "Already RSVP'd? Find my card" → focuses the existing lookup input.
- The matches/skeleton block stays below, but only renders once a card is loaded (today it shows skeleton always — change to hide until `me` exists, so the first-visit page is just: splash → event info → CTA).

### Files touched

- `src/assets/pb-monogram.png` (new — copied from upload)
- `src/components/afterparty/BasecampMatchPopflyLogo.tsx` (intro animation, remove "presents" text, mount PB monogram in its place)
- `src/pages/AfterPartyInvite.tsx` (new event-details + CTA section, gate matches skeleton on `me`)

### Editable copy keys added

- `afterparty.about.title`, `afterparty.about.body`, `afterparty.about.detail1/2/3`, `afterparty.cta.primary`, `afterparty.cta.secondary`

