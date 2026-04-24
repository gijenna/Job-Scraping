import { useEffect, useState } from "react";
import popflyLogo from "@/assets/popfly-logo-neon.png";
import pbMonogramSplash from "@/assets/pb-monogram-v2.png";
import outsideDaysStacked from "@/assets/outside-days-stacked.svg";
import presentsWordmark from "@/assets/presents-wordmark.png";
import outsideDaysLogo from "@/assets/outside-days-logo.svg";
import BasecampMatchAnimated from "./BasecampMatchAnimated";
import StarSparkle from "./StarSparkle";

interface Props {
  onRevealed?: () => void;
}

/**
 * Choreographed intro for the Creator After Party invite.
 *
 * Timeline (~6.4s):
 *   0.0–3.2s  Solo PB monogram, large + center, slow rumble + amber glow
 *   3.2–3.6s  Wind-up: tighter rumble, brighter glow
 *   3.6–4.8s  STAR BURST: ~12 sparkles (cream/coral/green) rocket outward
 *             from the monogram, filling the page; logos fade in *behind* the
 *             stars and start drifting toward their final slots
 *   4.8–5.6s  Stars contract back inward and fade; logos snap into final
 *             positions; PB monogram cross-fades into the "presents" wordmark
 *             in the small slot above the title
 *   5.6–6.4s  Title fades up, page reveals
 */
const BasecampMatchPopflyLogo = ({ onRevealed }: Props) => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const reduced = typeof window !== "undefined"
      && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const delay = reduced ? 0 : 6400;
    const t = setTimeout(() => {
      setRevealed(true);
      onRevealed?.();
    }, delay);
    return () => clearTimeout(t);
  }, [onRevealed]);

  // 12 stars that radiate outward from center then contract back.
  // Pre-computed angle/distance/tone/variant/size so animation is purely CSS.
  // Individual hand-drawn stars in varied sizes (24px tiny → 140px hero)
  // and our three brand tones. All use the single-star asset now.
  const burstStars = [
    { angle:   8, dist: 42, tone: "cream" as const, size:  36, delay:   0, spin:  220 },
    { angle:  34, dist: 50, tone: "coral" as const, size: 132, delay:  80, spin: -180 },
    { angle:  62, dist: 38, tone: "green" as const, size:  54, delay:  20, spin:  260 },
    { angle:  88, dist: 54, tone: "cream" as const, size:  96, delay: 110, spin: -240 },
    { angle: 112, dist: 34, tone: "coral" as const, size:  28, delay:  40, spin:  200 },
    { angle: 138, dist: 48, tone: "green" as const, size: 118, delay:  90, spin: -220 },
    { angle: 162, dist: 40, tone: "cream" as const, size:  62, delay:  10, spin:  240 },
    { angle: 188, dist: 56, tone: "coral" as const, size:  84, delay: 120, spin: -200 },
    { angle: 214, dist: 36, tone: "green" as const, size:  40, delay:  60, spin:  220 },
    { angle: 240, dist: 50, tone: "cream" as const, size: 108, delay: 100, spin: -260 },
    { angle: 266, dist: 44, tone: "coral" as const, size:  52, delay:  30, spin:  200 },
    { angle: 292, dist: 38, tone: "green" as const, size:  72, delay:  70, spin: -220 },
    { angle: 318, dist: 54, tone: "cream" as const, size: 124, delay:  50, spin:  220 },
    { angle: 344, dist: 32, tone: "coral" as const, size:  32, delay:  15, spin: -200 },
    { angle:  20, dist: 58, tone: "green" as const, size:  90, delay: 130, spin:  240 },
    { angle:  76, dist: 28, tone: "cream" as const, size:  46, delay:  85, spin: -180 },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center py-10 select-none">
      <style>{`
        /* ----- Solo splash: PB monogram alone, slow pulse + tiny rumble ----- */
        @keyframes bmpSoloPulse {
          0%, 100% { filter: drop-shadow(0 0 30px rgba(237,118,96,0.45)) drop-shadow(0 0 60px rgba(237,118,96,0.25)); }
          50%      { filter: drop-shadow(0 0 48px rgba(237,118,96,0.75)) drop-shadow(0 0 90px rgba(237,118,96,0.45)); }
        }
        @keyframes bmpSoloRumble {
          0%, 100% { transform: translate(-50%, -50%) rotate(-0.6deg); }
          50%      { transform: translate(-50%, -50%) rotate(0.6deg); }
        }
        @keyframes bmpWindUp {
          0%   { transform: translate(-50%, -50%) scale(1) rotate(0); filter: drop-shadow(0 0 48px rgba(237,118,96,0.75)); }
          50%  { transform: translate(-50%, -50%) scale(1.06) rotate(1.4deg); filter: drop-shadow(0 0 80px rgba(237,118,96,1)); }
          100% { transform: translate(-50%, -50%) scale(1.02) rotate(-1.4deg); filter: drop-shadow(0 0 80px rgba(237,118,96,1)); }
        }
        /* Splash exit: shrink + drop into the small "presents" slot */
        @keyframes bmpSplashShrink {
          0%   { transform: translate(-50%, -50%) scale(1.02) rotate(0); opacity: 1; }
          70%  { transform: translate(-50%, calc(-50% + 240px)) scale(0.18) rotate(0); opacity: 0.9; }
          100% { transform: translate(-50%, calc(-50% + 280px)) scale(0); opacity: 0; }
        }

        /* ----- Star burst: radiate out, then contract + fade ----- */
        @keyframes bmpStarBurst {
          0%   { transform: translate(-50%, -50%) translate(0, 0) scale(0.1) rotate(0); opacity: 0; }
          15%  { transform: translate(-50%, -50%) translate(var(--bx-mid), var(--by-mid)) scale(1.1) rotate(calc(var(--bspin) * 0.4deg)); opacity: 1; }
          55%  { transform: translate(-50%, -50%) translate(var(--bx-out), var(--by-out)) scale(1) rotate(calc(var(--bspin) * 1deg)); opacity: 1; }
          85%  { transform: translate(-50%, -50%) translate(calc(var(--bx-out) * 0.4), calc(var(--by-out) * 0.4)) scale(0.5) rotate(calc(var(--bspin) * 1.4deg)); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
        }

        /* ----- Logo bloom: starts on top of monogram, expands outward ----- */
        @keyframes bmpBloomLeft {
          0%, 30% { opacity: 0; transform: translate(0, 0) scale(0.32) rotate(-8deg); }
          45%     { opacity: 1; transform: translate(0, 0) scale(0.6) rotate(-4deg); }
          100%    { opacity: 1; transform: translate(0, 0) scale(1) rotate(0); }
        }
        @keyframes bmpBloomRight {
          0%, 30% { opacity: 0; transform: translate(0, 0) scale(0.32) rotate(8deg); }
          45%     { opacity: 1; transform: translate(0, 0) scale(0.6) rotate(4deg); }
          100%    { opacity: 1; transform: translate(0, 0) scale(1) rotate(0); }
        }

        @keyframes bmpAmberPulse {
          0%, 100% { filter: drop-shadow(0 0 12px rgba(225,182,36,0.55)) drop-shadow(0 0 24px rgba(225,182,36,0.35)); }
          50%      { filter: drop-shadow(0 0 18px rgba(225,182,36,0.85)) drop-shadow(0 0 36px rgba(225,182,36,0.55)); }
        }
        @keyframes bmpNeonPulse {
          0%, 100% { filter: drop-shadow(0 0 12px rgba(57,255,20,0.55)) drop-shadow(0 0 24px rgba(57,255,20,0.35)); }
          50%      { filter: drop-shadow(0 0 18px rgba(57,255,20,0.9))  drop-shadow(0 0 36px rgba(57,255,20,0.55)); }
        }

        @keyframes bmpFadeUp {
          0%   { transform: translateY(8px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes bmpGrowDivider {
          0%   { transform: scaleX(0); opacity: 0; }
          100% { transform: scaleX(1); opacity: 1; }
        }
        @keyframes bmpXGlow {
          0%, 100% { text-shadow: 0 0 8px rgba(245,230,211,0.6), 0 0 16px rgba(245,230,211,0.3); }
          50%      { text-shadow: 0 0 14px rgba(245,230,211,0.95), 0 0 28px rgba(245,230,211,0.55); }
        }
        @keyframes bmpPresentsIn {
          0%   { opacity: 0; transform: scale(0.6) rotate(-3deg); }
          70%  { opacity: 1; transform: scale(1.06) rotate(1deg); }
          100% { opacity: 1; transform: scale(1) rotate(0); }
        }

        /* Splash dark stage covers the page until ~5.2s */
        .bmp-splash-stage {
          position: fixed;
          inset: 0;
          background: #19363B;
          z-index: 60;
          pointer-events: none;
          animation: bmpStageOut 800ms ease-out 5.2s forwards;
        }
        @keyframes bmpStageOut {
          0%   { opacity: 1; }
          100% { opacity: 0; visibility: hidden; }
        }

        .bmp-splash-mono {
          position: fixed;
          top: 50%;
          left: 50%;
          width: min(70vh, 70vw);
          height: auto;
          z-index: 62;
          transform: translate(-50%, -50%);
          animation:
            bmpSoloRumble 220ms ease-in-out 0s 14 alternate,
            bmpSoloPulse 1600ms ease-in-out 0s 2,
            bmpWindUp 400ms ease-in-out 3.2s 1 forwards,
            bmpSplashShrink 1200ms cubic-bezier(.4,.1,.3,1) 4.0s forwards;
        }

        .bmp-burst-star {
          position: fixed;
          top: 50%;
          left: 50%;
          z-index: 61;
          opacity: 0;
          animation: bmpStarBurst 1800ms cubic-bezier(.2,.7,.3,1) forwards;
        }

        .bmp-bloom-left  { animation: bmpBloomLeft  1400ms cubic-bezier(.22,.9,.3,1) 4.4s both, bmpAmberPulse 2.6s ease-in-out 5.8s infinite; }
        .bmp-bloom-right { animation: bmpBloomRight 1400ms cubic-bezier(.22,.9,.3,1) 4.4s both, bmpNeonPulse 2.6s ease-in-out 5.8s infinite; }
        .bmp-divider-l   { transform-origin: right center; animation: bmpGrowDivider 700ms ease-out 5.4s both; }
        .bmp-divider-r   { transform-origin: left center;  animation: bmpGrowDivider 700ms ease-out 5.4s both; }
        .bmp-x           { animation: bmpFadeUp 700ms ease-out 5.5s both, bmpXGlow 2s ease-in-out 6.4s infinite; }
        .bmp-presents    { animation: bmpPresentsIn 800ms cubic-bezier(.2,.9,.3,1) 5.4s both; }
        .bmp-title       { animation: bmpFadeUp 800ms ease-out 5.8s both; }

        @keyframes bmpODPop {
          0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.4) rotate(-6deg); }
          40%  { opacity: 1; transform: translate(-50%, -50%) scale(1.1) rotate(2deg); }
          70%  { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(0); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.85) rotate(0); }
        }
        .bmp-od-stacked {
          position: fixed;
          top: 50%;
          left: 50%;
          width: min(34vh, 34vw);
          height: auto;
          z-index: 63;
          opacity: 0;
          filter: drop-shadow(0 0 24px rgba(245,230,211,0.45));
          animation: bmpODPop 1800ms cubic-bezier(.2,.7,.3,1) 3.6s forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .bmp-splash-stage, .bmp-splash-mono, .bmp-burst-star { display: none !important; }
          .bmp-bloom-left, .bmp-bloom-right, .bmp-divider-l, .bmp-divider-r,
          .bmp-x, .bmp-presents, .bmp-title {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Solo splash overlay */}
      {!revealed && (
        <>
          <div className="bmp-splash-stage" aria-hidden="true" />
          <img
            src={pbMonogramSplash}
            alt="Presented by Basecamp"
            className="bmp-splash-mono"
          />
          <img
            src={outsideDaysStacked}
            alt="Outside Days"
            className="bmp-od-stacked"
            aria-hidden="true"
          />
          {burstStars.map((s, i) => {
            const rad = (s.angle * Math.PI) / 180;
            const out = `${Math.cos(rad) * s.dist}vmin`;
            const outY = `${Math.sin(rad) * s.dist}vmin`;
            const mid = `${Math.cos(rad) * s.dist * 0.45}vmin`;
            const midY = `${Math.sin(rad) * s.dist * 0.45}vmin`;
            return (
              <div
                key={i}
                className="bmp-burst-star"
                style={{
                  ["--bx-out" as any]: out,
                  ["--by-out" as any]: outY,
                  ["--bx-mid" as any]: mid,
                  ["--by-mid" as any]: midY,
                  ["--bspin" as any]: s.spin,
                  animationDelay: `${3600 + s.delay}ms`,
                  animationDuration: "1900ms",
                }}
              >
                <StarSparkle tone={s.tone} variant="single" size={s.size} />
              </div>
            );
          })}
        </>
      )}

      {/* Steady-state lockup (logos land here) */}
      <div className="relative w-full flex flex-col items-center">
        <div className="flex items-center justify-center gap-3 sm:gap-5 w-full max-w-3xl px-4 text-center">
          <div className="bmp-bloom-left flex items-center justify-end flex-1 min-w-0">
            <BasecampMatchAnimated className="h-10 sm:h-14 md:h-16" />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div
              className="bmp-divider-l h-px w-8 sm:w-14"
              style={{ background: "linear-gradient(to right, transparent, #E1B624)", boxShadow: "0 0 8px rgba(225,182,36,0.6)" }}
            />
            <span
              className="bmp-x font-afterparty text-2xl sm:text-3xl font-bold"
              style={{ color: "#F5E6D3" }}
            >
              ×
            </span>
            <div
              className="bmp-divider-r h-px w-8 sm:w-14"
              style={{ background: "linear-gradient(to left, transparent, #39FF14)", boxShadow: "0 0 8px rgba(57,255,20,0.6)" }}
            />
          </div>

          <div className="bmp-bloom-right flex items-center justify-start flex-1 min-w-0">
            <img
              src={popflyLogo}
              alt="Popfly"
              className="h-12 sm:h-16 md:h-20 w-auto object-contain"
            />
          </div>
        </div>

        <div className="mt-2 text-center flex flex-col items-center">
          <div className="bmp-presents h-7 sm:h-8 mb-3 overflow-hidden" style={{ aspectRatio: `${1920 * 0.88} / 575` }}>
            <img
              src={presentsWordmark}
              alt="present"
              className="h-full w-auto max-w-none object-cover object-left"
              style={{ clipPath: "inset(0 12% 0 0)", transform: "translateX(0)" }}
            />
          </div>
          <h2
            className="bmp-title font-afterparty sm:text-3xl md:text-4xl font-bold text-6xl"
            style={{ color: "#F5E6D3" }}
          >
            Out of Office
          </h2>
          <div className="bmp-title mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm sm:text-base italic tracking-wide" style={{ color: "#F5E6D3", opacity: 0.9 }}>
            <span>The only official</span>
            <img
              src={outsideDaysLogo}
              alt="Outside Days"
              className="h-3.5 sm:h-4 md:h-5 w-auto object-contain"
            />
            <span>after-party</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasecampMatchPopflyLogo;
