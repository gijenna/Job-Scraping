import { motion } from "framer-motion";

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
              Basecamp Outdoor ×{" "}
              <span style={{ color: "#FEE123" }}>University of Oregon</span>'s
              Sports Product Management program.
            </h2>

            <p className="text-events-cream/70 font-body text-lg md:text-xl leading-relaxed">
              Portland is the <span className="font-semibold text-events-cream">beating heart</span> of the outdoor industry. 
              We partner with UO's world-class SPM program to bring together the PNW's most engaged 
              professionals, career-changers, and the next generation of outdoor talent.
            </p>

            <p className="font-body text-sm italic" style={{ color: "#FEE123", opacity: 0.8 }}>
              Located at UO's new Portland Campus — 2800 NE Liberty St
            </p>

            <a
              href="https://business.uoregon.edu/spm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-sm tracking-widest uppercase hover:opacity-80 transition-opacity"
              style={{ color: "#FEE123" }}
            >
              UO Sports Product Management →
            </a>
          </motion.div>

          {/* Right — UO Logo / Imagery */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl p-12 flex flex-col items-center gap-6" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
              <img
                src="https://www.google.com/s2/favicons?domain=uoregon.edu&sz=128"
                alt="University of Oregon"
                className="w-20 h-20 object-contain"
              />
              <div className="text-center">
                <p className="font-display font-bold text-xl text-events-cream">University of Oregon</p>
                <p className="font-body text-sm text-events-cream/60 mt-1">Sports Product Management</p>
                <p className="font-body text-xs text-events-cream/40 mt-3">
                  The program that feeds footwear, apparel, and outdoor product teams at Nike, Adidas, Columbia, and beyond.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PnwUOPartner;
