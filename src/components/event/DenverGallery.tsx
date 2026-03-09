import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import eventBoa from "@/assets/event-boa.jpg";
import eventCareerCoachingPopup from "@/assets/event-career-coaching-popup.jpg";
import eventOutsideBooth from "@/assets/event-outside-booth.jpg";
import eventRei from "@/assets/event-rei.jpg";
import eventAlisonVolunteer from "@/assets/event-alison-volunteer.jpg";
import eventBasecampTeam from "@/assets/event-basecamp-team.jpg";
import eventBoaSwag from "@/assets/event-boa-swag.jpg";
import eventCrowd from "@/assets/event-crowd.jpg";
import eventCrowdBooth from "@/assets/event-crowd-booth.jpg";
import eventCareerCoaching from "@/assets/event-career-coaching.jpg";

interface PhotoItem {
  src: string;
  alt: string;
  top: string;
  left: string;
  width: string;
  rotate: string;
  zIndex: number;
  parallaxSpeed: number;
}

const photos: PhotoItem[] = [
  // Upper-left cluster
  { src: eventCrowd, alt: "Crowd", top: "2%", left: "12%", width: "w-40 md:w-56", rotate: "-5deg", zIndex: 3, parallaxSpeed: 0.1 },
  { src: eventBoaSwag, alt: "BOA Swag", top: "0%", left: "55%", width: "w-36 md:w-48", rotate: "4deg", zIndex: 2, parallaxSpeed: 0.15 },

  // Middle row — 3 photos spread wide
  { src: eventCareerCoachingPopup, alt: "Career Coaching", top: "28%", left: "-2%", width: "w-36 md:w-48", rotate: "3deg", zIndex: 2, parallaxSpeed: 0.12 },
  { src: eventBasecampTeam, alt: "Basecamp Team", top: "24%", left: "30%", width: "w-44 md:w-60", rotate: "-3deg", zIndex: 4, parallaxSpeed: 0.06 },
  { src: eventOutsideBooth, alt: "Outside Booth", top: "26%", left: "65%", width: "w-40 md:w-52", rotate: "5deg", zIndex: 3, parallaxSpeed: 0.13 },

  // Lower row
  { src: eventAlisonVolunteer, alt: "Volunteers", top: "56%", left: "8%", width: "w-38 md:w-50", rotate: "-4deg", zIndex: 2, parallaxSpeed: 0.09 },
  { src: eventBoa, alt: "BOA", top: "58%", left: "52%", width: "w-36 md:w-48", rotate: "3deg", zIndex: 3, parallaxSpeed: 0.14 },

  // Bottom edge
  { src: eventCareerCoaching, alt: "Coaching Session", top: "78%", left: "2%", width: "w-40 md:w-52", rotate: "2deg", zIndex: 2, parallaxSpeed: 0.11 },
  { src: eventCrowdBooth, alt: "Crowd at Booths", top: "76%", left: "42%", width: "w-44 md:w-56", rotate: "-3deg", zIndex: 3, parallaxSpeed: 0.08 },
];

const ParallaxPhoto = ({ photo }: { photo: PhotoItem }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [photo.parallaxSpeed * 100, -photo.parallaxSpeed * 100]);

  return (
    <motion.div
      ref={ref}
      className={`absolute ${photo.width} aspect-[4/3] rounded-lg overflow-hidden shadow-xl`}
      style={{
        top: photo.top,
        left: photo.left,
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
    </motion.div>
  );
};

const DenverGallery = () => {
  return (
    <section className="relative overflow-hidden py-8 md:py-12" style={{ backgroundColor: "#0d1f22" }}>
      {/* Header */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-xs tracking-[0.3em] uppercase mb-6 font-body relative z-10"
        style={{ color: "#F5E6D3", opacity: 0.6 }}
      >
        Gallery
      </motion.p>

      {/* Collage container — compact like reference */}
      <div className="relative w-full mx-auto" style={{ height: "clamp(420px, 70vw, 700px)", maxWidth: "1200px" }}>
        {photos.map((photo, i) => (
          <ParallaxPhoto key={i} photo={photo} />
        ))}

        {/* Established 2024 badge — centered */}
        <motion.div
          className="absolute z-20 flex items-center justify-center"
          style={{ top: "42%", left: "50%", transform: "translate(-50%, -50%)" }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div
            className="w-28 h-28 md:w-36 md:h-36 rounded-full flex flex-col items-center justify-center border-2"
            style={{
              backgroundColor: "rgba(245, 230, 211, 0.9)",
              borderColor: "#E1B624",
            }}
          >
            <span
              className="text-[9px] md:text-[11px] tracking-[0.2em] uppercase font-body"
              style={{ color: "#19363B" }}
            >
              Established
            </span>
            <span
              className="font-display font-extrabold text-2xl md:text-3xl leading-none mt-0.5"
              style={{ color: "#E1B624" }}
            >
              2024
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DenverGallery;
