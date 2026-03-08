import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import heroMountains from "@/assets/hero-denver-mountains.jpg";
import denverLogo from "@/assets/denver-logo.png";
import { MapPin, Calendar, Clock } from "lucide-react";

const phrases = ["talent pipeline", "customer base", "community"];

const DenverHero = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (settled) return;
    if (phraseIndex < phrases.length - 1) {
      const timer = setTimeout(() => setPhraseIndex(phraseIndex + 1), 2200);
      return () => clearTimeout(timer);
    } else {
      setSettled(true);
    }
  }, [phraseIndex, settled]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Ken Burns background */}
      <div className="absolute inset-0">
        <img
          src={heroMountains}
          alt="Colorado Rocky Mountains at sunset"
          className="w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-background/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side — animated headline */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1 className="font-headline uppercase leading-[0.95] text-foreground">
                <span className="block text-5xl md:text-7xl lg:text-8xl">Connect</span>
                <span className="block text-5xl md:text-7xl lg:text-8xl">with your</span>
                <span className="block relative h-[1.1em] text-5xl md:text-7xl lg:text-8xl overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={phraseIndex}
                      initial={{ y: 60, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -60, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="absolute left-0 text-primary"
                    >
                      {phrases[phraseIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8"
            >
              <a
                href="mailto:Austin@basecampjobs.com?cc=jenna@wearetheoutdoorindustry.com&subject=I'd%20like%20to%20sponsor%20Gather%20Denver%202026"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-gold text-primary-foreground font-display font-bold text-lg rounded-lg hover:opacity-90 transition-opacity shadow-gold"
              >
                Become a Sponsor
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-4 text-sm text-muted-foreground italic"
            >
              Named one of two top activations from 2024 &amp; 2025 by Outside, Inc
            </motion.p>
          </div>

          {/* Right side — logo + event details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col items-center lg:items-end text-center lg:text-right"
          >
            <img
              src={denverLogo}
              alt="Gather Denver logo"
              className="w-56 md:w-72 h-auto drop-shadow-lg mb-8"
            />

            <div className="space-y-3 text-foreground/90">
              <div className="flex items-center gap-3 justify-center lg:justify-end">
                <Calendar className="w-5 h-5 text-primary shrink-0" />
                <span className="font-display font-bold text-lg md:text-xl">May 29, 2026</span>
              </div>
              <div className="flex items-center gap-3 justify-center lg:justify-end">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <span className="font-body text-base md:text-lg">1–4 PM · Doors at 12 PM MT</span>
              </div>
              <div className="flex items-center gap-3 justify-center lg:justify-end">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span className="font-body text-base md:text-lg">Auraria Campus · Denver, CO</span>
              </div>
            </div>

            <p className="mt-6 text-sm text-muted-foreground max-w-sm font-body leading-relaxed">
              Part of the 40,000-person{" "}
              <a
                href="https://bit.ly/4bDCrsv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:opacity-80"
              >
                Outside Days Festival
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DenverHero;
