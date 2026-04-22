import { useEffect, useState } from "react";
import popflyLogo from "@/assets/popfly-logo-neon.png";
import pbMonogramSplash from "@/assets/pb-monogram-v2.png";
import pbMonogram from "@/assets/pb-monogram.png";
import BasecampMatchAnimated from "./BasecampMatchAnimated";

interface Props {
  onRevealed?: () => void;
}

/**
 * Choreographed intro for the Creator After Party invite.
 *
 * Timeline (~4.8s):
 *   0.0–2.0s  Solo PB monogram, large + center, gentle rumble + glow
 *   2.0–2.4s  Wind-up: rumble intensifies, glow brightens
 *   2.4–3.6s  Logos bloom out of monogram and fly to final slots;
 *             monogram shrinks + falls into the small "presents" slot
 *   3.6–4.2s  Divider/× and title fade in; small monogram pulses
 *   4.2s      Reveal page (calls onRevealed)
 *
 * Honors prefers-reduced-motion: snap to final state immediately.
 */
const BasecampMatchPopflyLogo = ({ onRevealed }: Props) => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const reduced = typeof window !== "undefined"
      && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const delay = reduced ? 0 : 4200;
    const t = setTimeout(() => {
      setRevealed(true);
      onRevealed?.();
    }, delay);
    return () => clearTimeout(t);
  }, [onRevealed]);

  return (
    <div className="w-full flex flex-col items-center justify-center py-10 select-none">
      <style>{`
        /* Solo splash: PB monogram alone, slow pulse + tiny rumble, then wind-up + exit */
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
          50%  { transform: translate(-50%, -50%) scale(1.04) rotate(1.2deg); filter: drop-shadow(0 0 70px rgba(237,118,96,1)); }
          100% { transform: translate(-50%, -50%) scale(1) rotate(-1.2deg); filter: drop-shadow(0 0 70px rgba(237,118,96,1)); }
        }
        /* Splash exit: shrink + drop into the small "presents" slot below */
        @keyframes bmpSplashShrink {
          0%   { transform: translate(-50%, -50%) scale(1) rotate(0); opacity: 1; }
          70%  { transform: translate(-50%, calc(-50% + 220px)) scale(0.22) rotate(0); opacity: 1; }
          100% { transform: translate(-50%, calc(-50% + 260px)) scale(0.0) rotate(0); opacity: 0; }
        }

        /* Logo bloom: starts on top of monogram (clipped), expands outward, lands in slot */
        @keyframes bmpBloomLeft {
          0%   { opacity: 0; transform: translate(0, 0) scale(0.32) rotate(-8deg); clip-path: ellipse(8% 8% at 50% 50%); }
          15%  { opacity: 1; clip-path: ellipse(60% 60% at 50% 50%); }
          100% { opacity: 1; transform: translate(0, 0) scale(1) rotate(0); clip-path: ellipse(140% 140% at 50% 50%); }
        }
        @keyframes bmpBloomRight {
          0%   { opacity: 0; transform: translate(0, 0) scale(0.32) rotate(8deg); clip-path: ellipse(8% 8% at 50% 50%); }
          15%  { opacity: 1; clip-path: ellipse(60% 60% at 50% 50%); }
          100% { opacity: 1; transform: translate(0, 0) scale(1) rotate(0); clip-path: ellipse(140% 140% at 50% 50%); }
        }

        /* Steady-state ambient glows on landed logos */
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
        @keyframes bmpMiniIn {
          0%   { opacity: 0; transform: scale(0.6); }
          70%  { opacity: 1; transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }

        /* Splash overlay (covers the page until ~3.6s, then fades) */
        .bmp-splash-stage {
          position: fixed;
          inset: 0;
          background: #19363B;
          z-index: 60;
          pointer-events: none;
          animation: bmpStageOut 600ms ease-out 3.6s forwards;
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
          z-index: 61;
          transform: translate(-50%, -50%);
          animation:
            bmpSoloRumble 180ms ease-in-out 0s 11 alternate,
            bmpSoloPulse 1400ms ease-in-out 0s 2,
            bmpWindUp 400ms ease-in-out 2.0s 1 forwards,
            bmpSplashShrink 1200ms cubic-bezier(.4,.1,.3,1) 2.4s forwards;
        }

        /* Bloom logos — absolutely positioned over the steady-state slots */
        .bmp-bloom-left  { animation: bmpBloomLeft  1200ms cubic-bezier(.22,.9,.3,1) 2.4s both, bmpAmberPulse 2.6s ease-in-out 3.6s infinite; }
        .bmp-bloom-right { animation: bmpBloomRight 1200ms cubic-bezier(.22,.9,.3,1) 2.4s both, bmpNeonPulse 2.6s ease-in-out 3.6s infinite; }
        .bmp-divider-l   { transform-origin: right center; animation: bmpGrowDivider 600ms ease-out 3.6s both; }
        .bmp-divider-r   { transform-origin: left center;  animation: bmpGrowDivider 600ms ease-out 3.6s both; }
        .bmp-x           { animation: bmpFadeUp 600ms ease-out 3.7s both, bmpXGlow 2s ease-in-out 4.2s infinite; }
        .bmp-mini        { animation: bmpMiniIn 700ms ease-out 3.6s both; }
        .bmp-title       { animation: bmpFadeUp 700ms ease-out 3.9s both; }

        @media (prefers-reduced-motion: reduce) {
          .bmp-splash-stage, .bmp-splash-mono { display: none !important; }
          .bmp-bloom-left, .bmp-bloom-right, .bmp-divider-l, .bmp-divider-r,
          .bmp-x, .bmp-mini, .bmp-title {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            clip-path: none !important;
          }
        }
      `}</style>

      {/* Solo splash overlay — covers page until logos have flown out */}
      {!revealed && (
        <>
          <div className="bmp-splash-stage" aria-hidden="true" />
          <img
            src={pbMonogramSplash}
            alt="Presented by Basecamp"
            className="bmp-splash-mono"
          />
        </>
      )}

      {/* Steady-state lockup (logos land here) */}
      <div className="relative w-full flex flex-col items-center">
        <div className="flex items-center justify-center gap-3 sm:gap-5 w-full max-w-3xl px-4">
          {/* Left: Basecamp Match */}
          <div className="bmp-bloom-left flex items-center justify-end flex-1 min-w-0">
            <BasecampMatchAnimated className="h-10 sm:h-14 md:h-16" />
          </div>

          {/* Divider + × */}
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

          {/* Right: Popfly */}
          <div className="bmp-bloom-right flex items-center justify-start flex-1 min-w-0">
            <img
              src={popflyLogo}
              alt="Popfly"
              className="h-10 sm:h-14 md:h-16 w-auto object-contain"
            />
          </div>
        </div>

        <div className="mt-6 text-center flex flex-col items-center">
          <img
            src={pbMonogram}
            alt="Presented by Basecamp"
            className="bmp-mini h-10 sm:h-12 w-auto object-contain mb-3"
          />
          <h2
            className="bmp-title font-afterparty text-2xl sm:text-3xl md:text-4xl font-bold"
            style={{ color: "#F5E6D3" }}
          >
            The Creator After Party
          </h2>
        </div>
      </div>
    </div>
  );
};

export default BasecampMatchPopflyLogo;
