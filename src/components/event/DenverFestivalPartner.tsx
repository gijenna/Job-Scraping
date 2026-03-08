import { motion } from "framer-motion";
import headlinersImg from "@/assets/outside-days-headliners.png";

const DenverFestivalPartner = () => {
  return (
    <section className="relative py-20 md:py-28 bg-[#19363B] overflow-hidden">
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
              <span className="text-events-yellow">career fair</span> &{" "}
              <span className="text-events-yellow">field marketing.</span>
            </h2>

            <p className="text-events-cream/70 font-body text-lg md:text-xl leading-relaxed">
              We're the only <span className="font-semibold text-events-cream">FREE</span> activation
              at Outside Days' 40,000-person festival — and we've been a partner since day one.
            </p>

            <p className="text-events-yellow/80 font-body text-sm italic">
              Psst — Basecamp partners get free tix 🎟️
            </p>

            <a
              href="https://bit.ly/outside-days"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-events-yellow font-body text-sm tracking-widest uppercase hover:opacity-80 transition-opacity"
            >
              outsidedays.outsideonline.com →
            </a>
          </motion.div>

          {/* Right — Headliner imagery */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <a
              href="https://bit.ly/outside-days"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow"
            >
              <img
                src={headlinersImg}
                alt="Outside Days 2026 headliners — Death Cab for Cutie, My Morning Jacket, Cage the Elephant"
                className="w-full h-auto object-cover"
              />
            </a>
            <p className="mt-3 text-events-cream/40 text-xs font-body text-center italic">
              2026 Outside Days headliners — May 29–31, Denver CO
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DenverFestivalPartner;
