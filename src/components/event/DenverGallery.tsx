import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import eventBoa from "@/assets/event-boa.jpg";
import eventCareerCoachingPopup from "@/assets/event-career-coaching-popup.jpg";
import eventOutsideBooth from "@/assets/event-outside-booth.jpg";
import eventAlisonVolunteer from "@/assets/event-alison-volunteer.jpg";
import eventBoaSwag from "@/assets/event-boa-swag.jpg";
import eventCrowd from "@/assets/event-crowd.jpg";
import eventCrowdBooth from "@/assets/event-crowd-booth.jpg";
import eventCareerCoaching from "@/assets/event-career-coaching.jpg";
import eventGroupPhoto from "@/assets/event-group-photo.jpg";
import eventBoaConvo from "@/assets/event-boa-convo.jpg";
import eventYetiKate from "@/assets/event-yeti-kate.jpg";

interface PhotoItem {
  src: string;
  alt: string;
  top: string;
  left: string;
  width: number;
  height: number;
  rotate: string;
  zIndex: number;
  parallaxSpeed: number;
}

const photos: PhotoItem[] = [
  // Row 1 — top row, 5 photos staggered
  { src: eventCareerCoachingPopup, alt: "Career Coaching", top: "4%", left: "-1%", width: 220, height: 280, rotate: "-3deg", zIndex: 2, parallaxSpeed: 0.12 },
  { src: eventCrowd, alt: "Crowd", top: "-2%", left: "16%", width: 240, height: 300, rotate: "4deg", zIndex: 3, parallaxSpeed: 0.08 },
  { src: eventBasecampTeam, alt: "Basecamp Team", top: "2%", left: "36%", width: 230, height: 280, rotate: "-2deg", zIndex: 4, parallaxSpeed: 0.1 },
  { src: eventBoaSwag, alt: "BOA Swag", top: "-4%", left: "58%", width: 220, height: 270, rotate: "5deg", zIndex: 2, parallaxSpeed: 0.14 },
  { src: eventOutsideBooth, alt: "Outside Booth", top: "2%", left: "78%", width: 240, height: 290, rotate: "-4deg", zIndex: 3, parallaxSpeed: 0.09 },

  // Row 2 — bottom row, 4 photos offset from top row
  { src: eventAlisonVolunteer, alt: "Volunteers", top: "52%", left: "2%", width: 230, height: 280, rotate: "3deg", zIndex: 3, parallaxSpeed: 0.11 },
  { src: eventBoa, alt: "BOA", top: "56%", left: "24%", width: 220, height: 270, rotate: "-5deg", zIndex: 2, parallaxSpeed: 0.15 },
  { src: eventCareerCoaching, alt: "Coaching", top: "50%", left: "48%", width: 240, height: 290, rotate: "2deg", zIndex: 3, parallaxSpeed: 0.07 },
  { src: eventCrowdBooth, alt: "Booths", top: "54%", left: "74%", width: 230, height: 280, rotate: "-3deg", zIndex: 2, parallaxSpeed: 0.13 },
];

const ParallaxPhoto = ({ photo }: { photo: PhotoItem }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [photo.parallaxSpeed * 80, -photo.parallaxSpeed * 80]);

  return (
    <motion.div
      ref={ref}
      className="absolute rounded-lg overflow-hidden shadow-xl"
      style={{
        top: photo.top,
        left: photo.left,
        width: `clamp(${photo.width * 0.55}px, ${photo.width / 14}vw + 80px, ${photo.width}px)`,
        height: `clamp(${photo.height * 0.55}px, ${photo.height / 14}vw + 100px, ${photo.height}px)`,
        rotate: photo.rotate,
        zIndex: photo.zIndex,
        y,
      }}
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
    </motion.div>
  );
};

const DenverGallery = () => {
  return (
    <section className="relative overflow-hidden py-8 md:py-12" style={{ backgroundColor: "#0d1f22" }}>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-xs tracking-[0.3em] uppercase mb-6 font-body relative z-10"
        style={{ color: "#F5E6D3", opacity: 0.6 }}
      >
        Gallery
      </motion.p>

      <div className="relative w-full mx-auto" style={{ height: "clamp(380px, 55vw, 620px)", maxWidth: "1200px" }}>
        {photos.map((photo, i) => (
          <ParallaxPhoto key={i} photo={photo} />
        ))}

        {/* Established 2024 badge */}
        <motion.div
          className="absolute z-20"
          style={{ top: "38%", left: "50%", transform: "translate(-50%, -50%)" }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div
            className="w-28 h-28 md:w-36 md:h-36 rounded-full flex flex-col items-center justify-center border-2"
            style={{
              backgroundColor: "rgba(245, 230, 211, 0.92)",
              borderColor: "#E1B624",
            }}
          >
            <span className="text-[9px] md:text-[11px] tracking-[0.2em] uppercase font-body" style={{ color: "#19363B" }}>
              Established
            </span>
            <span className="font-display font-extrabold text-2xl md:text-3xl leading-none mt-0.5" style={{ color: "#E1B624" }}>
              2024
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DenverGallery;
