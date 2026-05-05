import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
const bundled = await bundle({ entryPoint: path.resolve("/dev-server/remotion/src/index.ts") });
const browser = await openBrowser("chrome", {
  browserExecutable: "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});
const composition = await selectComposition({ serveUrl: bundled, id: "lockup-buildon", puppeteerInstance: browser });
await renderStill({ composition, serveUrl: bundled, output: "/mnt/documents/lockup-still-transparent.png", frame: 140, puppeteerInstance: browser });
await browser.close({ silent: false });
console.log("DONE");
