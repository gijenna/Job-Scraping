import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Event photos - using existing assets, you can replace these
import eventBoa from "@/assets/event-boa.jpg";
import eventRei from "@/assets/event-rei.jpg";
import eventYeti from "@/assets/event-yeti.jpg";

interface OrbitingItem {
  id: string;
  type: "photo" | "logo" | "testimonial";
  content: string;
  image?: string;
  domain?: string;
  author?: string;
  avatar?: string;
}

// Photos for "500+" section
const eventPhotos: OrbitingItem[] = [
  { id: "photo1", type: "photo", content: "", image: eventBoa },
  { id: "photo2", type: "photo", content: "", image: eventRei },
  { id: "photo3", type: "photo", content: "", image: eventYeti },
];

// Brand logos for "30+" section
const brandLogos: OrbitingItem[] = [
  { id: "rei", type: "logo", content: "REI", domain: "rei.com" },
  { id: "patagonia", type: "logo", content: "Patagonia", domain: "patagonia.com" },
  { id: "north-face", type: "logo", content: "The North Face", domain: "thenorthface.com" },
  { id: "cotopaxi", type: "logo", content: "Cotopaxi", domain: "cotopaxi.com" },
  { id: "yeti", type: "logo", content: "Yeti", domain: "yeti.com" },
  { id: "smartwool", type: "logo", content: "Smartwool", domain: "smartwool.com" },
  { id: "black-diamond", type: "logo", content: "Black Diamond", domain: "blackdiamondequipment.com" },
  { id: "vail", type: "logo", content: "Vail Resorts", domain: "vailresorts.com" },
];

// Testimonials for "Thousands" section
const testimonials: OrbitingItem[] = [
  { 
    id: "test1", 
    type: "testimonial", 
    content: "This event changed my career trajectory completely.",
    author: "Marketing Director",
    avatar: "https://i.pravatar.cc/100?img=1"
  },
  { 
    id: "test2", 
    type: "testimonial", 
    content: "Met my future employer at Gather. Best decision ever.",
    author: "Product Manager",
    avatar: "https://i.pravatar.cc/100?img=2"
  },
  { 
    id: "test3", 
    type: "testimonial", 
    content: "The connections I made here are invaluable.",
    author: "Brand Strategist",
    avatar: "https://i.pravatar.cc/100?img=3"
  },
  { 
    id: "test4", 
    type: "testimonial", 
    content: "Finally found my people in the outdoor industry.",
    author: "Creative Director",
    avatar: "https://i.pravatar.cc/100?img=4"
  },
];

const DenverOrbitingStats = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Three phases: photos → logos → testimonials
  const photoOpacity = useTransform(scrollYProgress, [0.05, 0.15, 0.28, 0.35], [0, 1, 1, 0]);
  const photoScale = useTransform(scrollYProgress, [0.05, 0.15, 0.28, 0.35], [0.6, 1, 1, 0.6]);
  const photoRotate = useTransform(scrollYProgress, [0.05, 0.35], [0, 270]);
  
  const logoOpacity = useTransform(scrollYProgress, [0.32, 0.42, 0.55, 0.62], [0, 1, 1, 0]);
  const logoScale = useTransform(scrollYProgress, [0.32, 0.42, 0.55, 0.62], [0.6, 1, 1, 0.6]);
  const logoRotate = useTransform(scrollYProgress, [0.32, 0.62], [0, 270]);
  
  const testimonialOpacity = useTransform(scrollYProgress, [0.58, 0.68, 0.85], [0, 1, 1]);
  const testimonialScale = useTransform(scrollYProgress, [0.58, 0.68, 0.85], [0.6, 1, 1]);
  const testimonialRotate = useTransform(scrollYProgress, [0.58, 0.9], [0, 120]);

  // Number transitions
  const num1Opacity = useTransform(scrollYProgress, [0.05, 0.15, 0.28, 0.35], [0, 1, 1, 0]);
  const num2Opacity = useTransform(scrollYProgress, [0.32, 0.42, 0.55, 0.62], [0, 1, 1, 0]);
  const num3Opacity = useTransform(scrollYProgress, [0.58, 0.68, 0.85], [0, 1, 1]);

  const photoRadius = 180;
  const logoRadius = 200;
  const testimonialRadius = 280;

  return (
    <section 
      ref={containerRef}
      className="relative h-[250vh]"
      style={{ backgroundColor: "#0d1f22" }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Center content */}
        <div className="relative flex items-center justify-center w-full h-full">
          
          {/* PHASE 1: "500+" with photos */}
          <motion.div
            className="absolute flex items-center justify-center"
            style={{ opacity: num1Opacity }}
          >
            <div className="text-center z-20">
              <span
                className="font-display font-extrabold leading-none"
                style={{
                  fontSize: "clamp(5rem, 15vw, 12rem)",
                  color: "#E1B624",
                }}
              >
                500+
              </span>
              <p className="text-events-cream/60 font-body text-sm md:text-lg tracking-wide uppercase mt-4">
                Industry Professionals
              </p>
            </div>
          </motion.div>
          
          {/* Orbiting photos container */}
          <motion.div 
            className="absolute"
            style={{ 
              opacity: photoOpacity, 
              scale: photoScale,
              rotate: photoRotate,
            }}
          >
            {eventPhotos.map((photo, i) => {
              const angle = (360 / eventPhotos.length) * i - 90;
              const x = Math.cos((angle * Math.PI) / 180) * photoRadius;
              const y = Math.sin((angle * Math.PI) / 180) * photoRadius;
              return (
                <motion.div
                  key={photo.id}
                  className="absolute w-28 h-36 md:w-36 md:h-44 rounded-xl overflow-hidden shadow-2xl border-2 border-events-cream/20"
                  style={{
                    left: x,
                    top: y,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <img
                    src={photo.image}
                    alt="Event photo"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              );
            })}
          </motion.div>

          {/* PHASE 2: "30+" with logos */}
          <motion.div
            className="absolute flex items-center justify-center"
            style={{ opacity: num2Opacity }}
          >
            <div className="text-center z-20">
              <span
                className="font-display font-extrabold leading-none"
                style={{
                  fontSize: "clamp(5rem, 15vw, 12rem)",
                  color: "#E1B624",
                }}
              >
                30+
              </span>
              <p className="text-events-cream/60 font-body text-sm md:text-lg tracking-wide uppercase mt-4">
                Leading Brands
              </p>
            </div>
          </motion.div>
          
          {/* Orbiting logos container */}
          <motion.div 
            className="absolute"
            style={{ 
              opacity: logoOpacity, 
              scale: logoScale,
              rotate: logoRotate,
            }}
          >
            {brandLogos.map((logo, i) => {
              const angle = (360 / brandLogos.length) * i - 90;
              const x = Math.cos((angle * Math.PI) / 180) * logoRadius;
              const y = Math.sin((angle * Math.PI) / 180) * logoRadius;
              return (
                <motion.div
                  key={logo.id}
                  className="absolute w-14 h-14 md:w-16 md:h-16 rounded-full bg-events-cream flex items-center justify-center shadow-lg"
                  style={{
                    left: x,
                    top: y,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${logo.domain}&sz=64`}
                    alt={logo.content}
                    className="w-8 h-8 md:w-10 md:h-10 object-contain"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>

          {/* PHASE 3: "Thousands" with testimonials */}
          <motion.div
            className="absolute flex items-center justify-center"
            style={{ opacity: num3Opacity }}
          >
            <div className="text-center z-20">
              <span
                className="font-display font-extrabold leading-none"
                style={{
                  fontSize: "clamp(3rem, 10vw, 7rem)",
                  color: "#E1B624",
                }}
              >
                Thousands
              </span>
              <p className="text-events-cream/60 font-body text-sm md:text-lg tracking-wide uppercase mt-4">
                of Connections Made
              </p>
            </div>
          </motion.div>
          
          {/* Orbiting testimonials container */}
          <motion.div 
            className="absolute"
            style={{ 
              opacity: testimonialOpacity, 
              scale: testimonialScale,
              rotate: testimonialRotate,
            }}
          >
            {testimonials.map((testimonial, i) => {
              const angle = (360 / testimonials.length) * i - 45;
              const x = Math.cos((angle * Math.PI) / 180) * testimonialRadius;
              const y = Math.sin((angle * Math.PI) / 180) * testimonialRadius;
              return (
                <motion.div
                  key={testimonial.id}
                  className="absolute w-40 md:w-48 rounded-2xl bg-events-teal/90 backdrop-blur-sm border border-events-cream/20 p-3 shadow-xl"
                  style={{
                    left: x,
                    top: y,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="flex items-start gap-2">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-7 h-7 rounded-full shrink-0 border border-events-cream/30"
                    />
                    <div>
                      <p className="text-events-cream/90 text-[10px] md:text-xs leading-relaxed italic">
                        "{testimonial.content}"
                      </p>
                      <p className="text-events-yellow text-[9px] md:text-[10px] mt-1 font-medium">
                        — {testimonial.author}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DenverOrbitingStats;
