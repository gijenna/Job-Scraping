import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import EditableText from "@/components/EditableText";

interface BrandTestimonial {
  quote: string;
  firstName: string;
  company: string;
  domain: string;
}

interface BrandLogo {
  name: string;
  domain: string;
}

const brandTestimonials: BrandTestimonial[] = [
  { quote: "We use Gather as a branding opportunity.", firstName: "Liz", company: "Cotopaxi", domain: "cotopaxi.com" },
  { quote: "We were so impressed by the depth of talent - AWESOMELY tenured individuals.", firstName: "Hillary", company: "Elevate Outdoor Collective", domain: "elevateoc.com" },
  { quote: "We had a GREAT time at Gather! I thought it was a very successful event.", firstName: "Jessica", company: "YETI", domain: "yeti.com" },
  { quote: "Basecamp has been my FAVORITE partner and the one that has generated the most goodwill and visibility for our program.", firstName: "Chris", company: "University of Denver", domain: "du.edu" },
  { quote: "I will definitely seek out this event in the future!", firstName: "Crystal", company: "Eleven Experience", domain: "elevenexperience.com" },
  { quote: "We love sponsoring an event that breeds genuine connections and brings together curious minds.", firstName: "Miranda", company: "On Running", domain: "on-running.com" },
  { quote: "We all met GREAT candidates. I am hopefully extending an offer to one today. Huge success.", firstName: "Martine", company: "The North Face", domain: "thenorthface.com" },
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

const mobileRainLogos = brandLogos.map((logo, i) => ({
  logo,
  leftPercent: (i / (brandLogos.length - 1)) * 85 + 2,
  delay: 0.3 + i * 0.18,
  rotate: ['-5deg', '7deg', '-8deg', '6deg', '-4deg', '9deg', '-7deg', '5deg', '-3deg', '11deg', '-6deg'][i] || '0deg',
}));

const RainingLogo = ({ logo, leftPercent, delay, rotate }: { logo: BrandLogo; leftPercent: number; delay: number; rotate: string }) => (
  <motion.div
    initial={{ y: "-100vh", opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true, margin: "200px" }}
    transition={{ y: { duration: 3, delay, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.5, delay } }}
    className="absolute bottom-3 w-9 h-9 rounded-full flex items-center justify-center shadow-lg"
    style={{ left: `${leftPercent}%`, transform: `rotate(${rotate})`, backgroundColor: '#e8f0d8' }}
  >
    <motion.div initial={{ scale: 1 }} whileInView={{ scale: [1, 1.2, 0.9, 1.05, 1] }} viewport={{ once: true }} transition={{ duration: 0.5, delay: delay + 2.9, ease: "easeOut" }}>
      <img src={`https://www.google.com/s2/favicons?domain=${logo.domain}&sz=128`} alt={logo.name} className="w-5 h-5 object-contain" style={{ mixBlendMode: 'multiply' }} />
    </motion.div>
  </motion.div>
);

const PnwPowerfulPremium = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();

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
          background: `linear-gradient(180deg, #19363B 0%, #19363B 10%, #2d6b4f 25%, #d4e8c7 35%, #e8f0d8 50%, #8ab87a 65%, #3a6e50 80%, #1a3a3f 90%, #0d1f22 100%)`,
        }}
      >
        <div className="absolute top-0 w-full h-[250px] pointer-events-none">
          <div className="absolute -top-10 left-[5%] w-[400px] h-[200px] rounded-full opacity-90" style={{ background: "radial-gradient(ellipse, #19363B 0%, transparent 70%)" }} />
          <div className="absolute -top-16 left-[35%] w-[550px] h-[250px] rounded-full opacity-95" style={{ background: "radial-gradient(ellipse, #19363B 0%, transparent 70%)" }} />
          <div className="absolute -top-8 right-[15%] w-[450px] h-[220px] rounded-full opacity-90" style={{ background: "radial-gradient(ellipse, #19363B 0%, transparent 70%)" }} />
          <div className="absolute top-[80px] left-[15%] w-[400px] h-[180px] rounded-full opacity-60" style={{ background: "radial-gradient(ellipse, #5a9a6e 0%, transparent 70%)" }} />
          <div className="absolute top-[60px] right-[25%] w-[450px] h-[200px] rounded-full opacity-50" style={{ background: "radial-gradient(ellipse, #5a9a6e 0%, transparent 70%)" }} />
        </div>

        <div className="relative w-full pt-20 md:pt-28 pb-16 md:pb-24" style={{ minHeight: "580px" }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[220px] md:h-[260px]" style={{ background: "radial-gradient(ellipse 70% 100% at 50% 0%, #e8f0d8 0%, transparent 100%)" }} />
            <div className="absolute top-4 left-[5%] w-[350px] h-[160px] rounded-full opacity-70" style={{ background: "radial-gradient(ellipse, #e8f0d8 0%, transparent 70%)" }} />
            <div className="absolute top-0 left-[25%] w-[500px] h-[220px] rounded-full opacity-80" style={{ background: "radial-gradient(ellipse, #d4e8c7 0%, transparent 65%)" }} />
            <div className="absolute top-8 right-[10%] w-[400px] h-[180px] rounded-full opacity-65" style={{ background: "radial-gradient(ellipse, #e8f0d8 0%, transparent 70%)" }} />
            <div className="absolute top-2 right-[30%] w-[450px] h-[200px] rounded-full opacity-75" style={{ background: "radial-gradient(ellipse, #c5ddb5 0%, transparent 68%)" }} />
            <div className="absolute top-[30%] left-[15%] w-[300px] h-[140px] rounded-full opacity-50" style={{ background: "radial-gradient(ellipse, #8ab87a 0%, transparent 70%)" }} />
            <div className="absolute top-[35%] right-[20%] w-[350px] h-[150px] rounded-full opacity-45" style={{ background: "radial-gradient(ellipse, #8ab87a 0%, transparent 70%)" }} />
            <div className="absolute top-[25%] left-[45%] w-[400px] h-[160px] rounded-full opacity-55" style={{ background: "radial-gradient(ellipse, #6fa86a 0%, transparent 65%)" }} />
            <div className="absolute top-[55%] left-[10%] w-[250px] h-[100px] rounded-full opacity-30" style={{ background: "radial-gradient(ellipse, #4a8a5a 0%, transparent 70%)" }} />
            <div className="absolute top-[50%] right-[15%] w-[280px] h-[110px] rounded-full opacity-25" style={{ background: "radial-gradient(ellipse, #4a8a5a 0%, transparent 70%)" }} />
          </div>

          {isMobile && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {mobileRainLogos.map((item, i) => (
                <RainingLogo key={i} logo={item.logo} leftPercent={item.leftPercent} delay={item.delay} rotate={item.rotate} />
              ))}
            </div>
          )}

          <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="font-display font-extrabold text-5xl md:text-7xl mb-6" style={{ color: "#154733" }}>
              <EditableText settingKey="powerful_headline" defaultText="Powerful & Premium" as="span" />
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="text-lg md:text-xl font-body leading-relaxed mb-12" style={{ color: "#2a5a3e" }}>
              <EditableText settingKey="powerful_subtitle" defaultText="Portland's most intimate gathering of outdoor industry professionals, featuring top brands, UO's Sports Product Management program, and the PNW's deepest talent pool." as="span" multiline />
            </motion.p>

            <div className="h-[130px] md:h-[110px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div key={currentIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="text-center max-w-2xl">
                  <p className="font-body text-xs md:text-sm italic leading-relaxed mb-3" style={{ color: "#154733" }}>"{current.quote}"</p>
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="font-display font-semibold text-xs md:text-sm" style={{ color: "#154733" }}>{current.firstName} @</span>
                    <span className="font-display font-semibold text-xs md:text-sm" style={{ color: "#154733" }}>{current.company}</span>
                    <img src={`https://www.google.com/s2/favicons?domain=${current.domain}&sz=64`} alt={current.company} className="w-4 h-4 object-contain ml-0.5" />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center gap-1.5 mt-4">
              {brandTestimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrentIndex(i)} className="w-2 h-2 rounded-full transition-all duration-300" style={{ backgroundColor: "#154733", opacity: i === currentIndex ? 1 : 0.3, transform: i === currentIndex ? "scale(1.2)" : "scale(1)" }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PnwPowerfulPremium;
