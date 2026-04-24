import { motion } from "framer-motion";
import { Check } from "lucide-react";
import oakleyMetaGlasses from "@/assets/oakley-meta-glasses.png";

const OAKLEY_ORANGE = "#F47B00";

const bullets = [
  "Built for every athlete, from the morning walker to Olympic medalists and elite snowboarders.",
  "Prizm lens technology, dialed for trail, snow, and road.",
  "Try the Meta × Oakley smart glasses live on-site, capture, livestream, and play hands-free.",
];

const OakleyMetaDemo = () => {
  return (
    <section className="py-20 md:py-24 px-6 bg-events-teal">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl p-8 md:p-14 overflow-hidden border border-events-cream/10"
          style={{
            background: "linear-gradient(135deg, #0a1416 0%, #122a2e 50%, #0a1416 100%)",
          }}
        >
          {/* Glow accents */}
          <div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none"
            style={{ backgroundColor: OAKLEY_ORANGE }}
          />
          <div
            className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ backgroundColor: OAKLEY_ORANGE }}
          />

          <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Copy */}
            <div>
              <span
                className="inline-block text-xs font-display font-bold tracking-widest uppercase mb-4"
                style={{ color: OAKLEY_ORANGE }}
              >
                On-Site at Outside Days
              </span>
              <h2 className="font-headline font-bold text-3xl md:text-5xl text-events-cream mb-5 leading-tight">
                Try the Meta × Oakley smart glasses live.
              </h2>
              <p className="font-body text-events-cream/75 text-base md:text-lg mb-6 leading-relaxed">
                For 50 years, Oakley has built eyewear for everyone who moves. They're bringing a live demo of the new Meta × Oakley smart glasses to Outside Days
              </p>

              <ul className="space-y-3 mb-2">
                {bullets.map((b, i) => (
                  <li key={i} className="flex gap-3 text-events-cream/85 font-body text-sm md:text-base">
                    <Check
                      className="w-5 h-5 shrink-0 mt-0.5"
                      style={{ color: OAKLEY_ORANGE }}
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Floating glasses */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative flex items-center justify-center"
            >
              <motion.img
                src={oakleyMetaGlasses}
                alt="Meta × Oakley smart glasses"
                width={1024}
                height={1024}
                loading="lazy"
                className="relative z-10 w-full max-w-md drop-shadow-2xl"
                animate={{
                  y: [0, -14, 0],
                  rotateY: [-8, 8, -8],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ transformStyle: "preserve-3d", perspective: 1000 }}
              />
              <div
                className="absolute inset-0 rounded-full blur-3xl opacity-40 pointer-events-none"
                style={{ backgroundColor: OAKLEY_ORANGE }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OakleyMetaDemo;
