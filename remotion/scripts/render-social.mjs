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
  { id: "social-square", out: "/mnt/documents/out-of-office-social-square.mp4" },
  { id: "social-story",  out: "/mnt/documents/out-of-office-social-story.mp4" },
];

for (const { id, out } of targets) {
  const composition = await selectComposition({ serveUrl: bundled, id, puppeteerInstance: browser });
  console.log(`Rendering ${id} (${composition.durationInFrames}f) -> ${out}`);
  await renderMedia({
    composition, serveUrl: bundled, codec: "h264", outputLocation: out,
    puppeteerInstance: browser, muted: true, concurrency: 1, crf: 18,
  });
  console.log(`  done`);
}

await browser.close({ silent: false });
console.log("ALL DONE");
