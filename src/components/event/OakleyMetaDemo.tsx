import { motion } from "framer-motion";
import { Camera, Mic, Sparkles, Check } from "lucide-react";

const OAKLEY_ORANGE = "#F47B00";

const bullets = [
  "Hands-on demo station inside the Oakley activation footprint.",
  "First look for outdoor creators, athletes, and brand marketers.",
  "Natural lead-gen for influencer, creator-economy, and brand partnerships.",
];

const OakleyMetaDemo = () => {
  return (
    <section className="py-20 md:py-24 px-6 bg-events-teal">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl p-10 md:p-16 overflow-hidden border border-events-cream/10"
          style={{
            background: "linear-gradient(135deg, #0a1416 0%, #122a2e 50%, #0a1416 100%)",
          }}
        >
          {/* Glow accent */}
          <div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none"
            style={{ backgroundColor: OAKLEY_ORANGE }}
          />
          <div
            className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ backgroundColor: OAKLEY_ORANGE }}
          />

          <div className="relative">
            <span
              className="inline-block text-xs font-display font-bold tracking-widest uppercase mb-4"
              style={{ color: OAKLEY_ORANGE }}
            >
              On-Site Activation
            </span>
            <h2 className="font-headline font-bold text-3xl md:text-5xl text-events-cream mb-6 leading-tight">
              Live Meta × Oakley smart glasses demo.
            </h2>
            <p className="font-body text-events-cream/70 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
              Outside Days draws the exact crowd Meta and Oakley are building for: outdoor creators, athletes, recruiters, and brand marketers. Drop a demo station in the room and watch the right hands try the future on.
            </p>

            <ul className="space-y-3 mb-8 max-w-2xl">
              {bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-events-cream/80 font-body">
                  <Check
                    className="w-5 h-5 shrink-0 mt-0.5"
                    style={{ color: OAKLEY_ORANGE }}
                  />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-6 pt-6 border-t border-events-cream/10">
              <div className="flex items-center gap-3 text-events-cream/40">
                <Camera className="w-5 h-5" />
                <Mic className="w-5 h-5" />
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-events-cream/40 font-body text-sm tracking-wider">
                Powered by Meta
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OakleyMetaDemo;
