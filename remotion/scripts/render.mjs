import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const mode = args[0] || "all"; // "still:<compId>:<frame>:<out>" | "video:<compId>:<codec>:<out>" | "all"

const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (c) => c,
});

const browser = await openBrowser("chrome", {
  browserExecutable: "/bin/chromium",
  chromiumOptions: {
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  },
  chromeMode: "chrome-for-testing",
});

async function renderVideo(compId, codec, output, extra = {}) {
  const composition = await selectComposition({
    serveUrl: bundled,
    id: compId,
    puppeteerInstance: browser,
  });
  console.log(`Rendering ${compId} (${composition.durationInFrames}f) -> ${output}`);
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec,
    outputLocation: output,
    puppeteerInstance: browser,
    muted: true,
    concurrency: 1,
    ...extra,
  });
  console.log(`  done`);
}

async function renderStillFrame(compId, frame, output) {
  const composition = await selectComposition({
    serveUrl: bundled,
    id: compId,
    puppeteerInstance: browser,
  });
  console.log(`Still ${compId} frame=${frame} -> ${output}`);
  await renderStill({
    composition,
    serveUrl: bundled,
    output,
    frame,
    puppeteerInstance: browser,
  });
  console.log(`  done`);
}

if (mode === "stills") {
  // Spot-check key frames from each composition
  await renderStillFrame("opening-full-black", 30, "/tmp/check-fire.png");
  await renderStillFrame("opening-full-black", 100, "/tmp/check-kite.png");
  await renderStillFrame("opening-full-black", 240, "/tmp/check-burst.png");
  await renderStillFrame("lockup-buildon", 50, "/tmp/check-lockup-mid.png");
  await renderStillFrame("lockup-buildon", 140, "/tmp/check-lockup-final.png");
} else if (mode === "all") {
  await renderVideo("opening-full-black", "h264", "/mnt/documents/opening-full-black.mp4", { crf: 16 });
  await renderVideo("fire-and-kite", "vp9", "/mnt/documents/fire-and-kite-transparent.webm", { pixelFormat: "yuva420p", imageFormat: "png" });
  await renderVideo("lockup-buildon", "vp9", "/mnt/documents/lockup-buildon-transparent.webm", { pixelFormat: "yuva420p", imageFormat: "png" });
  await renderStillFrame("lockup-still", 140, "/mnt/documents/lockup-still-transparent.png");
}

await browser.close({ silent: false });
console.log("ALL DONE");
