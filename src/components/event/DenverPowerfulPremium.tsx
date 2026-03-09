import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface BrandTestimonial {
  quote: string;
  firstName: string;
  domain: string;
}

const brandTestimonials: BrandTestimonial[] = [
  {
    quote: "We all met GREAT candidates. Three of us have a candidate in play, and I am hopefully extending an offer to one today. Huge success.",
    firstName: "Martine",
    domain: "vfc.com",
  },
  {
    quote: "We generated a LOT of excellent candidates & would be very happy to sponsor again! We were so impressed by the depth of talent — AWESOMELY tenured individuals.",
    firstName: "Hillary",
    domain: "elevateoc.com",
  },
  {
    quote: "We had a GREAT time at Gather! I thought it was a very successful event - the volunteers you had helping were very much appreciated!",
    firstName: "Jessica",
    domain: "yeti.com",
  },
  {
    quote: "We use Gather as a branding opportunity for when we're hiring in the future.",
    firstName: "Liz",
    domain: "cotopaxi.com",
  },
  {
    quote: "We are still OVER THE MOON after Gather. Basecamp has been my FAVORITE partner and the one that has generated the most goodwill and visibility for our nascent program.",
    firstName: "Chris",
    domain: "du.edu",
  },
  {
    quote: "The job seekers were super motivated and highly aligned. I will definitely seek out this event in the future!",
    firstName: "Crystal",
    domain: "elevenexperience.com",
  },
  {
    quote: "We love sponsoring an event that breeds genuine connections and brings together curious minds.",
    firstName: "Miranda",
    domain: "on-running.com",
  },
];

const DenverPowerfulPremium = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % brandTestimonials.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const current = brandTestimonials[currentIndex];

  return (
    <section className="relative overflow-hidden" style={{ marginTop: "-2px" }}>
      <div
        className="relative flex flex-col items-center justify-start"
        style={{
          background: `
            linear-gradient(180deg, 
              #19363B 0%, 
              #19363B 10%,
              #c4b49a 25%, 
              #F5E6D3 35%,
              #e8d5bf 50%,
              #b8a888 65%,
              #4a6a6e 80%,
              #1a3a3f 90%,
              #0d1f22 100%
            )
          `,
        }}
      >
        {/* ── Top clouds fading into Teal ── */}
        <div className="absolute top-0 w-full h-[250px] pointer-events-none">
          <div className="absolute -top-10 left-[5%] w-[400px] h-[200px] rounded-full opacity-90"
            style={{ background: "radial-gradient(ellipse, #19363B 0%, transparent 70%)" }} />
          <div className="absolute -top-16 left-[35%] w-[550px] h-[250px] rounded-full opacity-95"
            style={{ background: "radial-gradient(ellipse, #19363B 0%, transparent 70%)" }} />
          <div className="absolute -top-8 right-[15%] w-[450px] h-[220px] rounded-full opacity-90"
            style={{ background: "radial-gradient(ellipse, #19363B 0%, transparent 70%)" }} />
          <div className="absolute top-[80px] left-[15%] w-[400px] h-[180px] rounded-full opacity-60"
            style={{ background: "radial-gradient(ellipse, #c4b49a 0%, transparent 70%)" }} />
          <div className="absolute top-[60px] right-[25%] w-[450px] h-[200px] rounded-full opacity-50"
            style={{ background: "radial-gradient(ellipse, #c4b49a 0%, transparent 70%)" }} />
        </div>

        {/* ── Cloud field with text overlaid ── */}
        <div className="relative w-full pt-20 md:pt-28 pb-16 md:pb-24" style={{ minHeight: "580px" }}>
          {/* Cloud puffs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[220px] md:h-[260px]"
              style={{ background: "radial-gradient(ellipse 70% 100% at 50% 0%, #F5E6D3 0%, transparent 100%)" }} />
            <div className="absolute top-4 left-[5%] w-[350px] h-[160px] rounded-full opacity-70"
              style={{ background: "radial-gradient(ellipse, #F5E6D3 0%, transparent 70%)" }} />
            <div className="absolute top-0 left-[25%] w-[500px] h-[220px] rounded-full opacity-80"
              style={{ background: "radial-gradient(ellipse, #efe0cc 0%, transparent 65%)" }} />
            <div className="absolute top-8 right-[10%] w-[400px] h-[180px] rounded-full opacity-65"
              style={{ background: "radial-gradient(ellipse, #F5E6D3 0%, transparent 70%)" }} />
            <div className="absolute top-2 right-[30%] w-[450px] h-[200px] rounded-full opacity-75"
              style={{ background: "radial-gradient(ellipse, #e8d5bf 0%, transparent 68%)" }} />
            <div className="absolute top-[30%] left-[15%] w-[300px] h-[140px] rounded-full opacity-50"
              style={{ background: "radial-gradient(ellipse, #d4c4a8 0%, transparent 70%)" }} />
            <div className="absolute top-[35%] right-[20%] w-[350px] h-[150px] rounded-full opacity-45"
              style={{ background: "radial-gradient(ellipse, #d4c4a8 0%, transparent 70%)" }} />
            <div className="absolute top-[25%] left-[45%] w-[400px] h-[160px] rounded-full opacity-55"
              style={{ background: "radial-gradient(ellipse, #cdb99a 0%, transparent 65%)" }} />
            <div className="absolute top-[55%] left-[10%] w-[250px] h-[100px] rounded-full opacity-30"
              style={{ background: "radial-gradient(ellipse, #b8a888 0%, transparent 70%)" }} />
            <div className="absolute top-[50%] right-[15%] w-[280px] h-[110px] rounded-full opacity-25"
              style={{ background: "radial-gradient(ellipse, #b8a888 0%, transparent 70%)" }} />
            <div className="absolute top-[60%] left-[40%] w-[320px] h-[120px] rounded-full opacity-20"
              style={{ background: "radial-gradient(ellipse, #a09070 0%, transparent 70%)" }} />
          </div>

          {/* Text on top of clouds */}
          <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-display font-extrabold text-5xl md:text-7xl mb-6"
              style={{ color: "#19363B" }}
            >
              Powerful &amp; Premium
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl font-body leading-relaxed mb-12"
              style={{ color: "#3a5a5e" }}
            >
              Our annual gathering features the biggest outdoor brands in the world,
              consistently attracting the industry's top talent, influencers, and athletes.
            </motion.p>

            {/* Rotating testimonials */}
            <div className="h-[140px] md:h-[120px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center max-w-2xl"
                >
                  <p
                    className="font-body text-base md:text-lg italic leading-relaxed mb-4"
                    style={{ color: "#19363B" }}
                  >
                    "{current.quote}"
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className="font-display font-semibold text-sm"
                      style={{ color: "#19363B" }}
                    >
                      @{current.firstName}
                    </span>
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${current.domain}&sz=64`}
                      alt={current.firstName}
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-1.5 mt-4">
              {brandTestimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: i === currentIndex ? "#19363B" : "#19363B",
                    opacity: i === currentIndex ? 1 : 0.3,
                    transform: i === currentIndex ? "scale(1.2)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DenverPowerfulPremium;
