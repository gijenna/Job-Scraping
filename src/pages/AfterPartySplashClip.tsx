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
 * Nothing else from the invite is shown.
 *
 * Query params:
 *   ?ratio=square   → square framing (PC / feed)
 *   ?ratio=story    → 9:16 framing (Instagram story / mobile) - default
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
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: ratio === "square" ? 720 : 560,
          padding: "0 24px",
        }}
      >
        <BasecampMatchPopflyLogo onRevealed={() => setSplashDone(true)} />

        <div
          style={{
            opacity: splashDone ? 1 : 0,
            transition: "opacity 0.4s ease-out",
            textAlign: "center",
            marginTop: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginBottom: 12,
              marginTop: 4,
            }}
            aria-hidden="true"
          >
            <StarSparkle tone="coral" size={18} />
            <StarSparkle tone="cream" size={26} />
            <StarSparkle tone="green" size={20} />
            <StarSparkle tone="cream" size={14} />
            <StarSparkle tone="coral" size={22} />
          </div>
          <div
            className="font-afterparty"
            style={{
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              whiteSpace: "nowrap",
              fontSize: ratio === "square" ? 22 : 18,
              color: CREAM,
            }}
          >
            <span>DJ</span>
            <StarSparkle tone="green" size={10} />
            <span>Drinks</span>
            <StarSparkle tone="coral" size={10} />
            <span>Swag</span>
            <StarSparkle tone="cream" size={10} />
            <span>Food</span>
            <StarSparkle tone="green" size={10} />
            <span>Friends</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AfterPartySplashClip;
