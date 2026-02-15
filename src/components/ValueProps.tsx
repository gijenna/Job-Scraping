import { motion } from "framer-motion";
import { Megaphone, Palette, Handshake } from "lucide-react";

const props = [
  {
    icon: Megaphone,
    title: "Industry Influence",
    desc: "38% of our audience are the storytellers — Marketing and PR pros who manage social feeds for the biggest names in outdoor. Your brand gets in front of the people who move the needle.",
  },
  {
    icon: Palette,
    title: "The Talent Pipeline",
    desc: "Direct access to the UO Sports Product Management cohort and 100+ mid-to-senior level designers, product developers, and operations leaders actively seeking their next role.",
  },
  {
    icon: Handshake,
    title: "Strategic Networking",
    desc: "Skip the LinkedIn cold-outreach. Build real partnerships in a curated, sober, high-vibe environment where every conversation is intentional.",
  },
];

const ValueProps = () => {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4 font-body">Why Gather?</p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground">
            This Isn't a Job Fair
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {props.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-gradient-card border border-border rounded-xl p-8 shadow-card group hover:border-primary/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <p.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-3">{p.title}</h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-card border border-primary/20 rounded-xl p-8 text-center shadow-gold"
        >
          <p className="text-foreground font-display text-lg md:text-xl italic max-w-3xl mx-auto">
            "You aren't just buying a table — you are setting up a product demo for the people who manage the social feeds of the entire industry. This is your chance to get your new line into the hands of the storytellers."
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ValueProps;
