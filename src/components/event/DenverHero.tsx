import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import heroMountains from "@/assets/hero-denver-mountains.jpg";
import denverLogo from "@/assets/denver-logo.png";

const phrases = ["talent pipeline", "customer base", "community"];

const DenverHero = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (settled) return;
    if (phraseIndex < phrases.length - 1) {
      const timer = setTimeout(() => setPhraseIndex(phraseIndex + 1), 2400);
      return () => clearTimeout(timer);
    } else {
      setSettled(true);
    }
  }, [phraseIndex, settled]);

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
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

      <div className="relative z-10 container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-0 items-center max-w-7xl mx-auto">
          {/* Left — logo + date */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <img
              src={denverLogo}
              alt="Gather Denver logo"
              className="w-48 md:w-64 h-auto drop-shadow-lg mb-5"
            />
            <p className="text-foreground/60 font-body text-sm tracking-widest uppercase">
              May 29, 2026 · Denver, CO
            </p>
          </motion.div>

          {/* Divider */}
          <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-px bg-gradient-to-b from-transparent via-foreground/15 to-transparent" />

          {/* Right — Fredoka text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: "easeOut" }}
            className="flex flex-col justify-center items-center lg:items-start px-4 lg:px-8"
          >
            <h2 className="font-headline font-bold text-events-cream leading-none mb-3" style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)" }}>
              Connect<br />with your
            </h2>

            {/* Rotating phrase */}
            <div className="relative w-full overflow-hidden" style={{ height: "clamp(2.5rem, 5vw, 4.5rem)" }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={phraseIndex}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute left-0 top-0 font-headline font-bold text-events-yellow whitespace-nowrap leading-none"
                  style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)" }}
                >
                  {phrases[phraseIndex]}
                </motion.span>
              </AnimatePresence>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-4 text-xs text-muted-foreground/60 italic font-body"
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
