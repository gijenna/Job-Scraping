import { motion } from "framer-motion";

const paragraphs = [
  { text: "You need to be unforgettable before the role ever opens.", bold: false },
  { text: "This isn't about collecting resumes. It's about staying in the back of someone's mind until the timing is right. So when it is, you're not a cold option. You're the obvious one.", bold: false },
  { text: "That ticker above? That's who's in the room. The top performers your competitors want to poach.", bold: false },
  { text: "Employed, respected, and quietly deciding which companies are worth leaving for.", bold: false },
  { text: "Basecamp isn't a recruiting tactic. It's a revenue strategy.", bold: false },
  { text: "Show up like it matters. Because it does.", bold: true },
];

const EventNotHiringCallout = () => (
  <section className="py-16 px-6">
    <div className="container mx-auto max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h3 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-6">
          You don't have to be hiring.
        </h3>
        <div className="space-y-6 max-w-2xl mx-auto">
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 * i }}
              className={
                p.bold
                  ? "font-body text-sm md:text-base text-foreground font-semibold leading-relaxed"
                  : "font-body text-sm md:text-base text-muted-foreground leading-relaxed"
              }
            >
              {p.text}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default EventNotHiringCallout;
