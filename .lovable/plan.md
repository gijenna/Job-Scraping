
# Standalone After Party Animation Clips

Rebuild the relevant pieces of the `/afterparty` intro in Remotion so we can render clean, frame-perfect 2160x2160 clips. Output goes to `/mnt/documents/` as downloadable files.

## Deliverables

All 2160x2160, 30fps, rendered to `/mnt/documents/`:

1. **`opening-full-black.mp4`** — Full opening sequence on solid black background. Fire grows in, sparks emit, hero spark launches into the popfly kite, kite flutters around the fire trailing dust motes, fire dismisses, kite flies off, snowflake/star burst plays out. ~10s, H.264 MP4.
2. **`fire-and-kite-transparent.webm`** — Same fire + kite choreography (no star burst, no wordmarks), transparent background. WebM VP9 + alpha. ~7s.
3. **`lockup-buildon-transparent.webm`** — New build-on for the "basecamp match × popfly" header lockup: basecamp wordmark draws in left-to-right, flame catches and starts flickering, X divider draws across, popfly kite/wordmark bounces in from the right with neon glow settling into the steady pulse. Holds the steady loop for ~2s. Transparent bg, WebM VP9 + alpha. ~5s total.
4. **`lockup-still-transparent.png`** — Final resting frame of #3 as a high-res PNG with alpha. 2160x2160 (logo centered with generous padding).

## Approach

### Project setup
- Create `remotion/` directory at project root, `bun init`, install Remotion deps + musl/gnu compositor fix per skill instructions.
- Copy existing assets (`popfly-logo-neon.png`, `popfly-kite.png`, `afterparty-star.png`, `afterparty-starset.png`) into `remotion/public/`.
- Inline the fire SVG paths and basecamp wordmark SVG paths from the existing components into Remotion scene components.

### Scene components
- `FireOnly.tsx` — yellow ellipse + animated flame (outer + inner flicker) + matchstick + match head, all driven by `useCurrentFrame()` + `interpolate()`/`spring()`.
- `Sparks.tsx` — emit sparks on a frame-driven loop (replaces CSS `@keyframes bmpSparkRise`).
- `Kite.tsx` — popfly kite image with frame-driven flutter path around the fire, wing-fold scaleX, and neon green drop-shadow glow pulse.
- `TrailMotes.tsx` — frame-driven dust motes that drop off the kite.
- `StarBurst.tsx` — recreates the cream/coral/green sparkle burst using the existing star PNGs.
- `LockupBuildOn.tsx` — basecamp wordmark with `clip-path` reveal driven by frame, animated flame catching, X divider scaleX draw-on, popfly bouncing in via spring, neon pulse loop on the popfly side.

### Compositions in `Root.tsx`
Four registered compositions, each with its own duration:
- `opening-full-black` (background: solid #000)
- `fire-and-kite` (background: transparent)
- `lockup-buildon` (background: transparent)
- `lockup-still` (a `<Still>` at the resting frame of `lockup-buildon`)

### Render script
`remotion/scripts/render-all.mjs` renders all four:
- MP4: `codec: 'h264'` for the black-background clip.
- WebM with alpha: `codec: 'vp9'`, `pixelFormat: 'yuva420p'` for the two transparent clips.
- PNG: `bunx remotion still` for the static lockup.

All outputs go directly to `/mnt/documents/`. Final step lists the files with sizes and emits `<lov-artifact>` tags so you can download them.

## Notes / constraints
- Per skill rules, all motion uses `useCurrentFrame()` + `interpolate()` / `spring()` — no CSS animations carried over from the live page.
- The kite flutter path will visually match the existing wide-around-the-fire choreography but be rebuilt as a parametric path so it stays smooth at 2160x2160.
- Square (2160x2160) framing means the lockup will be centered with vertical padding rather than stretched — the lockup itself stays in its natural horizontal proportion.
- I'll spot-check key frames with `bunx remotion still` before doing the full renders to catch any visual issues early.

## Out of scope
- No changes to the live `/afterparty` page — these clips are exports only.
- No audio.
- The Oakley variant — same source animation, so the clips work for both unless you tell me otherwise.
