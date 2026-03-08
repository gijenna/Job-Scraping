import { motion } from "framer-motion";

interface StatItem {
  number: string;
  suffix?: string;
  label: string;
}

const stats: StatItem[] = [
  { number: "500", suffix: "+", label: "Outdoor Industry Professionals Per Event" },
  { number: "88", suffix: "%", label: "Have Management Experience" },
  { number: "67", suffix: "%", label: "Have 6+ Years Industry Experience" },
  { number: "40K", suffix: "+", label: "Festival Attendees Surrounding Our Activation" },
];

const DenverByTheNumbers = () => {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#0d1f22" }}>
      <div className="relative py-24 md:py-36">
        {/* Scattered placeholder images — positioned around the stats */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Top-left photo placeholder */}
          <div className="absolute top-8 left-4 md:left-12 w-32 md:w-44 h-44 md:h-56 rounded-lg bg-events-teal/40 border border-events-cream/10 overflow-hidden rotate-[-4deg]">
            <div className="w-full h-full flex items-center justify-center text-events-cream/20 text-xs font-body">
              Photo
            </div>
          </div>

          {/* Top-right logo placeholder */}
          <div className="absolute top-16 right-6 md:right-16 w-24 md:w-32 h-24 md:h-32 rounded-full bg-events-teal/30 border border-events-cream/10 flex items-center justify-center rotate-[6deg]">
            <span className="text-events-cream/20 text-xs font-body">Logo</span>
          </div>

          {/* Left-mid photo */}
          <div className="absolute top-1/3 -left-4 md:left-8 w-36 md:w-48 h-48 md:h-60 rounded-lg bg-events-teal/35 border border-events-cream/10 overflow-hidden rotate-[3deg]">
            <div className="w-full h-full flex items-center justify-center text-events-cream/20 text-xs font-body">
              Photo
            </div>
          </div>

          {/* Right-mid testimonial placeholder */}
          <div className="absolute top-1/3 right-4 md:right-10 w-40 md:w-56 h-28 md:h-36 rounded-xl bg-events-teal/25 border border-events-yellow/15 p-4 rotate-[-3deg]">
            <div className="text-events-cream/15 text-[10px] font-body italic leading-relaxed">
              "Placeholder testimonial quote goes here..."
            </div>
            <div className="mt-2 text-events-yellow/20 text-[9px] font-body">— Brand Name</div>
          </div>

          {/* Bottom-left logo */}
          <div className="absolute bottom-16 left-8 md:left-20 w-20 md:w-28 h-20 md:h-28 rounded-full bg-events-teal/30 border border-events-cream/10 flex items-center justify-center rotate-[-5deg]">
            <span className="text-events-cream/20 text-xs font-body">Logo</span>
          </div>

          {/* Bottom-right photo */}
          <div className="absolute bottom-8 right-6 md:right-14 w-36 md:w-44 h-44 md:h-56 rounded-lg bg-events-teal/35 border border-events-cream/10 overflow-hidden rotate-[5deg]">
            <div className="w-full h-full flex items-center justify-center text-events-cream/20 text-xs font-body">
              Photo
            </div>
          </div>

          {/* Mid-bottom testimonial */}
          <div className="absolute bottom-20 left-1/4 w-44 md:w-52 h-24 md:h-32 rounded-xl bg-events-teal/20 border border-events-yellow/10 p-4 rotate-[2deg] hidden md:block">
            <div className="text-events-cream/15 text-[10px] font-body italic leading-relaxed">
              "Another placeholder testimonial..."
            </div>
            <div className="mt-2 text-events-yellow/20 text-[9px] font-body">— Brand Name</div>
          </div>

          {/* Extra scattered small photos */}
          <div className="absolute top-[15%] left-[40%] w-20 h-24 rounded-md bg-events-teal/25 border border-events-cream/8 rotate-[8deg] hidden lg:block" />
          <div className="absolute bottom-[25%] right-[35%] w-16 h-20 rounded-md bg-events-teal/20 border border-events-cream/8 rotate-[-6deg] hidden lg:block" />
        </div>

        {/* Center stats */}
        <div className="relative z-10 container mx-auto px-6">
          <div className="flex flex-col items-center gap-16 md:gap-20 max-w-2xl mx-auto">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className="text-center"
              >
                <div className="flex items-baseline justify-center gap-1">
                  <span
                    className="font-display font-extrabold leading-none"
                    style={{
                      fontSize: "clamp(4rem, 12vw, 9rem)",
                      color: "#E1B624",
                    }}
                  >
                    {stat.number}
                  </span>
                  {stat.suffix && (
                    <span
                      className="font-display font-bold"
                      style={{
                        fontSize: "clamp(2rem, 5vw, 4rem)",
                        color: "#E1B624",
                      }}
                    >
                      {stat.suffix}
                    </span>
                  )}
                </div>
                <p className="text-events-cream/60 font-body text-sm md:text-base tracking-wide uppercase mt-2 max-w-xs mx-auto">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DenverByTheNumbers;
