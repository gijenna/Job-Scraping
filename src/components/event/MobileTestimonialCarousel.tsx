import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  { quote: "You never know who you will meet or make connections with at Gather!", avatarId: 32 },
  { quote: "Networking doesn't have to be scary around the RIGHT people!", avatarId: 44 },
  { quote: "The companies were so generous with their time.", avatarId: 28 },
  { quote: "Very friendly and energetic vibe to the whole event!", avatarId: 15 },
  { quote: "The career coaching helped me work up courage to talk to Outside.", avatarId: 67 },
  { quote: "Thank you for providing this space for under-represented communities.", avatarId: 20 },
  { quote: "The layout and overall vibe of the event was great.", avatarId: 51 },
  { quote: "I've met some of my closest friends from these events.", avatarId: 38 },
];

const MobileTestimonialCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="block md:hidden py-12 px-6" style={{ backgroundColor: "#0d1f22" }}>
      <p className="text-[#E1B624] text-xs tracking-[0.3em] uppercase mb-6 font-body text-center">
        What Attendees Say
      </p>
      <div className="relative max-w-sm mx-auto">
        <div className="h-[120px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl p-4 shadow-lg text-center"
              style={{ backgroundColor: "#F5E6D3" }}
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <img
                  src={`https://i.pravatar.cc/80?img=${testimonials[index].avatarId}`}
                  alt="Attendee"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <p className="text-sm font-body leading-snug" style={{ color: "#19363B" }}>
                  "{testimonials[index].quote}"
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={() => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#F5E6D3" }}
          >
            <ChevronLeft className="w-4 h-4" style={{ color: "#19363B" }} />
          </button>
          <div className="flex gap-1.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: "#F5E6D3",
                  opacity: i === index ? 1 : 0.3,
                }}
              />
            ))}
          </div>
          <button
            onClick={() => setIndex((prev) => (prev + 1) % testimonials.length)}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#F5E6D3" }}
          >
            <ChevronRight className="w-4 h-4" style={{ color: "#19363B" }} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default MobileTestimonialCarousel;
