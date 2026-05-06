import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile, Img } from "remotion";
import { OpeningScene } from "./OpeningScene";
import { loadFont as loadUnbounded } from "@remotion/google-fonts/Unbounded";
import { loadFont as loadJosefin } from "@remotion/google-fonts/JosefinSans";

const { fontFamily: unbounded } = loadUnbounded("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: josefin } = loadJosefin("normal", { weights: ["300", "500"], subsets: ["latin"] });

interface Props {
  format: "square" | "story";
}

/**
 * Social post variant: replays the opening sunset animation
 * (fire -> spark -> kite -> snowflake burst over the sunset background)
 * and reveals the Outside Days logo, "OUT OF OFFICE" title, and date/location
 * at the end so the still-frame ending works as a static social card.
 *
 * Total: 360 frames (12s @ 30fps).
 */
export const SocialPost: React.FC<Props> = ({ format }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // OpeningScene runs from 0..300; star burst peaks ~204-260
  // We push the final reveal slightly after burst settles.
  const TEXT_IN = 230;
  const TITLE_IN = 250;
  const DATE_IN = 275;
  const LOGO_IN = 215;

  const ease = (f: number, s: number, e: number) =>
    interpolate(f, [s, e], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const logoSpring = spring({ frame: frame - LOGO_IN, fps, config: { damping: 18, stiffness: 90, mass: 0.9 } });
  const logoOpacity = ease(frame, LOGO_IN, LOGO_IN + 25);
  const titleSpring = spring({ frame: frame - TITLE_IN, fps, config: { damping: 16, stiffness: 100, mass: 0.7 } });
  const titleOpacity = ease(frame, TITLE_IN, TITLE_IN + 20);
  const dateOpacity = ease(frame, DATE_IN, DATE_IN + 25);
  const dateY = interpolate(dateOpacity, [0, 1], [16, 0]);

  // Layout per format
  const isStory = format === "story";
  const logoSize = isStory ? width * 0.7 : width * 0.55;
  const titleSize = isStory ? width * 0.13 : width * 0.11;
  const dateSize = isStory ? width * 0.038 : width * 0.034;

  // Vertical anchors
  // For story (9:16): logo top, scene middle, text bottom
  // For square: text overlays lower portion
  const logoTop = isStory ? height * 0.08 : height * 0.04;
  const titleBottom = isStory ? height * 0.22 : height * 0.14;
  const dateBottom = isStory ? height * 0.13 : height * 0.07;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {/* Reuse the choreographed opening over sunset, scaled from 2160 base. */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 2160,
          height: 2160,
          transform: `translate(-50%, -50%) scale(${Math.max(width, height) / 2160})`,
          transformOrigin: "center center",
        }}
      >
        <OpeningScene withStarBurst sunsetBackground withLogo={false} canvasOverride={{ width: 2160, height: 2160 }} />
      </div>
      {/* Soft vignette for legibility once text appears */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 100%)",
          opacity: ease(frame, 200, 260) * 0.9,
          pointerEvents: "none",
        }}
      />

      {/* Outside Days logo — top */}
      <div
        style={{
          position: "absolute",
          top: logoTop,
          left: "50%",
          transform: `translateX(-50%) scale(${0.85 + logoSpring * 0.15})`,
          opacity: logoOpacity,
          width: logoSize,
        }}
      >
        <Img
          src={staticFile("images/outside-days-logo.png")}
          style={{
            width: "100%",
            height: "auto",
            filter: "drop-shadow(0 6px 30px rgba(0,0,0,0.7))",
          }}
        />
      </div>

      {/* OUT OF OFFICE title - bottom */}
      <div
        style={{
          position: "absolute",
          bottom: titleBottom,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOpacity,
          transform: `translateY(${(1 - titleSpring) * 24}px)`,
          fontFamily: unbounded,
          fontWeight: 700,
          fontSize: titleSize,
          lineHeight: 0.95,
          letterSpacing: "-0.02em",
          color: "#F5E6D3",
          textShadow:
            "0 2px 24px rgba(0,0,0,0.85), 0 0 48px rgba(237,118,96,0.35)",
          padding: "0 6%",
        }}
      >
        OUT OF<br />OFFICE
      </div>

      {/* Date + location */}
      <div
        style={{
          position: "absolute",
          bottom: dateBottom,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: dateOpacity,
          transform: `translateY(${dateY}px)`,
          fontFamily: josefin,
          fontWeight: 500,
          fontSize: dateSize,
          letterSpacing: "0.18em",
          color: "#F5E6D3",
          textShadow: "0 2px 18px rgba(0,0,0,0.9)",
        }}
      >
        MAY 28 · 7:30–9:30PM
        <div style={{ height: dateSize * 0.35 }} />
        <span style={{ color: "rgba(245,230,211,0.78)", fontWeight: 300, fontSize: dateSize * 0.85 }}>
          OAKLEY RiNo · DENVER
        </span>
      </div>
    </AbsoluteFill>
  );
};
