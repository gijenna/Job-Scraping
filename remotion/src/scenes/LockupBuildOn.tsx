import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile, Img } from "remotion";
import { FireMark } from "../components/FireMark";
import { BasecampMatchText } from "../components/BasecampMatchText";

/**
 * Lockup build-on:
 * 0-15:   Basecamp fire scales in
 * 10-40:  "basecamp / match" text wipes in left-to-right
 * 35-55:  Yellow divider draws to right
 * 50-65:  X fades up + glow
 * 55-75:  Green divider draws to left
 * 60-90:  Popfly logo bounces in from right with neon glow
 * 90+:    Steady pulse loop (flame keeps flickering, neon glow pulses)
 *
 * Total duration ~150 frames (5s at 30fps).
 */
export const LockupBuildOn: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Layout: lockup centered horizontally on a 2160x2160 canvas
  const lockupY = height / 2;

  // Fire mark
  const fireScale = spring({ frame, fps, config: { damping: 14, stiffness: 110, mass: 0.8 } });

  // Basecamp text wipe
  const textReveal = interpolate(frame, [10, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textOpacity = interpolate(frame, [10, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Yellow divider (left of X) - scales from right edge
  const yellowDiv = interpolate(frame, [35, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Green divider (right of X)
  const greenDiv = interpolate(frame, [55, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // X mark
  const xOpacity = interpolate(frame, [50, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const xY = interpolate(frame, [50, 65], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const xGlowT = (frame / 60) * Math.PI * 2;
  const xGlow = `0 0 ${20 + Math.sin(xGlowT) * 8}px rgba(245,230,211,0.9), 0 0 ${40 + Math.sin(xGlowT) * 12}px rgba(245,230,211,0.55)`;

  // Popfly bounce in
  const popflyAppear = spring({ frame: frame - 60, fps, config: { damping: 10, stiffness: 90, mass: 0.9 } });
  const popflyOpacity = interpolate(frame, [60, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const popflyX = interpolate(popflyAppear, [0, 1], [200, 0]);
  // Neon pulse on popfly
  const neonT = (frame / 78) * Math.PI * 2;
  const neonGlow = `drop-shadow(0 0 ${24 + Math.sin(neonT) * 12}px rgba(57,255,20,${0.6 + Math.sin(neonT) * 0.25})) drop-shadow(0 0 ${48 + Math.sin(neonT) * 16}px rgba(57,255,20,0.4))`;

  // Amber pulse on basecamp side
  const amberT = (frame / 78) * Math.PI * 2 + Math.PI;
  const amberGlow = `drop-shadow(0 0 ${24 + Math.sin(amberT) * 12}px rgba(225,182,36,${0.55 + Math.sin(amberT) * 0.25})) drop-shadow(0 0 ${48 + Math.sin(amberT) * 16}px rgba(225,182,36,0.35))`;

  // Sizes - lockup is large on the square canvas
  const fireSize = 360;
  const textWidth = 1100;
  const textHeight = (textWidth / 57) * 35;
  const dividerW = 200;
  const popflyHeight = 360;

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <div
        style={{
          position: "absolute",
          top: lockupY,
          left: width / 2,
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 60,
        }}
      >
        {/* Basecamp side: fire + text */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 30,
            filter: frame > 90 ? amberGlow : "none",
          }}
        >
          <div style={{ transform: `scale(${fireScale})` }}>
            <FireMark size={fireSize} />
          </div>
          <div style={{ opacity: textOpacity, height: textHeight, display: "flex", alignItems: "center" }}>
            <BasecampMatchText width={textWidth} reveal={textReveal} />
          </div>
        </div>

        {/* X divider group */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              height: 4,
              width: dividerW,
              transformOrigin: "right center",
              transform: `scaleX(${yellowDiv})`,
              background: "linear-gradient(to right, transparent, #E1B624)",
              boxShadow: "0 0 16px rgba(225,182,36,0.6)",
            }}
          />
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 180,
              fontWeight: 700,
              color: "#F5E6D3",
              opacity: xOpacity,
              transform: `translateY(${xY}px)`,
              textShadow: xGlow,
              lineHeight: 1,
            }}
          >
            ×
          </span>
          <div
            style={{
              height: 4,
              width: dividerW,
              transformOrigin: "left center",
              transform: `scaleX(${greenDiv})`,
              background: "linear-gradient(to left, transparent, #39FF14)",
              boxShadow: "0 0 16px rgba(57,255,20,0.6)",
            }}
          />
        </div>

        {/* Popfly side */}
        <div
          style={{
            opacity: popflyOpacity,
            transform: `translateX(${popflyX}px) scale(${0.6 + popflyAppear * 0.4})`,
            filter: neonGlow,
            overflow: "hidden",
            height: popflyHeight,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Img
            src={staticFile("images/popfly-logo-neon.png")}
            style={{
              height: popflyHeight,
              width: "auto",
              objectFit: "contain",
              clipPath: "inset(24% 11% 24% 11%)",
              transform: "scale(1.25)",
              transformOrigin: "center center",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
