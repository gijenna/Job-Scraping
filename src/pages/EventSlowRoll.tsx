import { useEffect, useState } from "react";
import { EditableTextProvider } from "@/components/EditableTextProvider";
import EditableText from "@/components/EditableText";
import PageMetaApplier from "@/components/event/PageMetaApplier";
import OrderedSections from "@/components/event/OrderedSections";
import heroPhoto from "@/assets/slowroll/hero.jpg.asset.json";
import cwBikeLights from "@/assets/slowroll/light-up-the-night.png.asset.json";
import northCommons from "@/assets/slowroll/north-commons.png.asset.json";
import slowRollLogo from "@/assets/slowroll/logo.jpg.asset.json";
import basecampJobsLogo from "@/assets/mn26/sponsors/basecamp-match-logo.png.asset.json";
import mpfH1 from "@/assets/slowroll/mpf-h1.jpg.asset.json";
import mpfH2 from "@/assets/slowroll/mpf-h2.png.asset.json";
import mpfH3 from "@/assets/slowroll/mpf-h3.png.asset.json";
import mpfH4 from "@/assets/slowroll/mpf-h4.jpg.asset.json";
import mpfH5 from "@/assets/slowroll/mpf-h5.png.asset.json";
import mpfH6 from "@/assets/slowroll/mpf-h6.png.asset.json";
import mpfH7 from "@/assets/slowroll/mpf-h7.png.asset.json";

// North Commons leads. Rest rotate behind it.
const HERO_PHOTOS = [northCommons.url, mpfH1.url, mpfH4.url, mpfH2.url, mpfH3.url, mpfH5.url, mpfH6.url, mpfH7.url];

// Brand neon palette — Coral + Yellow + ALSO purple, with a touch of cyan for water.
// Warm near-black base so photos and neon both breathe.
const C = {
  midnight: "#0f0a08",       // warm near-black base
  midnight2: "#1a120f",      // panel base
  ink: "#0f0a08",
  paper: "#faf7f2",
  paperLine: "#e2ddd2",
  muted: "#8a8578",
  mutedDark: "#5b5f57",
  // Brand neons
  magenta: "#ED7660",        // Basecamp coral — primary neon
  cyan: "#38d6e6",           // touch of cyan for water references
  yellow: "#E1B624",         // Basecamp yellow — secondary neon
  lime: "#a855f7",           // ALSO purple — tertiary neon
  // Legacy roles
  primary: "#ED7660",
  primaryGlow: "0 0 22px rgba(237,118,96,0.55)",
  cyanGlow: "0 0 20px rgba(56,214,230,0.45)",
  yellowGlow: "0 0 22px rgba(225,182,36,0.55)",
};

const REGISTER_URL = "https://basecampoutdoor.typeform.com/to/yumTbpY7";
const SLOWROLL_FB_URL = "https://www.facebook.com/SlowRollTC/";

const font = { fontFamily: "'Inter', system-ui, sans-serif" };
const displayFont = { fontFamily: "'Unbounded', 'Inter', system-ui, sans-serif" };

const Badge = ({
  settingKey,
  defaultText,
  variant = "solid",
}: {
  settingKey: string;
  defaultText: string;
  variant?: "solid" | "outline";
}) => (
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

const CTAButton = ({
  settingKey,
  defaultText,
  size = "md",
}: {
  settingKey: string;
  defaultText: string;
  size?: "md" | "lg";
}) => (
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
      boxShadow: `0 0 0 2px rgba(255,255,255,0.06), 0 10px 40px rgba(255,45,149,0.45), 0 0 60px rgba(245,217,10,0.25)`,
    }}
  >
    <EditableText settingKey={settingKey} defaultText={defaultText} as="span" />
  </a>
);

/* Global keyframes for glow, path, blobs, bike ticker */
const NeonStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700;800;900&display=swap');
    @keyframes sr-pulse { 0%,100% { opacity:.85; filter:brightness(1) } 50% { opacity:1; filter:brightness(1.15) } }
    @keyframes sr-drift { 0% { transform: translate(0,0) scale(1) } 50% { transform: translate(20px,-15px) scale(1.05) } 100% { transform: translate(0,0) scale(1) } }
    @keyframes sr-dash { to { stroke-dashoffset: -240; } }
    @keyframes sr-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    @keyframes sr-bike-lane { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    @keyframes sr-headlight { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
    .sr-neon-text { text-shadow: 0 0 12px currentColor, 0 0 28px currentColor; }
    .sr-path-dash { stroke-dasharray: 14 12; animation: sr-dash 6s linear infinite; }
  `}</style>
);

const NeonBlobs = () => (
  <>
    <div aria-hidden style={{
      position: "absolute", width: 520, height: 520, borderRadius: "50%",
      background: `radial-gradient(circle, ${C.magenta}33 0%, transparent 65%)`,
      filter: "blur(50px)", top: -160, left: -120, animation: "sr-drift 18s ease-in-out infinite",
      pointerEvents: "none",
    }} />
    <div aria-hidden style={{
      position: "absolute", width: 480, height: 480, borderRadius: "50%",
      background: `radial-gradient(circle, ${C.lime}2a 0%, transparent 65%)`,
      filter: "blur(60px)", bottom: -200, right: -140, animation: "sr-drift 22s ease-in-out infinite reverse",
      pointerEvents: "none",
    }} />
  </>
);

/* Bike with a glowing headlight + taillight — used in the endless ticker */
const LitBike = ({ size = 40, color, light = "#E1B624" }: { size?: number; color: string; light?: string }) => (
  <svg width={size} height={size * 0.62} viewBox="0 0 64 40" fill="none" style={{ display: "block", overflow: "visible" }}>
    <ellipse cx="60" cy="22" rx="10" ry="3" fill={light} opacity="0.55" style={{ filter: `blur(4px)` }} />
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

/* Endless dense pack of lit bikes rolling across. Focal point in hero + section divider. */
const BikeTicker = ({ height = 56, bikeSize = 40, speed = 22 }: { height?: number; bikeSize?: number; speed?: number }) => {
  const colors = [C.yellow, C.magenta, C.lime, C.cyan, C.yellow, C.magenta, C.lime, C.yellow, C.magenta, C.cyan, C.yellow, C.lime];
  const pack = [...colors, ...colors];
  return (
    <div style={{ position: "relative", height, overflow: "hidden", width: "100%" }}>
      <div aria-hidden style={{
        position: "absolute", left: 0, right: 0, bottom: Math.round(height * 0.28), height: 1,
        background: `linear-gradient(90deg, transparent, ${C.yellow}, ${C.magenta}, ${C.lime}, transparent)`,
        opacity: 0.55, filter: `drop-shadow(0 0 6px ${C.yellow})`,
      }} />
      <div style={{
        display: "flex", alignItems: "flex-end", height: "100%", width: "max-content",
        animation: `sr-bike-lane ${speed}s linear infinite`,
      }}>
        {pack.map((col, i) => (
          <div key={i} style={{ padding: "0 14px", display: "flex", alignItems: "flex-end", height: "100%" }}>
            <LitBike size={bikeSize} color={col} light={i % 3 === 0 ? C.cyan : C.yellow} />
          </div>
        ))}
      </div>
    </div>
  );
};

const BikePathDivider = () => (
  <div style={{ background: C.midnight, borderTop: `1px solid rgba(255,255,255,0.06)`, borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
    <BikeTicker height={52} bikeSize={34} speed={26} />
  </div>
);

const Hero = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % HERO_PHOTOS.length), 5000);
    return () => clearInterval(id);
  }, []);
  return (
    <section
      style={{ position: "relative", background: C.midnight, color: "#fff" }}
      className="px-6 py-24 md:py-32 overflow-hidden"
    >
      {HERO_PHOTOS.map((url, i) => (
        <div
          key={url}
          aria-hidden
          style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${url})`,
            backgroundSize: "cover", backgroundPosition: "center",
            opacity: i === idx ? 0.75 : 0,
            transition: "opacity 1.6s ease-in-out",
          }}
        />
      ))}
      {/* warm dark wash — keeps photo visible while text stays legible */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(180deg, rgba(15,10,8,0.55) 0%, rgba(15,10,8,0.35) 45%, rgba(15,10,8,0.85) 100%)`,
      }} />
      <NeonBlobs />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="mb-8">
          <Badge settingKey="sr_hero_pill" defaultText="OFFICIAL OUTDOOR RETAILER EVENT" />
        </div>
        <p
          className="uppercase font-bold mb-6"
          style={{ letterSpacing: "0.3em", fontSize: 12, color: C.cyan, textShadow: `0 0 14px ${C.cyan}` }}
        >
          <EditableText settingKey="sr_hero_eyebrow" defaultText="Basecamp Outdoor × Slow Roll" as="span" />
        </p>
        <h1
          className="leading-[0.95] mb-8"
          style={{
            ...displayFont,
            fontSize: "clamp(52px, 10vw, 128px)",
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "-0.02em",
            textShadow: `0 0 30px rgba(255,45,149,0.55), 0 0 80px rgba(0,230,255,0.35)`,
          }}
        >
          <EditableText settingKey="sr_hero_headline_a" defaultText="SLOW " as="span" />
          <span style={{ color: C.yellow, textShadow: `0 0 24px ${C.yellow}, 0 0 60px ${C.yellow}` }}>
            <EditableText settingKey="sr_hero_headline_b" defaultText="ROLL" as="span" />
          </span>
          <br />
          <span style={{ ...displayFont, fontSize: "0.5em", fontWeight: 700, color: C.magenta, textShadow: `0 0 22px ${C.magenta}` }}>
            <EditableText settingKey="sr_hero_headline_c" defaultText="× BASECAMP" as="span" />
          </span>
        </h1>
        <p className="mb-3" style={{ fontSize: 19, color: "#fff", fontWeight: 500 }}>
          <EditableText
            settingKey="sr_hero_subline"
            defaultText="MINNEAPOLIS · WED AUG 19, 2026 · AFTER DARK"
            as="span"
          />
        </p>
        <p className="mb-8 font-bold" style={{ fontSize: 16, color: C.lime, letterSpacing: "0.06em", textShadow: `0 0 12px ${C.lime}` }}>
          <EditableText
            settingKey="sr_hero_capline"
            defaultText="ONLY 100 RIDERS · BRING A BIKE OR BORROW ONE"
            as="span"
          />
        </p>
        <p
          className="max-w-2xl mx-auto mb-10"
          style={{ fontSize: 17, lineHeight: 1.65, color: "rgba(255,255,255,0.9)" }}
        >
          <EditableText
            settingKey="sr_hero_pitch"
            defaultText="A curated 90-minute community bike ride through Minneapolis. Not a race. A moving experience with stops for stories about the city's history of public land access, equity, and outdoor culture, ending in a DJ set and a community meal. Open to everyone. No OR badge required."
            as="span"
            multiline
          />
        </p>
        <CTAButton settingKey="sr_hero_cta" defaultText="REGISTER — 100 SPOTS" size="lg" />
        <p className="mt-8" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
          Lead photo: Tom Evers /{" "}
          <a
            href="https://mplsparksfoundation.org/slow-roll-joy/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: C.cyan, textDecoration: "underline" }}
          >
            Minneapolis Parks Foundation
          </a>
        </p>
      </div>
    </section>
  );
};

/* Marquee ticker — joy, community, art, lights */
const Marquee = () => {
  const items = [
    "SLOW ROLL", "COMMUNITY", "LIGHTS ON", "MINNEAPOLIS", "RIDE JOY", "PUBLIC WATER",
    "DJ + MEAL", "BRING A BIKE", "AFTER DARK", "NO RACE", "MOVING STORIES", "ALL WELCOME",
  ];
  const row = [...items, ...items];
  return (
    <div style={{ background: C.midnight2, borderTop: `1px solid ${C.magenta}`, borderBottom: `1px solid ${C.cyan}`, overflow: "hidden", position: "relative" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${C.midnight2} 0%, transparent 8%, transparent 92%, ${C.midnight2} 100%)`, zIndex: 2, pointerEvents: "none" }} />
      <div style={{ display: "flex", whiteSpace: "nowrap", animation: "sr-marquee 40s linear infinite", padding: "18px 0" }}>
        {row.map((t, i) => (
          <span key={i} style={{
            ...displayFont, fontWeight: 800, fontSize: 22, letterSpacing: "0.08em",
            color: i % 3 === 0 ? C.yellow : i % 3 === 1 ? C.cyan : C.magenta,
            padding: "0 28px", textShadow: `0 0 14px currentColor`,
          }}>
            {t} <span style={{ color: "rgba(255,255,255,0.35)", marginLeft: 20 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* Dark section frame with neon halo, replaces cream backgrounds for a wow feel */
const DarkPanel = ({ children, id }: { children: React.ReactNode; id?: string }) => (
  <section id={id} style={{ background: C.midnight, color: "#fff", position: "relative", overflow: "hidden" }} className="px-6 py-24 md:py-28">
    <NeonBlobs />
    <div aria-hidden style={{
      position: "absolute", inset: 0, opacity: 0.025,
      backgroundImage: `linear-gradient(${C.cyan} 1px, transparent 1px), linear-gradient(90deg, ${C.cyan} 1px, transparent 1px)`,
      backgroundSize: "80px 80px",
    }} />
    <div className="relative z-10">{children}</div>
  </section>
);

const NeonCard = ({ children, accent = C.magenta }: { children: React.ReactNode; accent?: string }) => (
  <div
    className="rounded-2xl p-6 md:p-7 h-full"
    style={{
      background: "rgba(19,18,53,0.7)",
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
        <p className="uppercase font-bold mb-4" style={{ letterSpacing: "0.22em", fontSize: 12, color: C.cyan, textShadow: `0 0 10px ${C.cyan}` }}>
          <EditableText settingKey="sr_what_eyebrow" defaultText="What it is" as="span" />
        </p>
        <h2 className="mb-6" style={{ ...displayFont, fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, color: "#fff", lineHeight: 1.05 }}>
          <EditableText
            settingKey="sr_what_headline"
            defaultText="A Critical Mass-style ride, at a humane pace."
            as="span"
          />
        </h2>
        <div className="space-y-5" style={{ fontSize: 17, lineHeight: 1.7, color: "rgba(255,255,255,0.85)" }}>
          <p>
            <EditableText
              settingKey="sr_what_p1"
              defaultText="Ninety minutes on two wheels. Riders don't know the exact route ahead of time, only the theme, so the pace stays comfortable for everyone from first-time riders to seasoned cyclists."
              as="span"
              multiline
            />
          </p>
          <p>
            <EditableText
              settingKey="sr_what_p2"
              defaultText="Volunteers hold intersections so the group moves as one. The ride stops along the way for short talks tied to the theme, and ends with a DJ and a free community meal."
              as="span"
              multiline
            />
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <figure className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.cyan}55`, boxShadow: `0 0 40px ${C.cyan}33` }}>
          <img src={cwBikeLights.url} alt="Cyclists lit up on a community night ride" className="w-full h-72 md:h-80 object-cover block" />
          <figcaption className="px-4 py-3" style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", background: C.midnight2 }}>
            Photo:{" "}
            <a href="https://sfbike.org/news/light-up-the-night-is-back-2/" target="_blank" rel="noopener noreferrer" style={{ color: C.cyan, textDecoration: "underline" }}>
              San Francisco Bicycle Coalition
            </a>
          </figcaption>
        </figure>
        <figure className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.magenta}55`, boxShadow: `0 0 40px ${C.magenta}33` }}>
          <img src={northCommons.url} alt="Slow Roll North Commons ride in Minneapolis" className="w-full h-72 md:h-80 object-cover block" />
          <figcaption className="px-4 py-3" style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", background: C.midnight2 }}>
            Photo: Tom Evers /{" "}
            <a href="https://mplsparksfoundation.org/slow-roll-joy/" target="_blank" rel="noopener noreferrer" style={{ color: C.magenta, textDecoration: "underline" }}>
              Minneapolis Parks Foundation
            </a>
          </figcaption>
        </figure>
      </div>
    </div>
  </DarkPanel>
);

const ThemeCard = ({
  labelKey, labelDefault, headKey, headDefault, bodyKey, bodyDefault, accent,
}: {
  labelKey: string; labelDefault: string;
  headKey: string; headDefault: string;
  bodyKey: string; bodyDefault: string;
  accent: string;
}) => (
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
          <EditableText
            settingKey="sr_theme_headline"
            defaultText="The story of Minneapolis, told from a bike."
            as="span"
          />
        </h2>
        <p style={{ fontSize: 17, lineHeight: 1.7, color: "rgba(255,255,255,0.8)" }}>
          <EditableText
            settingKey="sr_theme_intro"
            defaultText="Here's what's here, and here's the story behind it. Light stops and heavier ones, woven together. Not a lecture, just the full texture of the city."
            as="span"
            multiline
          />
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ThemeCard accent={C.cyan}
          labelKey="sr_theme_c1_label" labelDefault="PUBLIC WATER"
          headKey="sr_theme_c1_head" headDefault="A lakefront that belongs to everyone."
          bodyKey="sr_theme_c1_body"
          bodyDefault="Minnesota's history of public waterway access is rare in this country. The entire Minneapolis lakefront is public land, and that fact is worth knowing before you ride past it."
        />
        <ThemeCard accent={C.magenta}
          labelKey="sr_theme_c2_label" labelDefault="POOLS & POLICY"
          headKey="sr_theme_c2_head" headDefault="Segregated pools, and who swims today."
          bodyKey="sr_theme_c2_body"
          bodyDefault="Minneapolis has a real history of segregated public pools, and that policy history still echoes in who learns to swim and who feels welcome at the water. We tell it straight, not as trivia."
        />
        <ThemeCard accent={C.lime}
          labelKey="sr_theme_c3_label" labelDefault="RECLAIMED LAND"
          headKey="sr_theme_c3_head" headDefault="A waterway uncovered, a neighborhood rebuilt."
          bodyKey="sr_theme_c3_body"
          bodyDefault="An affordable-housing community here was built over a formerly covered urban waterway. When it was redeveloped, the waterway was uncovered, replanted with prairie grass, and the housing went back in around it. Proof that reclamation is possible."
        />
        <ThemeCard accent={C.yellow}
          labelKey="sr_theme_c4_label" labelDefault="MUSIC & TRAILS"
          headKey="sr_theme_c4_head" headDefault="Prince, First Avenue, and rails turned into trails."
          bodyKey="sr_theme_c4_body"
          bodyDefault="Minneapolis music history runs deep: Prince, Lake Minnetonka, First Avenue. The city's rails-to-trails success is another quiet win. The ride isn't all heavy. This is the lighter thread."
        />
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
      <div
        className="rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[minmax(0,360px)_1fr] gap-0"
        style={{ background: "rgba(19,18,53,0.7)", border: `1px solid ${C.yellow}55`, boxShadow: `0 0 60px ${C.yellow}22` }}
      >
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
              <EditableText
                settingKey="sr_guide_p1"
                defaultText="Anthony Taylor leads this ride. Founder of Slow Roll Twin Cities with the Cultural Wellness Center, co-founder of the Major Taylor Bicycling Club of Minnesota, and a nationally recognized advocate for equity in the outdoors and mobility justice."
                as="span" multiline
              />
            </p>
            <p>
              <EditableText
                settingKey="sr_guide_p2"
                defaultText="He's led Slow Rolls through Minneapolis for years. This isn't a one-off. It's his life's work, and we're honored he's showing us the city."
                as="span" multiline
              />
            </p>
          </div>
          <p className="mt-4" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
            Photo: Minnesota Spokesman-Recorder
          </p>
        </div>
      </div>
    </div>
  </DarkPanel>
);

const PartnerCard = ({
  nameKey, nameDefault, descKey, descDefault, logoUrl, logoAlt, href, accent,
}: {
  nameKey: string; nameDefault: string;
  descKey: string; descDefault: string;
  logoUrl?: string; logoAlt: string; href?: string; accent: string;
}) => {
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
    <a href={href} target="_blank" rel="noopener noreferrer" className="block transition-transform hover:-translate-y-1">
      {inner}
    </a>
  ) : inner;
};

const alsoLogo = "/__l5e/assets-v1/b06c9430-a522-4188-bdd1-333d9b3b5005/also-logo.webp";

const Partners = () => (
  <DarkPanel>
    <div className="max-w-5xl mx-auto">
      <p className="uppercase font-bold mb-4 text-center" style={{ letterSpacing: "0.22em", fontSize: 12, color: C.lime, textShadow: `0 0 10px ${C.lime}` }}>
        <EditableText settingKey="sr_partners_eyebrow" defaultText="Partners" as="span" />
      </p>
      <h2 className="mb-12 text-center" style={{ ...displayFont, fontSize: "clamp(30px, 4.5vw, 48px)", fontWeight: 800, color: "#fff", lineHeight: 1.05 }}>
        <EditableText settingKey="sr_partners_headline" defaultText="Made possible by." as="span" />
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PartnerCard accent={C.magenta}
          nameKey="sr_p1_name" nameDefault="Slow Roll MSP / Cultural Wellness Center"
          descKey="sr_p1_desc" descDefault="The ride organizer, led by Anthony Taylor."
          logoUrl={slowRollLogo.url} logoAlt="Slow Roll Twin Cities" href={SLOWROLL_FB_URL}
        />
        <PartnerCard accent={C.cyan}
          nameKey="sr_p2_name" nameDefault="ALSO"
          descKey="sr_p2_desc" descDefault="E-bikes provided for the ride. Several loaners available on-site for anyone who doesn't bring their own."
          logoUrl={alsoLogo} logoAlt="ALSO" href="https://ridealso.com"
        />
        <PartnerCard accent={C.yellow}
          nameKey="sr_p3_name" nameDefault="Basecamp Jobs"
          descKey="sr_p3_desc" descDefault="Where the outdoor industry finds its people. Powering the connections behind the ride."
          logoUrl={basecampJobsLogo.url} logoAlt="Basecamp Jobs" href="https://basecampjobs.com"
        />
      </div>
    </div>
  </DarkPanel>
);

const DetailRow = ({ labelKey, labelDefault, valueKey, valueDefault }: {
  labelKey: string; labelDefault: string; valueKey: string; valueDefault: string;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-4" style={{ borderBottom: `1px solid rgba(255,255,255,0.1)` }}>
    <div className="uppercase font-bold" style={{ letterSpacing: "0.16em", fontSize: 11, color: C.cyan, minWidth: 150, textShadow: `0 0 8px ${C.cyan}` }}>
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
      <div className="rounded-2xl p-6 md:p-8" style={{ background: "rgba(19,18,53,0.7)", border: `1px solid ${C.cyan}55`, boxShadow: `0 0 40px ${C.cyan}22` }}>
        <div style={{ borderTop: `1px solid rgba(255,255,255,0.1)` }}>
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
        <EditableText
          settingKey="sr_watch_caption"
          defaultText="MPR News · Bridging the gap: How Anthony Taylor is making outdoor recreation welcoming for all (1:42)."
          as="span"
        />
      </p>
    </div>
  </DarkPanel>
);

const FooterCTA = () => (
  <section style={{ background: C.midnight, color: "#fff", position: "relative", overflow: "hidden" }} className="px-6 py-24 md:py-32">
    <NeonBlobs />
    <div aria-hidden style={{
      position: "absolute", inset: 0, opacity: 0.1,
      backgroundImage: `linear-gradient(${C.magenta} 1px, transparent 1px), linear-gradient(90deg, ${C.magenta} 1px, transparent 1px)`,
      backgroundSize: "60px 60px",
      maskImage: "radial-gradient(circle at 50% 50%, black 30%, transparent 75%)",
    }} />
    <div className="max-w-3xl mx-auto text-center relative z-10">
      <div className="mb-6">
        <Badge settingKey="sr_footer_pill" defaultText="OFFICIAL OUTDOOR RETAILER EVENT" />
      </div>
      <h2 className="mb-5" style={{ ...displayFont, fontSize: "clamp(40px, 7vw, 84px)", fontWeight: 900, color: "#fff", lineHeight: 0.95, letterSpacing: "-0.02em", textShadow: `0 0 30px ${C.magenta}, 0 0 80px ${C.cyan}` }}>
        <EditableText settingKey="sr_footer_headline" defaultText="COME RIDE WITH US." as="span" />
      </h2>
      <p className="mb-8 font-bold" style={{ fontSize: 16, color: C.lime, letterSpacing: "0.08em", textShadow: `0 0 12px ${C.lime}` }}>
        <EditableText settingKey="sr_footer_capline" defaultText="ONLY 100 SPOTS · BRING A BIKE OR BORROW ONE" as="span" />
      </p>
      <div className="mb-10">
        <CTAButton settingKey="sr_footer_cta" defaultText="REGISTER — 100 SPOTS" size="lg" />
      </div>
      <div className="pt-8 space-y-2" style={{ borderTop: `1px solid rgba(255,255,255,0.12)`, color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
        <p>
          <EditableText settingKey="sr_footer_presented" defaultText="Presented by Basecamp Outdoor and Slow Roll MSP." as="span" />
        </p>
        <p>
          <a href="mailto:jenna@wearetheoutdoorindustry.com" className="underline hover:text-white transition-colors" style={{ color: C.cyan }}>
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
            { key: "hero", content: <><Hero /><BikePathDivider /></> },
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
