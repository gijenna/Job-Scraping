import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import eventBoa from "@/assets/event-boa.jpg";
import eventCareerCoaching from "@/assets/event-career-coaching.jpg";
import eventOutsideBooth from "@/assets/event-outside-booth.jpg";
import eventPow from "@/assets/event-pow.jpg";
import eventRei from "@/assets/event-rei.jpg";
import eventShar from "@/assets/event-shar.jpg";
import eventYeti from "@/assets/event-yeti.jpg";
import eventAlisonVolunteer from "@/assets/event-alison-volunteer.jpg";
import eventBasecampTeam from "@/assets/event-basecamp-team.jpg";
import eventYetiBestday from "@/assets/event-yeti-bestday.jpg";
import eventBoaSwag from "@/assets/event-boa-swag.jpg";
import eventCareerCoachingPopup from "@/assets/event-career-coaching-popup.jpg";
import eventCrowd from "@/assets/event-crowd.jpg";
import eventCrowdBooth from "@/assets/event-crowd-booth.jpg";

interface ScatteredPhoto {
  src: string;
  caption: string;
  // Position & size as percentages/classes
  top: string;
  left: string;
  width: string;
  rotate: string;
  zIndex: number;
  parallaxSpeed: number; // multiplier for scroll movement
}

const photos: ScatteredPhoto[] = [
  // Row 1 — top scattered
  { src: eventRei, caption: "REI", top: "2%", left: "3%", width: "w-36 md:w-52", rotate: "-4deg", zIndex: 2, parallaxSpeed: 0.15 },
  { src: eventCrowd, caption: "Crowd", top: "0%", left: "28%", width: "w-44 md:w-64", rotate: "3deg", zIndex: 3, parallaxSpeed: 0.08 },
  { src: eventYeti, caption: "YETI", top: "4%", left: "60%", width: "w-40 md:w-56", rotate: "-2deg", zIndex: 2, parallaxSpeed: 0.12 },
  { src: eventBoaSwag, caption: "BOA", top: "1%", left: "85%", width: "w-32 md:w-44", rotate: "5deg", zIndex: 1, parallaxSpeed: 0.18 },

  // Row 2 — middle
  { src: eventCareerCoachingPopup, caption: "Coaching", top: "30%", left: "0%", width: "w-40 md:w-56", rotate: "2deg", zIndex: 3, parallaxSpeed: 0.1 },
  { src: eventBasecampTeam, caption: "Team", top: "34%", left: "32%", width: "w-48 md:w-72", rotate: "-3deg", zIndex: 4, parallaxSpeed: 0.05 },
  { src: eventOutsideBooth, caption: "Outside", top: "28%", left: "68%", width: "w-36 md:w-52", rotate: "4deg", zIndex: 2, parallaxSpeed: 0.14 },

  // Row 3 — bottom scattered
  { src: eventShar, caption: "Leaders", top: "58%", left: "5%", width: "w-36 md:w-48", rotate: "-5deg", zIndex: 2, parallaxSpeed: 0.16 },
  { src: eventPow, caption: "POW", top: "62%", left: "35%", width: "w-40 md:w-56", rotate: "2deg", zIndex: 3, parallaxSpeed: 0.07 },
  { src: eventAlisonVolunteer, caption: "Volunteers", top: "56%", left: "62%", width: "w-44 md:w-60", rotate: "-3deg", zIndex: 2, parallaxSpeed: 0.11 },
  { src: eventBoa, caption: "BOA", top: "60%", left: "88%", width: "w-32 md:w-44", rotate: "6deg", zIndex: 1, parallaxSpeed: 0.19 },

  // Row 4 — bottom edge
  { src: eventCareerCoaching, caption: "Coaching", top: "82%", left: "8%", width: "w-40 md:w-52", rotate: "3deg", zIndex: 2, parallaxSpeed: 0.13 },
  { src: eventCrowdBooth, caption: "Booths", top: "85%", left: "40%", width: "w-44 md:w-60", rotate: "-2deg", zIndex: 3, parallaxSpeed: 0.06 },
  { src: eventYetiBestday, caption: "YETI x Best Day", top: "80%", left: "72%", width: "w-36 md:w-52", rotate: "4deg", zIndex: 2, parallaxSpeed: 0.15 },
];

const ParallaxPhoto = ({ photo }: { photo: ScatteredPhoto }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [photo.parallaxSpeed * 120, -photo.parallaxSpeed * 120]);

  return (
    <motion.div
      ref={ref}
      className={`absolute ${photo.width} aspect-[4/3] rounded-lg overflow-hidden shadow-xl cursor-default`}
      style={{
        top: photo.top,
        left: photo.left,
        rotate: photo.rotate,
        zIndex: photo.zIndex,
        y,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
    >
      <img
        src={photo.src}
        alt={photo.caption}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {/* Subtle dark gradient at bottom for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
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
        className="text-center text-xs tracking-[0.3em] uppercase mb-8 font-body relative z-10"
        style={{ color: "#F5E6D3", opacity: 0.6 }}
      >
        Gallery
      </motion.p>

      {/* Collage container — tall to allow scattered placement */}
      <div className="relative w-full" style={{ height: "clamp(600px, 120vw, 1200px)" }}>
        {photos.map((photo, i) => (
          <ParallaxPhoto key={i} photo={photo} />
        ))}
      </div>
    </section>
  );
};

export default DenverGallery;
