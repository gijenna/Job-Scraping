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
];

const testimonials: Testimonial[] = [
  { quote: "You never know who you will meet or make connections with at Gather!", avatarId: 32 },
  { quote: "Networking doesn't have to be scary around the RIGHT people!", avatarId: 44 },
  { quote: "The companies were so generous with their time.", avatarId: 28 },
  { quote: "Very friendly and energetic vibe to the whole event!", avatarId: 15 },
  { quote: "The career coaching helped me work up courage to talk to Outside.", avatarId: 67 },
  { quote: "Thank you for providing this space for under-represented communities.", avatarId: 23 },
  { quote: "The layout and overall vibe of the event was great.", avatarId: 51 },
  { quote: "I've met some of my closest friends from these events.", avatarId: 38 },
];

// Scattered placements — no pattern, no touching, evenly distributed, avoiding center column (25%-75%)
const scatteredElements: Array<{
  type: 'logo' | 'testimonial';
  index: number;
  top: string;
  left?: string;
  right?: string;
  rotate: string;
}> = [
  // Spread across the full height, alternating sides irregularly
  { type: 'logo', index: 0, top: '2%', left: '4%', rotate: '-7deg' },
  { type: 'testimonial', index: 0, top: '5%', right: '2%', rotate: '3deg' },

  { type: 'logo', index: 1, top: '14%', right: '6%', rotate: '11deg' },
  { type: 'logo', index: 2, top: '18%', left: '1%', rotate: '-4deg' },

  { type: 'testimonial', index: 1, top: '26%', left: '2%', rotate: '-2deg' },
  { type: 'logo', index: 3, top: '30%', right: '2%', rotate: '8deg' },

  { type: 'logo', index: 4, top: '40%', left: '5%', rotate: '13deg' },
  { type: 'testimonial', index: 2, top: '43%', right: '1%', rotate: '-5deg' },

  { type: 'testimonial', index: 3, top: '54%', left: '1%', rotate: '4deg' },
  { type: 'logo', index: 5, top: '56%', right: '4%', rotate: '-10deg' },

  { type: 'logo', index: 6, top: '66%', left: '3%', rotate: '6deg' },
  { type: 'testimonial', index: 4, top: '70%', right: '2%', rotate: '-3deg' },

  { type: 'logo', index: 7, top: '80%', right: '5%', rotate: '9deg' },
  { type: 'testimonial', index: 5, top: '84%', left: '2%', rotate: '-6deg' },

  { type: 'logo', index: 8, top: '92%', left: '6%', rotate: '5deg' },
];

const LogoBubble = ({ logo, style, rotate, delay }: { logo: BrandLogo; style: React.CSSProperties; rotate: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.7 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="absolute w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-lg"
    style={{ ...style, transform: `rotate(${rotate})`, backgroundColor: '#F5E6D3' }}
  >
    <img
      src={`https://www.google.com/s2/favicons?domain=${logo.domain}&sz=128`}
      alt={logo.name}
      className="w-10 h-10 md:w-12 md:h-12 object-contain"
      style={{ mixBlendMode: 'multiply' }}
    />
  </motion.div>
);

const TestimonialCard = ({ testimonial, style, rotate, delay }: { testimonial: Testimonial; style: React.CSSProperties; rotate: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="absolute w-40 md:w-48 rounded-xl p-3 shadow-lg hidden md:block"
    style={{ ...style, transform: `rotate(${rotate})`, backgroundColor: '#F5E6D3' }}
  >
    <div className="flex gap-2 items-start">
      <img
        src={`https://i.pravatar.cc/80?img=${testimonial.avatarId}`}
        alt="Attendee"
        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
      />
      <p className="text-[10px] md:text-[11px] leading-snug font-body" style={{ color: '#19363B' }}>
        "{testimonial.quote}"
      </p>
    </div>
  </motion.div>
);

const DenverByTheNumbers = () => {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#0d1f22" }}>
      <div className="relative py-28 md:py-40">
        {/* Scattered elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {scatteredElements.map((item, i) => {
            const posStyle: React.CSSProperties = { top: item.top };
            if (item.left !== undefined) posStyle.left = item.left;
            if (item.right !== undefined) posStyle.right = item.right;

            if (item.type === 'logo') {
              return (
                <LogoBubble
                  key={i}
                  logo={brandLogos[item.index]}
                  style={posStyle}
                  rotate={item.rotate}
                  delay={0.08 + i * 0.04}
                />
              );
            }
            return (
              <TestimonialCard
                key={i}
                testimonial={testimonials[item.index]}
                style={posStyle}
                rotate={item.rotate}
                delay={0.08 + i * 0.04}
              />
            );
          })}
        </div>

        {/* Center stats — protected from overlap */}
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
    </section>
  );
};

export default DenverByTheNumbers;
