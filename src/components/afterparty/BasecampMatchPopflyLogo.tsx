import { useEffect, useState } from "react";
import popflyLogo from "@/assets/popfly-logo-neon.png";
import popflyKite from "@/assets/popfly-kite.png";
import outsideDaysStacked from "@/assets/outside-days-stacked.svg";
import presentsWordmark from "@/assets/presents-wordmark.png";
import outsideDaysLogo from "@/assets/outside-days-logo.svg";
import BasecampMatchAnimated from "./BasecampMatchAnimated";
import StarSparkle from "./StarSparkle";

interface Props {
  onRevealed?: () => void;
  /** Presenter logo shown under the lockup, replacing the "present" wordmark.
   *  When provided, an `@ / [logo] / RiNo` style stack is rendered. */
  presenter?: {
    label?: string;          // small text above the logo (e.g. "@")
    sublabel?: string;       // small text below the logo (e.g. "RiNo")
    logoUrl: string;
    logoAlt: string;
    href?: string;
    /** When true, render with cream-toned neon glow (matches cream logos). */
    creamGlow?: boolean;
  };
}

/**
 * Standalone Basecamp fire mark (just the yellow ellipse + animated flame),
 * used as the centerpiece of the new opening sequence. Reuses the same
 * flame keyframes as BasecampMatchAnimated for visual consistency.
 */
const BasecampFireOnly = ({ className = "" }: { className?: string }) => (
  <div className={className}>
    <style>{`
      @keyframes bmpFlameOuter {
        0%   { transform: translateY(0)      scaleY(1)    scaleX(1)    skewX(0deg); opacity: 1; }
        12%  { transform: translateY(-0.4px) scaleY(1.06) scaleX(0.97) skewX(-1.2deg); opacity: 0.96; }
        24%  { transform: translateY(0)      scaleY(0.97) scaleX(1.03) skewX(0.8deg);  opacity: 1; }
        38%  { transform: translateY(-0.6px) scaleY(1.08) scaleX(0.96) skewX(1.4deg);  opacity: 0.92; }
        52%  { transform: translateY(0.2px)  scaleY(0.95) scaleX(1.04) skewX(-0.6deg); opacity: 1; }
        66%  { transform: translateY(-0.3px) scaleY(1.04) scaleX(0.98) skewX(1deg);    opacity: 0.97; }
        80%  { transform: translateY(0)      scaleY(1.02) scaleX(1.01) skewX(-0.4deg); opacity: 1; }
        100% { transform: translateY(0)      scaleY(1)    scaleX(1)    skewX(0deg);    opacity: 1; }
      }
      @keyframes bmpFlameInner {
        0%   { transform: translateY(0)     scaleY(1)    skewX(0deg); opacity: 0.95; }
        18%  { transform: translateY(0.3px) scaleY(0.92) skewX(1.6deg); opacity: 1; }
        36%  { transform: translateY(-0.2px) scaleY(1.05) skewX(-1.2deg); opacity: 0.9; }
        54%  { transform: translateY(0.4px)  scaleY(0.94) skewX(0.8deg); opacity: 1; }
        72%  { transform: translateY(-0.3px) scaleY(1.06) skewX(-0.6deg); opacity: 0.93; }
        100% { transform: translateY(0)     scaleY(1)    skewX(0deg); opacity: 0.95; }
      }
      .bmp-flame-outer {
        transform-origin: 22px 30px;
        transform-box: fill-box;
        animation: bmpFlameOuter 1.8s cubic-bezier(.4,0,.6,1) infinite;
        will-change: transform, opacity;
      }
      .bmp-flame-inner {
        transform-origin: 22px 29px;
        transform-box: fill-box;
        animation: bmpFlameInner 1.2s cubic-bezier(.4,0,.6,1) infinite;
        will-change: transform, opacity;
      }
    `}</style>
    <svg
      viewBox="0 0 45 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-label="Basecamp Match"
    >
      <ellipse cx="22.4292" cy="22" rx="22.4292" ry="22" fill="#E1B624" />
      <path
        className="bmp-flame-outer"
        d="M19.1971 29.5136C18.4269 29.1598 15.2549 27.3235 16.1127 22.0659C16.1194 22.0276 16.1308 21.9901 16.1466 21.9545C16.6488 20.8135 18.4037 18.496 17.6442 12.476C17.5495 11.7295 19.0416 15.0358 19.1632 15.2357C19.4133 15.6479 19.9048 15.379 20.1657 15.1048C21.6936 13.4914 21.9152 10.8114 21.4702 8.7522C21.4506 8.65865 21.4612 8.56138 21.5004 8.47409C21.5396 8.3868 21.6055 8.31389 21.6888 8.26564C21.772 8.21738 21.8685 8.19621 21.9646 8.20511C22.0607 8.21401 22.1515 8.25253 22.2243 8.31524C24.1615 9.96929 24.9174 13.3835 24.0793 15.6957C23.9524 16.0495 23.8059 16.4139 23.8773 16.7801C23.8909 16.8736 23.9312 16.9614 23.9935 17.033C24.1633 17.2099 24.4867 17.1551 24.6636 16.9764C24.8218 16.7826 24.9286 16.5527 24.9746 16.3077C25.2355 15.3914 25.6233 14.4662 26.3542 13.8488C26.4904 13.7195 26.6597 13.6296 26.8438 13.5887C26.9362 13.5706 27.032 13.5814 27.1179 13.6198C27.2038 13.6582 27.2754 13.7222 27.3227 13.8028C27.3687 13.9307 27.3755 14.0691 27.3424 14.2008C27.0011 16.428 26.5615 18.6765 26.7956 20.9408C26.8057 21.0545 26.8585 21.1603 26.9435 21.2373C27.0285 21.3144 27.1396 21.3571 27.2548 21.3571C27.3701 21.3571 27.4812 21.3144 27.5662 21.2373C27.6512 21.1603 27.704 21.0545 27.7141 20.9408L27.748 20.5552C27.757 20.4514 27.8015 20.3537 27.8743 20.2784C27.947 20.2031 28.0436 20.1547 28.148 20.1413C28.2524 20.1279 28.3583 20.1502 28.448 20.2046C28.5378 20.2589 28.6061 20.3421 28.6416 20.4402C29.2241 22.0766 29.8657 24.5231 29.3671 26.4195C29.3465 26.4937 29.3069 26.5614 29.2521 26.616C29.1973 26.6705 29.1292 26.7101 29.0544 26.7309L19.5241 29.5348C19.4162 29.5678 19.2998 29.5602 19.1971 29.5136Z"
        fill="#ED6953"
      />
      <path
        className="bmp-flame-inner"
        d="M20.6794 28.7108C20.229 28.4985 18.3723 27.4283 18.8745 24.3537C18.8783 24.3311 18.8849 24.3092 18.8941 24.2882C19.1872 23.6213 20.2148 22.2645 19.7698 18.7441C19.7144 18.3071 20.5882 20.2407 20.6633 20.3574C20.8098 20.5998 21.0958 20.4423 21.2477 20.2814C22.1412 19.3367 22.2716 17.7693 22.0125 16.5664C22.0018 16.512 22.0084 16.4557 22.0314 16.4052C22.0544 16.3548 22.0927 16.3126 22.141 16.2846C22.1893 16.2567 22.2452 16.2442 22.3009 16.2491C22.3567 16.2539 22.4095 16.2758 22.4521 16.3116C23.5869 17.2793 24.0283 19.2766 23.5386 20.6281C23.4433 20.8257 23.4026 21.0449 23.4207 21.2632C23.428 21.3179 23.4509 21.3695 23.4868 21.4118C23.544 21.4577 23.6169 21.4798 23.6902 21.4736C23.7636 21.4673 23.8316 21.4331 23.88 21.3782C23.9714 21.2646 24.0328 21.1302 24.0587 20.9872C24.2106 20.4565 24.4375 19.9099 24.8664 19.5472C24.9458 19.4719 25.0448 19.4198 25.1523 19.3968C25.206 19.3864 25.2617 19.3927 25.3116 19.4149C25.3615 19.4371 25.4033 19.474 25.4311 19.5207C25.4585 19.5956 25.4628 19.6768 25.4436 19.7542C25.2435 21.058 24.9861 22.3724 25.1237 23.6974C25.1313 23.7625 25.1628 23.8225 25.2123 23.8661C25.2617 23.9097 25.3256 23.9338 25.3918 23.9338C25.458 23.9338 25.5219 23.9097 25.5713 23.8661C25.6207 23.8225 25.6522 23.7625 25.6598 23.6974L25.6795 23.4709C25.6853 23.4107 25.7115 23.3541 25.754 23.3106C25.7965 23.267 25.8527 23.2391 25.9133 23.2312C25.9739 23.2234 26.0355 23.2362 26.0878 23.2676C26.1401 23.2989 26.1801 23.3469 26.2013 23.4037C26.5426 24.3608 26.9161 25.7919 26.6266 26.9011C26.6143 26.9431 26.5914 26.9813 26.5602 27.0122C26.5289 27.0431 26.4903 27.0658 26.4479 27.078L20.8706 28.725C20.8073 28.7439 20.7391 28.7389 20.6794 28.7108Z"
        fill="#E59B80"
      />
      <path d="M14.1016 31.0351C14.1016 31.0351 13.0883 34.0425 16.1281 35.0473L30.3153 29.7809C30.3153 29.7809 31.5823 28.026 29.3021 25.5175L25.7548 26.7718L27.5222 24.7586C27.5222 24.7586 27.2702 23.7556 26.0032 24.2562L23.7229 27.2636L14.1016 31.0351Z" fill="#1F171C"/>
      <path d="M26.3816 35.5481C27.9903 35.5481 29.2945 34.3133 29.2945 32.7902C29.2945 31.267 27.9903 30.0322 26.3816 30.0322C24.7729 30.0322 23.4688 31.267 23.4688 32.7902C23.4688 34.3133 24.7729 35.5481 26.3816 35.5481Z" fill="#1F171C"/>
    </svg>
  </div>
);

/**
 * Choreographed intro for the Creator After Party invite.
 *
 * NEW timeline (~9.5s):
 *   0.0–1.0s   Fire circle scales up at center, gentle rumble + amber glow
 *   1.0–2.0s   Sparks emit from the fire (continuous loop while fire holds)
 *   2.0–2.3s   One spark shoots up + morphs into the Popfly kite
 *   2.3–4.8s   Kite "firefly" flutters around the fire (~2.5s)
 *   4.8–5.8s   Lockup forms: fire moves to its lockup position, kite flies
 *              to its home, both wordmarks fade in around them
 *   5.8s+      Existing star burst, "presents" wordmark, "Out of Office"
 *              title, and Outside Days kick-off pop play unchanged
 */
const BasecampMatchPopflyLogo = ({ onRevealed, presenter }: Props) => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const reduced = typeof window !== "undefined"
      && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const delay = reduced ? 0 : 10700;
    const t = setTimeout(() => {
      setRevealed(true);
      onRevealed?.();
    }, delay);
    return () => clearTimeout(t);
  }, [onRevealed]);

  // Sparks emitted from the fire. Each has an angle, distance, size, color, and delay.
  // They arc outward like real embers. Tightened window to keep pacing snappy.
  const sparks = [
    { angle:  -85, dist: 28, size:  6, color: "#E1B624", delay:    0, dur: 1200 },
    { angle:  -70, dist: 36, size:  5, color: "#ED7660", delay:  120, dur: 1300 },
    { angle: -100, dist: 32, size:  7, color: "#F5E6D3", delay:  220, dur: 1200 },
    { angle:  -55, dist: 40, size:  4, color: "#E1B624", delay:  340, dur: 1400 },
    { angle: -115, dist: 30, size:  6, color: "#ED7660", delay:  460, dur: 1200 },
    { angle:  -80, dist: 44, size:  5, color: "#F5E6D3", delay:  580, dur: 1300 },
    { angle:  -65, dist: 26, size:  4, color: "#E1B624", delay:  720, dur: 1200 },
    { angle:  -95, dist: 38, size:  6, color: "#ED7660", delay:  860, dur: 1300 },
  ];

  // Kite dust trail motes — drop off the kite during its flutter.
  // Mostly neon green with warm sparks mixed in to tie to the fire flickers.
  const trailMotes = [
    { color: "#39FF14", size: 5, delay: 2300, dur: 1200, ox:  20, oy:  10 },
    { color: "#E1B624", size: 4, delay: 2600, dur: 1300, ox: -18, oy:  20 },
    { color: "#39FF14", size: 6, delay: 2950, dur: 1200, ox:  30, oy:  -8 },
    { color: "#F5E6D3", size: 4, delay: 3300, dur: 1300, ox: -25, oy:  16 },
    { color: "#39FF14", size: 5, delay: 3650, dur: 1200, ox:  10, oy:  24 },
    { color: "#ED7660", size: 4, delay: 4000, dur: 1300, ox:  22, oy: -12 },
    { color: "#39FF14", size: 5, delay: 4350, dur: 1200, ox: -28, oy:  18 },
    { color: "#E1B624", size: 4, delay: 4700, dur: 1300, ox:  16, oy:  22 },
    { color: "#39FF14", size: 6, delay: 5050, dur: 1200, ox: -14, oy:  -6 },
    { color: "#F5E6D3", size: 4, delay: 5400, dur: 1300, ox:  26, oy:  14 },
  ];

  // Pre-existing star burst (kept exactly as-is, just shifted later in the timeline).
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

  // Pacing — total runtime ~8.8s. Slower kite section, gives every beat room to breathe.
  const STAR_BURST_DELAY_MS = 8400;     // snowflakes burst as the invite reveals
  const STAGE_OUT_DELAY_S = 10.3;       // hold dark stage so the burst plays out fully
  const OD_POP_DELAY_S = 7.6;           // OD lands into the kickoff line
  const PRESENTS_DELAY_S = 7.4;
  const DIVIDER_DELAY_S = 7.2;
  const X_DELAY_S = 7.3;
  const TITLE_DELAY_S = 7.8;
  const X_GLOW_DELAY_S = 8.2;
  const NEON_PULSE_DELAY_S = 7.6;

  return (
    <div className="w-full flex flex-col items-center justify-center py-10 select-none">
      <style>{`
        /* ===== NEW: Fire / spark / kite splash ===== */

        /* Fire grows in smoothly — single ease-out, no mid-bounce */
        @keyframes bmpFireGrow {
          0%   { transform: translate(-50%, -50%) scale(0.08); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1);    opacity: 1; }
        }
        @keyframes bmpFireGlow {
          0%, 100% { filter: drop-shadow(0 0 24px rgba(225,182,36,0.7)) drop-shadow(0 0 48px rgba(237,105,83,0.45)); }
          50%      { filter: drop-shadow(0 0 36px rgba(225,182,36,1)) drop-shadow(0 0 72px rgba(237,105,83,0.7)); }
        }
        /* After kite flutter, fire shrinks down to nothing — leaving the embers behind. */
        @keyframes bmpFireDismiss {
          0%   { transform: translate(-50%, -50%) scale(1)    rotate(0); opacity: 1; }
          70%  { transform: translate(-50%, -50%) scale(0.18) rotate(0); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(0)    rotate(0); opacity: 0; }
        }

        /* Each spark arcs outward + fades, then loops */
        @keyframes bmpSparkRise {
          0%   { transform: translate(-50%, -50%) translate(0, 0) scale(0.3); opacity: 0; }
          15%  { transform: translate(-50%, -50%) translate(calc(var(--sx) * 0.3), calc(var(--sy) * 0.3)) scale(1); opacity: 1; }
          70%  { transform: translate(-50%, -50%) translate(var(--sx), calc(var(--sy) - 20px)) scale(0.7); opacity: 0.7; }
          100% { transform: translate(-50%, -50%) translate(var(--sx), calc(var(--sy) - 60px)) scale(0.2); opacity: 0; }
        }

        /* "Hero" spark grows + cross-fades into the kite */
        @keyframes bmpHeroSparkLaunch {
          0%   { transform: translate(-50%, -50%) translate(0, 0) scale(0.3); opacity: 0; }
          20%  { transform: translate(-50%, -50%) translate(0, -20px) scale(1.4); opacity: 1; }
          70%  { transform: translate(-50%, -50%) translate(0, -120px) scale(2.2); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(0, -160px) scale(2.6); opacity: 0; }
        }
        @keyframes bmpKiteAppear {
          0%   { opacity: 0; transform: translate(-50%, -50%) translate(0, -260px) scale(0.4); }
          100% { opacity: 1; transform: translate(-50%, -50%) translate(0, -260px) scale(1); }
        }

        /* Kite flutters wide around the fire — far enough out that it never overlaps the yellow circle. */
        @keyframes bmpKiteFlutter {
          0%   { transform: translate(-50%, -50%) translate(0, -260px); }
          25%  { transform: translate(-50%, -50%) translate(280px, -40px); }
          50%  { transform: translate(-50%, -50%) translate(0, 240px); }
          75%  { transform: translate(-50%, -50%) translate(-280px, -40px); }
          100% { transform: translate(-50%, -50%) translate(0, -260px); }
        }
        /* Wing fold — the kite folds in half and back out like butterfly wings. */
        @keyframes bmpKiteWingFold {
          0%, 100% { transform: scaleX(1); }
          50%      { transform: scaleX(0.55); }
        }
        @keyframes bmpKiteGlow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(57,255,20,0.7)) drop-shadow(0 0 16px rgba(57,255,20,0.4)); }
          50%      { filter: drop-shadow(0 0 14px rgba(57,255,20,1)) drop-shadow(0 0 28px rgba(57,255,20,0.6)); }
        }
        /* Kite flies fully off the page (top-right) */
        @keyframes bmpKiteDismiss {
          0%   { opacity: 1; transform: translate(-50%, -50%) translate(0, -260px) scale(1); }
          70%  { opacity: 1; }
          100% { opacity: 0; transform: translate(-50%, -50%) translate(120vw, -90vh) scale(0.5); }
        }

        /* Dust trail mote — drifts outward + downward, fading as it shrinks. */
        @keyframes bmpTrailDrift {
          0%   { transform: translate(-50%, -50%) translate(0, 0) scale(1);   opacity: 0; }
          15%  { opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(var(--tox), calc(var(--toy) + 40px)) scale(0.2); opacity: 0; }
        }

        /* ===== Existing star burst (kept) ===== */
        @keyframes bmpStarBurst {
          0%   { transform: translate(-50%, -50%) translate(0, 0) scale(0.1) rotate(0); opacity: 0; }
          10%  { transform: translate(-50%, -50%) translate(var(--bx-mid), var(--by-mid)) scale(1.1) rotate(calc(var(--bspin) * 0.4deg)); opacity: 1; }
          30%  { transform: translate(-50%, -50%) translate(var(--bx-out), var(--by-out)) scale(1) rotate(calc(var(--bspin) * 0.7deg)); opacity: 1; }
          78%  { transform: translate(-50%, -50%) translate(var(--bx-out), var(--by-out)) scale(1) rotate(calc(var(--bspin) * 1deg)); opacity: 1; }
          92%  { transform: translate(-50%, -50%) translate(calc(var(--bx-out) * 0.4), calc(var(--by-out) * 0.4)) scale(0.5) rotate(calc(var(--bspin) * 1.4deg)); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) translate(0, 0) scale(0); opacity: 0; }
        }

        /* ===== Logo bloom (kept) ===== */
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

        /* Splash dark stage */
        .bmp-splash-stage {
          position: fixed;
          inset: 0;
          background-color: #19363B;
          background-image: linear-gradient(rgba(8,8,8,0.25), rgba(8,8,8,0.35)), url(/afterparty-bg.jpg);
          background-size: cover;
          background-position: center top;
          background-repeat: no-repeat;
          z-index: 60;
          pointer-events: none;
          animation: bmpStageOut 800ms ease-out ${STAGE_OUT_DELAY_S}s forwards;
        }
        @keyframes bmpStageOut {
          0%   { opacity: 1; }
          100% { opacity: 0; visibility: hidden; }
        }

        /* Center fire mark */
        .bmp-splash-fire {
          position: fixed;
          top: 50%;
          left: 50%;
          width: min(40vh, 40vw);
          height: min(40vh, 40vw);
          z-index: 62;
          transform: translate(-50%, -50%) scale(0.08);
          opacity: 0;
          animation:
            bmpFireGrow 900ms cubic-bezier(.16,.84,.32,1) 0s forwards,
            bmpFireDismiss 800ms cubic-bezier(.4,.1,.3,1) 5.8s forwards;
        }
        .bmp-splash-fire-glow {
          width: 100%;
          height: 100%;
          animation: bmpFireGlow 2.2s ease-in-out infinite;
        }

        /* Sparks */
        .bmp-spark {
          position: fixed;
          top: 50%;
          left: 50%;
          z-index: 61;
          border-radius: 50%;
          opacity: 0;
          animation: bmpSparkRise var(--sdur, 1400ms) ease-out infinite;
        }

        /* Hero spark + kite */
        .bmp-hero-spark {
          position: fixed;
          top: 50%;
          left: 50%;
          z-index: 63;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: radial-gradient(circle, #FFFFFF 0%, #2EF116 60%, transparent 100%);
          box-shadow: 0 0 14px rgba(57,255,20,0.9), 0 0 28px rgba(57,255,20,0.6);
          opacity: 0;
          animation: bmpHeroSparkLaunch 600ms cubic-bezier(.4,.1,.3,1) 1700ms forwards;
        }
        /* Outer kite wrapper handles flight path; inner wrapper handles wing fold; img keeps glow. */
        .bmp-kite {
          position: fixed;
          top: 50%;
          left: 50%;
          width: min(14vh, 14vw);
          height: min(14vh, 14vw);
          z-index: 64;
          opacity: 0;
          will-change: transform, opacity;
          animation:
            bmpKiteAppear 500ms ease-out 2000ms forwards,
            bmpKiteFlutter 4200ms cubic-bezier(.45,.05,.55,.95) 2300ms 1 forwards,
            bmpKiteDismiss 800ms cubic-bezier(.4,.1,.3,1) 6000ms forwards;
        }
        .bmp-kite-wings {
          width: 100%;
          height: 100%;
          animation: bmpKiteWingFold 850ms ease-in-out 2300ms infinite;
          will-change: transform;
        }
        .bmp-kite-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          animation: bmpKiteGlow 1.8s ease-in-out 2300ms infinite;
          will-change: filter;
        }

        /* Dust trail mote (drops off the kite as it flutters) */
        .bmp-trail {
          position: fixed;
          top: 50%;
          left: 50%;
          z-index: 63;
          border-radius: 50%;
          opacity: 0;
          will-change: transform, opacity;
        }

        /* Steady-state lockup animations */
        .bmp-bloom-left  { animation: bmpBloomLeft  1200ms cubic-bezier(.22,.9,.3,1) 6.8s both, bmpAmberPulse 2.6s ease-in-out ${NEON_PULSE_DELAY_S}s infinite; }
        .bmp-bloom-right { animation: bmpBloomRight 1200ms cubic-bezier(.22,.9,.3,1) 6.8s both, bmpNeonPulse 2.6s ease-in-out ${NEON_PULSE_DELAY_S}s infinite; }
        .bmp-divider-l   { transform-origin: right center; animation: bmpGrowDivider 700ms ease-out ${DIVIDER_DELAY_S}s both; }
        .bmp-divider-r   { transform-origin: left center;  animation: bmpGrowDivider 700ms ease-out ${DIVIDER_DELAY_S}s both; }
        .bmp-x           { animation: bmpFadeUp 700ms ease-out ${X_DELAY_S}s both, bmpXGlow 2s ease-in-out ${X_GLOW_DELAY_S}s infinite; }
        .bmp-presents    { animation: bmpPresentsIn 800ms cubic-bezier(.2,.9,.3,1) ${PRESENTS_DELAY_S}s both; }
        .bmp-title       { animation: bmpFadeUp 800ms ease-out ${TITLE_DELAY_S}s both; }

        /* OD logo finds its home in the kickoff line — appears high, drifts down past lockup,
           lands tiny right where the inline kickoff-line OD logo sits, then fades into it. */
        @keyframes bmpODFindHome {
          0%   { opacity: 0; transform: translate(-50%, calc(-50% - 30vh)) scale(0.4); }
          20%  { opacity: 1; transform: translate(-50%, calc(-50% - 26vh)) scale(1); }
          55%  { opacity: 1; transform: translate(-50%, calc(-50% - 8vh))  scale(0.6); }
          90%  { opacity: 0.6; transform: translate(-50%, calc(-50% + 22vh)) scale(0.16); }
          100% { opacity: 0; transform: translate(-50%, calc(-50% + 26vh)) scale(0.12); }
        }
        .bmp-od-stacked {
          position: fixed;
          top: 50%;
          left: 50%;
          width: min(28vh, 28vw);
          height: auto;
          z-index: 63;
          opacity: 0;
          filter: drop-shadow(0 0 24px rgba(245,230,211,0.45));
          animation: bmpODFindHome 1900ms cubic-bezier(.2,.7,.3,1) ${OD_POP_DELAY_S}s forwards;
        }

        /* Cream neon pulse (matches cream brand color, used on the Oakley logo) */
        @keyframes bmpCreamPulse {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(245,230,211,0.55)) drop-shadow(0 0 20px rgba(245,230,211,0.3)); }
          50%      { filter: drop-shadow(0 0 18px rgba(245,230,211,0.95)) drop-shadow(0 0 36px rgba(245,230,211,0.55)); }
        }
        .bmp-presenter      { animation: bmpPresentsIn 800ms cubic-bezier(.2,.9,.3,1) ${PRESENTS_DELAY_S}s both; }
        .bmp-presenter-logo { animation: bmpCreamPulse 2.6s ease-in-out ${NEON_PULSE_DELAY_S}s infinite; }

        @media (prefers-reduced-motion: reduce) {
          .bmp-splash-stage, .bmp-splash-fire, .bmp-spark, .bmp-hero-spark, .bmp-kite, .bmp-kite-wings, .bmp-trail, .bmp-burst-star, .bmp-burst-photo-wrap, .bmp-od-stacked { display: none !important; }
          .bmp-bloom-left, .bmp-bloom-right, .bmp-divider-l, .bmp-divider-r,
          .bmp-x, .bmp-presents, .bmp-presenter, .bmp-title {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Splash overlay */}
      {!revealed && (
        <>
          <div className="bmp-splash-stage" aria-hidden="true" />

          {/* Centered fire mark */}
          <div className="bmp-splash-fire" aria-hidden="true">
            <div className="bmp-splash-fire-glow">
              <BasecampFireOnly className="w-full h-full" />
            </div>
          </div>

          {/* Ambient sparks rising from the fire */}
          {sparks.map((s, i) => {
            const rad = (s.angle * Math.PI) / 180;
            const sx = `${Math.cos(rad) * s.dist}vmin`;
            const sy = `${Math.sin(rad) * s.dist}vmin`;
            return (
              <div
                key={i}
                className="bmp-spark"
                style={{
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  background: `radial-gradient(circle, #FFFFFF 0%, ${s.color} 50%, transparent 100%)`,
                  boxShadow: `0 0 ${s.size * 1.5}px ${s.color}`,
                  ["--sx" as any]: sx,
                  ["--sy" as any]: sy,
                  ["--sdur" as any]: `${s.dur}ms`,
                  animationDelay: `${600 + s.delay}ms`,
                }}
              />
            );
          })}

          {/* Hero spark that becomes the kite */}
          <div className="bmp-hero-spark" aria-hidden="true" />

          {/* Popfly kite firefly — outer = flight path, inner = wing fold, img = glow */}
          <div className="bmp-kite" aria-hidden="true">
            <div className="bmp-kite-wings">
              <img src={popflyKite} alt="" className="bmp-kite-img" />
            </div>
          </div>

          {/* Kite dust trail — neon + warm motes that drop off the kite */}
          {trailMotes.map((m, i) => (
            <div
              key={`trail-${i}`}
              className="bmp-trail"
              style={{
                width: `${m.size}px`,
                height: `${m.size}px`,
                background: `radial-gradient(circle, #FFFFFF 0%, ${m.color} 55%, transparent 100%)`,
                boxShadow: `0 0 ${m.size * 2}px ${m.color}`,
                ["--tox" as any]: `${m.ox}px`,
                ["--toy" as any]: `${m.oy}px`,
                animation: `bmpTrailDrift ${m.dur}ms ease-out ${m.delay}ms forwards`,
              }}
            />
          ))}

          {/* Existing star burst, fired AFTER lockup forms.
              When `burstImages` is provided (e.g. Oakley product photos),
              roughly half the entries become circular photo medallions instead
              of stars, using the same orbital animation. */}
          {burstStars.map((s, i) => {
            const rad = (s.angle * Math.PI) / 180;
            const out = `${Math.cos(rad) * s.dist}vmin`;
            const outY = `${Math.sin(rad) * s.dist}vmin`;
            const mid = `${Math.cos(rad) * s.dist * 0.45}vmin`;
            const midY = `${Math.sin(rad) * s.dist * 0.45}vmin`;
            // Weight the burst heavily toward product images so the Oakley
            // glasses are unmistakable in the quick animation beat.
            const usePhoto = !!(burstImages && burstImages.length && (i % 8) < 7);
            const photoIdx = usePhoto
              ? (burstImages ? i % burstImages.length : 0)
              : 0;
            const photoSrc = usePhoto ? burstImages![photoIdx] : undefined;
            // Large uncropped cutouts so the glasses actually read.
            const photoSize = usePhoto ? Math.min(280, Math.max(210, s.size + 130)) : s.size;
            return (
              <div
                key={`burst-${i}`}
                className={usePhoto ? "bmp-burst-star bmp-burst-photo-wrap" : "bmp-burst-star"}
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  zIndex: 61,
                  opacity: 0,
                  ["--bx-out" as any]: out,
                  ["--by-out" as any]: outY,
                  ["--bx-mid" as any]: mid,
                  ["--by-mid" as any]: midY,
                  ["--bspin" as any]: s.spin,
                  animation: `bmpStarBurst 3800ms cubic-bezier(.2,.7,.3,1) ${STAR_BURST_DELAY_MS + s.delay}ms forwards`,
                }}
              >
                {usePhoto ? (
                  <img
                    src={photoSrc}
                    alt=""
                    className="bmp-burst-photo"
                    style={{ width: photoSize, height: photoSize }}
                    aria-hidden="true"
                  />
                ) : (
                  <StarSparkle tone={s.tone} variant="single" size={s.size} />
                )}
              </div>
            );
          })}

          <img
            src={outsideDaysStacked}
            alt="Outside Days"
            className="bmp-od-stacked"
            aria-hidden="true"
          />
        </>
      )}

      {/* Steady-state lockup (logos land here) */}
      <div className="relative w-full flex flex-col items-center">
        <div className="flex items-center justify-center gap-3 sm:gap-5 w-full max-w-3xl px-4 text-center">
          <div className="bmp-bloom-left flex items-center justify-end flex-1 min-w-0">
            <a href="https://basecampjobs.com" target="_blank" rel="noopener noreferrer" aria-label="Basecamp Match">
              <BasecampMatchAnimated className="h-10 sm:h-14 md:h-16" />
            </a>
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

          <div className="bmp-bloom-right flex items-center justify-start flex-1 min-w-0 overflow-visible">
            <a href="https://popfly.com" target="_blank" rel="noopener noreferrer" aria-label="Popfly">
              <img
                src={popflyLogo}
                alt="Popfly"
                className="h-10 sm:h-14 md:h-16 w-auto max-w-none object-contain"
                style={{
                  clipPath: "inset(24% 11% 24% 11%)",
                  transform: "scale(1.25)",
                  transformOrigin: "center center",
                }}
              />
            </a>
          </div>
        </div>

        <div className="mt-2 text-center flex flex-col items-center">
          {presenter ? (
            // Custom presenter stack (e.g. Oakley): "@ / [logo] / RiNo".
            // Replaces the "presents" wordmark when supplied.
            <a
              href={presenter.href || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="bmp-presenter flex flex-col items-center justify-center mb-3 group"
              aria-label={presenter.logoAlt}
            >
              {presenter.label && (
                <span
                  className="font-afterparty text-[12px] sm:text-[13px] tracking-[0.2em] mb-1"
                  style={{ color: "rgba(245,230,211,0.85)", fontWeight: 500 }}
                >
                  {presenter.label}
                </span>
              )}
              <img
                src={presenter.logoUrl}
                alt={presenter.logoAlt}
                className={`h-9 sm:h-11 md:h-12 w-auto object-contain ${presenter.creamGlow ? "bmp-presenter-logo" : ""}`}
              />
              {presenter.sublabel && (
                <span
                  className="font-afterparty text-[12px] sm:text-[13px] tracking-[0.25em] mt-1"
                  style={{ color: "rgba(245,230,211,0.85)", fontWeight: 500 }}
                >
                  {presenter.sublabel}
                </span>
              )}
            </a>
          ) : (
            <div className="bmp-presents h-7 sm:h-8 mb-3 overflow-hidden" style={{ aspectRatio: `${1920 * 0.88} / 575` }}>
              <img
                src={presentsWordmark}
                alt="present"
                className="h-full w-auto max-w-none object-cover object-left"
                style={{ clipPath: "inset(0 12% 0 0)", transform: "translateX(0)" }}
              />
            </div>
          )}
          <h2
            className="bmp-title font-afterparty text-4xl sm:text-5xl md:text-6xl font-bold"
            style={{ color: "#F5E6D3" }}
          >
            Out of Office
          </h2>
          <div className="bmp-title mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm sm:text-base italic tracking-wide" style={{ color: "#F5E6D3", opacity: 0.9 }}>
            <span>An official</span>
            <img
              src={outsideDaysLogo}
              alt="Outside Days"
              className="h-3.5 sm:h-4 md:h-5 w-auto object-contain"
            />
            <span>kick-off party</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasecampMatchPopflyLogo;
