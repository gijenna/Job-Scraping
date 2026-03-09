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
        {/* Scattered elements — logos and testimonials positioned around the edges */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          
          {/* === TOP ROW - Logos only === */}
          
          {/* The North Face logo - top left */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="absolute top-8 left-4 md:left-8 w-16 md:w-20 h-16 md:h-20 rounded-full bg-events-cream flex items-center justify-center rotate-[-4deg] shadow-lg"
          >
            <img
              src={`https://www.google.com/s2/favicons?domain=${brandLogos[0].domain}&sz=64`}
              alt={brandLogos[0].name}
              className="w-8 h-8 md:w-10 md:h-10 object-contain"
            />
          </motion.div>

          {/* REI logo - top right */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="absolute top-10 right-4 md:right-10 w-16 md:w-20 h-16 md:h-20 rounded-full bg-events-cream flex items-center justify-center rotate-[6deg] shadow-lg"
          >
            <img
              src={`https://www.google.com/s2/favicons?domain=${brandLogos[1].domain}&sz=64`}
              alt={brandLogos[1].name}
              className="w-8 h-8 md:w-10 md:h-10 object-contain"
            />
          </motion.div>

          {/* === LEFT COLUMN - Testimonials stacked === */}
          
          {/* Testimonial 1 - Left upper */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute top-[18%] left-2 md:left-4 w-40 md:w-48 rounded-xl p-3 rotate-[-2deg] shadow-lg hidden md:block"
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

          {/* Cotopaxi logo - left side */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="absolute top-[32%] left-3 md:left-6 w-14 md:w-16 h-14 md:h-16 rounded-full bg-events-cream flex items-center justify-center rotate-[5deg] shadow-lg"
          >
            <img
              src={`https://www.google.com/s2/favicons?domain=${brandLogos[2].domain}&sz=64`}
              alt={brandLogos[2].name}
              className="w-7 h-7 md:w-8 md:h-8 object-contain"
            />
          </motion.div>

          {/* Testimonial 2 - Left middle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute top-[42%] left-2 md:left-4 w-40 md:w-48 rounded-xl p-3 rotate-[2deg] shadow-lg hidden lg:block"
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

          {/* Brooks logo - left lower */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="absolute top-[58%] left-3 md:left-6 w-14 md:w-16 h-14 md:h-16 rounded-full bg-events-cream flex items-center justify-center rotate-[-6deg] shadow-lg hidden md:flex"
          >
            <img
              src={`https://www.google.com/s2/favicons?domain=${brandLogos[3].domain}&sz=64`}
              alt={brandLogos[3].name}
              className="w-7 h-7 md:w-8 md:h-8 object-contain"
            />
          </motion.div>

          {/* Testimonial 3 - Left lower */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute top-[68%] left-2 md:left-4 w-44 md:w-52 rounded-xl p-3 rotate-[-3deg] shadow-lg hidden lg:block"
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

          {/* Altra logo - bottom left */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="absolute bottom-8 left-4 md:left-8 w-14 md:w-18 h-14 md:h-18 rounded-full bg-events-cream flex items-center justify-center rotate-[4deg] shadow-lg"
          >
            <img
              src={`https://www.google.com/s2/favicons?domain=${brandLogos[5].domain}&sz=64`}
              alt={brandLogos[5].name}
              className="w-7 h-7 md:w-9 md:h-9 object-contain"
            />
          </motion.div>

          {/* === RIGHT COLUMN - Testimonials stacked === */}
          
          {/* Testimonial 4 - Right upper */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute top-[18%] right-2 md:right-4 w-40 md:w-48 rounded-xl p-3 rotate-[3deg] shadow-lg hidden md:block"
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

          {/* BOA Fit logo - right side */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="absolute top-[32%] right-3 md:right-6 w-14 md:w-16 h-14 md:h-16 rounded-full bg-events-cream flex items-center justify-center rotate-[-5deg] shadow-lg"
          >
            <img
              src={`https://www.google.com/s2/favicons?domain=${brandLogos[4].domain}&sz=64`}
              alt={brandLogos[4].name}
              className="w-7 h-7 md:w-8 md:h-8 object-contain"
            />
          </motion.div>

          {/* Testimonial 5 - Right middle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute top-[42%] right-2 md:right-4 w-40 md:w-48 rounded-xl p-3 rotate-[-2deg] shadow-lg hidden lg:block"
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

          {/* U of Oregon logo - right lower */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="absolute top-[58%] right-3 md:right-6 w-14 md:w-16 h-14 md:h-16 rounded-full bg-events-cream flex items-center justify-center rotate-[6deg] shadow-lg hidden md:flex"
          >
            <img
              src={`https://www.google.com/s2/favicons?domain=${brandLogos[6].domain}&sz=64`}
              alt={brandLogos[6].name}
              className="w-7 h-7 md:w-8 md:h-8 object-contain"
            />
          </motion.div>

          {/* Testimonial 6 - Right lower */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute top-[68%] right-2 md:right-4 w-44 md:w-52 rounded-xl p-3 rotate-[2deg] shadow-lg hidden lg:block"
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

          {/* Gaia GPS logo - bottom right */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="absolute bottom-8 right-4 md:right-8 w-14 md:w-18 h-14 md:h-18 rounded-full bg-events-cream flex items-center justify-center rotate-[-4deg] shadow-lg"
          >
            <img
              src={`https://www.google.com/s2/favicons?domain=${brandLogos[9].domain}&sz=64`}
              alt={brandLogos[9].name}
              className="w-7 h-7 md:w-9 md:h-9 object-contain"
            />
          </motion.div>

          {/* Testimonial 7 - Bottom center */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-44 md:w-52 rounded-xl p-3 rotate-[-1deg] shadow-lg hidden md:block"
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
