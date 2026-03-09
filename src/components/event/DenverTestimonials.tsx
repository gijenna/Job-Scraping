import { motion } from "framer-motion";
import { User } from "lucide-react";

const testimonials = [
  "You never know who you will see, meet, or make connections with at Gather!",
  "Networking doesn't have to be scary if you're around the RIGHT people in the RIGHT industry!",
  "The companies were so generous with their time and made everyone feel important and worthy of a conversation.",
  "Very friendly and energetic vibe to the whole event!",
  "The career coaching was very helpful. It helped me work up the courage to go ask the staff at Outside about being a writer for them someday.",
  "Thank you for providing this space for under-represented communities.",
  "I now have more knowledge of what skills are desired by the companies I want to work for.",
];

const DenverTestimonials = () => {
  return (
    <section className="py-20 md:py-28" style={{ backgroundColor: "#0d1f22" }}>
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl font-bold text-center mb-4"
          style={{ color: "#E1B624" }}
        >
          What Job Seekers Are Saying
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center font-body text-sm uppercase tracking-widest mb-14"
          style={{ color: "#F5E6D3", opacity: 0.5 }}
        >
          Real feedback from Gather attendees
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((quote, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-xl p-6 flex flex-col gap-4"
              style={{ backgroundColor: "#F5E6D3" }}
            >
              {/* Avatar circle */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#19363B" }}
              >
                <User className="w-5 h-5" style={{ color: "#F5E6D3" }} />
              </div>

              {/* Quote */}
              <p
                className="font-body text-sm md:text-base leading-relaxed flex-1"
                style={{ color: "#19363B" }}
              >
                "{quote}"
              </p>

              {/* Attribution */}
              <span
                className="font-body text-xs uppercase tracking-wider"
                style={{ color: "#19363B", opacity: 0.5 }}
              >
                — Gather Attendee
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DenverTestimonials;
