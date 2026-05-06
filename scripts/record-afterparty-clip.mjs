// Record the /afterparty-clip route via headless Chromium frame-by-frame,
// then encode with ffmpeg. Produces pixel-identical capture of the live
// animation (no re-implementation).
//
// Usage: node scripts/record-afterparty-clip.mjs <square|story>

import { mkdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import puppeteer from "puppeteer-core";

const ratio = process.argv[2] === "square" ? "square" : "story";
const WIDTH = ratio === "square" ? 1080 : 1080;
const HEIGHT = ratio === "square" ? 1080 : 1920;
const FPS = 30;
const TAIL_MS = 1500; // how long to hold after splash reveals
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

console.log(`Loading ${URL} ...`);
await page.goto(URL, { waitUntil: "networkidle0", timeout: 30_000 });

// Wait for fonts + sunset image
await page.evaluate(async () => {
  await (document as any).fonts?.ready;
  const img = new Image();
  img.src = "/bg-sunset.jpg";
  if (!img.complete) {
    await new Promise((r) => {
      img.onload = r;
      img.onerror = r;
    });
  }
});

// Use CDP to capture frames at a fixed cadence (deterministic clock)
const client = await page.target().createCDPSession();

// Total clip = 12s (splash ~10.8s + 1.5s tail + small head buffer)
const TOTAL_MS = 10800 + TAIL_MS + 200;
const totalFrames = Math.round((TOTAL_MS / 1000) * FPS);

console.log(`Capturing ${totalFrames} frames (~${(TOTAL_MS / 1000).toFixed(1)}s)...`);

const start = Date.now();
for (let i = 0; i < totalFrames; i++) {
  const targetT = (i / FPS) * 1000;
  const wait = start + targetT - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  const { data } = await client.send("Page.captureScreenshot", {
    format: "jpeg",
    quality: 92,
    captureBeyondViewport: false,
  });
  const fname = `${FRAME_DIR}/frame-${String(i).padStart(5, "0")}.jpg`;
  writeFileSync(fname, Buffer.from(data, "base64"));
  if (i % 30 === 0) console.log(`  frame ${i}/${totalFrames}`);
}

await browser.close();
console.log("Encoding mp4 with ffmpeg...");

const ffmpegBin = spawnSync("which", ["ffmpeg"]).stdout.toString().trim();
const res = spawnSync(
  ffmpegBin,
  [
    "-y",
    "-framerate",
    String(FPS),
    "-i",
    `${FRAME_DIR}/frame-%05d.jpg`,
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-crf",
    "18",
    OUT,
  ],
  { stdio: "inherit" },
);

if (res.status !== 0) {
  console.error("ffmpeg failed");
  process.exit(1);
}

console.log(`✓ wrote ${OUT}`);
