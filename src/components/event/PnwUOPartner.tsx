import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import eventPnwCrowd from "@/assets/event-pnw-crowd.jpg";

const PnwUOPartner = () => {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden" style={{ backgroundColor: "#154733" }}>
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:24px_24px]" />

      <div className="relative z-10 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <h2
              className="font-headline font-bold text-events-cream leading-[1.1]"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
            >
              Gather is an outdoor industry discovery zone merging a{" "}
              <span style={{ color: "#FEE123" }}>career fair</span> &{" "}
              <span style={{ color: "#FEE123" }}>field marketing.</span>
            </h2>

            <p className="text-events-cream/70 font-body text-lg md:text-xl leading-relaxed">
              Portland is the <span className="font-semibold text-events-cream">beating heart</span> of the outdoor industry. 
              We partner with UO's world-class SPM program to bring together the PNW's most engaged 
              professionals, career-changers, and the next generation of outdoor talent.
            </p>

            <a
              href="mailto:jenna@wearetheoutdoorindustry.com?subject=I want to get in on Gather PNW"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-display font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: "#FEE123", color: "#154733" }}
            >
              Get in on this
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>

          {/* Right — Last year's photo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img
                src={eventPnwCrowd}
                alt="Gather PNW last year"
                className="w-full h-auto object-cover"
              />
            </div>
            <p className="mt-3 text-events-cream/40 text-xs font-body text-center italic">
              Gather PNW 2025
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PnwUOPartner;
