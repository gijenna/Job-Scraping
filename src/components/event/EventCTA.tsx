import { motion } from "framer-motion";

interface EventCTAProps {
  ctaEmail: string;
  eventName: string;
  headline?: string;
  subtitle?: string;
}

const EventCTA = ({
  ctaEmail,
  eventName,
  headline = "Ready to Be Part of This?",
  subtitle = "Spots are limited and filling fast. Reach out to secure your presence at the outdoor industry's most talked-about career event.",
}: EventCTAProps) => {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-6">
            {headline}
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto mb-10">
            {subtitle}
          </p>
          <a
            href={`mailto:${ctaEmail}?cc=jenna@wearetheoutdoorindustry.com&subject=I'd like to sponsor ${eventName}`}
            className="inline-flex items-center justify-center px-10 py-4 bg-gradient-gold text-primary-foreground font-display font-bold text-lg rounded-lg hover:opacity-90 transition-opacity shadow-gold"
          >
            Get in Touch
          </a>
          <p className="mt-6 text-muted-foreground text-sm font-body">
            Contact:{" "}
            <a
              href={`mailto:${ctaEmail}`}
              className="text-primary hover:underline"
            >
              {ctaEmail}
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default EventCTA;
