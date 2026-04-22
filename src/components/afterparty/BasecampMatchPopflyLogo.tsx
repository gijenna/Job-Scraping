import basecampMatchLogo from "@/assets/basecamp-match-logo-dark.png";
import popflyLogo from "@/assets/popfly-logo-neon.png";

/**
 * Co-branded animated header: Basecamp Match × Popfly
 * Pure CSS animation. Two marks slide in, meet at a glowing neon ×,
 * then "Creator After Party" fades in below.
 */
const BasecampMatchPopflyLogo = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-10 select-none">
      <style>{`
        @keyframes bmpFromLeft {
          0% { transform: translateX(-120px); opacity: 0; }
          70% { transform: translateX(8px); opacity: 1; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes bmpFromRight {
          0% { transform: translateX(120px); opacity: 0; }
          70% { transform: translateX(-8px); opacity: 1; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes bmpGrowDivider {
          0%, 30% { transform: scaleX(0); opacity: 0; }
          100% { transform: scaleX(1); opacity: 1; }
        }
        @keyframes bmpFadeUp {
          0%, 60% { transform: translateY(8px); opacity: 0; }
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
        .bmp-left   { animation: bmpFromLeft  900ms cubic-bezier(.2,.7,.2,1) both, bmpAmberPulse 2.6s ease-in-out 1s infinite; }
        .bmp-right  { animation: bmpFromRight 900ms cubic-bezier(.2,.7,.2,1) both, bmpNeonPulse 2.6s ease-in-out 1s infinite; }
        .bmp-x      { animation: bmpFadeUp 800ms ease-out 700ms both, bmpXGlow 2s ease-in-out 1.5s infinite; }
        .bmp-divider-l { transform-origin: right center; animation: bmpGrowDivider 800ms ease-out 600ms both; }
        .bmp-divider-r { transform-origin: left center;  animation: bmpGrowDivider 800ms ease-out 600ms both; }
        .bmp-title  { animation: bmpFadeUp 800ms ease-out 1100ms both; }
      `}</style>

      <div className="flex items-center justify-center gap-3 sm:gap-5 w-full max-w-3xl px-4">
        {/* Left: Basecamp Match */}
        <div className="bmp-left flex items-center justify-end flex-1 min-w-0">
          <img
            src={basecampMatchLogo}
            alt="Basecamp Match"
            className="h-10 sm:h-14 md:h-16 w-auto object-contain"
          />
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

        {/* Right: Popfly wordmark (custom SVG, neon teal) */}
        <div className="bmp-right flex items-center justify-start flex-1 min-w-0">
          <svg
            viewBox="0 0 240 64"
            className="h-10 sm:h-14 md:h-16 w-auto"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Popfly"
          >
            <defs>
              <linearGradient id="popflyGrad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#3DDFD5" />
                <stop offset="100%" stopColor="#7BF0E8" />
              </linearGradient>
            </defs>
            {/* Pin / play mark */}
            <g transform="translate(8 8)">
              <path
                d="M24 0 C10.7 0 0 10.7 0 24 c0 18 24 32 24 32 s24-14 24-32 C48 10.7 37.3 0 24 0 z"
                fill="none"
                stroke="url(#popflyGrad)"
                strokeWidth="3"
              />
              <polygon points="19,15 35,24 19,33" fill="url(#popflyGrad)" />
            </g>
            {/* Wordmark */}
            <text
              x="68"
              y="42"
              fontFamily="'Josefin Sans', system-ui, sans-serif"
              fontSize="34"
              fontWeight="700"
              fill="url(#popflyGrad)"
              letterSpacing="1"
            >
              POPFLY
            </text>
          </svg>
        </div>
      </div>

      <div className="bmp-title mt-6 text-center">
        <div className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-events-cream/60 mb-1">
          presents
        </div>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-events-cream">
          The Creator After Party
        </h2>
      </div>
    </div>
  );
};

export default BasecampMatchPopflyLogo;
