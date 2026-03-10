import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StatItem {
  number: string;
  suffix?: string;
  label: string;
}

interface BrandLogo {
  name: string;
  domain: string;
}

interface Testimonial {
  quote: string;
  avatarId: number;
}

const stats: StatItem[] = [
  { number: "500", suffix: "+", label: "Outdoor Industry Professionals Per Event" },
  { number: "30", suffix: "+", label: "Brands (from nonprofit to keystone)" },
  { number: "40K", suffix: "+", label: "Festival Attendees Surrounding Our Activation" },
];

const brandLogos: BrandLogo[] = [
  { name: "The North Face", domain: "thenorthface.com" },
  { name: "REI", domain: "rei.com" },
  { name: "Cotopaxi", domain: "cotopaxi.com" },
  { name: "Brooks", domain: "brooksrunning.com" },
  { name: "VF Corporation", domain: "vfc.com" },
  { name: "Altra", domain: "altrarunning.com" },
  { name: "U of Oregon", domain: "uoregon.edu" },
  { name: "Outside", domain: "outsideonline.com" },
  { name: "Ski Magazine", domain: "skimag.com" },
  { name: "YETI", domain: "yeti.com" },
  { name: "Alterra", domain: "alterramtnco.com" },
  { name: "Outward Bound", domain: "outwardbound.org" },
  { name: "The Wilderness Society", domain: "wilderness.org" },
];

const testimonials: Testimonial[] = [
  { quote: "You never know who you will meet or make connections with at Gather!", avatarId: 32 },
  { quote: "Networking doesn't have to be scary around the RIGHT people!", avatarId: 44 },
  { quote: "The companies were so generous with their time.", avatarId: 28 },
  { quote: "Very friendly and energetic vibe to the whole event!", avatarId: 15 },
  { quote: "The career coaching helped me work up courage to talk to Outside.", avatarId: 67 },
  { quote: "Thank you for providing this space for under-represented communities.", avatarId: 45 },
  { quote: "The layout and overall vibe of the event was great.", avatarId: 51 },
  { quote: "I've met some of my closest friends from these events.", avatarId: 38 },
];

const rainLogos = brandLogos.map((logo, i) => ({
  logo,
  leftPercent: (i / (brandLogos.length - 1)) * 85 + 2,
  delay: 0.3 + i * 0.18,
  rotate: ['-5deg', '7deg', '-8deg', '6deg', '-4deg', '9deg', '-7deg', '5deg', '-3deg', '11deg', '-6deg', '4deg', '-8deg'][i] || '0deg',
}));

const RainingLogo = ({ logo, leftPercent, delay, rotate }: { logo: BrandLogo; leftPercent: number; delay: number; rotate: string }) => (
  <motion.div
    initial={{ y: "-100vh", opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true, margin: "200px" }}
    transition={{
      y: { duration: 3, delay, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.5, delay },
    }}
    className="absolute bottom-3 w-9 h-9 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg"
    style={{ left: `${leftPercent}%`, transform: `rotate(${rotate})`, backgroundColor: '#F5E6D3' }}
  >
    <motion.div
      initial={{ scale: 1 }}
      whileInView={{ scale: [1, 1.2, 0.9, 1.05, 1] }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay + 2.9, ease: "easeOut" }}
    >
      <img
        src={`https://www.google.com/s2/favicons?domain=${logo.domain}&sz=128`}
        alt={logo.name}
        className="w-5 h-5 md:w-8 md:h-8 object-contain"
        style={{ mixBlendMode: 'multiply' }}
      />
    </motion.div>
  </motion.div>
);

const RegistrantDenverStats = () => {
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#0d1f22" }}>
      <div className="relative py-28 md:py-40">
        {/* Raining logos — all viewports */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {rainLogos.map((item, i) => (
            <RainingLogo
              key={i}
              logo={item.logo}
              leftPercent={item.leftPercent}
              delay={item.delay}
              rotate={item.rotate}
            />
          ))}
        </div>

        {/* Center stats */}
        <div className="relative z-10 container mx-auto px-6">
          <div className="flex flex-col items-center gap-20 md:gap-28 max-w-md mx-auto">
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

      {/* Job seeker testimonials — carousel */}
      <div className="relative z-10 pb-20 md:pb-28 px-6 mt-16">
        <div className="container mx-auto max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-xs tracking-[0.3em] uppercase mb-10 font-body text-events-coral"
          >
            What attendees are saying
          </motion.p>

          {/* Carousel */}
          <div className="relative">
            <div className="h-[100px] flex items-center justify-center">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl p-5 shadow-lg text-center max-w-lg mx-auto"
                style={{ backgroundColor: "rgba(245, 230, 211, 0.08)" }}
              >
                <div className="flex items-center justify-center gap-3">
                  <img
                    src={`https://i.pravatar.cc/80?img=${testimonials[testimonialIndex].avatarId}`}
                    alt="Attendee"
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                  <p className="font-body text-sm text-events-cream/70 leading-relaxed">
                    "{testimonials[testimonialIndex].quote}"
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(245, 230, 211, 0.15)" }}
              >
                <ChevronLeft className="w-4 h-4 text-events-cream" />
              </button>
              <div className="flex gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIndex(i)}
                    className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: "#F5E6D3",
                      opacity: i === testimonialIndex ? 1 : 0.3,
                    }}
                  />
                ))}
              </div>
              <button
                onClick={() => setTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(245, 230, 211, 0.15)" }}
              >
                <ChevronRight className="w-4 h-4 text-events-cream" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrantDenverStats;
