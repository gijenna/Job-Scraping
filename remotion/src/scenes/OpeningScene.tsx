import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile, Img } from "remotion";
import { FireMark } from "../components/FireMark";

interface Props {
  /** Render the snowflake star burst at the end (only for full opening). */
  withStarBurst?: boolean;
  /** Render solid black background (vs transparent). */
  blackBackground?: boolean;
  /** Render the sunset photo background. */
  sunsetBackground?: boolean;
  /** Render Outside Days logo overlay at the bottom. */
  withLogo?: boolean;
}

// Timeline (at 30fps):
//   0-30   Fire grows in
//   30-90  Sparks rise (continuous)
//   60-72  Hero spark launches
//   72-180 Kite flutters around the fire (3.6s)
//   180-204 Fire dismisses, kite flies off
//   204-300 Star burst (only when withStarBurst)
const FPS = 30;

const sparks = [
  { angle: -85, dist: 360, size: 18, color: "#E1B624", phase: 0 },
  { angle: -70, dist: 460, size: 15, color: "#ED7660", phase: 4 },
  { angle: -100, dist: 410, size: 22, color: "#F5E6D3", phase: 8 },
  { angle: -55, dist: 510, size: 12, color: "#E1B624", phase: 12 },
  { angle: -115, dist: 380, size: 18, color: "#ED7660", phase: 16 },
  { angle: -80, dist: 560, size: 15, color: "#F5E6D3", phase: 20 },
  { angle: -65, dist: 330, size: 12, color: "#E1B624", phase: 24 },
  { angle: -95, dist: 480, size: 18, color: "#ED7660", phase: 28 },
];

const trailMotes = [
  { color: "#39FF14", size: 16, delay: 80, ox: 60, oy: 30 },
  { color: "#E1B624", size: 13, delay: 90, ox: -54, oy: 60 },
  { color: "#39FF14", size: 19, delay: 100, ox: 90, oy: -24 },
  { color: "#F5E6D3", size: 13, delay: 110, ox: -75, oy: 48 },
  { color: "#39FF14", size: 16, delay: 120, ox: 30, oy: 72 },
  { color: "#ED7660", size: 13, delay: 130, ox: 66, oy: -36 },
  { color: "#39FF14", size: 16, delay: 140, ox: -84, oy: 54 },
  { color: "#E1B624", size: 13, delay: 150, ox: 48, oy: 66 },
  { color: "#39FF14", size: 19, delay: 160, ox: -42, oy: -18 },
  { color: "#F5E6D3", size: 13, delay: 170, ox: 78, oy: 42 },
];

const burstStars = [
  { angle: 8, dist: 760, tone: "cream", size: 130, delay: 0, spin: 220 },
  { angle: 34, dist: 900, tone: "coral", size: 470, delay: 3, spin: -180 },
  { angle: 62, dist: 680, tone: "green", size: 195, delay: 1, spin: 260 },
  { angle: 88, dist: 970, tone: "cream", size: 345, delay: 4, spin: -240 },
  { angle: 112, dist: 610, tone: "coral", size: 100, delay: 2, spin: 200 },
  { angle: 138, dist: 860, tone: "green", size: 425, delay: 3, spin: -220 },
  { angle: 162, dist: 720, tone: "cream", size: 225, delay: 1, spin: 240 },
  { angle: 188, dist: 1010, tone: "coral", size: 305, delay: 4, spin: -200 },
  { angle: 214, dist: 645, tone: "green", size: 145, delay: 2, spin: 220 },
  { angle: 240, dist: 900, tone: "cream", size: 390, delay: 3, spin: -260 },
  { angle: 266, dist: 790, tone: "coral", size: 187, delay: 1, spin: 200 },
  { angle: 292, dist: 680, tone: "green", size: 260, delay: 2, spin: -220 },
  { angle: 318, dist: 970, tone: "cream", size: 445, delay: 2, spin: 220 },
  { angle: 344, dist: 575, tone: "coral", size: 115, delay: 1, spin: -200 },
  { angle: 20, dist: 1045, tone: "green", size: 325, delay: 4, spin: 240 },
  { angle: 76, dist: 500, tone: "cream", size: 165, delay: 3, spin: -180 },
];

const TONE_FILTER: Record<string, string> = {
  cream: "brightness(0) saturate(100%) invert(94%) sepia(13%) saturate(444%) hue-rotate(335deg) brightness(101%) contrast(96%)",
  coral: "brightness(0) saturate(100%) invert(56%) sepia(73%) saturate(458%) hue-rotate(330deg) brightness(96%) contrast(91%)",
  green: "brightness(0) saturate(100%) invert(78%) sepia(83%) saturate(2103%) hue-rotate(57deg) brightness(106%) contrast(101%)",
};

export const OpeningScene: React.FC<Props> = ({ withStarBurst = false, blackBackground = false, sunsetBackground = false, withLogo = false }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const cx = width / 2;
  const cy = height / 2;

  // Fire grow
  const fireScale = spring({ frame, fps, config: { damping: 18, stiffness: 90, mass: 0.8 } });
  // Fire dismiss starts at 180
  const fireDismiss = interpolate(frame, [180, 204], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fireOpacity = interpolate(frame, [180, 204], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const finalFireScale = fireScale * fireDismiss;

  // Glow pulse
  const glowPulse = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin((frame / 22) * Math.PI * 2));
  const fireGlow = `drop-shadow(0 0 ${40 + glowPulse * 30}px rgba(225,182,36,${0.5 + glowPulse * 0.3})) drop-shadow(0 0 ${80 + glowPulse * 40}px rgba(237,105,83,${0.3 + glowPulse * 0.3}))`;

  // Hero spark launch (frame 60-72)
  const heroSparkProg = interpolate(frame, [60, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const heroSparkOpacity = frame >= 60 && frame < 76 ? interpolate(frame, [60, 64, 70, 76], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const heroSparkY = -heroSparkProg * 480;
  const heroSparkScale = 0.3 + heroSparkProg * 2.5;

  // Kite appears at 72, flutters until 180, dismisses 180-204
  const kiteAppear = spring({ frame: frame - 72, fps, config: { damping: 12, stiffness: 100, mass: 0.7 } });
  const kiteVisible = frame >= 72 ? 1 : 0;

  // Flutter path: 4 waypoints over 108 frames (72-180), looping smoothly
  const fluttT = Math.max(0, Math.min(1, (frame - 78) / 102));
  const fluttAngle = fluttT * Math.PI * 2 - Math.PI / 2; // start at top
  const fluttRadius = 720;
  const kiteX = Math.cos(fluttAngle) * fluttRadius * 1.0;
  const kiteY = Math.sin(fluttAngle) * fluttRadius * 0.85 - 60;

  // Wing fold
  const wingFold = 1 - 0.45 * Math.abs(Math.sin((frame / 13) * Math.PI));

  // Kite dismiss (frame 180+) - flies off top right
  const kiteDismiss = interpolate(frame, [180, 220], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dismissX = kiteDismiss * width * 1.0;
  const dismissY = kiteDismiss * -height * 0.9;
  const dismissOpacity = interpolate(frame, [180, 220], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Kite glow pulse
  const kiteGlowT = (frame / 27) * Math.PI * 2;
  const kiteGlow = `drop-shadow(0 0 ${20 + Math.sin(kiteGlowT) * 8}px rgba(57,255,20,${0.7 + Math.sin(kiteGlowT) * 0.2})) drop-shadow(0 0 ${40 + Math.sin(kiteGlowT) * 12}px rgba(57,255,20,0.5))`;

  const kiteSize = 480;

  // Star burst (only if enabled)
  const burstStart = 204;
  const burstDur = 90;

  return (
    <AbsoluteFill style={{ backgroundColor: blackBackground ? "#000000" : "transparent" }}>
      {/* Fire */}
      <div
        style={{
          position: "absolute",
          top: cy,
          left: cx,
          transform: `translate(-50%, -50%) scale(${finalFireScale})`,
          opacity: fireOpacity,
          filter: fireGlow,
        }}
      >
        <FireMark size={800} />
      </div>

      {/* Sparks - continuous loop */}
      {sparks.map((s, i) => {
        // Each spark loops every 36 frames, offset by phase
        const local = (frame - 30 - s.phase) % 42;
        if (frame < 30 + s.phase) return null;
        const t = local / 42;
        if (t < 0) return null;
        const rad = (s.angle * Math.PI) / 180;
        const sx = Math.cos(rad) * s.dist;
        const sy = Math.sin(rad) * s.dist;
        const x = sx * t;
        const y = sy * t - 60 * t * t;
        const opacity = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
        const scale = 0.3 + t * 0.7 - (t > 0.7 ? (t - 0.7) * 2 : 0);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: cy,
              left: cx,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: `radial-gradient(circle, #FFFFFF 0%, ${s.color} 50%, transparent 100%)`,
              boxShadow: `0 0 ${s.size * 1.5}px ${s.color}`,
              opacity: Math.max(0, opacity),
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${Math.max(0.1, scale)})`,
            }}
          />
        );
      })}

      {/* Hero spark */}
      {heroSparkOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            top: cy,
            left: cx,
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "radial-gradient(circle, #FFFFFF 0%, #2EF116 60%, transparent 100%)",
            boxShadow: "0 0 40px rgba(57,255,20,0.9), 0 0 80px rgba(57,255,20,0.6)",
            opacity: heroSparkOpacity,
            transform: `translate(-50%, -50%) translate(0, ${heroSparkY}px) scale(${heroSparkScale})`,
          }}
        />
      )}

      {/* Kite */}
      {kiteVisible > 0 && (
        <div
          style={{
            position: "absolute",
            top: cy,
            left: cx,
            width: kiteSize,
            height: kiteSize,
            opacity: kiteAppear * dismissOpacity,
            transform: `translate(-50%, -50%) translate(${kiteX + dismissX}px, ${kiteY + dismissY}px) scale(${kiteAppear})`,
          }}
        >
          <div style={{ width: "100%", height: "100%", transform: `scaleX(${wingFold})` }}>
            <Img
              src={staticFile("images/popfly-kite.png")}
              style={{ width: "100%", height: "100%", objectFit: "contain", filter: kiteGlow }}
            />
          </div>
        </div>
      )}

      {/* Trail motes */}
      {trailMotes.map((m, i) => {
        const start = 78 + m.delay;
        if (frame < start) return null;
        const t = Math.min(1, (frame - start) / 36);
        if (t >= 1) return null;
        const opacity = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
        // Anchor mote near where the kite is at start frame
        const localFlutT = Math.max(0, Math.min(1, (start - 78) / 102));
        const ang = localFlutT * Math.PI * 2 - Math.PI / 2;
        const ax = Math.cos(ang) * fluttRadius * 1.0;
        const ay = Math.sin(ang) * fluttRadius * 0.85 - 60;
        const dx = ax + m.ox * t;
        const dy = ay + m.oy * t + 100 * t;
        return (
          <div
            key={`tm-${i}`}
            style={{
              position: "absolute",
              top: cy,
              left: cx,
              width: m.size,
              height: m.size,
              borderRadius: "50%",
              background: `radial-gradient(circle, #FFFFFF 0%, ${m.color} 55%, transparent 100%)`,
              boxShadow: `0 0 ${m.size * 2}px ${m.color}`,
              opacity: Math.max(0, opacity),
              transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(${1 - t * 0.7})`,
            }}
          />
        );
      })}

      {/* Star burst - snowflakes radiating out then collapsing back */}
      {withStarBurst && burstStars.map((s, i) => {
        const localStart = burstStart + s.delay;
        if (frame < localStart) return null;
        const t = Math.min(1, (frame - localStart) / burstDur);
        const rad = (s.angle * Math.PI) / 180;
        const xOut = Math.cos(rad) * s.dist;
        const yOut = Math.sin(rad) * s.dist;
        // arc: 0->mid (0.1), hold (0.1-0.78), back to 0 (0.78-1)
        let posT = 0;
        if (t < 0.3) posT = t / 0.3;
        else if (t < 0.78) posT = 1;
        else posT = 1 - (t - 0.78) / 0.22;
        const x = xOut * posT;
        const y = yOut * posT;
        const scale = posT * 1.0;
        const opacity = t < 0.1 ? t / 0.1 : t > 0.92 ? Math.max(0, (1 - t) / 0.08) : 1;
        const rot = s.spin * t;
        return (
          <Img
            key={`bs-${i}`}
            src={staticFile("images/afterparty-star.png")}
            style={{
              position: "absolute",
              top: cy,
              left: cx,
              width: s.size,
              height: s.size,
              objectFit: "contain",
              filter: TONE_FILTER[s.tone],
              opacity: Math.max(0, opacity),
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale}) rotate(${rot}deg)`,
              pointerEvents: "none",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
