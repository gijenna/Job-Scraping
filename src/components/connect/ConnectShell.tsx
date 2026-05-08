import { ReactNode } from "react";
import heroMountains from "@/assets/hero-denver-mountains.jpg";
import basecampLogo from "@/assets/basecamp-outdoor-logo.png";
import outsideDaysLogo from "@/assets/outside-days-logo.png";
import EditableText from "@/components/EditableText";

interface ConnectShellProps {
  children: ReactNode;
  /** When true, renders the hero photo with logo lockup. Otherwise just the dark teal background. */
  hero?: boolean;
  maxWidth?: "md" | "lg" | "xl" | "2xl" | "4xl";
}

const widthClass: Record<NonNullable<ConnectShellProps["maxWidth"]>, string> = {
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
};

const ConnectShell = ({ children, hero = true, maxWidth = "md" }: ConnectShellProps) => (
  <div className="min-h-screen bg-events-teal text-events-cream">
    {hero && (
      <div className="relative w-full overflow-hidden">
        <img
          src={heroMountains}
          alt="Outside Days at Auraria Campus, Denver"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-events-teal/70" />
        <div className="relative px-4 pt-8 pb-10 md:pt-12 md:pb-14 flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={basecampLogo} alt="Basecamp Outdoor" className="h-12 w-auto drop-shadow-md" />
            <span className="font-body text-events-cream/90 text-2xl md:text-3xl font-light">@</span>
            <img src={outsideDaysLogo} alt="Outside Days" className="h-14 md:h-20 w-auto drop-shadow-md" />
          </div>
          <EditableText
            settingKey="connect_hero_subtitle"
            defaultText="Career fair connections. Denver, May 28."
            as="p"
            className="font-body text-events-cream/80 text-sm md:text-base"
          />
        </div>
      </div>
    )}
    <div className={`${widthClass[maxWidth]} mx-auto px-4 py-6 md:py-10`}>{children}</div>
  </div>
);

export default ConnectShell;
