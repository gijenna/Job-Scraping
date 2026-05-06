## Goal

Two MP4s that are 1:1 the current `/afterparty` opening animation (logo splash → snowflake burst → Oakley merge → presenter lockup → "Out of Office" reveal → sparkles → "DJ ✦ Drinks ✦ Swag ✦ Food ✦ Friends" line). Nothing below that line, no greeting, no RSVP card, no spotlights — just the top portion. Two crops:

- **Square 1080×1080** (feed / desktop)
- **Story 1080×1920** (Instagram / mobile)

The previous Remotion-based "social post" outputs are scrapped because they re-implemented the animation from scratch and drifted from the live one.

## Approach

Capture the *actual* live page through a headless browser so the animation pixels are exactly identical to what users see — zero re-implementation risk.

### 1. Add a clip-only route — `/afterparty-clip`
- New file `src/pages/AfterPartySplashClip.tsx` that renders ONLY:
  - the `BasecampMatchPopflyLogo` (unchanged, so identical timing/easing)
  - the sparkles row + the "DJ ✦ Drinks ✦ Swag ✦ Food ✦ Friends" inline row (copy-pasted from `AfterPartyInvite.tsx` lines 419–439, identical fonts/spacing)
  - the same `bg-sunset.jpg` background and the same darkening overlay (so the fade-in look matches)
- Nothing else — no nav, no greeting overlay, no RSVP card, no spotlights, no footer.
- Reads `?ratio=square|story` to pick a `max-width` that matches the original mobile column on /afterparty.
- Sets `window.__SPLASH_DONE__ = true` once `BasecampMatchPopflyLogo` fires `onRevealed`, so the recorder knows when to stop.
- Register route in `src/App.tsx`: `<Route path="/afterparty-clip" element={<AfterPartySplashClip />} />`.

### 2. Replace `remotion/scripts/render-social.mjs` with a Puppeteer recorder
- Install `puppeteer-core` (Chromium is already at `/bin/chromium` in the sandbox; no download needed).
- New script `remotion/scripts/record-afterparty-clip.mjs`:
  - Launches `chromium` headless at viewport 1080×1080 (square) or 1080×1920 (story).
  - Navigates to `http://localhost:8080/afterparty-clip?ratio=<square|story>`.
  - Waits for `bg-sunset.jpg` and fonts to be ready, then waits for the splash to fully finish (`window.__SPLASH_DONE__`) plus a small tail (~1.5s) so the "DJ … Friends" line is visible at rest.
  - Uses Chrome DevTools Protocol `Page.startScreencast` (or simpler: `page.screenshot` in a tight 30 fps loop) to capture frames into `/tmp/clip-frames-<ratio>/frame-####.png`.
  - Pipes the frames to ffmpeg: `ffmpeg -framerate 30 -i frame-%04d.png -c:v libx264 -pix_fmt yuv420p -movflags +faststart out.mp4`.
  - Outputs to `/mnt/documents/afterparty-clip-square.mp4` and `/mnt/documents/afterparty-clip-story.mp4`.
- Total clip length: ~12s (matches the existing reveal timeline — splash ends around frame 10800ms, plus ~1.5s settle).

### 3. Cleanup
- Delete the now-obsolete Remotion outputs and the old `SocialPost.tsx`/`render-social` Remotion path so the only "social clip" pipeline is this one. (Files: `remotion/src/scenes/SocialPost.tsx`, the SocialPost composition entry in `remotion/src/Root.tsx`, and the prior MP4s.)

## Why this is the right approach

- **Pixel-identical**: We're recording the real `BasecampMatchPopflyLogo` — same DOM, same CSS keyframes, same easing, same delays. No drift between web and clip.
- **Editable in one place**: If you later tweak the animation timings on `/afterparty`, re-running the recorder picks up the changes automatically.
- **No new framework debt**: Removes the fragile Remotion re-implementation.

## Deliverables

- `/mnt/documents/afterparty-clip-square.mp4` (1080×1080)
- `/mnt/documents/afterparty-clip-story.mp4` (1080×1920)

I'll surface both with `<lov-artifact>` tags after the render so you can preview/download from chat.
