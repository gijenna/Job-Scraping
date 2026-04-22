import popflyLogo from "@/assets/popfly-logo-neon.png";
import pbMonogram from "@/assets/pb-monogram.png";
import BasecampMatchAnimated from "./BasecampMatchAnimated";

/**
 * Co-branded animated header: Basecamp Match × Popfly
 * Three-stage intro:
 *   0–1.4s   PB monogram alone, centered, pulsing
 *   1.4–2.4s Side logos flutter in; monogram shrinks to "presents" slot
 *   2.4s+    Title fades in; monogram lives permanently where "presents" was
 */
const BasecampMatchPopflyLogo = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-10 select-none">
      <style>{`
        @keyframes bmpFromLeft {
          0%, 35% { transform: translateX(-160px) rotate(-6deg); opacity: 0; }
          75% { transform: translateX(8px) rotate(2deg); opacity: 1; }
          100% { transform: translateX(0) rotate(0); opacity: 1; }
        }
        @keyframes bmpFromRight {
          0%, 35% { transform: translateX(160px) rotate(6deg); opacity: 0; }
          75% { transform: translateX(-8px) rotate(-2deg); opacity: 1; }
          100% { transform: translateX(0) rotate(0); opacity: 1; }
        }
        @keyframes bmpGrowDivider {
          0%, 50% { transform: scaleX(0); opacity: 0; }
          100% { transform: scaleX(1); opacity: 1; }
        }
        @keyframes bmpFadeUp {
          0%, 75% { transform: translateY(8px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes bmpAmberPulse {
          0%, 100% { filter: drop-shadow(0 0 12px rgba(225,182,36,0.55)) drop-shadow(0 0 24px rgba(225,182,36,0.35)); }
          50%     { filter: drop-shadow(0 0 18px rgba(225,182,36,0.85)) drop-shadow(0 0 36px rgba(225,182,36,0.55)); }
        }
        @keyframes bmpNeonPulse {
          0%, 100% { filter: drop-shadow(0 0 12px rgba(57,255,20,0.55)) drop-shadow(0 0 24px rgba(57,255,20,0.35)); }
          50%     { filter: drop-shadow(0 0 18px rgba(57,255,20,0.9))  drop-shadow(0 0 36px rgba(57,255,20,0.55)); }
        }
        @keyframes bmpXGlow {
          0%, 100% { text-shadow: 0 0 8px rgba(245,230,211,0.6), 0 0 16px rgba(245,230,211,0.3); }
          50%     { text-shadow: 0 0 14px rgba(245,230,211,0.95), 0 0 28px rgba(245,230,211,0.55); }
        }

        /* Splash monogram: huge centered, pulse, then shrink + travel down */
        @keyframes bmpSplashPulse {
          0%   { transform: scale(0.85); opacity: 0; filter: drop-shadow(0 0 20px rgba(237,118,96,0.0)); }
          15%  { transform: scale(1.0);  opacity: 1; filter: drop-shadow(0 0 28px rgba(237,118,96,0.55)); }
          35%  { transform: scale(1.06); opacity: 1; filter: drop-shadow(0 0 38px rgba(237,118,96,0.85)); }
          55%  { transform: scale(1.0);  opacity: 1; filter: drop-shadow(0 0 28px rgba(237,118,96,0.55)); }
          /* shrink + drop into final mini slot */
          80%  { transform: translateY(180px) scale(0.18); opacity: 1; filter: drop-shadow(0 0 12px rgba(237,118,96,0.4)); }
          100% { transform: translateY(220px) scale(0.0);  opacity: 0; filter: none; }
        }

        /* Final small monogram fades in where "presents" used to be */
        @keyframes bmpMiniIn {
          0%, 80% { opacity: 0; transform: scale(0.6); }
          100%    { opacity: 1; transform: scale(1); }
        }

        .bmp-left   { animation: bmpFromLeft  1100ms cubic-bezier(.2,.7,.2,1) 1.4s both, bmpAmberPulse 2.6s ease-in-out 2.6s infinite; }
        .bmp-right  { animation: bmpFromRight 1100ms cubic-bezier(.2,.7,.2,1) 1.4s both, bmpNeonPulse 2.6s ease-in-out 2.6s infinite; }
        .bmp-x      { animation: bmpFadeUp 800ms ease-out 2.0s both, bmpXGlow 2s ease-in-out 2.8s infinite; }
        .bmp-divider-l { transform-origin: right center; animation: bmpGrowDivider 800ms ease-out 1.9s both; }
        .bmp-divider-r { transform-origin: left center;  animation: bmpGrowDivider 800ms ease-out 1.9s both; }
        .bmp-title  { animation: bmpFadeUp 800ms ease-out 2.6s both; }

        .bmp-splash { animation: bmpSplashPulse 2400ms cubic-bezier(.4,.1,.3,1) both; }
        .bmp-mini   { animation: bmpMiniIn 700ms ease-out 2.5s both; }

        @media (prefers-reduced-motion: reduce) {
          .bmp-left, .bmp-right, .bmp-x, .bmp-divider-l, .bmp-divider-r,
          .bmp-title, .bmp-splash, .bmp-mini {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .bmp-splash { display: none !important; }
        }
      `}</style>

      {/* Splash monogram (absolutely positioned overlay during intro) */}
      <div className="relative w-full flex flex-col items-center">
        <img
          src={pbMonogram}
          alt=""
          aria-hidden="true"
          className="bmp-splash absolute top-0 left-1/2 -translate-x-1/2 h-32 sm:h-40 md:h-48 w-auto object-contain pointer-events-none z-20"
        />

        <div className="flex items-center justify-center gap-3 sm:gap-5 w-full max-w-3xl px-4">
          {/* Left: Basecamp Match (animated flame) */}
          <div className="bmp-left flex items-center justify-end flex-1 min-w-0">
            <BasecampMatchAnimated className="h-10 sm:h-14 md:h-16" />
          </div>

          {/* Neon divider + × */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div
              className="bmp-divider-l h-px w-8 sm:w-14"
              style={{ background: "linear-gradient(to right, transparent, #E1B624)", boxShadow: "0 0 8px rgba(225,182,36,0.6)" }}
            />
            <span
              className="bmp-x font-display text-2xl sm:text-3xl font-bold text-events-cream"
              style={{ color: "#F5E6D3" }}
            >
              ×
            </span>
            <div
              className="bmp-divider-r h-px w-8 sm:w-14"
              style={{ background: "linear-gradient(to left, transparent, #39FF14)", boxShadow: "0 0 8px rgba(57,255,20,0.6)" }}
            />
          </div>

          <div className="bmp-right flex items-center justify-start flex-1 min-w-0">
            <img
              src={popflyLogo}
              alt="Popfly"
              className="h-10 sm:h-14 md:h-16 w-auto object-contain"
            />
          </div>
        </div>

        <div className="bmp-title mt-6 text-center flex flex-col items-center">
          <img
            src={pbMonogram}
            alt="Presented by Basecamp"
            className="bmp-mini h-10 sm:h-12 w-auto object-contain mb-3"
          />
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-events-cream">
            The Creator After Party
          </h2>
        </div>
      </div>
    </div>
  );
};

export default BasecampMatchPopflyLogo;
