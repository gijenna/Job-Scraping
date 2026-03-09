import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface RegistrantHeroProps {
  backgroundSrc: string;
  backgroundType: "video" | "image";
  logoSrc: string;
  logoAlt: string;
  date: string;
  location: string;
  time: string;
  tagline: string;
  registrationUrl: string;
  sponsorPageUrl: string;
  overlayColor?: string;
  accentColor?: string;
}

const RegistrantHero = ({
  backgroundSrc,
  backgroundType,
  logoSrc,
  logoAlt,
  date,
  location,
  time,
  tagline,
  registrationUrl,
  sponsorPageUrl,
  overlayColor = "rgba(25, 54, 59, 0.65)",
  accentColor = "#E1B624",
}: RegistrantHeroProps) => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {backgroundType === "video" ? (
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src={backgroundSrc} type="video/mp4" />
          </video>
        ) : (
          <img src={backgroundSrc} alt="" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0" style={{ backgroundColor: overlayColor }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.img
          src={logoSrc}
          alt={logoAlt}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-48 md:w-72 h-auto mx-auto mb-6 drop-shadow-2xl"
        />

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-display font-bold text-xl md:text-2xl text-white mb-2"
        >
          {date}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="font-body text-white/70 text-sm md:text-base mb-1"
        >
          {location}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="font-body text-white/50 text-sm mb-8"
        >
          {time}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="font-headline font-medium text-lg md:text-2xl max-w-xl mx-auto mb-10 leading-relaxed"
          style={{ color: accentColor }}
        >
          {tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a
            href={registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-display font-bold text-lg shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{ backgroundColor: accentColor, color: "#19363B" }}
          >
            Register Free
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href={sponsorPageUrl}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-display font-bold text-base border-2 border-white/30 text-white/90 transition-all duration-300 hover:border-white/60 hover:text-white hover:scale-105"
          >
            Join as a Brand
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default RegistrantHero;
