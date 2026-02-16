import { motion } from "framer-motion";

interface EventHeroProps {
  videoSrc: string;
  tagline: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  subtitleLink?: { text: string; url: string };
  date: string;
  ctaEmail: string;
  ctaSubject: string;
  accolade?: string;
  logoSrc?: string;
}

const EventHero = ({
  videoSrc,
  tagline,
  title,
  titleAccent,
  subtitle,
  subtitleLink,
  date,
  ctaEmail,
  ctaSubject,
  accolade,
  logoSrc,
}: EventHeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-6"
        >
          {tagline}
        </motion.p>

        {logoSrc && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <img
              src={logoSrc}
              alt="Event logo"
              className="w-64 md:w-80 h-auto mx-auto drop-shadow-lg"
            />
          </motion.div>
        )}

        {(title || titleAccent) && (
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-display font-900 text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-6"
          >
            {title && <span className="block text-foreground">{title}</span>}
            {titleAccent && <span className="block text-gradient-gold">{titleAccent}</span>}
          </motion.h1>
        )}

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="font-body text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-4 whitespace-pre-line"
        >
          {subtitle}
          {subtitleLink && (
            <>
              {" "}
              <a
                href={subtitleLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:opacity-80"
              >
                {subtitleLink.text}
              </a>
              .
            </>
          )}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="font-display font-bold text-2xl md:text-3xl text-foreground mb-10"
        >
          {date}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href={`mailto:${ctaEmail}?cc=jenna@wearetheoutdoorindustry.com&subject=${encodeURIComponent(ctaSubject)}`}
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

        {accolade && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-8 text-sm text-muted-foreground italic"
          >
            {accolade}
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default EventHero;
