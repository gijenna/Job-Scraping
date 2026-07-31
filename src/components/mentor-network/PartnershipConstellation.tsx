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

export type ConstellationStar = {
  key: string;
  name: string;
  logo: string | null;
  /** percentage coordinates inside the sky box */
  x: number;
  y: number;
  /** relative logo scale */
  scale?: number;
};

/** Connector lines, referenced by star key. Add a pair to extend the shape. */
type Edge = [string, string];

const StarField = () => {
  const dots = useMemo(() => {
    // deterministic pseudo-random field so it never reshuffles between renders
    let seed = 20261001;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    return Array.from({ length: 90 }, () => ({
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
}: {
  stars: ConstellationStar[];
  edges: Edge[];
}) => {
  const byKey = useMemo(() => Object.fromEntries(stars.map((s) => [s.key, s])), [stars]);

  return (
    <div
      className="relative overflow-hidden rounded-3xl"
      style={{
        background: `radial-gradient(120% 90% at 22% 8%, ${C.forest} 0%, ${C.forestDeep} 45%, ${C.night} 100%)`,
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
        {edges.map(([a, b], i) => {
          const sa = byKey[a];
          const sb = byKey[b];
          if (!sa || !sb) return null;
          return (
            <line
              key={i}
              x1={sa.x}
              y1={sa.y}
              x2={sb.x}
              y2={sb.y}
              stroke={C.gold}
              strokeWidth={0.14}
              strokeLinecap="round"
              opacity={0.42}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {/* stars */}
      <div className="relative aspect-[16/10] sm:aspect-[16/8] w-full">
        {stars.map((s, i) => (
          <div
            key={s.key}
            className="absolute -translate-x-1/2 -translate-y-1/2 mn-float"
            style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${i * 0.9}s` }}
          >
            <div className="relative flex flex-col items-center">
              <span
                className="absolute rounded-full mn-glow"
                style={{
                  width: 130,
                  height: 130,
                  background: `radial-gradient(circle, rgba(232,192,122,0.20) 0%, rgba(232,192,122,0) 68%)`,
                  animationDelay: `${i * 1.3}s`,
                }}
              />
              {s.logo ? (
                <img
                  src={s.logo}
                  alt={s.name}
                  className="relative object-contain"
                  style={{
                    height: `${(s.scale ?? 1) * 56}px`,
                    maxWidth: `${(s.scale ?? 1) * 150}px`,
                    filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.55))",
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
              <span
                className="relative mt-3 block h-[5px] w-[5px] rounded-full"
                style={{ background: C.gold, boxShadow: `0 0 10px 3px rgba(232,192,122,0.55)` }}
              />
            </div>
          </div>
        ))}
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
    .mn-drift { animation: mn-drift 34s ease-in-out infinite; }
    .mn-drift-slow { animation: mn-drift-slow 46s ease-in-out infinite; }
    .mn-float { animation: mn-float 9s ease-in-out infinite; }
    .mn-glow { animation: mn-glow 5.5s ease-in-out infinite; }
    @media (prefers-reduced-motion: reduce) {
      .mn-drift, .mn-drift-slow, .mn-float, .mn-glow { animation: none !important; }
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
