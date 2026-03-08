import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import heroMountains from "@/assets/hero-denver-mountains.jpg";
import denverLogo from "@/assets/denver-logo.png";
import { MapPin, Calendar, Clock } from "lucide-react";

const phrases = ["talent pipeline", "customer base", "community"];

const DenverHero = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Ken Burns background */}
      <div className="absolute inset-0">
        <img
          src={heroMountains}
          alt="Colorado Rocky Mountains at sunset"
          className="w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/40" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Left — logo + event details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" }}
            className="flex flex-col items-center lg:items-end"
          >
            <img
              src={denverLogo}
              alt="Gather Denver logo"
              className="w-48 md:w-64 h-auto drop-shadow-lg mb-6"
            />

            <div className="space-y-2 text-foreground/80">
              <div className="flex items-center gap-2.5 justify-center lg:justify-end">
                <Calendar className="w-4 h-4 text-primary/80 shrink-0" />
                <span className="font-body text-sm tracking-wide">May 29, 2026</span>
              </div>
              <div className="flex items-center gap-2.5 justify-center lg:justify-end">
                <Clock className="w-4 h-4 text-primary/80 shrink-0" />
                <span className="font-body text-sm tracking-wide">1–4 PM · Doors 12 PM MT</span>
              </div>
              <div className="flex items-center gap-2.5 justify-center lg:justify-end">
                <MapPin className="w-4 h-4 text-primary/80 shrink-0" />
                <span className="font-body text-sm tracking-wide">Auraria Campus · Denver, CO</span>
              </div>
            </div>

            <p className="mt-4 text-xs text-muted-foreground max-w-xs text-center lg:text-right font-body">
              Part of the 40,000-person{" "}
              <a
                href="https://bit.ly/4bDCrsv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/80 underline hover:text-primary transition-colors"
              >
                Outside Days Festival
              </a>
            </p>
          </motion.div>

          {/* Divider */}
          <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-px bg-gradient-to-b from-transparent via-foreground/15 to-transparent" />

          {/* Right — headline */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: "easeOut" }}
            className="flex flex-col items-center lg:items-start"
          >
            <h1 className="font-headline uppercase leading-[0.92] tracking-tight text-foreground">
              <span className="block text-4xl md:text-6xl lg:text-7xl">Connect</span>
              <span className="block text-4xl md:text-6xl lg:text-7xl">with your</span>
              <span className="block relative h-[1.05em] text-4xl md:text-6xl lg:text-7xl overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={phraseIndex}
                    initial={{ y: 50, opacity: 0, filter: "blur(4px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -50, opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="absolute left-0 text-primary whitespace-nowrap"
                  >
                    {phrases[phraseIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-6 text-xs text-muted-foreground/70 italic font-body"
            >
              Named one of two top activations from 2024 &amp; 2025 by Outside, Inc
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DenverHero;
