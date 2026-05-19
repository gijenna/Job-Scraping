// Record /afterparty-clip?mode=sponsors at deterministic seek frames.
// Produces: /mnt/documents/afterparty-sponsors-{square|story}.mp4
//
// Usage: node scripts/record-afterparty-sponsors.mjs <square|story>

import { mkdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import puppeteer from "puppeteer-core";

const ratio = process.argv[2] === "square" ? "square" : "story";
const WIDTH = 1080;
const HEIGHT = ratio === "square" ? 1080 : 1920;
const FPS = 30;
const HEAD_MS = 200;
// Mirror src/pages/AfterPartySplashClip.tsx timings
const SPLASH_MS = 10800;
const DJ_FADE_IN_MS = 800;
const DJ_HOLD_MS = 1200;            // splash holds before fading out (10800+800+1200=12800 = SPLASH_FADE_OUT_START)
const SPLASH_FADE_OUT_MS = 1200;
const SPONSORS_FADE_IN_MS = 1200;
const HOLD_MS = 4200;               // hold sponsors panel
const TAIL_MS = 600;
const TOTAL_MS =
  HEAD_MS + SPLASH_MS + DJ_FADE_IN_MS + DJ_HOLD_MS + SPLASH_FADE_OUT_MS + SPONSORS_FADE_IN_MS + HOLD_MS + TAIL_MS;
const totalFrames = Math.round((TOTAL_MS / 1000) * FPS);

const URL = `http://localhost:8080/afterparty-clip?ratio=${ratio}&mode=sponsors&seek=0`;
const FRAME_DIR = `/tmp/sponsors-frames-${ratio}`;
const OUT = `/mnt/documents/afterparty-sponsors-${ratio}.mp4`;

if (existsSync(FRAME_DIR)) rmSync(FRAME_DIR, { recursive: true });
mkdirSync(FRAME_DIR, { recursive: true });

console.log(`Launching headless chromium @ ${WIDTH}x${HEIGHT} ...`);
const browser = await puppeteer.launch({
  executablePath: "/bin/chromium",
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--hide-scrollbars",
    `--window-size=${WIDTH},${HEIGHT}`,
  ],
  defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 },
});

const page = await browser.newPage();
await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
const client = await page.target().createCDPSession();

console.log(`Warm load ${URL} ...`);
await page.goto(URL, { waitUntil: "networkidle0", timeout: 60_000 });
await page.evaluate(async () => {
  if (document.fonts && document.fonts.ready) await document.fonts.ready;
  // wait for sponsors data + their logos to load
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    if ((window).__SPONSORS_LOADED__) break;
    await new Promise((r) => setTimeout(r, 100));
  }
  // give logos a moment to fetch
  await new Promise((r) => setTimeout(r, 1200));
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
});

console.log(`Capturing ${totalFrames} frames (~${(TOTAL_MS / 1000).toFixed(1)}s)...`);

for (let i = 0; i < totalFrames; i++) {
  const ms = i * (1000 / FPS);
  await page.evaluate(async (timeMs) => {
    window.__SET_AFTERPARTY_CLIP_TIME__?.(timeMs);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    document.getAnimations({ subtree: true }).forEach((animation) => {
      animation.pause();
      animation.currentTime = timeMs;
    });
  }, ms);
  const { data } = await client.send("Page.captureScreenshot", {
    format: "jpeg",
    quality: 92,
    captureBeyondViewport: false,
  });
  writeFileSync(`${FRAME_DIR}/frame-${String(i).padStart(5, "0")}.jpg`, Buffer.from(data, "base64"));
  if (i % 30 === 0) console.log(`  frame ${i}/${totalFrames}`);
}

await browser.close();
console.log("Encoding mp4 with ffmpeg...");

const ffmpegBin = spawnSync("which", ["ffmpeg"]).stdout.toString().trim();
const res = spawnSync(
  ffmpegBin,
  [
    "-y",
    "-framerate", String(FPS),
    "-i", `${FRAME_DIR}/frame-%05d.jpg`,
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    "-crf", "18",
    OUT,
  ],
  { stdio: "inherit" },
);

if (res.status !== 0) {
  console.error("ffmpeg failed");
  process.exit(1);
}

console.log(`✓ wrote ${OUT}`);
