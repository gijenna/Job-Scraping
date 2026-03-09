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

const OrbitingPhoto = ({ 
  item, 
  index, 
  total, 
  rotation,
  scale,
  opacity,
}: { 
  item: OrbitingItem; 
  index: number; 
  total: number;
  rotation: number;
  scale: number;
  opacity: number;
}) => {
  const baseAngle = (360 / total) * index;
  const currentAngle = baseAngle + rotation;
  const radius = 220;
  
  const x = Math.cos((currentAngle * Math.PI) / 180) * radius;
  const y = Math.sin((currentAngle * Math.PI) / 180) * radius;

  return (
    <motion.div
      className="absolute w-32 h-40 md:w-40 md:h-48 rounded-xl overflow-hidden shadow-2xl"
      style={{
        x,
        y,
        scale,
        opacity,
        rotate: currentAngle * 0.1,
      }}
    >
      <img
        src={item.image}
        alt="Event photo"
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
};

const OrbitingLogo = ({ 
  item, 
  index, 
  total, 
  rotation,
  scale,
  opacity,
}: { 
  item: OrbitingItem; 
  index: number; 
  total: number;
  rotation: number;
  scale: number;
  opacity: number;
}) => {
  const baseAngle = (360 / total) * index;
  const currentAngle = baseAngle + rotation;
  const radius = 200;
  
  const x = Math.cos((currentAngle * Math.PI) / 180) * radius;
  const y = Math.sin((currentAngle * Math.PI) / 180) * radius;

  return (
    <motion.div
      className="absolute w-16 h-16 md:w-20 md:h-20 rounded-full bg-events-cream/90 flex items-center justify-center shadow-lg"
      style={{
        x,
        y,
        scale,
        opacity,
      }}
    >
      <img
        src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=64`}
        alt={item.content}
        className="w-10 h-10 md:w-12 md:h-12 object-contain"
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = 'none';
          target.parentElement!.innerHTML = `<span class="text-xs font-semibold text-events-teal text-center px-1">${item.content}</span>`;
        }}
      />
    </motion.div>
  );
};

const OrbitingTestimonial = ({ 
  item, 
  index, 
  total, 
  rotation,
  scale,
  opacity,
}: { 
  item: OrbitingItem; 
  index: number; 
  total: number;
  rotation: number;
  scale: number;
  opacity: number;
}) => {
  const baseAngle = (360 / total) * index + 45; // offset to avoid overlap
  const currentAngle = baseAngle + rotation;
  const radius = 240;
  
  const x = Math.cos((currentAngle * Math.PI) / 180) * radius;
  const y = Math.sin((currentAngle * Math.PI) / 180) * radius;

  return (
    <motion.div
      className="absolute w-44 md:w-52 rounded-2xl bg-events-teal/80 backdrop-blur-sm border border-events-cream/20 p-4 shadow-xl"
      style={{
        x,
        y,
        scale,
        opacity,
      }}
    >
      <div className="flex items-start gap-3">
        <img
          src={item.avatar}
          alt={item.author}
          className="w-8 h-8 rounded-full shrink-0"
        />
        <div>
          <p className="text-events-cream/90 text-xs leading-relaxed italic">
            "{item.content}"
          </p>
          <p className="text-events-yellow text-[10px] mt-2 font-medium">
            — {item.author}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const DenverOrbitingStats = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Three phases: 0-0.33 = photos, 0.33-0.66 = logos, 0.66-1 = testimonials
  const photoOpacity = useTransform(scrollYProgress, [0, 0.15, 0.3, 0.4], [0, 1, 1, 0]);
  const photoScale = useTransform(scrollYProgress, [0, 0.15, 0.3, 0.4], [0.5, 1, 1, 0.5]);
  const photoRotation = useTransform(scrollYProgress, [0, 0.4], [0, 180]);
  
  const logoOpacity = useTransform(scrollYProgress, [0.3, 0.45, 0.6, 0.7], [0, 1, 1, 0]);
  const logoScale = useTransform(scrollYProgress, [0.3, 0.45, 0.6, 0.7], [0.5, 1, 1, 0.5]);
  const logoRotation = useTransform(scrollYProgress, [0.3, 0.7], [0, 180]);
  
  const testimonialOpacity = useTransform(scrollYProgress, [0.6, 0.75, 0.95], [0, 1, 1]);
  const testimonialScale = useTransform(scrollYProgress, [0.6, 0.75, 0.95], [0.5, 1, 1]);
  const testimonialRotation = useTransform(scrollYProgress, [0.6, 1], [0, 90]);

  // Number transitions
  const num1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.3, 0.4], [0, 1, 1, 0]);
  const num2Opacity = useTransform(scrollYProgress, [0.3, 0.45, 0.6, 0.7], [0, 1, 1, 0]);
  const num3Opacity = useTransform(scrollYProgress, [0.6, 0.75, 0.95], [0, 1, 1]);

  return (
    <section 
      ref={containerRef}
      className="relative h-[300vh]"
      style={{ backgroundColor: "#0d1f22" }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Center content */}
        <div className="relative flex items-center justify-center">
          
          {/* "500+" with photos */}
          <motion.div
            className="absolute flex items-center justify-center"
            style={{ opacity: num1Opacity }}
          >
            <div className="text-center z-10">
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
          
          {/* Orbiting photos */}
          <motion.div style={{ opacity: photoOpacity, scale: photoScale }}>
            {eventPhotos.map((photo, i) => (
              <OrbitingPhoto
                key={photo.id}
                item={photo}
                index={i}
                total={eventPhotos.length}
                rotation={photoRotation.get()}
                scale={1}
                opacity={1}
              />
            ))}
          </motion.div>

          {/* "30+" with logos */}
          <motion.div
            className="absolute flex items-center justify-center"
            style={{ opacity: num2Opacity }}
          >
            <div className="text-center z-10">
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
          
          {/* Orbiting logos */}
          <motion.div style={{ opacity: logoOpacity, scale: logoScale }}>
            {brandLogos.map((logo, i) => (
              <OrbitingLogo
                key={logo.id}
                item={logo}
                index={i}
                total={brandLogos.length}
                rotation={logoRotation.get()}
                scale={1}
                opacity={1}
              />
            ))}
          </motion.div>

          {/* "Thousands" with testimonials */}
          <motion.div
            className="absolute flex items-center justify-center"
            style={{ opacity: num3Opacity }}
          >
            <div className="text-center z-10">
              <span
                className="font-display font-extrabold leading-none"
                style={{
                  fontSize: "clamp(3rem, 10vw, 8rem)",
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
          
          {/* Orbiting testimonials */}
          <motion.div style={{ opacity: testimonialOpacity, scale: testimonialScale }}>
            {testimonials.map((testimonial, i) => (
              <OrbitingTestimonial
                key={testimonial.id}
                item={testimonial}
                index={i}
                total={testimonials.length}
                rotation={testimonialRotation.get()}
                scale={1}
                opacity={1}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DenverOrbitingStats;
