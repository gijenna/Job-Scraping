import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BasecampMatchPopflyLogo from "@/components/afterparty/BasecampMatchPopflyLogo";
import StarSparkle from "@/components/afterparty/StarSparkle";
import SponsorsThankYouPanel from "@/components/afterparty/SponsorsThankYouPanel";
import oakleyCreamLogo from "@/assets/oakley-logo-cream.png";

// Timeline (ms) for sponsors mode — fully SEQUENTIAL fades for smoothness:
//   0      → splash begins
//   10800  → splash done; DJ/Drinks row begins fading in
//   11600  → DJ row fully visible (800ms ease-in)
//   12800  → splash container begins fading OUT (1200ms)
//   14000  → splash fully gone
//   14000  → sponsors panel begins fading IN (1200ms)
//   15200  → sponsors panel fully visible
//   ~19500 → end of clip
const SPLASH_DONE_MS = 10800;
const DJ_FADE_IN_MS = 800;
const SPLASH_FADE_OUT_START_MS = 12800;
const SPLASH_FADE_OUT_MS = 1200;
const SPONSORS_FADE_START_MS = 14000;
const SPONSORS_FADE_MS = 1200;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
// easeInOutCubic — silky, no pop
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const OAKLEY_PRESENTER = {
  label: "@",
  sublabel: "RiNo",
  logoUrl: oakleyCreamLogo,
  logoAlt: "Oakley",
  href: "https://www.oakley.com",
  creamGlow: true,
};

const CREAM = "#F5E6D3";

/**
 * Standalone clip of the afterparty opening animation — used to record
 * MP4 social posts. Renders ONLY:
 *   • the BasecampMatchPopflyLogo splash (identical to /afterparty)
 *   • the sparkles + "DJ ✦ Drinks ✦ Swag ✦ Food ✦ Friends" row
 *
 * The whole lockup lives in a fixed-size design container that gets
 * uniformly scaled up to fill the recording frame (square or 9:16).
 */
const AfterPartySplashClip = () => {
  const [params] = useSearchParams();
  const ratio = params.get("ratio") === "square" ? "square" : "story";
  const mode = params.get("mode") === "sponsors" ? "sponsors" : "default";
  const [clipSeekMs, setClipSeekMs] = useState<number | undefined>(
    params.has("seek") ? Number(params.get("seek")) || 0 : undefined,
  );
  const [liveSplashDone, setLiveSplashDone] = useState(false);
  const [liveElapsed, setLiveElapsed] = useState(0);
  const splashDone = typeof clipSeekMs === "number" ? clipSeekMs >= SPLASH_DONE_MS : liveSplashDone;

  // Track live elapsed so the sponsors fade-in works without explicit seeking.
  useEffect(() => {
    if (typeof clipSeekMs === "number") return;
    if (!liveSplashDone) return;
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      setLiveElapsed(performance.now() - start + SPLASH_DONE_MS);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [liveSplashDone, clipSeekMs]);

  const effectiveTimeMs =
    typeof clipSeekMs === "number" ? clipSeekMs : Math.max(liveElapsed, splashDone ? SPLASH_DONE_MS : 0);

  // === Deterministic, time-driven opacities (no CSS transitions, so the recorder
  //     can seek frame-by-frame and every transition stays perfectly smooth). ===

  // DJ/Drinks row fades in immediately after splash completes
  const djOpacity = easeInOut(clamp01((effectiveTimeMs - SPLASH_DONE_MS) / DJ_FADE_IN_MS));

  // Darkening veil follows the same curve as the DJ row so the stage doesn't pop
  const veilOpacity = easeInOut(clamp01((effectiveTimeMs - 8100) / 3200));

  // Sponsors mode: splash fades OUT first, sponsors fades IN after — sequential.
  const splashFadeOut =
    mode === "sponsors"
      ? easeInOut(clamp01((effectiveTimeMs - SPLASH_FADE_OUT_START_MS) / SPLASH_FADE_OUT_MS))
      : 0;
  const splashOpacity = 1 - splashFadeOut;

  const sponsorsOpacity =
    mode === "sponsors"
      ? easeInOut(clamp01((effectiveTimeMs - SPONSORS_FADE_START_MS) / SPONSORS_FADE_MS))
      : 0;
  const sponsorsVisible = sponsorsOpacity > 0;

  useEffect(() => {
    const clipWindow = window as typeof window & { __SET_AFTERPARTY_CLIP_TIME__?: (ms: number) => void };
    clipWindow.__SET_AFTERPARTY_CLIP_TIME__ = setClipSeekMs;
    return () => {
      delete clipWindow.__SET_AFTERPARTY_CLIP_TIME__;
    };
  }, []);

  useEffect(() => {
    if (splashDone) {
      (window as { __SPLASH_DONE__?: boolean }).__SPLASH_DONE__ = true;
    }
  }, [splashDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#080808",
        backgroundImage: "url('/bg-sunset.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: CREAM,
        fontFamily: '"Josefin Sans", sans-serif',
        fontWeight: 300,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <style>{`
        @keyframes apClipBgDarken {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .ap-clip-frame .bmp-steady-lockup {
          transform: scale(${ratio === "square" ? 1.18 : 1.24});
          transform-origin: center center;
        }
        .ap-clip-frame .bmp-splash-fire {
          width: min(48vh, 48vw) !important;
          height: min(48vh, 48vw) !important;
        }
        .ap-clip-frame .bmp-kite {
          width: min(17vh, 17vw) !important;
          height: min(17vh, 17vw) !important;
        }
        .ap-clip-frame .bmp-od-stacked {
          width: min(34vh, 34vw) !important;
        }
      `}</style>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.55)",
          opacity: veilOpacity,
          pointerEvents: "none",
        }}
      />
      <div
        className="ap-clip-frame"
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: ratio === "square" ? "72px" : "120px 64px",
          opacity: splashOpacity,
        }}
      >
        <div style={{ width: "100%" }}>
          <BasecampMatchPopflyLogo clipSeekMs={clipSeekMs} onRevealed={() => setLiveSplashDone(true)} presenter={OAKLEY_PRESENTER} />

          <div
            style={{
              opacity: djOpacity,
              textAlign: "center",
              marginTop: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                marginBottom: 14,
                marginTop: 4,
              }}
              aria-hidden="true"
            >
              <StarSparkle tone="coral" size={20} />
              <StarSparkle tone="cream" size={28} />
              <StarSparkle tone="green" size={22} />
              <StarSparkle tone="cream" size={16} />
              <StarSparkle tone="coral" size={24} />
            </div>
            <div
              className="font-afterparty"
              style={{
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                whiteSpace: "nowrap",
                fontSize: 26,
                color: CREAM,
              }}
            >
              <span>DJ</span>
              <StarSparkle tone="green" size={11} />
              <span>Drinks</span>
              <StarSparkle tone="coral" size={11} />
              <span>Swag</span>
              <StarSparkle tone="cream" size={11} />
              <span>Food</span>
              <StarSparkle tone="green" size={11} />
              <span>Friends</span>
            </div>
          </div>
        </div>
      </div>

      {mode === "sponsors" && (
        <SponsorsThankYouPanel ratio={ratio} visible={sponsorsVisible} />
      )}
    </div>
  );
};

export default AfterPartySplashClip;
