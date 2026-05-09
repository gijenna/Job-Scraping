import { ReactNode } from "react";
import heroEvent from "@/assets/connect-hero-event.jpg";
import connectLogo from "@/assets/connect-basecamp-outside-days.png";
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
          src={heroEvent}
          alt="Basecamp Outdoor at Outside Days"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay for logo legibility */}
        <div className="absolute inset-0 bg-events-teal/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-events-teal/40 via-transparent to-events-teal/80" />
        <div className="relative px-4 pt-8 pb-10 md:pt-12 md:pb-14 flex flex-col items-center text-center">
          <img
            src={connectLogo}
            alt="Basecamp Outdoor at Outside Days"
            className="h-32 md:h-44 w-auto drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          />
          <EditableText
            settingKey="connect_hero_subtitle"
            defaultText="Career fair connections. Denver, May 28."
            as="p"
            className="font-body text-events-cream/90 text-sm md:text-base mt-3"
          />
        </div>
      </div>
    )}
    <div className={`${widthClass[maxWidth]} mx-auto px-4 py-6 md:py-10`}>{children}</div>
  </div>
);

export default ConnectShell;
