import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import eventBoothTent from "@/assets/event-booth-tent.jpg";
import eventAttendeeSmile from "@/assets/event-attendee-smile.jpg";
import eventNetworkingUo from "@/assets/event-networking-uo.jpg";
import eventPanelUo from "@/assets/event-panel-uo.jpg";
import eventFriendsDuo from "@/assets/event-friends-duo.jpg";
import eventGroupGuys from "@/assets/event-group-guys.jpg";
import eventCotopaxiBooth from "@/assets/event-cotopaxi-booth.png";
import eventCrowdBooth from "@/assets/event-crowd-booth.png";
import eventVfBanner from "@/assets/event-vf-banner.png";
import eventYetiBooth from "@/assets/event-yeti-booth.png";

const galleryImages = [
  { src: eventBoothTent, alt: "Basecamp event booth" },
  { src: eventAttendeeSmile, alt: "Attendee networking" },
  { src: eventNetworkingUo, alt: "UO networking event" },
  { src: eventPanelUo, alt: "Panel discussion" },
  { src: eventFriendsDuo, alt: "Friends at Gather" },
  { src: eventGroupGuys, alt: "Group networking" },
  { src: eventCotopaxiBooth, alt: "Cotopaxi at Gather" },
  { src: eventCrowdBooth, alt: "Crowd at booth" },
  { src: eventVfBanner, alt: "VF Corporation at Gather" },
  { src: eventYetiBooth, alt: "YETI at Gather" },
];

const BasecampEventsGallery = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % galleryImages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Show 3 images at a time on desktop, 1 on mobile
  const getVisibleImages = () => {
    const indices = [];
    for (let i = 0; i < 3; i++) {
      indices.push((current + i) % galleryImages.length);
    }
    return indices;
  };

  return (
    <section className="py-16 md:py-24 px-6 bg-events-cream">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-4 font-body text-events-coral">
            See It In Action
          </p>
          <h2 className="font-headline font-bold text-2xl md:text-4xl text-events-teal leading-tight">
            Check out other Basecamp Events
          </h2>
        </motion.div>

        {/* Mobile: single image carousel */}
        <div className="block md:hidden">
          <div className="relative h-64 rounded-xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={current}
                src={galleryImages[current].src}
                alt={galleryImages[current].alt}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full object-cover absolute inset-0 rounded-xl"
              />
            </AnimatePresence>
          </div>
          <div className="flex justify-center gap-1.5 mt-4">
            {galleryImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: "#19363B",
                  opacity: i === current ? 1 : 0.25,
                }}
              />
            ))}
          </div>
        </div>

        {/* Desktop: 3-image grid that rotates */}
        <div className="hidden md:grid grid-cols-3 gap-4">
          {getVisibleImages().map((idx, i) => (
            <motion.div
              key={`${idx}-${i}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg"
            >
              <img
                src={galleryImages[idx].src}
                alt={galleryImages[idx].alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BasecampEventsGallery;
