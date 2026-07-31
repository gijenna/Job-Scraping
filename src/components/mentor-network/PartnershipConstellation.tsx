import { useMemo } from "react";
import EditableText from "@/components/EditableText";

const C = {
  forest: "#12241c",
  forestDeep: "#0c1913",
  night: "#060d0b",
  clay: "#c4654a",
  gold: "#e8c07a",
  cream: "#f5efe3",
  creamDim: "rgba(245,239,227,0.72)",
};

const body: React.CSSProperties = { fontFamily: "'Hind', system-ui, sans-serif" };
const display: React.CSSProperties = {
  fontFamily: "'Archivo Black', 'Hind', system-ui, sans-serif",
  letterSpacing: "-0.02em",
  lineHeight: 1.02,
};

export type StarTier = "north" | "partner" | "campus";

export type ConstellationStar = {
  key: string;
  name: string;
  logo: string | null;
  tier: StarTier;
  /** percentage coordinates inside the sky box */
  x: number;
  y: number;
  /** relative logo scale */
  scale?: number;
  /** one line role label under the logo */
  role?: string;
};

/** Connector lines, referenced by star key. Add a pair to extend the shape. */
export type Edge = [string, string];

const TIER_SIZE: Record<StarTier, { h: number; w: number; label: number; dot: number }> = {
  north: { h: 0, w: 240, label: 13, dot: 9 },
  partner: { h: 124, w: 290, label: 11, dot: 8 },
  campus: { h: 48, w: 138, label: 9, dot: 4 },
};

const StarField = () => {
  const dots = useMemo(() => {
    // deterministic pseudo-random field so it never reshuffles between renders
    let seed = 20261001;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    return Array.from({ length: 110 }, () => ({
      x: rand() * 100,
      y: rand() * 100,
      r: 0.4 + rand() * 1.1,
      o: 0.15 + rand() * 0.5,
      delay: rand() * 6,
      dur: 3.5 + rand() * 4.5,
    }));
  }, []);

  return (
    <svg className="absolute inset-0 h-full w-full mn-drift" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden>
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={d.r * 0.16}
          fill={C.cream}
          opacity={d.o}
          style={{ animation: `mn-twinkle ${d.dur}s ease-in-out ${d.delay}s infinite` }}
        />
      ))}
    </svg>
  );
};

const PartnershipConstellation = ({
  stars,
  edges,
  northStarLabelKey,
  northStarLabelDefault,
}: {
  stars: ConstellationStar[];
  edges: Edge[];
  northStarLabelKey?: string;
  northStarLabelDefault?: string;
}) => {
  const byKey = useMemo(() => Object.fromEntries(stars.map((s) => [s.key, s])), [stars]);

  return (
    <div
      className="relative overflow-hidden rounded-3xl"
      style={{
        background: `radial-gradient(120% 90% at 50% 2%, #1a3327 0%, ${C.forestDeep} 42%, ${C.night} 100%)`,
        border: "1px solid rgba(232,192,122,0.22)",
      }}
    >
      <StarField />

      {/* connector lines */}
      <svg
        className="absolute inset-0 h-full w-full mn-drift-slow"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <filter id="mn-line-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="0.8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#mn-line-glow)">
          {edges.map(([a, b], i) => {
            const sa = byKey[a];
            const sb = byKey[b];
            if (!sa || !sb) return null;
            const toNorth = sa.tier === "north" || sb.tier === "north";
            const isCampus = sa.tier === "campus" || sb.tier === "campus";
            return (
              <line
                key={i}
                x1={sa.x}
                y1={sa.y}
                x2={sb.x}
                y2={sb.y}
                stroke={C.gold}
                strokeWidth={toNorth ? 1.9 : isCampus ? 1 : 1.5}
                strokeLinecap="round"
                opacity={toNorth ? 0.95 : isCampus ? 0.55 : 0.8}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </g>
      </svg>

      {/* stars */}
      <div className="relative aspect-[4/5] sm:aspect-[16/11] w-full mn-sky">
        {stars.map((s, i) => {
          const t = TIER_SIZE[s.tier];
          const scale = s.scale ?? 1;
          return (
            <div
              key={s.key}
              className="absolute -translate-x-1/2 -translate-y-1/2 mn-float"
              style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${i * 0.7}s` }}
            >
              <div className="relative flex flex-col items-center">
                <span
                  className="absolute rounded-full mn-glow"
                  style={{
                    width: s.tier === "north" ? 240 : s.tier === "partner" ? 250 : 110,
                    height: s.tier === "north" ? 240 : s.tier === "partner" ? 250 : 110,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: `radial-gradient(circle, rgba(232,192,122,${
                      s.tier === "north" ? 0.34 : s.tier === "partner" ? 0.22 : 0.16
                    }) 0%, rgba(232,192,122,0) 68%)`,
                    animationDelay: `${i * 1.1}s`,
                  }}
                />

                {s.tier === "north" ? (
                  <span className="relative flex flex-col items-center">
                    <svg width="56" height="56" viewBox="0 0 24 24" aria-hidden className="mn-spark">
                      <path
                        d="M12 0 L13.6 9.2 L24 12 L13.6 14.8 L12 24 L10.4 14.8 L0 12 L10.4 9.2 Z"
                        fill={C.gold}
                      />
                    </svg>
                    <span
                      className="mt-2 text-center text-[11px] sm:text-[13px] font-bold uppercase"
                      style={{ ...body, color: C.gold, letterSpacing: "0.26em", whiteSpace: "nowrap" }}
                    >
                      {northStarLabelKey ? (
                        <EditableText
                          settingKey={northStarLabelKey}
                          defaultText={northStarLabelDefault || "The Outcome"}
                          as="span"
                        />
                      ) : (
                        s.name
                      )}
                    </span>
                  </span>
                ) : s.logo ? (
                  <img
                    src={s.logo}
                    alt={s.name}
                    className="relative object-contain"
                    style={{
                      height: `clamp(${Math.round(t.h * scale * 0.42)}px, ${
                        (t.h * scale) / 12
                      }vw, ${Math.round(t.h * scale)}px)`,
                      maxWidth: `clamp(${Math.round(t.w * scale * 0.45)}px, ${
                        (t.w * scale) / 12
                      }vw, ${Math.round(t.w * scale)}px)`,
                      filter: "drop-shadow(0 2px 14px rgba(0,0,0,0.6))",
                    }}
                  />
                ) : (
                  <span
                    className="relative text-center text-[11px] font-bold uppercase leading-tight"
                    style={{ ...body, color: C.cream, letterSpacing: "0.14em", maxWidth: 150 }}
                  >
                    {s.name}
                  </span>
                )}

                {s.tier !== "north" && s.role && (
                  <span
                    className="relative mt-2 text-center font-bold uppercase"
                    style={{
                      ...body,
                      color: s.tier === "partner" ? C.gold : "rgba(245,239,227,0.55)",
                      fontSize: s.tier === "partner" ? "clamp(8px,0.85vw,11px)" : "clamp(7px,0.7vw,9px)",
                      letterSpacing: "0.2em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.role}
                  </span>
                )}

                {s.tier !== "north" && (
                  <span
                    className="relative mt-2 block rounded-full"
                    style={{
                      width: s.tier === "partner" ? 6 : 4,
                      height: s.tier === "partner" ? 6 : 4,
                      background: C.gold,
                      boxShadow: `0 0 10px 3px rgba(232,192,122,${s.tier === "partner" ? 0.6 : 0.4})`,
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ConstellationStyles = () => (
  <style>{`
    @keyframes mn-twinkle { 0%,100% { opacity: .15 } 50% { opacity: .85 } }
    @keyframes mn-drift { 0%,100% { transform: translate3d(0,0,0) } 50% { transform: translate3d(-1.2%, 1%, 0) } }
    @keyframes mn-drift-slow { 0%,100% { transform: translate3d(0,0,0) } 50% { transform: translate3d(.7%, -.6%, 0) } }
    @keyframes mn-float { 0%,100% { transform: translate(-50%,-50%) } 50% { transform: translate(-50%, calc(-50% - 7px)) } }
    @keyframes mn-glow { 0%,100% { opacity: .55 } 50% { opacity: 1 } }
    @keyframes mn-spark { 0%,100% { transform: scale(1) rotate(0deg) } 50% { transform: scale(1.12) rotate(8deg) } }
    .mn-drift { animation: mn-drift 34s ease-in-out infinite; }
    .mn-drift-slow { animation: mn-drift-slow 46s ease-in-out infinite; }
    .mn-float { animation: mn-float 9s ease-in-out infinite; }
    .mn-glow { animation: mn-glow 5.5s ease-in-out infinite; }
    .mn-spark { animation: mn-spark 6s ease-in-out infinite; }
    @media (prefers-reduced-motion: reduce) {
      .mn-drift, .mn-drift-slow, .mn-float, .mn-glow, .mn-spark { animation: none !important; }
      .mn-float { transform: translate(-50%,-50%); }
    }
  `}</style>
);

export const ConstellationHeading = ({
  eyebrowKey,
  headlineKey,
  headlineDefault,
  subheadKey,
  subheadDefault,
}: {
  eyebrowKey: string;
  headlineKey: string;
  headlineDefault: string;
  subheadKey: string;
  subheadDefault: string;
}) => (
  <div className="max-w-3xl">
    <p className="text-[10px] sm:text-[11px] font-bold uppercase" style={{ ...body, letterSpacing: "0.24em", color: C.gold }}>
      <EditableText settingKey={eyebrowKey} defaultText="THE PARTNERSHIP" as="span" />
    </p>
    <h2 className="mt-4 text-[28px] sm:text-[40px]" style={{ ...display, color: C.cream }}>
      <EditableText settingKey={headlineKey} defaultText={headlineDefault} as="span" />
    </h2>
    <p className="mt-5 text-base sm:text-lg" style={{ ...body, color: C.creamDim, lineHeight: 1.6 }}>
      <EditableText settingKey={subheadKey} defaultText={subheadDefault} as="span" multiline />
    </p>
  </div>
);

export default PartnershipConstellation;
