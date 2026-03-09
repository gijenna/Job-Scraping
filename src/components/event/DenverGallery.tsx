import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import eventBoa from "@/assets/event-boa.jpg";
import eventCareerCoaching from "@/assets/event-career-coaching.jpg";
import eventOutsideBooth from "@/assets/event-outside-booth.jpg";
import eventPow from "@/assets/event-pow.jpg";
import eventRei from "@/assets/event-rei.jpg";
import eventShar from "@/assets/event-shar.jpg";
import eventYeti from "@/assets/event-yeti.jpg";

interface GalleryImage {
  src: string;
  caption: string;
}

const galleryImages: GalleryImage[] = [
  { src: eventRei, caption: "REI connecting with outdoor professionals" },
  { src: eventYeti, caption: "YETI brand activation" },
  { src: eventCareerCoaching, caption: "Career coaching sessions" },
  { src: eventOutsideBooth, caption: "Outside booth engagement" },
  { src: eventBoa, caption: "BOA networking moment" },
  { src: eventPow, caption: "POW brand presence" },
  { src: eventShar, caption: "Industry leaders connecting" },
];

const DenverGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const getPrevIndex = () => (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  const getNextIndex = () => (currentIndex + 1) % galleryImages.length;

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: "#0d1f22" }}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-xs tracking-[0.3em] uppercase mb-12 font-body"
          style={{ color: "#F5E6D3", opacity: 0.6 }}
        >
          Gallery
        </motion.p>

        {/* Gallery carousel */}
        <div className="relative flex items-center justify-center gap-4 md:gap-8">
          {/* Previous image (partially visible) */}
          <div 
            className="hidden md:block w-[200px] lg:w-[280px] h-[280px] lg:h-[380px] rounded-xl overflow-hidden opacity-40 cursor-pointer transition-opacity hover:opacity-60 shrink-0"
            onClick={goToPrevious}
          >
            {galleryImages[getPrevIndex()].src ? (
              <img
                src={galleryImages[getPrevIndex()].src}
                alt={galleryImages[getPrevIndex()].caption}
                className="w-full h-full object-cover"
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center text-xs font-body"
                style={{ backgroundColor: "#19363B", color: "#F5E6D3", opacity: 0.3 }}
              >
                Photo {getPrevIndex() + 1}
              </div>
            )}
          </div>

          {/* Navigation button - left */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 md:left-auto md:relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: "rgba(245, 230, 211, 0.1)", color: "#F5E6D3" }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Center image (main) */}
          <div className="relative w-full max-w-[500px] lg:max-w-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="aspect-[4/3] rounded-xl overflow-hidden"
              >
                {galleryImages[currentIndex].src ? (
                  <img
                    src={galleryImages[currentIndex].src}
                    alt={galleryImages[currentIndex].caption}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center text-sm font-body"
                    style={{ backgroundColor: "#19363B", color: "#F5E6D3", opacity: 0.4 }}
                  >
                    Upload Photo {currentIndex + 1}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Caption */}
            <AnimatePresence mode="wait">
              <motion.p
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center mt-6 font-body text-sm md:text-base"
                style={{ color: "#F5E6D3" }}
              >
                {galleryImages[currentIndex].caption}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Navigation button - right */}
          <button
            onClick={goToNext}
            className="absolute right-2 md:right-auto md:relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: "rgba(245, 230, 211, 0.1)", color: "#F5E6D3" }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Next image (partially visible) */}
          <div 
            className="hidden md:block w-[200px] lg:w-[280px] h-[280px] lg:h-[380px] rounded-xl overflow-hidden opacity-40 cursor-pointer transition-opacity hover:opacity-60 shrink-0"
            onClick={goToNext}
          >
            {galleryImages[getNextIndex()].src ? (
              <img
                src={galleryImages[getNextIndex()].src}
                alt={galleryImages[getNextIndex()].caption}
                className="w-full h-full object-cover"
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center text-xs font-body"
                style={{ backgroundColor: "#19363B", color: "#F5E6D3", opacity: 0.3 }}
              >
                Photo {getNextIndex() + 1}
              </div>
            )}
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {galleryImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: "#F5E6D3",
                opacity: i === currentIndex ? 1 : 0.3,
                transform: i === currentIndex ? "scale(1.2)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DenverGallery;
