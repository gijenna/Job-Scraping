import { useEffect, useState } from "react";
import EditableText from "@/components/EditableText";
import EditableLink from "@/components/EditableLink";
import hero1 from "@/assets/mn26/AnthonyMarz_Basecamp-024.jpg.asset.json";
import hero2 from "@/assets/mn26/AnthonyMarz_Basecamp-017.jpg.asset.json";
import hero3 from "@/assets/mn26/AnthonyMarz_Basecamp-019.jpg.asset.json";
import hero4 from "@/assets/mn26/AnthonyMarz_Basecamp-021.jpg.asset.json";
import hero5 from "@/assets/mn26/Copy_of_AnthonyMarz_Basecamp-183.jpg.asset.json";
import lockup from "@/assets/mn26/or-gatherings-square.png.asset.json";

const FOREST = "#1A2520";
const CREAM = "#F2E7D5";
const CORAL = "#E8836B";
const SAGE = "#A8B5A0";
const REGISTER = "https://basecampoutdoor.typeform.com/ORgatherings";
const APPLY = "https://basecampoutdoor.typeform.com/MNExperts";

const heroImages = [hero1.url, hero2.url, hero3.url, hero4.url, hero5.url];

const MNHero = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % heroImages.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      className="relative w-full flex items-center justify-center px-6 py-24 md:py-0 md:min-h-screen min-h-[70vh] overflow-hidden"
      style={{ backgroundColor: FOREST, color: CREAM }}
    >
      <div className="absolute inset-0">
        {heroImages.map((src, i) => (
          <img
            key={src}
            src={src}
            alt="Basecamp Outdoor Lounge attendees networking"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out"
            style={{ opacity: i === idx ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(26,37,32,0.72)" }} />
      </div>

      <div className="relative z-10 max-w-4xl text-center space-y-6">
        <img
          src={lockup.url}
          alt="Basecamp Outdoor @ Minneapolis · OR Gatherings"
          className="mx-auto w-full max-w-[360px] h-auto block -mb-8 md:-mb-10"
        />
        <p className="uppercase !mt-0" style={{ fontSize: 13, letterSpacing: "1.6px", color: CREAM }}>
          <EditableText settingKey="hero_kicker" defaultText="AN OR GATHERING · HOSTED BY BASECAMP OUTDOOR" as="span" />
        </p>
        <h1 className="font-normal leading-tight" style={{ fontSize: "clamp(36px, 5.5vw, 56px)", color: CREAM }}>
          <EditableText settingKey="hero_headline" defaultText="This is the room you've been trying to get into." as="span" multiline />
        </h1>
        <p className="italic" style={{ fontSize: 20, color: SAGE }}>
          <EditableText settingKey="hero_sub" defaultText="Two intentional Gatherings on the show floor. No OR badge needed." as="span" />
        </p>
        <p className="uppercase" style={{ fontSize: 14, letterSpacing: "1.4px", color: CREAM }}>
          <EditableText
            settingKey="hero_date_line"
            defaultText="AUG 20 + 21 · MINNEAPOLIS CONVENTION CENTER · INSIDE OUTDOOR RETAILER"
            as="span"
          />
        </p>
        <div className="pt-4 flex flex-col items-center gap-5">
          <EditableLink
            textKey="hero_register_text"
            urlKey="hero_register_url"
            defaultText="Register free · no badge needed"
            defaultUrl={REGISTER}
            className="inline-block rounded-full font-bold transition hover:opacity-90"
            style={{ backgroundColor: CORAL, color: CREAM, fontSize: 18, padding: "18px 40px" }}
          />
          <EditableLink
            textKey="hero_apply_text"
            urlKey="hero_apply_url"
            defaultText="Are you an industry expert? Apply here →"
            defaultUrl={APPLY}
            className="italic underline-offset-4 hover:underline"
            style={{ color: CREAM, fontSize: 14 }}
          />
        </div>
      </div>
    </section>
  );
};

export default MNHero;
