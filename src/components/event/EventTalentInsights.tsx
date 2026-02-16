import { motion } from "framer-motion";

interface InsightCard {
  title: string;
  stat: string;
  desc: string;
  image: string;
}

interface EventTalentInsightsProps {
  insights: InsightCard[];
}

const EventTalentInsights = ({ insights }: EventTalentInsightsProps) => {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4 font-body">
            Why It Matters
          </p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4">
            More Than A Career Fair
          </h2>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            Every seat in the room is strategic. Here's what the data tells sponsors.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {insights.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-xl overflow-hidden min-h-[320px] group border border-border shadow-card"
            >
              {/* Background image */}
              <img
                src={item.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-end h-full p-8">
                <p className="font-display font-extrabold text-3xl text-primary mb-1">
                  {item.stat}
                </p>
                <h3 className="font-display font-bold text-xl text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-white/80 font-body text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventTalentInsights;
