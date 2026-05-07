import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BasecampMatchPopflyLogo from "@/components/afterparty/BasecampMatchPopflyLogo";
import StarSparkle from "@/components/afterparty/StarSparkle";
import oakleyCreamLogo from "@/assets/oakley-logo-cream.png";

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
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (splashDone) {
      (window as { __SPLASH_DONE__?: boolean }).__SPLASH_DONE__ = true;
    }
  }, [splashDone]);

  // Design container: a fixed natural size that the lockup looks great in.
  // Then we scale it to fill the recording viewport.
  const DESIGN_WIDTH = ratio === "square" ? 620 : 540;
  const DESIGN_HEIGHT = ratio === "square" ? 540 : 820;

  // Recording viewports
  const FRAME_W = 1080;
  const FRAME_H = ratio === "square" ? 1080 : 1920;

  // 92% safe area
  const scale = Math.min(
    (FRAME_W * 0.92) / DESIGN_WIDTH,
    (FRAME_H * 0.92) / DESIGN_HEIGHT,
  );

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
      `}</style>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.55)",
          opacity: splashDone ? 1 : 0,
          animation: splashDone
            ? undefined
            : "apClipBgDarken 3200ms ease-in-out 8100ms forwards",
          transition: "opacity 0.4s ease-out",
          pointerEvents: "none",
        }}
      />
      {/* Scale wrapper */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%" }}>
          <BasecampMatchPopflyLogo onRevealed={() => setSplashDone(true)} presenter={OAKLEY_PRESENTER} />

          <div
            style={{
              opacity: splashDone ? 1 : 0,
              transition: "opacity 0.4s ease-out",
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
    </div>
  );
};

export default AfterPartySplashClip;
