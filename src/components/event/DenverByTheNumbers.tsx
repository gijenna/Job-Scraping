import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

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

// Mobile-safe scattered positions — logos only, pushed to edges, no overlap with center stats
const mobileScatteredElements: Array<{
  type: 'logo';
  index: number;
  top: string;
  left?: string;
  right?: string;
  rotate: string;
}> = [
  // The 3 stats sit at roughly 15%, 45%, 75% vertically
  // Place logos in gaps: 0-10%, 25-38%, 55-65%, 85-95%
  { type: 'logo', index: 0, top: '1%', left: '1%', rotate: '-6deg' },
  { type: 'logo', index: 1, top: '3%', right: '1%', rotate: '8deg' },
  { type: 'logo', index: 2, top: '25%', left: '0%', rotate: '10deg' },
  { type: 'logo', index: 3, top: '28%', right: '0%', rotate: '-5deg' },
  { type: 'logo', index: 4, top: '53%', left: '1%', rotate: '-9deg' },
  { type: 'logo', index: 5, top: '57%', right: '1%', rotate: '7deg' },
  { type: 'logo', index: 6, top: '82%', left: '0%', rotate: '5deg' },
  { type: 'logo', index: 7, top: '85%', right: '1%', rotate: '-8deg' },
  { type: 'logo', index: 8, top: '40%', left: '1%', rotate: '12deg' },
  { type: 'logo', index: 9, top: '70%', right: '0%', rotate: '-4deg' },
  { type: 'logo', index: 10, top: '96%', left: '1%', rotate: '6deg' },
];

// Desktop scattered placements — use full width including closer to center, evenly distributed
const scatteredElements: Array<{
  type: 'logo' | 'testimonial';
  index: number;
  top: string;
  left?: string;
  right?: string;
  rotate: string;
}> = [
  // Top band (0-15%)
  { type: 'logo', index: 0, top: '1%', left: '8%', rotate: '-5deg' },
  { type: 'testimonial', index: 0, top: '3%', right: '3%', rotate: '3deg' },
  { type: 'logo', index: 1, top: '8%', left: '22%', rotate: '9deg' },
  { type: 'testimonial', index: 6, top: '10%', right: '18%', rotate: '-4deg' },

  // Upper band (18-32%)
  { type: 'logo', index: 2, top: '20%', right: '6%', rotate: '-8deg' },
  { type: 'testimonial', index: 1, top: '24%', left: '2%', rotate: '2deg' },
  { type: 'logo', index: 3, top: '30%', left: '18%', rotate: '12deg' },

  // Middle band (35-50%)
  { type: 'testimonial', index: 2, top: '37%', right: '2%', rotate: '-3deg' },
  { type: 'logo', index: 4, top: '42%', left: '5%', rotate: '7deg' },
  { type: 'logo', index: 5, top: '48%', right: '16%', rotate: '-11deg' },

  // Lower-mid band (52-68%)
  { type: 'testimonial', index: 3, top: '55%', left: '1%', rotate: '4deg' },
  { type: 'logo', index: 6, top: '58%', right: '4%', rotate: '6deg' },
  { type: 'testimonial', index: 7, top: '64%', left: '16%', rotate: '-5deg' },

  // Lower band (70-85%)
  { type: 'testimonial', index: 4, top: '72%', right: '2%', rotate: '3deg' },
  { type: 'logo', index: 7, top: '76%', left: '4%', rotate: '-9deg' },

  // Bottom band (85-95%)
  { type: 'testimonial', index: 5, top: '86%', right: '14%', rotate: '-2deg' },
  { type: 'logo', index: 8, top: '90%', left: '10%', rotate: '8deg' },
  { type: 'logo', index: 9, top: '32%', right: '22%', rotate: '-6deg' },
  { type: 'logo', index: 10, top: '70%', left: '22%', rotate: '10deg' },
];

const LogoBubble = ({ logo, style, rotate, delay, small }: { logo: BrandLogo; style: React.CSSProperties; rotate: string; delay: number; small?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.7 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={`absolute ${small ? 'w-8 h-8' : 'w-16 h-16 md:w-20 md:h-20'} rounded-full flex items-center justify-center shadow-lg`}
    style={{ ...style, transform: `rotate(${rotate})`, backgroundColor: '#F5E6D3' }}
  >
    <img
      src={`https://www.google.com/s2/favicons?domain=${logo.domain}&sz=128`}
      alt={logo.name}
      className={`${small ? 'w-5 h-5' : 'w-10 h-10 md:w-12 md:h-12'} object-contain`}
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
  const isMobile = useIsMobile();
  const elements = isMobile ? mobileScatteredElements : scatteredElements;

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#0d1f22" }}>
      <div className="relative py-28 md:py-40">
        {/* Scattered elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {elements.map((item, i) => {
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
                  small={isMobile}
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
