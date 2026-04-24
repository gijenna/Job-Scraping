import { motion } from "framer-motion";
import { MapPin, Clock, ArrowRight, ExternalLink } from "lucide-react";

const HERO_IMG = "https://cdn.assets.prezly.com/8c6136a6-712c-4d77-a51d-a9da86618e21/-/format/auto/Rino.jpg";
const PRESS_URL = "https://oakley-media-hub.prezly.com/oakley-unveils-next-gen-retail-hub-in-denvers-river-north-arts-district-5f206e";
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=2660+Walnut+Street+Unit+3+Denver+CO";

const features = [
  "Customization Zone",
  "Prizm Wall",
  "Museum Wall",
  "Catalyst Wall",
  "Rooftop Lounge",
];

const OakleyRinoStorefront = () => {
  return (
    <section className="py-20 md:py-28 px-6 bg-gradient-to-b from-events-teal to-[#0d1f22]">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-display font-bold tracking-widest uppercase text-events-yellow mb-3">
            Now Open in Denver
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden shadow-2xl border border-events-cream/10"
          >
            <img
              src={HERO_IMG}
              alt="Oakley RiNo storefront in Denver"
              className="w-full h-[420px] md:h-[520px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-events-teal/40 via-transparent to-transparent pointer-events-none" />
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-headline font-bold text-3xl md:text-5xl text-events-cream mb-6 leading-tight">
              Make sure to visit Oakley RiNo while you're in Denver.
            </h2>
            <p className="font-body text-events-cream/70 text-lg leading-relaxed mb-6">
              Oakley's next-gen retail hub blurs the lines between performance and culture, a space built for the athletes, artists, and creators of River North Arts District.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {features.map((f, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-body font-semibold bg-events-card/60 text-events-cream/80 border border-events-yellow/30"
                >
                  {f}
                </span>
              ))}
            </div>

            <div className="bg-events-card/50 border border-events-cream/10 rounded-2xl p-6 mb-6">
              <div className="flex items-start gap-3 mb-3">
                <MapPin className="w-5 h-5 text-events-yellow shrink-0 mt-0.5" />
                <div>
                  <p className="font-headline font-bold text-events-cream">2660 Walnut Street, Unit 3</p>
                  <p className="font-body text-events-cream/60 text-sm">Denver, CO</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-events-yellow shrink-0" />
                <p className="font-body text-events-cream/70 text-sm">Mon–Sun · 10 AM – 6 PM</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-display font-bold text-base bg-events-yellow text-events-teal hover:scale-105 transition-transform"
              >
                Get Directions <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={PRESS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-display font-bold text-base border border-events-cream/30 text-events-cream/90 hover:bg-events-card/50 transition"
              >
                Read the Announcement <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OakleyRinoStorefront;
