import { useEffect, useState } from "react";
import { EditableTextProvider } from "@/components/EditableTextProvider";
import EditableText from "@/components/EditableText";
import PageMetaApplier from "@/components/event/PageMetaApplier";
import OrderedSections from "@/components/event/OrderedSections";
import northCommons from "@/assets/slowroll/north-commons.png.asset.json";
import slowRollLogo from "@/assets/slowroll/logo.jpg.asset.json";
import basecampMatchLogo from "@/assets/mn26/sponsors/basecamp-match-logo.png.asset.json";
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
    @keyframes sr-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    @keyframes sr-pack { 
      0%   { transform: translateX(110%); }
      35%  { transform: translateX(-110%); }
      100% { transform: translateX(-110%); }
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

const BikePackDivider = () => (
  <div style={{ background: C.midnight, borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
    <BikePack height={54} bikeSize={34} cycle={12} count={7} seed={2} />
  </div>
);

/* ============ SCENERY DECOS for the winding page spine ============ */
const SkylineDeco = () => (
  <svg width="220" height="90" viewBox="0 0 220 90" fill="none" style={{ filter: `drop-shadow(0 0 8px ${C.yellow}77)` }}>
    <g stroke={C.yellow} strokeWidth="1.3" fill="none">
      <rect x="4" y="40" width="16" height="46" />
      <rect x="24" y="28" width="14" height="58" />
      <rect x="42" y="16" width="18" height="70" />
      <rect x="64" y="34" width="14" height="52" />
      <rect x="82" y="20" width="18" height="66" />
      <rect x="104" y="36" width="14" height="50" />
      <rect x="122" y="6" width="20" height="80" />
      <rect x="146" y="26" width="14" height="60" />
      <rect x="164" y="38" width="16" height="48" />
      <rect x="184" y="30" width="14" height="56" />
    </g>
    <g fill={C.yellow} opacity="0.7">
      {[12, 30, 50, 70, 90, 110, 132, 152, 172, 190].map((x, i) => (
        <rect key={i} x={x} y={12 + (i * 4) % 20} width="2" height="2" />
      ))}
    </g>
  </svg>
);

const LakeDeco = () => (
  <svg width="240" height="70" viewBox="0 0 240 70" fill="none" style={{ filter: `drop-shadow(0 0 6px ${C.yellow}55)` }}>
    <ellipse cx="120" cy="52" rx="110" ry="12" stroke={C.yellow} strokeWidth="1.3" fill="none" />
    <path d="M 30 40 Q 45 36 60 40 T 90 40 T 120 40 T 150 40 T 180 40 T 210 40" stroke={C.yellow} strokeWidth="0.9" fill="none" opacity="0.75" />
    <path d="M 50 26 Q 65 22 80 26 T 110 26 T 140 26 T 170 26 T 195 26" stroke={C.yellow} strokeWidth="0.8" fill="none" opacity="0.55" />
    <path d="M 70 14 Q 85 10 100 14 T 130 14 T 160 14" stroke={C.yellow} strokeWidth="0.7" fill="none" opacity="0.4" />
  </svg>
);

const TreesDeco = () => (
  <svg width="220" height="110" viewBox="0 0 220 110" fill="none" style={{ filter: `drop-shadow(0 0 6px ${C.yellow}66)` }}>
    {[20, 55, 90, 130, 170, 200].map((x, i) => (
      <g key={i} stroke={C.yellow} strokeWidth="1.2" fill="none">
        <path d={`M ${x - 16} 74 L ${x} 20 L ${x + 16} 74 Z`} />
        <path d={`M ${x - 12} 56 L ${x} 32 L ${x + 12} 56`} />
        <path d={`M ${x - 8} 42 L ${x} 22 L ${x + 8} 42`} />
        <line x1={x} y1="74" x2={x} y2="94" />
      </g>
    ))}
  </svg>
);

const BridgeDeco = () => (
  <svg width="260" height="110" viewBox="0 0 260 110" fill="none" style={{ filter: `drop-shadow(0 0 6px ${C.magenta}77)` }}>
    <path d="M 10 82 Q 130 10 250 82" stroke={C.magenta} strokeWidth="1.6" fill="none" />
    <path d="M 10 88 L 250 88" stroke={C.magenta} strokeWidth="1.2" />
    <line x1="10" y1="82" x2="10" y2="102" stroke={C.magenta} strokeWidth="1.2" />
    <line x1="250" y1="82" x2="250" y2="102" stroke={C.magenta} strokeWidth="1.2" />
    {[40, 70, 100, 130, 160, 190, 220].map((x, i) => {
      const t = (x - 130) / 120;
      const y = 82 - (1 - t * t) * 70;
      return <line key={i} x1={x} y1={y} x2={x} y2="88" stroke={C.magenta} strokeWidth="0.7" opacity="0.65" />;
    })}
  </svg>
);

/* Continuous winding SVG spine (dashed yellow bike-lane feel), plus scenery
   anchored at section-fraction offsets, plus a small pack of bikes cruising the path. */
const BikePathSpine = () => (
  <>
    <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        style={{ position: "absolute", inset: 0, opacity: 0.45 }}
      >
        <defs>
          <path id="sr-spine-path" d="M 90 0 C 88 8, 12 14, 12 22 S 88 32, 88 42 S 12 52, 12 62 S 88 72, 88 82 S 12 92, 12 100" />
        </defs>
        <use href="#sr-spine-path" stroke={C.yellow} strokeWidth="0.35" strokeDasharray="0.9 1.2" fill="none" />
      </svg>
    </div>

    {/* Scenery pinned at section-fraction offsets (no distortion, plain HTML) */}
    <div aria-hidden style={{ position: "absolute", top: "14%", right: "4%", pointerEvents: "none", zIndex: 1, opacity: 0.4 }}>
      <SkylineDeco />
    </div>
    <div aria-hidden style={{ position: "absolute", top: "34%", left: "4%", pointerEvents: "none", zIndex: 1, opacity: 0.4 }}>
      <LakeDeco />
    </div>
    <div aria-hidden style={{ position: "absolute", top: "56%", right: "4%", pointerEvents: "none", zIndex: 1, opacity: 0.45 }}>
      <TreesDeco />
    </div>
    <div aria-hidden style={{ position: "absolute", top: "77%", left: "4%", pointerEvents: "none", zIndex: 1, opacity: 0.45 }}>
      <BridgeDeco />
    </div>
  </>
);

const Hero = () => (
  <section style={{ position: "relative", background: C.midnight, color: "#fff" }} className="px-6 py-24 md:py-32 overflow-hidden">
    <div aria-hidden style={{
      position: "absolute", inset: 0,
      background: `radial-gradient(ellipse at 50% 25%, rgba(237,118,96,0.14), transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(225,182,36,0.10), transparent 55%), ${C.midnight}`,
    }} />
    <NeonBlobs />

    <div className="max-w-5xl mx-auto text-center relative z-10">
      <div className="mb-8">
        <Badge settingKey="sr_hero_pill" defaultText="OFFICIAL OUTDOOR RETAILER EVENT" />
      </div>
      <p className="uppercase font-bold mb-6" style={{ letterSpacing: "0.3em", fontSize: 12, color: "#fff", opacity: 0.85 }}>
        <EditableText settingKey="sr_hero_eyebrow" defaultText="Basecamp Outdoor × Slow Roll" as="span" />
      </p>

      {/* Headline: SLOW ROLL in white, bike pack rolls between, then Basecamp Match logo */}
      <div style={{ ...displayFont, fontSize: "clamp(52px, 10vw, 128px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", lineHeight: 0.95 }} className="mb-6">
        <div style={{ textShadow: "0 0 24px rgba(255,255,255,0.35), 0 0 60px rgba(237,118,96,0.25)" }}>
          <EditableText settingKey="sr_hero_headline_a" defaultText="SLOW " as="span" />
          <EditableText settingKey="sr_hero_headline_b" defaultText="ROLL" as="span" />
        </div>
        <div style={{ margin: "22px 0" }}>
          <BikePack height={72} bikeSize={48} cycle={10} count={6} seed={0} />
        </div>
        <div className="flex items-center justify-center">
          <img
            src={basecampMatchLogo.url}
            alt="Basecamp Match"
            style={{ height: "clamp(64px, 10vw, 128px)", width: "auto", filter: "drop-shadow(0 0 16px rgba(237,118,96,0.45))" }}
          />
        </div>
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
  <section id={id} style={{ background: C.midnight, color: "#fff", position: "relative", overflow: "hidden" }} className="px-6 py-24 md:py-28">
    <NeonBlobs />
    <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.02, backgroundImage: `linear-gradient(${C.yellow} 1px, transparent 1px), linear-gradient(90deg, ${C.yellow} 1px, transparent 1px)`, backgroundSize: "80px 80px" }} />
    <div className="relative z-10">{children}</div>
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
      {/* Bike pack rolls through the "Made possible by" area too */}
      <div className="mb-10">
        <BikePack height={54} bikeSize={36} cycle={13} count={6} seed={4} />
      </div>
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
      {/* Bike pack rolls through the Watch section as well */}
      <div className="mb-8">
        <BikePack height={54} bikeSize={34} cycle={14} count={5} seed={7} />
      </div>
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
  <section style={{ background: C.midnight, color: "#fff", position: "relative", overflow: "hidden" }} className="px-6 py-24 md:py-32">
    <NeonBlobs />
    <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.08, backgroundImage: `linear-gradient(${C.magenta} 1px, transparent 1px), linear-gradient(90deg, ${C.magenta} 1px, transparent 1px)`, backgroundSize: "60px 60px", maskImage: "radial-gradient(circle at 50% 50%, black 30%, transparent 75%)" }} />
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
    <main style={{ ...font, background: C.midnight, color: "#fff", position: "relative", overflow: "hidden" }}>
      <BikePathSpine />
      <div style={{ position: "relative", zIndex: 2 }}>
        <OrderedSections
          sections={[
            { key: "hero", content: <><Hero /><BikePackDivider /></> },
            { key: "what", content: <WhatItIs /> },
            { key: "theme", content: <Theme /> },
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
