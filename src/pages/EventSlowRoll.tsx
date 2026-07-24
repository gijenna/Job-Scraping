import { useEffect, useState } from "react";
import { EditableTextProvider } from "@/components/EditableTextProvider";
import EditableText from "@/components/EditableText";
import PageMetaApplier from "@/components/event/PageMetaApplier";
import OrderedSections from "@/components/event/OrderedSections";
import northCommons from "@/assets/slowroll/north-commons.png.asset.json";
import slowRollLogo from "@/assets/slowroll/logo.jpg.asset.json";
import basecampMatchLogo from "@/assets/mn26/sponsors/basecamp-match-logo.png.asset.json";
import basecampMatchDark from "@/assets/slowroll/basecamp-match-darkmode.png.asset.json";

import mpfH1 from "@/assets/slowroll/mpf-h1.jpg.asset.json";
import mpfH2 from "@/assets/slowroll/mpf-h2.png.asset.json";
import mpfH3 from "@/assets/slowroll/mpf-h3.png.asset.json";
import mpfH4 from "@/assets/slowroll/mpf-h4.jpg.asset.json";
import mpfH5 from "@/assets/slowroll/mpf-h5.png.asset.json";
import mpfH6 from "@/assets/slowroll/mpf-h6.png.asset.json";
import mpfH7 from "@/assets/slowroll/mpf-h7.png.asset.json";

// Palette: white for headline / text, coral + yellow neon for accents,
// purple reserved for bike frames only (never text). No blue anywhere.
const C = {
  midnight: "#0a0806",
  midnight2: "#140f0c",
  ink: "#0f0a08",
  paper: "#faf7f2",
  paperLine: "#e2ddd2",
  muted: "#8a8578",
  mutedDark: "#5b5f57",
  magenta: "#ED7660",   // Basecamp coral
  yellow: "#E1B624",    // Basecamp yellow
  purple: "#a855f7",    // ALSO purple — bikes only
  // Legacy aliases remapped to white so any old callers stay legible.
  cyan: "#ffffff",
  lime: "#ffffff",
  primary: "#ED7660",
  primaryGlow: "0 0 22px rgba(237,118,96,0.55)",
  yellowGlow: "0 0 22px rgba(225,182,36,0.55)",
};

const REGISTER_URL = "https://basecampoutdoor.typeform.com/to/yumTbpY7";
const SLOWROLL_FB_URL = "https://www.facebook.com/SlowRollTC/";

const font = { fontFamily: "'Inter', system-ui, sans-serif" };
const displayFont = { fontFamily: "'Unbounded', 'Inter', system-ui, sans-serif" };

const Badge = ({ settingKey, defaultText, variant = "solid" }: { settingKey: string; defaultText: string; variant?: "solid" | "outline" }) => (
  <span
    className="inline-block uppercase font-bold rounded-full"
    style={{
      fontSize: 11,
      letterSpacing: "0.2em",
      padding: "7px 16px",
      background: variant === "solid" ? C.magenta : "transparent",
      color: variant === "solid" ? "#fff" : C.magenta,
      border: variant === "outline" ? `1.5px solid ${C.magenta}` : "none",
      boxShadow: variant === "solid" ? C.primaryGlow : "none",
    }}
  >
    <EditableText settingKey={settingKey} defaultText={defaultText} as="span" />
  </span>
);

const CTAButton = ({ settingKey, defaultText, size = "md" }: { settingKey: string; defaultText: string; size?: "md" | "lg" }) => (
  <a
    href={REGISTER_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block rounded-full font-bold transition-transform hover:scale-[1.03]"
    style={{
      background: `linear-gradient(90deg, ${C.magenta}, ${C.yellow})`,
      color: C.ink,
      padding: size === "lg" ? "18px 34px" : "13px 24px",
      fontSize: size === "lg" ? 17 : 15,
      letterSpacing: "0.02em",
      boxShadow: `0 0 0 2px rgba(255,255,255,0.06), 0 10px 40px rgba(237,118,96,0.45), 0 0 60px rgba(225,182,36,0.25)`,
    }}
  >
    <EditableText settingKey={settingKey} defaultText={defaultText} as="span" />
  </a>
);

const NeonStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700;800;900&display=swap');
    @keyframes sr-drift { 0% { transform: translate(0,0) scale(1) } 50% { transform: translate(20px,-15px) scale(1.05) } 100% { transform: translate(0,0) scale(1) } }
    @keyframes sr-pack {
      0%   { transform: translateX(-110%); }
      55%  { transform: translateX(110%); }
      100% { transform: translateX(110%); }
    }
    @keyframes sr-headlight { 0%,100% { opacity:.6 } 50% { opacity:1 } }
    .sr-neon-text { text-shadow: 0 0 12px currentColor, 0 0 28px currentColor; }
  `}</style>
);


const NeonBlobs = () => (
  <>
    <div aria-hidden style={{ position: "absolute", width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, ${C.magenta}33 0%, transparent 65%)`, filter: "blur(50px)", top: -160, left: -120, animation: "sr-drift 18s ease-in-out infinite", pointerEvents: "none" }} />
    <div aria-hidden style={{ position: "absolute", width: 480, height: 480, borderRadius: "50%", background: `radial-gradient(circle, ${C.yellow}22 0%, transparent 65%)`, filter: "blur(60px)", bottom: -200, right: -140, animation: "sr-drift 22s ease-in-out infinite reverse", pointerEvents: "none" }} />
  </>
);

/* One bike with glowing headlight + taillight */
const LitBike = ({ size = 40, color = "#fff", light = C.yellow }: { size?: number; color?: string; light?: string }) => (
  <svg width={size} height={size * 0.62} viewBox="0 0 64 40" fill="none" style={{ display: "block", overflow: "visible" }}>
    <ellipse cx="60" cy="22" rx="10" ry="3" fill={light} opacity="0.55" style={{ filter: "blur(4px)" }} />
    <circle cx="52" cy="22" r="2.4" fill={light} style={{ filter: `drop-shadow(0 0 6px ${light})`, animation: "sr-headlight 1.6s ease-in-out infinite" }} />
    <circle cx="12" cy="22" r="1.8" fill={C.magenta} style={{ filter: `drop-shadow(0 0 5px ${C.magenta})` }} />
    <g style={{ filter: `drop-shadow(0 0 5px ${color})` }}>
      <circle cx="12" cy="30" r="8" stroke={color} strokeWidth="2.2" />
      <circle cx="52" cy="30" r="8" stroke={color} strokeWidth="2.2" />
      <path d="M12 30 L28 30 L38 12 L48 30" stroke={color} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" fill="none" />
      <path d="M22 12 L32 12 L28 30" stroke={color} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" fill="none" />
      <circle cx="38" cy="12" r="2" fill={color} />
    </g>
  </svg>
);

/* A PACK of bikes rolls across, then the road sits empty, then loops. Community ride energy. */
const BikePack = ({ height = 60, bikeSize = 42, cycle = 11, count = 6, seed = 0 }: { height?: number; bikeSize?: number; cycle?: number; count?: number; seed?: number }) => {
  // Mostly white bikes, occasional purple + yellow + coral frames.
  const palette = ["#fff", C.yellow, "#fff", C.purple, "#fff", C.magenta, "#fff", C.purple, "#fff", C.yellow];
  const bikes = Array.from({ length: count }, (_, i) => palette[(i + seed) % palette.length]);
  return (
    <div style={{ position: "relative", height, overflow: "hidden", width: "100%" }}>
      {/* road: yellow dashed line, always visible */}
      <div aria-hidden style={{
        position: "absolute", left: 0, right: 0, bottom: Math.round(height * 0.26), height: 2,
        backgroundImage: `repeating-linear-gradient(90deg, ${C.yellow} 0 16px, transparent 16px 30px)`,
        opacity: 0.7, filter: `drop-shadow(0 0 5px ${C.yellow}88)`,
      }} />
      <div style={{
        display: "flex", alignItems: "flex-end", height: "100%", width: "max-content",
        animation: `sr-pack ${cycle}s linear infinite`,
        animationDelay: `${-seed * 0.7}s`,
      }}>
        {bikes.map((col, i) => (
          <div key={i} style={{ padding: "0 9px", display: "flex", alignItems: "flex-end", height: "100%", transform: `translateY(${(i % 3) - 1}px)` }}>
            <LitBike size={bikeSize + (i % 4 === 0 ? 4 : 0)} color={col} light={C.yellow} />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============ WEAVING PAGE SPINE ============
   One unbroken static bike-lane weaving down the full page.
   Bikes move in small packs, while landmarks sit in open gutters between sections. */
const BikePathSpine = () => {
  // Starts from the left side of the hero, runs horizontally between the
  // headline and logo area, then slips into gutters and section breaks.
  const D =
    "M 0 54 " +
    "C 14 54, 31 54, 45 54 " +
    "S 71 54, 83 60 " +
    "C 96 67, 94 91, 84 109 " +
    "C 75 126, 88 142, 94 166 " +
    "C 103 206, 78 231, 54 244 " +
    "C 25 260, 8 282, 8 321 " +
    "C 8 360, 31 379, 50 389 " +
    "C 70 400, 91 419, 91 456 " +
    "C 91 494, 70 512, 49 524 " +
    "C 28 537, 9 557, 9 596 " +
    "C 9 637, 35 653, 57 660 " +
    "C 82 668, 93 690, 88 725 " +
    "C 82 768, 23 766, 14 810 " +
    "C 5 854, 82 866, 88 912 " +
    "C 94 955, 44 965, 30 1000";

  const Tree = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
    <g transform={`translate(${x} ${y}) scale(${s})`} style={{ filter: `drop-shadow(0 0 3px ${C.yellow})` }}>
      <path d="M -6 8 L 0 -10 L 6 8 Z M -4 2 L 0 -6 L 4 2" stroke={C.yellow} strokeWidth="0.6" fill="none" vectorEffect="non-scaling-stroke" />
      <line x1="0" y1="8" x2="0" y2="12" stroke={C.yellow} strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
    </g>
  );
  const Building = ({ x, y }: { x: number; y: number }) => (
    <g transform={`translate(${x} ${y})`} style={{ filter: `drop-shadow(0 0 4px ${C.yellow})` }}>
      <rect x="-10" y="-24" width="7" height="24" stroke={C.yellow} strokeWidth="0.6" fill="none" vectorEffect="non-scaling-stroke" />
      <rect x="-2" y="-32" width="8" height="32" stroke={C.yellow} strokeWidth="0.6" fill="none" vectorEffect="non-scaling-stroke" />
      <rect x="7" y="-18" width="6" height="18" stroke={C.yellow} strokeWidth="0.6" fill="none" vectorEffect="non-scaling-stroke" />
      {[-8, -5, 2, 5, 9].map((cx, i) => [-20, -14, -8].map((cy, j) => (
        <rect key={`${i}-${j}`} x={cx} y={cy} width="1.2" height="1.2" fill={C.yellow} opacity="0.85" />
      )))}
    </g>
  );
  const Lake = ({ x, y }: { x: number; y: number }) => (
    <g transform={`translate(${x} ${y})`} style={{ filter: `drop-shadow(0 0 3px ${C.magenta})` }}>
      <ellipse cx="0" cy="0" rx="18" ry="5" stroke={C.magenta} strokeWidth="0.6" fill="none" vectorEffect="non-scaling-stroke" />
      <path d="M -12 -2 Q -8 -3 -4 -2 T 4 -2 T 12 -2" stroke={C.magenta} strokeWidth="0.4" fill="none" vectorEffect="non-scaling-stroke" opacity="0.7" />
      <path d="M -8 -4 Q -4 -5 0 -4 T 8 -4" stroke={C.magenta} strokeWidth="0.4" fill="none" vectorEffect="non-scaling-stroke" opacity="0.5" />
    </g>
  );
  const Picnic = ({ x, y }: { x: number; y: number }) => (
    <g transform={`translate(${x} ${y})`} style={{ filter: `drop-shadow(0 0 3px ${C.magenta})` }}>
      {/* checkered blanket */}
      <rect x="-8" y="-4" width="16" height="8" stroke={C.magenta} strokeWidth="0.5" fill="none" vectorEffect="non-scaling-stroke" />
      <line x1="-8" y1="0" x2="8" y2="0" stroke={C.magenta} strokeWidth="0.3" vectorEffect="non-scaling-stroke" opacity="0.7" />
      <line x1="-4" y1="-4" x2="-4" y2="4" stroke={C.magenta} strokeWidth="0.3" vectorEffect="non-scaling-stroke" opacity="0.7" />
      <line x1="0"  y1="-4" x2="0"  y2="4" stroke={C.magenta} strokeWidth="0.3" vectorEffect="non-scaling-stroke" opacity="0.7" />
      <line x1="4"  y1="-4" x2="4"  y2="4" stroke={C.magenta} strokeWidth="0.3" vectorEffect="non-scaling-stroke" opacity="0.7" />
      {/* basket */}
      <rect x="-2" y="-7" width="4" height="3" stroke={C.yellow} strokeWidth="0.5" fill="none" vectorEffect="non-scaling-stroke" />
    </g>
  );

  // A single bike drawn in the SVG so it can ride the path via animateMotion.
  const SpineBike = ({ color, dur, begin }: { color: string; dur: number; begin: number }) => (
    <g style={{ filter: `drop-shadow(0 0 5px ${color}) drop-shadow(0 0 9px ${C.yellow})` }}>
      {/* compact, thick bike facing +X */}
      <g transform="translate(-2.8 -1) scale(0.78)">
        <ellipse cx="6.3" cy="1.4" rx="3.5" ry="0.8" fill={C.yellow} opacity="0.5" />
        <circle cx="-2.4" cy="1.4" r="1.35" stroke={color} strokeWidth="1.9" fill="none" vectorEffect="non-scaling-stroke" />
        <circle cx="2.8" cy="1.4" r="1.35" stroke={color} strokeWidth="1.9" fill="none" vectorEffect="non-scaling-stroke" />
        <path d="M -2.4 1.4 L -0.1 1.4 L 1.1 -1.4 L 2.8 1.4 M -0.6 -1.4 L 1.6 -1.4 L -0.1 1.4" stroke={color} strokeWidth="1.9" fill="none" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        <path d="M 1.6 -1.4 L 2.6 -2.2" stroke={color} strokeWidth="1.7" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <circle cx="4.6" cy="1.4" r="0.8" fill={C.yellow} opacity="1" />
        <circle cx="-4" cy="1.4" r="0.55" fill={C.magenta} opacity="0.95" />
      </g>
      <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" rotate="auto" path={D} />
    </g>
  );

  const packStarts = [0, -5, -10, -15, -20, -25, -30, -35];
  const packColors = ["#ffffff", "#ffffff", C.purple, "#ffffff", C.yellow, "#ffffff", C.magenta];

  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        viewBox="0 0 100 1000"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <path id="sr-spine-path" d={D} />
        </defs>
        {/* soft static bike lane */}
        <use href="#sr-spine-path" stroke={C.yellow} strokeWidth="4" strokeOpacity="0.18" fill="none" vectorEffect="non-scaling-stroke" style={{ filter: `blur(5px)` }} />
        <use href="#sr-spine-path" stroke={C.midnight} strokeWidth="2.7" strokeOpacity="0.85" fill="none" vectorEffect="non-scaling-stroke" />
        <use
          href="#sr-spine-path"
          stroke={C.yellow}
          strokeWidth="1.45"
          strokeDasharray="4 7"
          fill="none"
          vectorEffect="non-scaling-stroke"
          opacity="0.92"
          style={{ filter: `drop-shadow(0 0 4px ${C.yellow}) drop-shadow(0 0 9px ${C.yellow}88)` }}
        />

        {/* Landmarks live in open gutters and section breaks, not over text or photos. */}
        <g opacity="0.95">
          <g><Tree x={13} y={151} /> <Tree x={20} y={160} s={1.15} /> <Tree x={28} y={150} s={0.85} /></g>
          <Building x={86} y={345} />
          <Lake x={16} y={487} />
          <g><Tree x={84} y={579} /> <Tree x={91} y={591} s={1.2} /></g>
          <Picnic x={17} y={734} />
          <Building x={84} y={842} />
          <Lake x={18} y={948} />
        </g>

        {/* Bike packs: 4 to 8 bikes launch roughly every 5 seconds. */}
        {packStarts.map((start, packIndex) => (
          <g key={start}>
            {packColors.slice(0, 4 + (packIndex % 4)).map((color, bikeIndex) => (
              <SpineBike
                key={`${start}-${bikeIndex}`}
                color={color}
                dur={40}
                begin={start + bikeIndex * 0.18}
              />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
};


const Hero = () => (
  <section style={{ position: "relative", background: "transparent", color: "#fff" }} className="px-6 py-24 md:py-32 overflow-hidden">
    <div aria-hidden style={{
      position: "absolute", inset: 0,
      background: `radial-gradient(ellipse at 50% 25%, rgba(237,118,96,0.12), transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(225,182,36,0.08), transparent 55%)`,
    }} />
    <NeonBlobs />

    <div className="max-w-5xl mx-auto text-center relative z-10">
      <div className="mb-8">
        <Badge settingKey="sr_hero_pill" defaultText="OFFICIAL OUTDOOR RETAILER EVENT" />
      </div>
      <p className="uppercase font-bold mb-6" style={{ letterSpacing: "0.3em", fontSize: 12, color: "#fff", opacity: 0.85 }}>
        <EditableText settingKey="sr_hero_eyebrow" defaultText="Basecamp Outdoor × Slow Roll" as="span" />
      </p>

      {/* Headline: SLOW ROLL (white) × Basecamp Match dark-mode lockup */}
      <div className="mb-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 flex-wrap">
        <div
          style={{
            ...displayFont,
            fontSize: "clamp(52px, 9vw, 120px)",
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "-0.02em",
            lineHeight: 0.95,
            textShadow: "0 0 24px rgba(255,255,255,0.35), 0 0 60px rgba(237,118,96,0.25)",
          }}
        >
          <EditableText settingKey="sr_hero_headline_a" defaultText="SLOW " as="span" />
          <EditableText settingKey="sr_hero_headline_b" defaultText="ROLL" as="span" />
        </div>
        <span
          aria-hidden
          style={{
            ...displayFont,
            fontSize: "clamp(48px, 8vw, 96px)",
            fontWeight: 800,
            color: C.magenta,
            lineHeight: 1,
            textShadow: `0 0 18px ${C.magenta}, 0 0 40px ${C.magenta}77`,
          }}
        >
          ×
        </span>
        <img
          src={basecampMatchDark.url}
          alt="Basecamp Match"
          style={{ height: "clamp(70px, 11vw, 130px)", width: "auto", filter: "drop-shadow(0 0 16px rgba(225,182,36,0.35))" }}
        />
      </div>


      <p className="mt-8 mb-3" style={{ fontSize: 19, color: "#fff", fontWeight: 500 }}>
        <EditableText settingKey="sr_hero_subline" defaultText="MINNEAPOLIS · WED AUG 19, 2026 · AFTER DARK" as="span" />
      </p>
      <p className="mb-8 font-bold" style={{ fontSize: 16, color: "#fff", letterSpacing: "0.06em", opacity: 0.95, textShadow: `0 0 10px ${C.yellow}66` }}>
        <EditableText settingKey="sr_hero_capline" defaultText="ONLY 100 RIDERS · BRING A BIKE OR BORROW ONE" as="span" />
      </p>
      <p className="max-w-2xl mx-auto mb-10" style={{ fontSize: 17, lineHeight: 1.65, color: "rgba(255,255,255,0.9)" }}>
        <EditableText
          settingKey="sr_hero_pitch"
          defaultText="A curated 90-minute community bike ride through Minneapolis. Not a race. A moving experience with stops for stories about the city's history of public land access, equity, and outdoor culture, ending in a DJ set and a community meal. Open to everyone. No OR badge required."
          as="span"
          multiline
        />
      </p>
      <CTAButton settingKey="sr_hero_cta" defaultText="REGISTER — 100 SPOTS" size="lg" />
    </div>
  </section>
);

const Marquee = () => {
  const items = ["SLOW ROLL", "COMMUNITY", "LIGHTS ON", "MINNEAPOLIS", "RIDE JOY", "PUBLIC WATER", "DJ + MEAL", "BRING A BIKE", "AFTER DARK", "NO RACE", "MOVING STORIES", "ALL WELCOME"];
  const row = [...items, ...items];
  return (
    <div style={{ background: C.midnight2, borderTop: `1px solid ${C.magenta}`, borderBottom: `1px solid ${C.yellow}`, overflow: "hidden", position: "relative" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${C.midnight2} 0%, transparent 8%, transparent 92%, ${C.midnight2} 100%)`, zIndex: 2, pointerEvents: "none" }} />
      <div style={{ display: "flex", whiteSpace: "nowrap", animation: "sr-marquee 40s linear infinite", padding: "18px 0" }}>
        {row.map((t, i) => (
          <span key={i} style={{ ...displayFont, fontWeight: 800, fontSize: 22, letterSpacing: "0.08em", color: i % 2 === 0 ? C.yellow : "#fff", padding: "0 28px", textShadow: `0 0 12px currentColor` }}>
            {t} <span style={{ color: "rgba(255,255,255,0.35)", marginLeft: 20 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};

const DarkPanel = ({ children, id }: { children: React.ReactNode; id?: string }) => (
  <section id={id} style={{ background: "transparent", color: "#fff", position: "relative", overflow: "hidden" }} className="px-6 py-24 md:py-28">
    <NeonBlobs />
    <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${C.midnight}d8, ${C.midnight2}d0 42%, ${C.midnight}d8)`, opacity: 0.56 }} />
    <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.018, backgroundImage: `linear-gradient(${C.yellow} 1px, transparent 1px), linear-gradient(90deg, ${C.yellow} 1px, transparent 1px)`, backgroundSize: "80px 80px" }} />
    <div className="relative" style={{ zIndex: 6 }}>{children}</div>
  </section>
);

const NeonCard = ({ children, accent = C.magenta }: { children: React.ReactNode; accent?: string }) => (
  <div
    className="rounded-2xl p-6 md:p-7 h-full"
    style={{
      background: "rgba(20,15,12,0.72)",
      border: `1px solid ${accent}55`,
      boxShadow: `0 0 0 1px ${accent}22 inset, 0 10px 40px rgba(0,0,0,0.4), 0 0 30px ${accent}22`,
      backdropFilter: "blur(6px)",
    }}
  >
    {children}
  </div>
);

const WhatItIs = () => (
  <DarkPanel>
    <div className="max-w-5xl mx-auto">
      <div className="max-w-3xl mb-12">
        <p className="uppercase font-bold mb-4" style={{ letterSpacing: "0.22em", fontSize: 12, color: C.yellow, textShadow: `0 0 10px ${C.yellow}` }}>
          <EditableText settingKey="sr_what_eyebrow" defaultText="What it is" as="span" />
        </p>
        <h2 className="mb-6" style={{ ...displayFont, fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, color: "#fff", lineHeight: 1.05 }}>
          <EditableText settingKey="sr_what_headline" defaultText="A Critical Mass-style ride, at a humane pace." as="span" />
        </h2>
        <div className="space-y-5" style={{ fontSize: 17, lineHeight: 1.7, color: "rgba(255,255,255,0.88)" }}>
          <p>
            <EditableText settingKey="sr_what_p1" defaultText="Ninety minutes on two wheels. Riders don't know the exact route ahead of time, only the theme, so the pace stays comfortable for everyone from first-time riders to seasoned cyclists." as="span" multiline />
          </p>
          <p>
            <EditableText settingKey="sr_what_p2" defaultText="Volunteers hold intersections so the group moves as one. The ride stops along the way for short talks tied to the theme, and ends with a DJ and a free community meal." as="span" multiline />
          </p>
        </div>
      </div>
      <PhotoCarousels />
    </div>
  </DarkPanel>
);

const CAROUSEL_PHOTOS = [northCommons.url, mpfH1.url, mpfH2.url, mpfH3.url, mpfH4.url, mpfH5.url, mpfH6.url, mpfH7.url];
const CarouselFrame = ({ photos, accent, offset = 0 }: { photos: string[]; accent: string; offset?: number }) => {
  const [idx, setIdx] = useState(offset % photos.length);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % photos.length), 5000);
    return () => clearInterval(id);
  }, [photos.length]);
  return (
    <figure className="rounded-2xl overflow-hidden relative" style={{ border: `1px solid ${accent}55`, boxShadow: `0 0 40px ${accent}33`, height: "20rem" }}>
      {photos.map((url, i) => (
        <img key={url} src={url} alt="Slow Roll Minneapolis ride" className="absolute inset-0 w-full h-full object-cover block" style={{ opacity: i === idx ? 1 : 0, transition: "opacity 1.4s ease-in-out" }} />
      ))}
      <figcaption className="absolute left-0 right-0 bottom-0 px-4 py-3" style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", background: "linear-gradient(180deg, transparent, rgba(15,10,8,0.85))" }}>
        Photo: Tom Evers /{" "}
        <a href="https://mplsparksfoundation.org/slow-roll-joy/" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", textDecoration: "underline" }}>
          Minneapolis Parks Foundation
        </a>
      </figcaption>
    </figure>
  );
};
const PhotoCarousels = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <CarouselFrame photos={CAROUSEL_PHOTOS} accent={C.yellow} offset={0} />
    <CarouselFrame photos={CAROUSEL_PHOTOS} accent={C.magenta} offset={3} />
  </div>
);

const ThemeCard = ({ labelKey, labelDefault, headKey, headDefault, bodyKey, bodyDefault, accent }: { labelKey: string; labelDefault: string; headKey: string; headDefault: string; bodyKey: string; bodyDefault: string; accent: string }) => (
  <NeonCard accent={accent}>
    <p className="uppercase font-bold mb-3" style={{ letterSpacing: "0.18em", fontSize: 11, color: accent, textShadow: `0 0 10px ${accent}` }}>
      <EditableText settingKey={labelKey} defaultText={labelDefault} as="span" />
    </p>
    <h3 className="mb-3" style={{ ...displayFont, fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
      <EditableText settingKey={headKey} defaultText={headDefault} as="span" />
    </h3>
    <p style={{ fontSize: 15.5, lineHeight: 1.65, color: "rgba(255,255,255,0.82)" }}>
      <EditableText settingKey={bodyKey} defaultText={bodyDefault} as="span" multiline />
    </p>
  </NeonCard>
);

const Theme = () => (
  <DarkPanel>
    <div className="max-w-5xl mx-auto">
      <div className="max-w-3xl mb-12">
        <p className="uppercase font-bold mb-4" style={{ letterSpacing: "0.22em", fontSize: 12, color: C.yellow, textShadow: `0 0 10px ${C.yellow}` }}>
          <EditableText settingKey="sr_theme_eyebrow" defaultText="The theme" as="span" />
        </p>
        <h2 className="mb-5" style={{ ...displayFont, fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, color: "#fff", lineHeight: 1.05 }}>
          <EditableText settingKey="sr_theme_headline" defaultText="The story of Minneapolis, told from a bike." as="span" />
        </h2>
        <p style={{ fontSize: 17, lineHeight: 1.7, color: "rgba(255,255,255,0.85)" }}>
          <EditableText settingKey="sr_theme_intro" defaultText="Here's what's here, and here's the story behind it. Light stops and heavier ones, woven together. Not a lecture, just the full texture of the city." as="span" multiline />
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ThemeCard accent={C.yellow}
          labelKey="sr_theme_c1_label" labelDefault="PUBLIC WATER"
          headKey="sr_theme_c1_head" headDefault="A lakefront that belongs to everyone."
          bodyKey="sr_theme_c1_body"
          bodyDefault="Minnesota's history of public waterway access is rare in this country. The entire Minneapolis lakefront is public land, and that fact is worth knowing before you ride past it." />
        <ThemeCard accent={C.magenta}
          labelKey="sr_theme_c2_label" labelDefault="POOLS & POLICY"
          headKey="sr_theme_c2_head" headDefault="Segregated pools, and who swims today."
          bodyKey="sr_theme_c2_body"
          bodyDefault="Minneapolis has a real history of segregated public pools, and that policy history still echoes in who learns to swim and who feels welcome at the water. We tell it straight, not as trivia." />
        <ThemeCard accent={C.yellow}
          labelKey="sr_theme_c3_label" labelDefault="RECLAIMED LAND"
          headKey="sr_theme_c3_head" headDefault="A waterway uncovered, a neighborhood rebuilt."
          bodyKey="sr_theme_c3_body"
          bodyDefault="An affordable-housing community here was built over a formerly covered urban waterway. When it was redeveloped, the waterway was uncovered, replanted with prairie grass, and the housing went back in around it. Proof that reclamation is possible." />
        <ThemeCard accent={C.magenta}
          labelKey="sr_theme_c4_label" labelDefault="MUSIC & TRAILS"
          headKey="sr_theme_c4_head" headDefault="Prince, First Avenue, and rails turned into trails."
          bodyKey="sr_theme_c4_body"
          bodyDefault="Minneapolis music history runs deep: Prince, Lake Minnetonka, First Avenue. The city's rails-to-trails success is another quiet win. The ride isn't all heavy. This is the lighter thread." />
      </div>
    </div>
  </DarkPanel>
);

const Guide = () => (
  <DarkPanel>
    <div className="max-w-5xl mx-auto">
      <p className="uppercase font-bold mb-4 text-center" style={{ letterSpacing: "0.22em", fontSize: 12, color: C.magenta, textShadow: `0 0 10px ${C.magenta}` }}>
        <EditableText settingKey="sr_guide_eyebrow" defaultText="Meet your guide" as="span" />
      </p>
      <h2 className="mb-12 text-center" style={{ ...displayFont, fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, color: "#fff", lineHeight: 1.05 }}>
        <EditableText settingKey="sr_guide_headline" defaultText="Anthony Taylor." as="span" />
      </h2>
      <div className="rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[minmax(0,360px)_1fr] gap-0" style={{ background: "rgba(20,15,12,0.72)", border: `1px solid ${C.yellow}55`, boxShadow: `0 0 60px ${C.yellow}22` }}>
        <img
          src="https://i0.wp.com/spokesman-recorder.com/wp-content/uploads/2021/10/slow-roll-bike-ride-Anthony-Taylor.jpg"
          alt="Anthony Taylor leading a past Slow Roll ride in Minneapolis"
          className="w-full h-full object-cover"
          style={{ minHeight: 360 }}
        />
        <div className="p-6 md:p-8">
          <h3 className="mb-2" style={{ ...displayFont, fontSize: 28, fontWeight: 800, color: C.yellow, textShadow: `0 0 14px ${C.yellow}` }}>
            <EditableText settingKey="sr_guide_name" defaultText="Anthony Taylor" as="span" />
          </h3>
          <p className="uppercase font-medium mb-5" style={{ letterSpacing: "0.16em", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
            <EditableText settingKey="sr_guide_title" defaultText="Ride Leader · Advocate · Minneapolis" as="span" />
          </p>
          <div className="space-y-4" style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.88)" }}>
            <p>
              <EditableText settingKey="sr_guide_p1" defaultText="Anthony Taylor leads this ride. Founder of Slow Roll Twin Cities with the Cultural Wellness Center, co-founder of the Major Taylor Bicycling Club of Minnesota, and a nationally recognized advocate for equity in the outdoors and mobility justice." as="span" multiline />
            </p>
            <p>
              <EditableText settingKey="sr_guide_p2" defaultText="He's led Slow Rolls through Minneapolis for years. This isn't a one-off. It's his life's work, and we're honored he's showing us the city." as="span" multiline />
            </p>
          </div>
          <p className="mt-4" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Photo: Minnesota Spokesman-Recorder</p>
        </div>
      </div>
    </div>
  </DarkPanel>
);

const PartnerCard = ({ nameKey, nameDefault, descKey, descDefault, logoUrl, logoAlt, href, accent }: { nameKey: string; nameDefault: string; descKey: string; descDefault: string; logoUrl?: string; logoAlt: string; href?: string; accent: string }) => {
  const inner = (
    <NeonCard accent={accent}>
      <div className="mb-5 flex items-center justify-center rounded-xl" style={{ height: 110, background: "#fff", border: `1px solid ${accent}55` }}>
        {logoUrl ? (
          <img src={logoUrl} alt={logoAlt} className="max-h-20 max-w-[75%] object-contain" />
        ) : (
          <span className="uppercase font-medium" style={{ letterSpacing: "0.16em", fontSize: 11, color: C.mutedDark }}>Logo pending</span>
        )}
      </div>
      <h3 className="mb-2" style={{ ...displayFont, fontSize: 18, fontWeight: 700, color: "#fff" }}>
        <EditableText settingKey={nameKey} defaultText={nameDefault} as="span" />
      </h3>
      <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "rgba(255,255,255,0.75)" }}>
        <EditableText settingKey={descKey} defaultText={descDefault} as="span" multiline />
      </p>
    </NeonCard>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block transition-transform hover:-translate-y-1">{inner}</a>
  ) : inner;
};

const alsoLogo = "/__l5e/assets-v1/b06c9430-a522-4188-bdd1-333d9b3b5005/also-logo.webp";

const Partners = () => (
  <DarkPanel>
    <div className="max-w-5xl mx-auto">
      <p className="uppercase font-bold mb-4 text-center" style={{ letterSpacing: "0.22em", fontSize: 12, color: C.magenta, textShadow: `0 0 10px ${C.magenta}` }}>
        <EditableText settingKey="sr_partners_eyebrow" defaultText="Partners" as="span" />
      </p>
      <h2 className="mb-12 text-center" style={{ ...displayFont, fontSize: "clamp(30px, 4.5vw, 48px)", fontWeight: 800, color: "#fff", lineHeight: 1.05 }}>
        <EditableText settingKey="sr_partners_headline" defaultText="Made possible by." as="span" />
      </h2>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PartnerCard accent={C.magenta}
          nameKey="sr_p1_name" nameDefault="Slow Roll MSP / Cultural Wellness Center"
          descKey="sr_p1_desc" descDefault="The ride organizer, led by Anthony Taylor."
          logoUrl={slowRollLogo.url} logoAlt="Slow Roll Twin Cities" href={SLOWROLL_FB_URL} />
        <PartnerCard accent={C.yellow}
          nameKey="sr_p2_name" nameDefault="ALSO"
          descKey="sr_p2_desc" descDefault="E-bikes provided for the ride. Several loaners available on-site for anyone who doesn't bring their own."
          logoUrl={alsoLogo} logoAlt="ALSO" href="https://ridealso.com" />
        <PartnerCard accent={C.yellow}
          nameKey="sr_p3_name" nameDefault="Basecamp Jobs"
          descKey="sr_p3_desc" descDefault="Where the outdoor industry finds its people. Powering the connections behind the ride."
          logoUrl={basecampMatchLogo.url} logoAlt="Basecamp Jobs" href="https://basecampjobs.com" />
      </div>
    </div>
  </DarkPanel>
);

const DetailRow = ({ labelKey, labelDefault, valueKey, valueDefault }: { labelKey: string; labelDefault: string; valueKey: string; valueDefault: string }) => (
  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
    <div className="uppercase font-bold" style={{ letterSpacing: "0.16em", fontSize: 11, color: C.yellow, minWidth: 150, textShadow: `0 0 8px ${C.yellow}` }}>
      <EditableText settingKey={labelKey} defaultText={labelDefault} as="span" />
    </div>
    <div style={{ fontSize: 16, color: "#fff", lineHeight: 1.55 }}>
      <EditableText settingKey={valueKey} defaultText={valueDefault} as="span" multiline />
    </div>
  </div>
);

const Details = () => (
  <DarkPanel>
    <div className="max-w-3xl mx-auto">
      <p className="uppercase font-bold mb-4" style={{ letterSpacing: "0.22em", fontSize: 12, color: C.magenta, textShadow: `0 0 10px ${C.magenta}` }}>
        <EditableText settingKey="sr_details_eyebrow" defaultText="The details" as="span" />
      </p>
      <h2 className="mb-10" style={{ ...displayFont, fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, color: "#fff", lineHeight: 1.05 }}>
        <EditableText settingKey="sr_details_headline" defaultText="Everything you need." as="span" />
      </h2>
      <div className="rounded-2xl p-6 md:p-8" style={{ background: "rgba(20,15,12,0.72)", border: `1px solid ${C.yellow}55`, boxShadow: `0 0 40px ${C.yellow}22` }}>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <DetailRow labelKey="sr_det_date_l" labelDefault="Date" valueKey="sr_det_date_v" valueDefault="Wednesday, August 19, 2026" />
          <DetailRow labelKey="sr_det_time_l" labelDefault="Time" valueKey="sr_det_time_v" valueDefault="Evening. Exact start TBD." />
          <DetailRow labelKey="sr_det_start_l" labelDefault="Start" valueKey="sr_det_start_v" valueDefault="Near the Minneapolis Convention Center. Exact spot TBD." />
          <DetailRow labelKey="sr_det_cap_l" labelDefault="Capacity" valueKey="sr_det_cap_v" valueDefault="Capped at 100 riders." />
          <DetailRow labelKey="sr_det_bring_l" labelDefault="What to bring" valueKey="sr_det_bring_v" valueDefault="Your own bike, or borrow one of the ALSO e-bikes provided on-site. No bike required to join." />
          <DetailRow labelKey="sr_det_cost_l" labelDefault="Cost" valueKey="sr_det_cost_v" valueDefault="Free and open to the public." />
        </div>
        <div className="mt-8">
          <CTAButton settingKey="sr_details_cta" defaultText="REGISTER — 100 SPOTS" size="lg" />
        </div>
      </div>
    </div>
  </DarkPanel>
);

const Watch = () => (
  <DarkPanel>
    <div className="max-w-3xl mx-auto">
      <p className="uppercase font-bold mb-4 text-center" style={{ letterSpacing: "0.22em", fontSize: 12, color: C.yellow, textShadow: `0 0 10px ${C.yellow}` }}>
        <EditableText settingKey="sr_watch_eyebrow" defaultText="Watch" as="span" />
      </p>
      <h2 className="mb-8 text-center" style={{ ...displayFont, fontSize: "clamp(30px, 4.5vw, 48px)", fontWeight: 800, color: "#fff", lineHeight: 1.05 }}>
        <EditableText settingKey="sr_watch_headline" defaultText="Hear it from Anthony." as="span" />
      </h2>


      <div className="w-full rounded-2xl overflow-hidden" style={{ aspectRatio: "16 / 9", border: `1px solid ${C.magenta}55`, boxShadow: `0 0 40px ${C.magenta}33` }}>
        <iframe
          src="https://www.youtube.com/embed/4sTkjejTZPA"
          title="Bridging the gap: How Anthony Taylor is making outdoor recreation welcoming for all"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          style={{ border: 0 }}
        />
      </div>
      <p className="mt-4 text-center" style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
        <EditableText settingKey="sr_watch_caption" defaultText="MPR News · Bridging the gap: How Anthony Taylor is making outdoor recreation welcoming for all (1:42)." as="span" />
      </p>
    </div>
  </DarkPanel>
);

const FooterCTA = () => (
  <section style={{ background: "transparent", color: "#fff", position: "relative", overflow: "hidden" }} className="px-6 py-24 md:py-32">
    <NeonBlobs />
    <div aria-hidden style={{ position: "absolute", inset: 0, background: `${C.midnight}e8` }} />
    <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: `linear-gradient(${C.magenta} 1px, transparent 1px), linear-gradient(90deg, ${C.magenta} 1px, transparent 1px)`, backgroundSize: "60px 60px", maskImage: "radial-gradient(circle at 50% 50%, black 30%, transparent 75%)" }} />
    <div className="max-w-3xl mx-auto text-center relative z-10">
      <div className="mb-6">
        <Badge settingKey="sr_footer_pill" defaultText="OFFICIAL OUTDOOR RETAILER EVENT" />
      </div>
      <h2 className="mb-5" style={{ ...displayFont, fontSize: "clamp(40px, 7vw, 84px)", fontWeight: 900, color: "#fff", lineHeight: 0.95, letterSpacing: "-0.02em", textShadow: `0 0 30px ${C.magenta}, 0 0 60px ${C.yellow}55` }}>
        <EditableText settingKey="sr_footer_headline" defaultText="COME RIDE WITH US." as="span" />
      </h2>
      <p className="mb-8 font-bold" style={{ fontSize: 16, color: "#fff", letterSpacing: "0.08em", opacity: 0.95, textShadow: `0 0 10px ${C.yellow}66` }}>
        <EditableText settingKey="sr_footer_capline" defaultText="ONLY 100 SPOTS · BRING A BIKE OR BORROW ONE" as="span" />
      </p>
      <div className="mb-10">
        <CTAButton settingKey="sr_footer_cta" defaultText="REGISTER — 100 SPOTS" size="lg" />
      </div>
      <div className="pt-8 space-y-2" style={{ borderTop: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
        <p>
          <EditableText settingKey="sr_footer_presented" defaultText="Presented by Basecamp Outdoor and Slow Roll MSP." as="span" />
        </p>
        <p>
          <a href="mailto:jenna@wearetheoutdoorindustry.com" className="underline hover:text-white transition-colors" style={{ color: "#fff" }}>
            jenna@wearetheoutdoorindustry.com
          </a>
        </p>
      </div>
    </div>
  </section>
);

const EventSlowRoll = () => (
  <EditableTextProvider pageSlug="slow-roll">
    <PageMetaApplier title="Slow Roll x Basecamp · Minneapolis · Aug 19, 2026" />
    <NeonStyles />
    <main style={{ ...font, background: `linear-gradient(180deg, ${C.midnight}, ${C.midnight2} 45%, ${C.midnight})`, color: "#fff", position: "relative", overflow: "hidden" }}>
      <BikePathSpine />
      <div style={{ position: "relative", zIndex: 2 }}>
        <OrderedSections
          sections={[
            { key: "hero", content: <Hero /> },
            { key: "what", content: <WhatItIs /> },
            { key: "guide", content: <Guide /> },
            { key: "partners", content: <Partners /> },
            { key: "details", content: <Details /> },
            { key: "watch", content: <Watch /> },
            { key: "footer", content: <FooterCTA /> },
          ]}
        />
      </div>
    </main>
  </EditableTextProvider>
);

export default EventSlowRoll;
