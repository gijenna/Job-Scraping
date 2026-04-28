## Goal

Refine the opening intro on `/afterparty` so it feels smooth, elegant, and tightly paced — and have the snowflake burst be the moment the rest of the invite appears (snowflakes scatter into the page).

All work happens in `src/components/afterparty/BasecampMatchPopflyLogo.tsx` plus a tiny tweak to `src/pages/AfterPartyInvite.tsx` so the rest of the invite renders earlier (synchronized with the snowflake burst, not after it).

---

## Changes

### 1. Smoother Basecamp fire grow-in
- Replace `bmpFireGrow` with a single-stage ease-out curve (no mid-bounce step) using `cubic-bezier(.16,.84,.32,1)`, starting from `scale(0.08)` and growing continuously to `scale(1)` over ~900ms.
- Remove the `bmpFireRumble` margin-shift animation (it's the source of the jerky horizontal jitter). Keep only `bmpFireGlow` for the amber halo pulse.
- Slow `bmpFlameOuter` / `bmpFlameInner` slightly (1.6s / 1.1s) and switch to `cubic-bezier(.4,0,.6,1)` so the flame licks read as fluid rather than twitchy.

### 2. Kite — no circular clip, true wing flutter, dust trail
- Remove `border-radius: 50%` from `.bmp-kite` so the kite shows freely (no circle around it).
- Replace the current jerky `bmpKiteFlutter` (8 hard waypoints) with a smoother path:
  - Use a Bezier-style figure-8 with only 4 waypoints + `cubic-bezier(.45,.05,.55,.95)` so motion eases between every point. Total path stays around the fire but feels like a butterfly.
- Add a real "wing fold" via a second animation `bmpKiteWingFold`:
  - Animates `transform: scaleX(...)` between `1 → 0.55 → 1` on a child wrapper at ~600ms infinite ease-in-out, simulating the kite folding in half and back out like wings.
  - Implementation: wrap the `<img>` in a `<div class="bmp-kite-wings">` so the outer div handles flight path + rotation, the inner div handles the wing-fold scaleX, and the img keeps its glow filter. This avoids transform conflicts.
- Slow the per-revolution flutter to ~3s (one loop) so the path reads as elegant rather than frantic.

### 3. Kite dust trail (mixed warm + neon)
- Add a new emitter: 6–8 small dust motes positioned at the kite's center via a shared CSS variable system. Each mote uses `position: fixed; top: 50%; left: 50%;` and a new `bmpKiteTrail` keyframe that fades + drifts down ~30px while shrinking.
- Implementation approach: render the trail motes as siblings of the kite, each with `animation-delay` staggered every 180ms across the kite's flutter window (2.4s–5.0s), and position them by reading `--kx / --ky` CSS vars set on the kite's parent via the same flutter keyframe values at the trail-mote percentages. To keep this simple and performant: render ~10 trail motes that each follow a shortened/offset version of the flutter path with their own delay, so they appear to "drop off" the kite.
- Mote palette alternates: `#39FF14` (neon), `#E1B624` (amber), `#F5E6D3` (cream), `#ED7660` (coral) — mostly neon with warm sparks mixed in.
- Each mote: 4–6px, radial-gradient white→tone, soft `box-shadow` glow.

### 4. Tightened pacing
Current → New timeline:

```text
                 OLD          NEW
Fire grow        0.0–1.0s     0.0–0.9s   (smoother curve)
Sparks loop      1.0–2.0s     0.6–1.6s   (start sooner, shorter window)
Hero spark       2.0–2.6s     1.5–1.9s
Kite appear      2.4s         1.8s
Kite flutter     2.8–5.2s     1.9–4.7s   (~2.8s, smoother path + dust)
Fire dismiss     5.0–5.8s     4.5–5.1s
Kite dismiss     5.2–5.9s     4.6–5.2s
Lockup bloom     7.6s         5.2s       (no awkward dead air)
Presents/X/title 8.4–8.8s     5.8–6.4s
OD pop           9.0s         6.0s       (appears sooner, higher Y, animates downward)
Star burst       9.0s         6.6s       (snowflakes burst)
Stage out / reveal 9.5s       7.0s       (invite appears AS snowflakes burst)
```

Net result: ~7.0s total, with no period of "just sparks with nothing else on screen."

### 5. Outside Days logo lands in the kickoff line
- Add a new keyframe `bmpODFindHome` that replaces `bmpODPop`:
  - 0%: opacity 0, `translate(-50%, -120%) scale(0.4)` (higher on the page).
  - 30%: opacity 1, `translate(-50%, -100%) scale(1)`.
  - 70%: opacity 1, `translate(-50%, -50%) scale(0.7)` (drifts downward).
  - 100%: opacity 0, `translate(-50%, +30%) scale(0.28)` (lands ~where the inline OD logo sits in the kick-off line, then fades into it).
- The exact `+30%` translation target is calibrated so the shrunk OD logo visually overlaps the inline `<img src={outsideDaysLogo}>` in the "An official [OD] kick-off party" line.

### 6. Snowflake burst = invite reveal (the big sync change)
- The snowflakes (the `burstStars` rendering `StarSparkle`) currently fire at 9.0s and the invite reveals at 9.5s (after they finish). Move the burst earlier (6.6s) and have `onRevealed` fire at 7.0s — i.e. just as the snowflakes reach their outermost point. This makes them feel like they burst into the page.
- In `AfterPartyInvite.tsx`, the existing `revealed` state already fades in the rest of the invite when `splashDone` flips. Add a 250ms ease-out fade-up on the invite content so snowflakes feel like they scatter and the invite materializes underneath. This requires confirming the existing wrapper around the post-splash content has a transition class — if not, add `transition-opacity duration-300` and toggle `opacity-0`/`opacity-100` based on `revealed`.
- Reduce the `setTimeout(... 9500)` in `BasecampMatchPopflyLogo.tsx` to `7000`.
- Update `bmp-splash-stage` `bmpStageOut` delay from `8.2s` to `6.6s` so the dark stage fades out simultaneously with the snowflake burst.

### 7. Reduced-motion preserved
- Keep the existing `@media (prefers-reduced-motion: reduce)` block; just update the new selectors (`.bmp-kite-wings`, `.bmp-kite-trail`) to be hidden too.

---

## Files

- `src/components/afterparty/BasecampMatchPopflyLogo.tsx` — keyframes, timings, kite wrapper structure, dust-trail emitters, OD landing keyframe, removal of circular clip, removal of rumble.
- `src/pages/AfterPartyInvite.tsx` — ensure the post-splash content has a smooth fade-in tied to `revealed`, so it visibly "materializes" with the snowflake burst.

No new assets, no DB or edge function changes.

---

## What stays exactly the same

- The OutsideDays + snowflakes block content (snowflake shapes, colors, sizes, count).
- The final lockup design (Basecamp Match × Popfly), the "presents" wordmark, "Out of Office" title, and "An official [OD] kick-off party" line.
- Every section of the invite below the splash.
