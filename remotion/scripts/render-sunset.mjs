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
  { id: "fire-and-kite-sunset", out: "/mnt/documents/fire-and-kite-sunset.mp4" },
  { id: "lockup-buildon-sunset", out: "/mnt/documents/lockup-buildon-sunset.mp4" },
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
