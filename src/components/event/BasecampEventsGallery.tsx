import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EditableText from "@/components/EditableText";

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

  const goNext = useCallback(() => setCurrent((prev) => (prev + 1) % galleryImages.length), []);
  const goPrev = useCallback(() => setCurrent((prev) => (prev - 1 + galleryImages.length) % galleryImages.length), []);

  const getVisibleIndices = () => {
    const indices = [];
    for (let i = 0; i < 3; i++) {
      indices.push((current + i) % galleryImages.length);
    }
    return indices;
  };

  const visibleIndices = getVisibleIndices();

  return (
    <section className="py-16 md:py-24 px-6 bg-events-cream">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.3em] uppercase mb-4 font-body text-events-coral">
            See It In Action
          </p>
          <h2 className="font-headline font-bold text-2xl md:text-4xl text-events-teal leading-tight">
            Check out other Basecamp Events
          </h2>
        </div>

        {/* Mobile: single image with crossfade */}
        <div className="block md:hidden">
          <div className="relative h-64 rounded-xl overflow-hidden">
            {galleryImages.map((img, i) => (
              <img
                key={i}
                src={img.src}
                alt={img.alt}
                className="absolute inset-0 w-full h-full object-cover rounded-xl transition-opacity duration-500 ease-in-out"
                style={{ opacity: i === current ? 1 : 0 }}
              />
            ))}
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
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

        {/* Desktop: 3-image grid with smooth crossfade */}
        <div className="hidden md:block relative">
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((slot) => (
              <div
                key={slot}
                className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg relative"
              >
                {galleryImages.map((img, imgIdx) => (
                  <img
                    key={imgIdx}
                    src={img.src}
                    alt={img.alt}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                    style={{ opacity: visibleIndices[slot] === imgIdx ? 1 : 0 }}
                  />
                ))}
              </div>
            ))}
          </div>
          <button
            onClick={goPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-events-teal/80 hover:bg-events-teal text-events-cream rounded-full p-3 shadow-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-events-teal/80 hover:bg-events-teal text-events-cream rounded-full p-3 shadow-lg transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BasecampEventsGallery;
