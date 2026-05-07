// Record /afterparty-clip via headless Chromium using CDP virtual time so
// every captured frame represents exactly 1/FPS seconds of in-page time —
// matching the live /afterparty animation 1:1.
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
const FRAME_BUDGET_MS = 1000 / FPS;
const totalFrames = Math.round((TOTAL_MS / 1000) * FPS);

const URL = `http://localhost:8080/afterparty-clip?ratio=${ratio}`;
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

// Helper: advance virtual time by N ms and resolve when budget expires.
const advance = (budget) =>
  new Promise(async (resolve) => {
    const onExpired = () => {
      client.off("Emulation.virtualTimeBudgetExpired", onExpired);
      resolve();
    };
    client.on("Emulation.virtualTimeBudgetExpired", onExpired);
    await client.send("Emulation.setVirtualTimePolicy", {
      policy: "pauseIfNetworkFetchesPending",
      budget,
    });
  });

// 1. Warm-up load: assets + fonts cached in browser.
console.log(`Warm load ${URL} ...`);
await page.goto(URL, { waitUntil: "networkidle0", timeout: 60_000 });
await page.evaluate(async () => {
  if (document.fonts && document.fonts.ready) await document.fonts.ready;
});

// 2. Pause virtual time, then re-navigate so all timers/animations start
//    at virtual t=0 with the clock paused.
await client.send("Emulation.setVirtualTimePolicy", { policy: "pause" });
await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60_000 });

// 3. Let React mount + first paint by ticking ~80ms of virtual time.
await advance(80);

console.log(`Capturing ${totalFrames} frames (~${(TOTAL_MS / 1000).toFixed(1)}s real-time)...`);

for (let i = 0; i < totalFrames; i++) {
  await advance(FRAME_BUDGET_MS);
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
