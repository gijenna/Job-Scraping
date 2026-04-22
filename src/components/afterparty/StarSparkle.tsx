import { CSSProperties } from "react";
import starSet from "@/assets/afterparty-starset.png";
import starOne from "@/assets/afterparty-star.png";

/**
 * Decorative hand-drawn asterisk/sparkle. Source asset is white-on-transparent
 * so we recolor via CSS filter chains.
 *
 *   tone="cream"  -> #F5E6D3
 *   tone="coral"  -> #ED7660
 *   tone="green"  -> #2EF116
 */
type Tone = "cream" | "coral" | "green";
type Variant = "single" | "set";

const TONE_FILTER: Record<Tone, string> = {
  // The source is pure white. brightness(0) -> black, then drop-shadow stamps
  // a colored copy. We use the "drop-shadow" trick to recolor without losing
  // the alpha mask.
  cream: "brightness(0) saturate(100%) invert(94%) sepia(13%) saturate(444%) hue-rotate(335deg) brightness(101%) contrast(96%)",
  coral: "brightness(0) saturate(100%) invert(56%) sepia(73%) saturate(458%) hue-rotate(330deg) brightness(96%) contrast(91%)",
  green: "brightness(0) saturate(100%) invert(78%) sepia(83%) saturate(2103%) hue-rotate(57deg) brightness(106%) contrast(101%)",
};

interface StarSparkleProps {
  tone?: Tone;
  variant?: Variant;
  size?: number | string;
  className?: string;
  style?: CSSProperties;
  alt?: string;
}

const StarSparkle = ({
  tone = "cream",
  variant = "single",
  size = 24,
  className,
  style,
  alt = "",
}: StarSparkleProps) => {
  const src = variant === "set" ? starSet : starOne;
  const dim = typeof size === "number" ? `${size}px` : size;
  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={alt === "" ? true : undefined}
      className={className}
      style={{
        width: dim,
        height: dim,
        objectFit: "contain",
        filter: TONE_FILTER[tone],
        pointerEvents: "none",
        ...style,
      }}
    />
  );
};

export default StarSparkle;
