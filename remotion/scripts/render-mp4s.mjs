import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bundled = await bundle({ entryPoint: path.resolve(__dirname, "../src/index.ts") });

const browser = await openBrowser("chrome", {
  browserExecutable: "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});

const targets = [
  { id: "opening-full-black-with-logo", out: "/mnt/documents/opening-full-black-with-logo.mp4" },
  { id: "opening-sunset", out: "/mnt/documents/opening-sunset.mp4" },
  { id: "fire-and-kite-black", out: "/mnt/documents/fire-and-kite-black.mp4" },
  { id: "lockup-buildon-black", out: "/mnt/documents/lockup-buildon-black.mp4" },
];

for (const { id, out } of targets) {
  const composition = await selectComposition({ serveUrl: bundled, id, puppeteerInstance: browser });
  console.log(`Rendering ${id} (${composition.durationInFrames}f) -> ${out}`);
  await renderMedia({
    composition, serveUrl: bundled, codec: "h264", outputLocation: out,
    puppeteerInstance: browser, muted: true, concurrency: 1, crf: 16,
  });
  console.log(`  done`);
}

await browser.close({ silent: false });
console.log("ALL DONE");
