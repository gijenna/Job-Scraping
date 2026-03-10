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
  { number: "300", suffix: "+", label: "Outdoor Industry Professionals Per Event" },
  { number: "15", suffix: "+", label: "Brands & Organizations" },
  { number: "20", suffix: "%+", label: "UO SPM Students & Recent Grads" },
];

const brandLogos: BrandLogo[] = [
  { name: "Nike", domain: "nike.com" },
  { name: "Columbia", domain: "columbia.com" },
  { name: "KEEN", domain: "keenfootwear.com" },
  { name: "On Running", domain: "on-running.com" },
  { name: "Rumpl", domain: "rumpl.com" },
  { name: "Arc'teryx", domain: "arcteryx.com" },
  { name: "Brooks", domain: "brooksrunning.com" },
  { name: "Patagonia", domain: "patagonia.com" },
  { name: "Specialized", domain: "specialized.com" },
  { name: "Superfeet", domain: "superfeet.com" },
  { name: "Lululemon", domain: "lululemon.com" },
];

const testimonials: Testimonial[] = [
  { quote: "This event connected me with my dream job at an outdoor brand!", avatarId: 32 },
  { quote: "The UO connection makes this unlike any other industry event.", avatarId: 44 },
  { quote: "Intimate, genuine conversations — not the usual career fair chaos.", avatarId: 28 },
  { quote: "I met three hiring managers and got a follow-up the next day.", avatarId: 15 },
  { quote: "The panel gave me actionable steps to break into outdoor.", avatarId: 67 },
  { quote: "Best networking event in the PNW, hands down.", avatarId: 45 },
  { quote: "Portland is the heart of outdoor — and this event proves it.", avatarId: 51 },
  { quote: "I brought my whole team and we all made valuable connections.", avatarId: 38 },
];

const mobileRainLogos = brandLogos.map((logo, i) => ({
  logo,
  leftPercent: (i / (brandLogos.length - 1)) * 85 + 2,
  delay: 0.3 + i * 0.18,
  rotate: ['-5deg', '7deg', '-8deg', '6deg', '-4deg', '9deg', '-7deg', '5deg', '-3deg', '11deg', '-6deg'][i] || '0deg',
}));

const scatteredElements: Array<{
  type: 'logo' | 'testimonial';
  index: number;
  top: string;
  left?: string;
  right?: string;
  rotate: string;
}> = [
  { type: 'logo', index: 0, top: '1%', left: '8%', rotate: '-5deg' },
  { type: 'testimonial', index: 0, top: '3%', right: '3%', rotate: '3deg' },
  { type: 'logo', index: 1, top: '8%', left: '22%', rotate: '9deg' },
  { type: 'testimonial', index: 6, top: '10%', right: '18%', rotate: '-4deg' },
  { type: 'logo', index: 2, top: '20%', right: '6%', rotate: '-8deg' },
  { type: 'testimonial', index: 1, top: '24%', left: '2%', rotate: '2deg' },
  { type: 'logo', index: 3, top: '30%', left: '18%', rotate: '12deg' },
  { type: 'testimonial', index: 2, top: '37%', right: '2%', rotate: '-3deg' },
  { type: 'logo', index: 4, top: '42%', left: '5%', rotate: '7deg' },
  { type: 'logo', index: 5, top: '48%', right: '16%', rotate: '-11deg' },
  { type: 'testimonial', index: 3, top: '55%', left: '1%', rotate: '4deg' },
  { type: 'logo', index: 6, top: '58%', right: '4%', rotate: '6deg' },
  { type: 'testimonial', index: 7, top: '64%', left: '16%', rotate: '-5deg' },
  { type: 'testimonial', index: 4, top: '72%', right: '2%', rotate: '3deg' },
  { type: 'logo', index: 7, top: '76%', left: '4%', rotate: '-9deg' },
  { type: 'testimonial', index: 5, top: '86%', right: '14%', rotate: '-2deg' },
  { type: 'logo', index: 8, top: '90%', left: '10%', rotate: '8deg' },
  { type: 'logo', index: 9, top: '32%', right: '22%', rotate: '-6deg' },
  { type: 'logo', index: 10, top: '70%', left: '22%', rotate: '10deg' },
];

const LogoBubble = ({ logo, style, rotate, delay }: { logo: BrandLogo; style: React.CSSProperties; rotate: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.7 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="absolute w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-lg"
    style={{ ...style, transform: `rotate(${rotate})`, backgroundColor: '#e8f0d8' }}
  >
    <img
      src={`https://www.google.com/s2/favicons?domain=${logo.domain}&sz=128`}
      alt={logo.name}
      className="w-10 h-10 md:w-12 md:h-12 object-contain"
      style={{ mixBlendMode: 'multiply' }}
    />
  </motion.div>
);

const RainingLogo = ({ logo, leftPercent, delay, rotate }: { logo: BrandLogo; leftPercent: number; delay: number; rotate: string }) => (
  <motion.div
    initial={{ y: "-100vh", opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true, margin: "200px" }}
    transition={{
      y: { duration: 3, delay, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.5, delay },
    }}
    className="absolute bottom-3 w-9 h-9 rounded-full flex items-center justify-center shadow-lg"
    style={{ left: `${leftPercent}%`, transform: `rotate(${rotate})`, backgroundColor: '#e8f0d8' }}
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
        className="w-5 h-5 object-contain"
        style={{ mixBlendMode: 'multiply' }}
      />
    </motion.div>
  </motion.div>
);

const TestimonialCard = ({ testimonial, style, rotate, delay }: { testimonial: Testimonial; style: React.CSSProperties; rotate: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="absolute w-40 md:w-48 rounded-xl p-3 shadow-lg hidden md:block"
    style={{ ...style, transform: `rotate(${rotate})`, backgroundColor: '#e8f0d8' }}
  >
    <div className="flex gap-2 items-start">
      <img
        src={`https://i.pravatar.cc/80?img=${testimonial.avatarId}`}
        alt="Attendee"
        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
      />
      <p className="text-[10px] md:text-[11px] leading-snug font-body" style={{ color: '#154733' }}>
        "{testimonial.quote}"
      </p>
    </div>
  </motion.div>
);

const PnwByTheNumbers = () => {
  const isMobile = useIsMobile();

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#0d1f22" }}>
      <div className="relative py-28 md:py-40">
        {/* Desktop: scattered logos + testimonials */}
        {!isMobile && (
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
        )}

        {/* Mobile: logos rain down */}
        {isMobile && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {mobileRainLogos.map((item, i) => (
              <RainingLogo
                key={i}
                logo={item.logo}
                leftPercent={item.leftPercent}
                delay={item.delay}
                rotate={item.rotate}
              />
            ))}
          </div>
        )}

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
                      color: "#FEE123",
                    }}
                  >
                    {stat.number}
                  </span>
                  {stat.suffix && (
                    <span
                      className="font-display font-bold"
                      style={{
                        fontSize: "clamp(2rem, 5vw, 4rem)",
                        color: "#FEE123",
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

export default PnwByTheNumbers;
