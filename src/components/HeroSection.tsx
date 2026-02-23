import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-event.jpg";
import basecampLogo from "@/assets/basecamp-outdoor-logo.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-16">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Diverse group of outdoor industry professionals networking at a Gather event"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <img
           src={basecampLogo}
            alt="Basecamp Outdoor logo"
            className="h-24 md:h-32 w-auto"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-display font-900 text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-6"
        >
          <span className="block text-gradient-gold">GATHER</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="font-body text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10"
        >
          The outdoor industry's premier career events. Connecting top talent
          with the brands shaping the future of outdoor.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/gather-pnw"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-gold text-primary-foreground font-display font-bold text-lg rounded-lg hover:opacity-90 transition-opacity shadow-gold"
          >
            Portland — April 16
          </Link>
          <Link
            to="/gather-denver"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-gold text-primary-foreground font-display font-bold text-lg rounded-lg hover:opacity-90 transition-opacity shadow-gold"
          >
            Denver — May 29
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
