## New Opening Animation: Fire → Spark → Kite → Lockup

Replace the current "PB monogram splash + star burst" opening with a cinematic fire/spark/kite sequence that resolves into the existing Basecamp Match × Popfly lockup. Everything from the Outside Days snowflakes onward stays untouched.

### Asset prep

Copy three uploaded files into `src/assets/`:
- `basecamp-match-fire.png` (full Basecamp Match logo with fire circle + wordmark) — we'll also use it solo as the central fire mark
- `popfly-wordmark.png` (full green Popfly wordmark with kite)
- `popfly-kite.png` (just the dark teal kite/triangle in a circle)

The two wordmarks will get the same neon glow treatment already used on the main invite (amber for Basecamp Match, neon green for Popfly).

### Choreographed timeline (~7s before existing Outside Days beat)

```
0.0 - 1.0s   Fire circle (just the Basecamp flame mark, no wordmark) appears
             tiny at center, scales up to ~min(40vh,40vw), gentle rumble +
             amber glow. Flames "move" via subtle hue/scale pulse + drop-shadow
             flicker (no new asset, just CSS keyframes on the existing fire).

1.0 - 2.0s   Sparks start emitting from the fire — 8-12 small cream/coral/yellow
             dots that arc outward, fade, and drift up like real embers.
             Continuous loop while fire stays centered.

2.0 - 2.3s   One spark (slightly brighter, green-tinted) shoots out from the
             top of the fire and morphs into the Popfly kite mid-flight
             (cross-fade spark → kite asset, scale-up).

2.3 - 4.8s   Kite "firefly" flutter: travels a hand-tuned path around the fire
             circle (figure-eight / loose orbit) with gentle wing-flap rotation
             (-8deg ↔ +8deg) and a soft green glow trail. ~2.5s of personality.
             Sparks continue in background.

4.8 - 5.8s   LOCKUP FORMS:
             • Fire circle shrinks + slides left to its final Basecamp Match
               icon position
             • Basecamp Match wordmark fades in to the right of the fire
               (forming the complete Basecamp Match logo on the LEFT side of
               the lockup)
             • Kite flies to its home position above the "y" in Popfly
             • Popfly wordmark fades in around the landed kite (forming the
               complete Popfly logo on the RIGHT side of the lockup)
             • Divider lines + "×" grow in between them
             • Both logos settle with their existing neon glow pulses
               (amber-pulse on Basecamp, neon-green-pulse on Popfly)

5.8s onward  EXISTING SEQUENCE RESUMES UNCHANGED:
             • Star burst (the 16 cream/coral/green hand-drawn stars)
             • "presents" wordmark drops in
             • "Out of Office" title fades up
             • "An official [Outside Days] kick-off party" line
             • Outside Days stacked logo pop (the part you said NOT to change)
             • Page reveal at end
```

The lockup, once formed, stays static and visible through the rest of the invite (Outside Days beat happens with the lockup still in place at the top), exactly as the current steady-state already does.

### Technical implementation

Edit only `src/components/afterparty/BasecampMatchPopflyLogo.tsx`:

1. Replace the splash overlay JSX (the `bmp-splash-mono` PB monogram, the 16 `bmp-burst-star` elements that fire during the splash, and the `bmpSoloPulse` / `bmpWindUp` / `bmpSplashShrink` keyframes) with a new fire/spark/kite splash stage.
2. Add new keyframes:
   - `bmpFireGrow` (0 → full size, 0–1s)
   - `bmpFireFlicker` (continuous flame pulse via filter drop-shadow)
   - `bmpSparkEmit` (per-spark arc + fade, multiple instances with staggered delays)
   - `bmpSparkToKite` (the chosen spark scale + cross-fade into kite)
   - `bmpKiteFlutter` (path animation using translate + rotate keyframes, ~2.5s)
   - `bmpFireToLockup` (shrink + translate fire to its left-side lockup slot)
   - `bmpKiteToLockup` (translate kite to its position above the "y")
   - `bmpWordmarkFadeIn` (each wordmark fades + scales in around its anchor)
3. Push the existing star burst, presents wordmark, Out of Office title, and Outside Days pop animations LATER on the timeline by ~5.8s (they currently start at 3.6s, 5.4s, etc.) so they play AFTER the new lockup forms. The existing `bmp-burst-star`, `bmp-presents`, `bmp-title`, `bmp-od-stacked`, and `bmp-splash-stage` animation-delay values get shifted.
4. Update the `useEffect` reveal delay from `6400` to roughly `9500` ms so `onRevealed` fires after the full new sequence completes.
5. Update the `bmpStageOut` delay so the dark teal splash stage fades out at the right new moment.
6. Reduced-motion path: skip the splash entirely and show the final lockup + title immediately, same approach as today.

### Things that stay exactly the same
- Outside Days stacked-logo pop and the entire snowflake/kick-off beat
- Final lockup layout (Basecamp Match × Popfly with the divider + "×")
- "presents" wordmark, "Out of Office" title, "An official Outside Days kick-off party" line
- Neon amber glow on Basecamp Match and neon green glow on Popfly in steady state
- All sizing, fonts, and colors of the steady-state lockup
- No other component or page is touched

### Open assumptions (will proceed unless you say otherwise)
- Fire mark in the opening = the flame-in-yellow-circle from the Basecamp Match logo asset (cropped/used solo). If you'd rather I use a different isolated fire asset, say so and I'll wait for it.
- Sparks are pure CSS dots (no new image asset) styled with the cream/coral/yellow brand palette.
- Kite flutter path is hand-tuned, not random — same on every load.
