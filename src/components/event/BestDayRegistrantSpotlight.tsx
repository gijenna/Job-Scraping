import { motion } from "framer-motion";
import { ArrowRight, Sun } from "lucide-react";
import bestdayEvent1 from "@/assets/bestday-event-1.jpg";
import bestdayEvent4 from "@/assets/bestday-event-4.jpg";

const BEST_DAY_LOGO = "https://logo.clearbit.com/bestdaybrewing.com";

const BestDayRegistrantSpotlight = () => {
  return (
    <section className="py-12 md:py-16 px-6 bg-gradient-to-b from-[#0d1f22] to-events-teal">
      <div className="container mx-auto max-w-5xl">
        {/* Logo + Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 mb-5">
            <img
              src={BEST_DAY_LOGO}
              alt="Best Day Brewing"
              className="h-12 w-12 rounded-full border-2 border-events-yellow/40 shadow-lg"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <span className="font-headline font-bold text-2xl md:text-3xl tracking-tight text-events-cream">
              Best Day Brewing
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sun className="w-4 h-4 text-events-yellow" />
            <span className="text-xs font-display font-bold tracking-[0.2em] uppercase text-events-yellow">
              Title Sponsor
            </span>
            <Sun className="w-4 h-4 text-events-yellow" />
          </div>
          <h2 className="font-headline font-bold text-3xl md:text-4xl text-events-cream">
            A Proudly Sober Event
          </h2>
        </motion.div>

        {/* Two-column: Photo + Quote */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
        >
          {/* Photo 1 */}
          <div className="aspect-[3/4] md:aspect-auto rounded-2xl overflow-hidden">
            <img
              src={bestdayEvent1}
              alt="Gather event — sober networking"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Quote + Copy */}
          <div className="flex flex-col justify-center py-4 md:py-8">
            <p className="font-body text-events-cream/80 text-base md:text-lg leading-relaxed mb-6">
              Last year we shifted to fully sober events — and the response from both job seekers and brands was incredible. Clear eyes, real connections, and a professional atmosphere that lets the outdoor industry's best talent shine.
            </p>

            <blockquote className="border-l-3 border-events-yellow pl-5 mb-6">
              <p className="font-body text-events-cream/70 text-sm md:text-base italic leading-relaxed">
                "Last year, we made the decision to remove alcohol from our events. We weren't sure how it'd go, but the feedback was overwhelmingly positive. Conversations were more genuine, people stayed longer, and both recruiters and candidates told us it felt more professional and welcoming."
              </p>
              <footer className="mt-2 font-display text-events-cream/50 text-xs tracking-wide uppercase">
                — Recruiter, The North Face
              </footer>
            </blockquote>

            <p className="font-body text-events-cream/50 text-sm leading-relaxed">
              Born in Northern California, Best Day Brewing crafts the world's best-tasting non-alcoholic beer for the adventure-seeking, fun-loving outdoor community.
            </p>
          </div>
        </motion.div>

        {/* Full-width cinematic photo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="aspect-[21/9] rounded-2xl overflow-hidden mb-6"
        >
          <img
            src={bestdayEvent4}
            alt="Gather event crowd"
            className="w-full h-full object-cover"
          />
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
