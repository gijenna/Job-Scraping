import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import bestdayEvent1 from "@/assets/bestday-event-1.jpg";
import bestdayEvent2 from "@/assets/bestday-event-2.jpg";
import bestdayEvent3 from "@/assets/bestday-event-3.jpg";
import bestdayEvent4 from "@/assets/bestday-event-4.jpg";

const BEST_DAY_LOGO = "https://bestdaybrewing.com/cdn/shop/files/916_IG_Feed_Ads_1200_x_1200_px_3.png?v=1739926696&width=400";

const photos = [bestdayEvent1, bestdayEvent2, bestdayEvent3, bestdayEvent4];

const BestDayRegistrantSpotlight = () => {
  return (
    <section className="py-16 md:py-20 px-6 bg-gradient-to-b from-events-teal to-[#0d1f22]">
      <div className="container mx-auto max-w-5xl">
        {/* Logo + tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <img
            src={BEST_DAY_LOGO}
            alt="Best Day Brewing"
            className="h-20 md:h-24 w-auto mx-auto mb-6 rounded-xl"
          />
          <p className="font-body text-events-cream/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Last year we shifted to fully sober events — and the response from both job seekers and brands was incredible.
          </p>
        </motion.div>

        {/* North Face quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="relative max-w-3xl mx-auto mb-12 px-8 py-6 border-l-4 border-events-yellow bg-events-card/30 rounded-r-xl"
        >
          <p className="font-body text-events-cream/80 text-sm md:text-base italic leading-relaxed">
            "Last year, we made the decision to remove alcohol from our events. We weren't sure how it'd go, but the feedback was overwhelmingly positive. Conversations were more genuine, people stayed longer, and both recruiters and candidates told us it felt more professional and welcoming."
          </p>
          <footer className="mt-3 font-display text-events-cream/50 text-xs tracking-wide uppercase">
            — Recruiter, The North Face
          </footer>
        </motion.blockquote>

        {/* Photo strip */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-8"
        >
          {photos.map((src, i) => (
            <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden">
              <img
                src={src}
                alt={`Gather event photo ${i + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <a
            href="https://bestdaybrewing.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-display font-bold text-events-yellow hover:text-events-cream transition-colors"
          >
            Explore Best Day Brewing <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default BestDayRegistrantSpotlight;
