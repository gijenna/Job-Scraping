import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import EditableText from "@/components/EditableText";
import hero1 from "@/assets/hero-rotation/AnthonyMarz_Basecamp-024_1-2.jpg.asset.json";
import hero2 from "@/assets/hero-rotation/AnthonyMarz_Basecamp-017_1-2.jpg.asset.json";
import hero3 from "@/assets/hero-rotation/AnthonyMarz_PopflyOutside-087.jpg.asset.json";
import hero4 from "@/assets/hero-rotation/Copy_of_AnthonyMarz_Basecamp-183.jpg.asset.json";
import hero5 from "@/assets/hero-rotation/AnthonyMarz_Basecamp-176.jpg.asset.json";
import hero6 from "@/assets/hero-rotation/AnthonyMarz_Basecamp-092.jpg.asset.json";

const heroImages = [hero1.url, hero2.url, hero3.url, hero4.url, hero5.url, hero6.url];

const EventsHero = () => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % heroImages.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative pt-16">
      <div className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="Basecamp Gather attendees networking outdoors"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out"
              style={{ opacity: i === idx ? 1 : 0 }}
            />
          ))}
          <div className="absolute inset-0 bg-events-teal/65" />
          <div className="absolute inset-0 bg-gradient-to-t from-events-teal via-transparent to-events-teal/30" />
        </div>

        <a
          href="https://instagram.com/anthonymarz"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-6 right-6 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-events-teal/40 backdrop-blur-sm text-events-cream/80 hover:text-events-cream hover:bg-events-teal/60 transition-colors text-xs font-body"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>@anthonymarz</span>
        </a>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center w-full">
          <p className="font-glacial text-events-cream/80 text-lg md:text-xl tracking-wide mb-3">
            <EditableText settingKey="hero_eyebrow" defaultText="What's On" as="span" />
          </p>
          <h1 className="font-display text-events-cream text-4xl md:text-6xl lg:text-7xl font-bold leading-tight drop-shadow-lg">
            <EditableText settingKey="hero_headline" defaultText="Happenings at Basecamp" as="span" />
          </h1>
        </div>
      </div>

      <div className="relative -mt-1 bg-events-cream">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none">
          <path d="M0,0 L0,20 Q30,45 60,25 Q90,5 120,30 Q150,55 180,35 Q210,15 240,40 Q270,65 300,40 Q330,15 360,35 Q390,55 420,30 Q450,5 480,25 Q510,45 540,20 Q570,0 600,25 Q630,50 660,30 Q690,10 720,35 Q750,60 780,35 Q810,10 840,30 Q870,50 900,25 Q930,0 960,20 Q990,40 1020,25 Q1050,10 1080,35 Q1110,60 1140,40 Q1170,20 1200,35 Q1230,50 1260,30 Q1290,10 1320,25 Q1350,40 1380,20 Q1410,0 1440,15 L1440,0 Z" className="fill-events-teal" />
        </svg>
      </div>
    </section>
  );
};

export default EventsHero;
