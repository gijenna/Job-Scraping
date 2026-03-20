import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EditableText from "@/components/EditableText";

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

interface JobSeekerTestimonialsProps {
  accentColor?: string;
  bgColor?: string;
}

const JobSeekerTestimonials = ({ accentColor = "#FEE123", bgColor = "#0d1f22" }: JobSeekerTestimonialsProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 md:py-20 px-6" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto max-w-2xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-xs tracking-[0.3em] uppercase mb-10 font-body text-events-coral"
        >
          What attendees are saying
        </motion.p>

        <div className="relative">
          <div className="h-[100px] flex items-center justify-center">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl p-5 shadow-lg text-center max-w-lg mx-auto"
              style={{ backgroundColor: "rgba(245, 230, 211, 0.08)" }}
            >
              <div className="flex items-center justify-center gap-3">
                <img
                  src={`https://i.pravatar.cc/80?img=${testimonials[index].avatarId}`}
                  alt="Attendee"
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
                <p className="font-body text-sm text-events-cream/70 leading-relaxed">
                  "{testimonials[index].quote}"
                </p>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(245, 230, 211, 0.15)" }}
            >
              <ChevronLeft className="w-4 h-4 text-events-cream" />
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
              style={{ backgroundColor: "rgba(245, 230, 211, 0.15)" }}
            >
              <ChevronRight className="w-4 h-4 text-events-cream" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobSeekerTestimonials;
