## Goal

Re-render the two afterparty splash clips (`/mnt/documents/afterparty-clip-square.mp4` and `afterparty-clip-story.mp4`) so that:

1. The animation plays at the **exact same speed as `/afterparty`** (not sped up).
2. The whole splash (logo lockup, snowflakes, Oakley merge, "Out of Office", kick-off line, sparkles + "DJ ✦ Drinks ✦ Swag ✦ Food ✦ Friends") **fills the frame** instead of sitting small in the middle.

No timing, copy, or visual changes to `/afterparty` itself. Only the recorder + the standalone `/afterparty-clip` route are touched.

## Why the current clips look sped up

`scripts/record-afterparty-clip.mjs` captures screenshots on a real wall-clock loop. Each `Page.captureScreenshot` call takes ~80–150 ms in headless Chromium, so the loop can't keep up with 30 fps. The recorder still tags those frames as 1/30 s apart at encode time, which compresses ~10.8 s of animation into ~5–6 s of video. Result: animation looks ~2× too fast.

The fix is to drive Chromium with **CDP virtual time** (`Emulation.setVirtualTimePolicy`), which freezes the page clock between captures. Each frame then represents exactly 1/30 s of in-page time regardless of how long the screenshot itself takes — output matches `/afterparty` 1:1.

## Changes

### 1. `scripts/record-afterparty-clip.mjs` — real-time virtual clock capture

- After page load + font/image readiness, switch the page into paused virtual time:
  - `Emulation.setVirtualTimePolicy { policy: "pause" }` once.
  - For each frame i: `Emulation.setVirtualTimePolicy { policy: "advance", budget: 1000/FPS, waitForNavigation: false }`, await the `Emulation.virtualTimeBudgetExpired` event, then capture the screenshot.
- Remove the wall-clock `setTimeout` pacing loop.
- Keep total duration = 10800 ms splash + 1500 ms tail + 200 ms head buffer (≈ 375 frames @ 30 fps).
- Keep ffmpeg encode settings (libx264, yuv420p, crf 18, faststart).
- Output paths unchanged: `/mnt/documents/afterparty-clip-square.mp4` and `/mnt/documents/afterparty-clip-story.mp4`.

### 2. `src/pages/AfterPartySplashClip.tsx` — scale-to-fill wrapper

Wrap the existing inner content (`BasecampMatchPopflyLogo` + sparkles + "DJ ✦ Drinks ✦ Swag ✦ Food ✦ Friends" row) in a fixed-size "design" container (e.g. 560 × 720 for story, 720 × 560 for square — chosen to match the natural aspect of the lockup), then apply `transform: scale(<viewport-fit-ratio>)` on a parent so the whole thing scales up uniformly until it fills the 1080×1080 / 1080×1920 frame with a small safe-area margin (~5%).

- Square (1080×1080): scale ≈ 1.4×, vertically centered, full frame width minus 5% padding.
- Story (1080×1920): scale ≈ 1.7×, vertically centered, taller breathing room top/bottom.
- Use `transform-origin: center center` so the snowflake burst, Oakley cross-fade, and sunset-darkening overlay all stay correctly composed.
- Sunset background overlay + `apClipBgDarken` keyframe stay exactly as-is (they're on the outer fixed-inset layer, not inside the scaled container, so the dark overlay still covers the full frame).
- No font-size hardcoding for the bottom line — it scales with the parent transform, so it'll grow proportionally with the rest of the lockup.

### 3. Re-run the recorder for both ratios

After the two file edits, run:

```
node scripts/record-afterparty-clip.mjs square
node scripts/record-afterparty-clip.mjs story
```

(sequentially, since they share `/tmp/clip-frames-*` dirs only by name but Chromium reuse is cleaner sequentially)

Then deliver both MP4s as artifacts.

## What stays untouched

- `/afterparty` page, `BasecampMatchPopflyLogo.tsx`, `AfterPartyInvite.tsx`, all keyframes, all timings.
- The 8000 ms `onInvitePop` / 10800 ms `onRevealed` callbacks — clip route uses only `onRevealed`.
- All copy.

## Deliverables

Two refreshed MP4s in `/mnt/documents/`, played back at true real-time speed, with the lockup + bottom text filling the square and 9:16 frames respectively.