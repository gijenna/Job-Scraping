import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Camera } from "lucide-react";
import basecampLogo from "@/assets/basecamp-outdoor-logo.png";
import EditableText from "@/components/EditableText";
import hero1 from "@/assets/hero-rotation/AnthonyMarz_Basecamp-024_1-2.jpg.asset.json";
import hero2 from "@/assets/hero-rotation/AnthonyMarz_Basecamp-017_1-2.jpg.asset.json";
import hero3 from "@/assets/hero-rotation/AnthonyMarz_PopflyOutside-087.jpg.asset.json";
import hero4 from "@/assets/hero-rotation/Copy_of_AnthonyMarz_Basecamp-183.jpg.asset.json";
import hero5 from "@/assets/hero-rotation/AnthonyMarz_Basecamp-176.jpg.asset.json";
import hero6 from "@/assets/hero-rotation/AnthonyMarz_Basecamp-092.jpg.asset.json";

const heroImages = [hero1.url, hero2.url, hero3.url, hero4.url, hero5.url, hero6.url];

const HeroSection = () => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % heroImages.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-16">
      <div className="absolute inset-0">
        {heroImages.map((src, i) => (
          <img
            key={src}
            src={src}
            alt="Outdoor industry professionals networking at a Basecamp Gather event"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out"
            style={{ opacity: i === idx ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0 bg-background/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <a
        href="https://instagram.com/anthonymarz"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/40 backdrop-blur-sm text-foreground/70 hover:text-foreground hover:bg-background/60 transition-colors text-xs font-body"
      >
        <Camera className="w-3.5 h-3.5" />
        <span>@anthonymarz</span>
      </a>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex justify-center mb-8">
          <img src={basecampLogo} alt="Basecamp Outdoor logo" className="h-24 md:h-32 w-auto" />
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="font-display font-900 text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-6">
          <span className="block text-gradient-gold">GATHER</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="font-body text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10">
          <EditableText settingKey="hero_subtitle" defaultText="The outdoor industry's premier career events. Connecting top talent with the brands shaping the future of outdoor." as="span" multiline />
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/gather-pnw" className="inline-flex items-center justify-center px-8 py-4 bg-gradient-gold text-primary-foreground font-display font-bold text-lg rounded-lg hover:opacity-90 transition-opacity shadow-gold">
            Portland, April 16
          </Link>
          <Link to="/gather-denver" className="inline-flex items-center justify-center px-8 py-4 bg-gradient-gold text-primary-foreground font-display font-bold text-lg rounded-lg hover:opacity-90 transition-opacity shadow-gold">
            Denver, May 28
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
