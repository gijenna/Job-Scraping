import { motion } from "framer-motion";
import heroImage from "@/assets/hero-event.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Outdoor industry professionals networking at a Gather event"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-6"
        >
          Basecamp Outdoor × Outside Days
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-display font-900 text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-6"
        >
          <span className="block text-foreground">GATHER</span>
          <span className="block text-gradient-gold">DENVER 2026</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="font-body text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-4"
        >
          The outdoor industry's premier career event. 900+ candidates.
          25+ brands. One unforgettable evening.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="font-display font-bold text-2xl md:text-3xl text-foreground mb-10"
        >
          May 29th, 2026 · Denver, CO
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="mailto:Austin@basecampjobs.com?subject=I'd like to sponsor GATHER Denver 2026"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-gold text-primary-foreground font-display font-bold text-lg rounded-lg hover:opacity-90 transition-opacity shadow-gold"
          >
            Become a Sponsor
          </a>
          <a
            href="#tiers"
            className="inline-flex items-center justify-center px-8 py-4 border border-primary/30 text-primary font-display font-semibold text-lg rounded-lg hover:bg-primary/10 transition-colors"
          >
            View Partnership Tiers
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-8 text-sm text-muted-foreground italic"
        >
          Named one of two top activations from 2024 & 2025 by Outside, Inc
        </motion.p>
      </div>
    </section>
  );
};

export default HeroSection;
