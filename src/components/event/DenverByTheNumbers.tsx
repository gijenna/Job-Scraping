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
  { quote: "You never know who you will see, meet, or make connections with at Gather!", avatarId: 32 },
  { quote: "Networking doesn't have to be scary if you're around the RIGHT people in the RIGHT industry!", avatarId: 44 },
  { quote: "The companies were so generous with their time and made everyone feel important and worthy of a conversation.", avatarId: 28 },
  { quote: "Very friendly and energetic vibe to the whole event!", avatarId: 15 },
  { quote: "The career coaching was very helpful. It helped me work up the courage to go ask the staff at Outside about being a writer for them someday.", avatarId: 67 },
  { quote: "Thank you for providing this space for under-represented communities.", avatarId: 23 },
  { quote: "I now have more knowledge of what skills are desired by the companies I want to work for.", avatarId: 51 },
];

const DenverByTheNumbers = () => {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#0d1f22" }}>
      <div className="relative py-24 md:py-36">
        {/* Scattered elements — logos, photos, and testimonials positioned around the stats */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Top-left photo placeholder */}
          <div className="absolute top-8 left-4 md:left-12 w-32 md:w-44 h-44 md:h-56 rounded-lg bg-events-teal/40 border border-events-cream/10 overflow-hidden rotate-[-4deg]">
            <div className="w-full h-full flex items-center justify-center text-events-cream/20 text-xs font-body">
              Photo
            </div>
          </div>

          {/* Top-right logo - The North Face */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="absolute top-16 right-6 md:right-16 w-20 md:w-24 h-20 md:h-24 rounded-full bg-events-cream flex items-center justify-center rotate-[6deg] shadow-lg"
          >
            <img
              src={`https://www.google.com/s2/favicons?domain=${brandLogos[0].domain}&sz=64`}
              alt={brandLogos[0].name}
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
            />
          </motion.div>

          {/* Testimonial 1 - Top right area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute top-[8%] right-[5%] md:right-[12%] w-44 md:w-52 rounded-xl p-3 rotate-[3deg] shadow-lg hidden md:block"
            style={{ backgroundColor: "#F5E6D3" }}
          >
            <div className="flex gap-2">
              <img
                src={`https://i.pravatar.cc/80?img=${testimonials[0].avatarId}`}
                alt="Attendee"
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <p className="text-[10px] md:text-xs leading-relaxed" style={{ color: "#19363B" }}>
                "{testimonials[0].quote}"
              </p>
            </div>
          </motion.div>

          {/* Left-mid photo */}
          <div className="absolute top-1/3 -left-4 md:left-8 w-36 md:w-48 h-48 md:h-60 rounded-lg bg-events-teal/35 border border-events-cream/10 overflow-hidden rotate-[3deg]">
            <div className="w-full h-full flex items-center justify-center text-events-cream/20 text-xs font-body">
              Photo
            </div>
          </div>

          {/* Testimonial 2 - Right mid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="absolute top-[28%] right-[3%] md:right-[8%] w-40 md:w-48 rounded-xl p-3 rotate-[-2deg] shadow-lg"
            style={{ backgroundColor: "#F5E6D3" }}
          >
            <div className="flex gap-2">
              <img
                src={`https://i.pravatar.cc/80?img=${testimonials[1].avatarId}`}
                alt="Attendee"
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <p className="text-[10px] md:text-xs leading-relaxed" style={{ color: "#19363B" }}>
                "{testimonials[1].quote}"
              </p>
            </div>
          </motion.div>

          {/* Cotopaxi logo - top center-left */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="absolute top-[12%] left-[35%] w-14 md:w-18 h-14 md:h-18 rounded-full bg-events-cream flex items-center justify-center rotate-[8deg] shadow-lg hidden lg:flex"
          >
            <img
              src={`https://www.google.com/s2/favicons?domain=${brandLogos[2].domain}&sz=64`}
              alt={brandLogos[2].name}
              className="w-7 h-7 md:w-9 md:h-9 object-contain"
            />
          </motion.div>

          {/* REI logo - left side */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute bottom-[55%] left-8 md:left-20 w-16 md:w-20 h-16 md:h-20 rounded-full bg-events-cream flex items-center justify-center rotate-[-5deg] shadow-lg"
          >
            <img
              src={`https://www.google.com/s2/favicons?domain=${brandLogos[1].domain}&sz=64`}
              alt={brandLogos[1].name}
              className="w-8 h-8 md:w-10 md:h-10 object-contain"
            />
          </motion.div>

          {/* Testimonial 3 - Left side mid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute top-[45%] left-[2%] md:left-[5%] w-44 md:w-52 rounded-xl p-3 rotate-[2deg] shadow-lg hidden lg:block"
            style={{ backgroundColor: "#F5E6D3" }}
          >
            <div className="flex gap-2">
              <img
                src={`https://i.pravatar.cc/80?img=${testimonials[2].avatarId}`}
                alt="Attendee"
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <p className="text-[10px] md:text-xs leading-relaxed" style={{ color: "#19363B" }}>
                "{testimonials[2].quote}"
              </p>
            </div>
          </motion.div>

          {/* Brooks logo - left side mid-lower */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="absolute bottom-[38%] left-[5%] md:left-[8%] w-14 md:w-18 h-14 md:h-18 rounded-full bg-events-cream flex items-center justify-center rotate-[-8deg] shadow-lg"
          >
            <img
              src={`https://www.google.com/s2/favicons?domain=${brandLogos[3].domain}&sz=64`}
              alt={brandLogos[3].name}
              className="w-7 h-7 md:w-9 md:h-9 object-contain"
            />
          </motion.div>

          {/* BOA Fit logo - right side upper */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute top-[22%] right-[30%] w-14 md:w-16 h-14 md:h-16 rounded-full bg-events-cream flex items-center justify-center rotate-[4deg] shadow-lg hidden md:flex"
          >
            <img
              src={`https://www.google.com/s2/favicons?domain=${brandLogos[4].domain}&sz=64`}
              alt={brandLogos[4].name}
              className="w-7 h-7 md:w-8 md:h-8 object-contain"
            />
          </motion.div>

          {/* Testimonial 4 - Right side mid-lower */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="absolute top-[52%] right-[2%] md:right-[6%] w-36 md:w-44 rounded-xl p-3 rotate-[4deg] shadow-lg hidden md:block"
            style={{ backgroundColor: "#F5E6D3" }}
          >
            <div className="flex gap-2">
              <img
                src={`https://i.pravatar.cc/80?img=${testimonials[3].avatarId}`}
                alt="Attendee"
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <p className="text-[10px] md:text-xs leading-relaxed" style={{ color: "#19363B" }}>
                "{testimonials[3].quote}"
              </p>
            </div>
          </motion.div>

          {/* Altra logo - bottom left area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="absolute bottom-[18%] left-[12%] w-14 md:w-18 h-14 md:h-18 rounded-full bg-events-cream flex items-center justify-center rotate-[6deg] shadow-lg hidden md:flex"
          >
            <img
              src={`https://www.google.com/s2/favicons?domain=${brandLogos[5].domain}&sz=64`}
              alt={brandLogos[5].name}
              className="w-7 h-7 md:w-9 md:h-9 object-contain"
            />
          </motion.div>

          {/* Testimonial 5 - Bottom left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute bottom-[22%] left-[3%] md:left-[6%] w-44 md:w-56 rounded-xl p-3 rotate-[-3deg] shadow-lg hidden lg:block"
            style={{ backgroundColor: "#F5E6D3" }}
          >
            <div className="flex gap-2">
              <img
                src={`https://i.pravatar.cc/80?img=${testimonials[4].avatarId}`}
                alt="Attendee"
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <p className="text-[10px] md:text-xs leading-relaxed" style={{ color: "#19363B" }}>
                "{testimonials[4].quote}"
              </p>
            </div>
          </motion.div>

          {/* U of Oregon logo - right side mid */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute top-[68%] right-[8%] w-16 md:w-20 h-16 md:h-20 rounded-full bg-events-cream flex items-center justify-center rotate-[-4deg] shadow-lg hidden lg:flex"
          >
            <img
              src={`https://www.google.com/s2/favicons?domain=${brandLogos[6].domain}&sz=64`}
              alt={brandLogos[6].name}
              className="w-8 h-8 md:w-10 md:h-10 object-contain"
            />
          </motion.div>

          {/* Testimonial 6 - Bottom center */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="absolute bottom-[8%] left-[25%] w-40 md:w-48 rounded-xl p-3 rotate-[2deg] shadow-lg hidden md:block"
            style={{ backgroundColor: "#F5E6D3" }}
          >
            <div className="flex gap-2">
              <img
                src={`https://i.pravatar.cc/80?img=${testimonials[5].avatarId}`}
                alt="Attendee"
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <p className="text-[10px] md:text-xs leading-relaxed" style={{ color: "#19363B" }}>
                "{testimonials[5].quote}"
              </p>
            </div>
          </motion.div>

          {/* Outside logo - bottom center-right */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="absolute bottom-[32%] right-[25%] w-14 md:w-16 h-14 md:h-16 rounded-full bg-events-cream flex items-center justify-center rotate-[3deg] shadow-lg hidden lg:flex"
          >
            <img
              src={`https://www.google.com/s2/favicons?domain=${brandLogos[7].domain}&sz=64`}
              alt={brandLogos[7].name}
              className="w-7 h-7 md:w-8 md:h-8 object-contain"
            />
          </motion.div>

          {/* Testimonial 7 - Bottom right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute bottom-[12%] right-[5%] md:right-[10%] w-44 md:w-52 rounded-xl p-3 rotate-[-2deg] shadow-lg hidden md:block"
            style={{ backgroundColor: "#F5E6D3" }}
          >
            <div className="flex gap-2">
              <img
                src={`https://i.pravatar.cc/80?img=${testimonials[6].avatarId}`}
                alt="Attendee"
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <p className="text-[10px] md:text-xs leading-relaxed" style={{ color: "#19363B" }}>
                "{testimonials[6].quote}"
              </p>
            </div>
          </motion.div>

          {/* Ski Magazine logo - top right area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute top-[8%] right-[38%] w-12 md:w-14 h-12 md:h-14 rounded-full bg-events-cream flex items-center justify-center rotate-[-6deg] shadow-lg hidden lg:flex"
          >
            <img
              src={`https://www.google.com/s2/favicons?domain=${brandLogos[8].domain}&sz=64`}
              alt={brandLogos[8].name}
              className="w-6 h-6 md:w-7 md:h-7 object-contain"
            />
          </motion.div>

          {/* Gaia GPS logo - bottom right */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="absolute bottom-[42%] right-[18%] w-14 md:w-16 h-14 md:h-16 rounded-full bg-events-cream flex items-center justify-center rotate-[7deg] shadow-lg hidden md:flex"
          >
            <img
              src={`https://www.google.com/s2/favicons?domain=${brandLogos[9].domain}&sz=64`}
              alt={brandLogos[9].name}
              className="w-7 h-7 md:w-8 md:h-8 object-contain"
            />
          </motion.div>

          {/* Bottom-right photo */}
          <div className="absolute bottom-8 right-6 md:right-14 w-36 md:w-44 h-44 md:h-56 rounded-lg bg-events-teal/35 border border-events-cream/10 overflow-hidden rotate-[5deg]">
            <div className="w-full h-full flex items-center justify-center text-events-cream/20 text-xs font-body">
              Photo
            </div>
          </div>
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
