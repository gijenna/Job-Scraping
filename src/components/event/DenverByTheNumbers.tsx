import { motion } from "framer-motion";

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
  { number: "67", suffix: "%", label: "Have 6+ Years Industry Experience" },
  { number: "30", suffix: "+", label: "Brands (from nonprofit to keystone)" },
  { number: "40K", suffix: "+", label: "Festival Attendees Surrounding Our Activation" },
];

const brandLogos: BrandLogo[] = [
  { name: "The North Face", domain: "thenorthface.com" },
  { name: "REI", domain: "rei.com" },
  { name: "Cotopaxi", domain: "cotopaxi.com" },
  { name: "Brooks", domain: "brooksrunning.com" },
  { name: "BOA Fit", domain: "boafit.com" },
  { name: "Altra", domain: "altrarunning.com" },
  { name: "U of Oregon", domain: "uoregon.edu" },
  { name: "Outside", domain: "outsideonline.com" },
  { name: "Ski Magazine", domain: "skimag.com" },
  { name: "Gaia GPS", domain: "gaiagps.com" },
];

const testimonials: Testimonial[] = [
  { quote: "You never know who you will meet or make connections with at Gather!", avatarId: 32 },
  { quote: "Networking doesn't have to be scary around the RIGHT people!", avatarId: 44 },
  { quote: "The companies were so generous with their time.", avatarId: 28 },
  { quote: "Very friendly and energetic vibe to the whole event!", avatarId: 15 },
  { quote: "The career coaching helped me work up courage to talk to Outside.", avatarId: 67 },
  { quote: "Thank you for providing this space for under-represented communities.", avatarId: 23 },
  { quote: "I now know what skills companies I want to work for desire.", avatarId: 51 },
];

// Positioned items for left gutter
const leftItems: Array<{ type: 'logo' | 'testimonial'; index: number; top: string; left: string; rotate: string }> = [
  { type: 'logo', index: 0, top: '4%', left: '2%', rotate: '-8deg' },
  { type: 'testimonial', index: 0, top: '14%', left: '1%', rotate: '3deg' },
  { type: 'logo', index: 2, top: '28%', left: '4%', rotate: '-4deg' },
  { type: 'testimonial', index: 1, top: '38%', left: '0%', rotate: '-2deg' },
  { type: 'logo', index: 3, top: '52%', left: '2%', rotate: '6deg' },
  { type: 'testimonial', index: 2, top: '62%', left: '1%', rotate: '4deg' },
  { type: 'logo', index: 5, top: '76%', left: '3%', rotate: '-10deg' },
  { type: 'testimonial', index: 6, top: '86%', left: '1%', rotate: '2deg' },
];

// Positioned items for right gutter
const rightItems: Array<{ type: 'logo' | 'testimonial'; index: number; top: string; right: string; rotate: string }> = [
  { type: 'logo', index: 1, top: '6%', right: '3%', rotate: '10deg' },
  { type: 'testimonial', index: 3, top: '16%', right: '1%', rotate: '-4deg' },
  { type: 'logo', index: 4, top: '30%', right: '2%', rotate: '5deg' },
  { type: 'testimonial', index: 4, top: '40%', right: '0%', rotate: '3deg' },
  { type: 'logo', index: 6, top: '54%', right: '4%', rotate: '-7deg' },
  { type: 'testimonial', index: 5, top: '64%', right: '1%', rotate: '-3deg' },
  { type: 'logo', index: 7, top: '78%', right: '2%', rotate: '12deg' },
  { type: 'logo', index: 9, top: '90%', right: '4%', rotate: '-5deg' },
];

const LogoBubble = ({ logo, style, rotate, delay }: { logo: BrandLogo; style: React.CSSProperties; rotate: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.7 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="absolute w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg"
    style={{ ...style, transform: `rotate(${rotate})`, backgroundColor: '#F5E6D3' }}
  >
    <img
      src={`https://www.google.com/s2/favicons?domain=${logo.domain}&sz=128`}
      alt={logo.name}
      className="w-9 h-9 md:w-10 md:h-10 object-contain"
    />
  </motion.div>
);

const TestimonialCard = ({ testimonial, style, rotate, delay }: { testimonial: Testimonial; style: React.CSSProperties; rotate: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="absolute w-40 md:w-44 rounded-xl p-2.5 shadow-lg hidden md:block"
    style={{ ...style, transform: `rotate(${rotate})`, backgroundColor: '#F5E6D3' }}
  >
    <div className="flex gap-2 items-start">
      <img
        src={`https://i.pravatar.cc/80?img=${testimonial.avatarId}`}
        alt="Attendee"
        className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
      />
      <p className="text-[10px] leading-snug font-body" style={{ color: '#19363B' }}>
        "{testimonial.quote}"
      </p>
    </div>
  </motion.div>
);

const DenverByTheNumbers = () => {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#0d1f22" }}>
      <div className="relative py-24 md:py-36">
        {/* Left gutter elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {leftItems.map((item, i) => {
            const posStyle: React.CSSProperties = { top: item.top, left: item.left };
            if (item.type === 'logo') {
              return (
                <LogoBubble
                  key={`l-${i}`}
                  logo={brandLogos[item.index]}
                  style={posStyle}
                  rotate={item.rotate}
                  delay={0.1 + i * 0.06}
                />
              );
            }
            return (
              <TestimonialCard
                key={`l-${i}`}
                testimonial={testimonials[item.index]}
                style={posStyle}
                rotate={item.rotate}
                delay={0.1 + i * 0.06}
              />
            );
          })}

          {/* Right gutter elements */}
          {rightItems.map((item, i) => {
            const posStyle: React.CSSProperties = { top: item.top, right: item.right };
            if (item.type === 'logo') {
              return (
                <LogoBubble
                  key={`r-${i}`}
                  logo={brandLogos[item.index]}
                  style={posStyle}
                  rotate={item.rotate}
                  delay={0.15 + i * 0.06}
                />
              );
            }
            return (
              <TestimonialCard
                key={`r-${i}`}
                testimonial={testimonials[item.index]}
                style={posStyle}
                rotate={item.rotate}
                delay={0.15 + i * 0.06}
              />
            );
          })}
        </div>

        {/* Center stats — protected from overlap */}
        <div className="relative z-10 container mx-auto px-6">
          <div className="flex flex-col items-center gap-16 md:gap-20 max-w-md mx-auto">
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
