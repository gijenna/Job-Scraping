## Goal

Three fixes to the `/afterparty` opening intro:

1. Kite shows ONLY the green kite shape — no white box, no dark outline behind it.
2. Slow down the entire kite section (overall pacing, flight speed, wing fold) so it reads as elegant.
3. Make the Outside Days logo actually land on the small inline OD logo in the "An official [OD] kick-off party" line.

---

## 1. Strip white + outline from the kite asset

`src/assets/popfly-kite.png` is currently a 200×200 PNG with an opaque white background and a dark `rgb(29,38,45)` outline around the green kite. Even with no `border-radius`, the rectangle and outline render as a visible white/black box.

Run a one-off Python script to overwrite the asset with a clean transparent version:
- Set alpha = 0 for any pixel where R/G/B > 240 (white background).
- Set alpha = 0 for any pixel where R/G/B < 70 (dark outline).
- Set alpha = 0 for low-saturation gray pixels (anti-aliased edges between white and outline) so the silhouette is crisp and only the green body remains.

Result: only the green kite shape is visible — its glow filter and dust trail will read clean against the dark teal stage.

(Already executed in the read-only inspection step; the file is updated. No code change needed for this item.)

## 2. Slow the kite section down

Edit `src/components/afterparty/BasecampMatchPopflyLogo.tsx`:

- **Wing fold**: `bmpKiteWingFold` cycle from `700ms` → `1200ms` (slower, more deliberate flap).
- **Flutter flight**: `bmpKiteFlutter` from `2800ms` → `4200ms` for a single revolution around the fire.
- **Kite appear**: `350ms` → `500ms` (slightly softer entrance).
- **Kite glow pulse**: `1.4s` → `1.8s`.
- **Kite dismiss**: shifts from `4600ms` → `6000ms` to allow the longer flutter.
- **Fire dismiss**: `4500ms` → `5800ms` so the fire stays present while the kite finishes its slower path.
- **Hero spark launch delay**: `1500ms` → `1700ms` so the spark→kite handoff isn't rushed.
- **Trail motes**: extend the dust delay window from `1900–4100ms` → `2300–5500ms` and bump each mote's drift duration from `~900ms` → `1200ms` so the dust feels like it's gently floating, matching the slower flight.

Updated steady-state lockup timings (everything shifts later by ~1.6s):
- `bmp-bloom-left/right` start: `5.2s` → `6.8s`
- `PRESENTS_DELAY_S`: `5.8` → `7.4`
- `DIVIDER_DELAY_S`: `5.6` → `7.2`
- `X_DELAY_S`: `5.7` → `7.3`
- `TITLE_DELAY_S`: `6.2` → `7.8`
- `X_GLOW_DELAY_S`: `6.6` → `8.2`
- `NEON_PULSE_DELAY_S`: `6.0` → `7.6`
- `OD_POP_DELAY_S`: `6.0` → `7.6` (OD starts as lockup blooms in)
- `STAR_BURST_DELAY_MS`: `6600` → `8400` (snowflakes burst as OD lands)
- `STAGE_OUT_DELAY_S`: `6.6` → `8.4` (dark stage fades with the snowflake burst)
- `useEffect` reveal timeout: `7000ms` → `8800ms`

Net total runtime: ~7s → ~8.8s — still tight, but every beat has room to breathe.

## 3. Outside Days lands in the kickoff line

The kickoff line ("An official [OD logo] kick-off party") sits in the lockup container, roughly **220–260px below viewport center** on a typical mobile viewport. The current `bmpODFindHome` keyframe ends at `translate(-50%, 40%)` of the OD element's OWN height, which only moves it down ~50px — nowhere near the kickoff line. That's why it doesn't visually merge.

Fix the keyframe to use a viewport-based translate:

```css
@keyframes bmpODFindHome {
  0%   { opacity: 0; transform: translate(-50%, calc(-50% - 30vh)) scale(0.4); }
  20%  { opacity: 1; transform: translate(-50%, calc(-50% - 26vh)) scale(1); }
  55%  { opacity: 1; transform: translate(-50%, calc(-50% - 8vh)) scale(0.6); }
  90%  { opacity: 0.6; transform: translate(-50%, calc(-50% + 22vh)) scale(0.16); }
  100% { opacity: 0; transform: translate(-50%, calc(-50% + 26vh)) scale(0.12); }
}
```

What this does:
- Starts ~30vh above center (high on the page, as requested).
- Hits full size near the top of its arc.
- Drifts smoothly down past lockup.
- Lands at +26vh below viewport center (≈ where the inline kickoff-line OD logo sits) at ~12% scale (matching the inline logo's tiny size of `h-3.5 sm:h-4 md:h-5`).
- Fades out at the very end so it visually merges into the inline logo rather than popping away.

Also bump the OD animation duration from `1500ms` → `1900ms` so the descent feels graceful, not snappy.

## Files

- `src/components/afterparty/BasecampMatchPopflyLogo.tsx` — timing constants, kite/wing/glow/dismiss/fire-dismiss durations, trail mote delays + durations, OD keyframe + duration, and the `useEffect` reveal timeout.
- `src/assets/popfly-kite.png` — already cleaned (alpha mask applied).

No other files affected.
