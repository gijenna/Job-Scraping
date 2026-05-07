// Record /afterparty-clip by explicitly seeking the page to each frame time.
// This avoids wall-clock drift and keeps the MP4 exactly 1:1 with the web animation.
//
// Usage: node scripts/record-afterparty-clip.mjs <square|story>

import { mkdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import puppeteer from "puppeteer-core";

const ratio = process.argv[2] === "square" ? "square" : "story";
const WIDTH = 1080;
const HEIGHT = ratio === "square" ? 1080 : 1920;
const FPS = 30;
const SPLASH_MS = 10800;
const TAIL_MS = 1500;
const HEAD_MS = 200;
const TOTAL_MS = SPLASH_MS + TAIL_MS + HEAD_MS;
const totalFrames = Math.round((TOTAL_MS / 1000) * FPS);

const URL = `http://localhost:8080/afterparty-clip?ratio=${ratio}&seek=0`;
const FRAME_DIR = `/tmp/clip-frames-${ratio}`;
const OUT = `/mnt/documents/afterparty-clip-${ratio}.mp4`;

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
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
});

console.log(`Capturing ${totalFrames} frames (~${(TOTAL_MS / 1000).toFixed(1)}s real-time)...`);

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
