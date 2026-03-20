import { motion } from "framer-motion";
import { ArrowRight, Globe, Users, Landmark } from "lucide-react";
import ConfluenceMap from "./ConfluenceMap";

const ConfluenceSpotlight = () => {
  return (
    <section className="py-20 md:py-28 px-6 bg-gradient-to-b from-events-teal via-[#0d1f22] to-events-teal">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-display font-bold tracking-widest uppercase text-events-yellow mb-4">
            Title Sponsor Spotlight
          </span>
          <h2 className="font-headline font-bold text-3xl md:text-5xl text-events-cream mb-6">
            Confluence of States
          </h2>
          <p className="font-body text-events-cream/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            A bipartisan coalition of 20 state outdoor recreation offices working together to grow the outdoor economy, create jobs, and make the outdoors more accessible to everyone. Think of them as your state's champion for outdoor industry careers.
          </p>
        </motion.div>

        {/* Value Props */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {[
            {
              icon: Landmark,
              title: "20 State Offices",
              desc: "Each state has a dedicated office focused on growing outdoor recreation as an economic engine.",
            },
            {
              icon: Users,
              title: "$350B+ Economic Impact",
              desc: "Combined outdoor recreation across member states generates hundreds of billions in economic activity.",
            },
            {
              icon: Globe,
              title: "2.5M+ Jobs",
              desc: "Millions of people work in outdoor recreation across these 20 states — and they need talented people like you.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-events-card/50 border border-events-cream/10 rounded-2xl p-6 text-center"
            >
              <item.icon className="w-8 h-8 text-events-yellow mx-auto mb-3" />
              <h3 className="font-headline font-bold text-events-cream text-lg mb-2">
                {item.title}
              </h3>
              <p className="font-body text-events-cream/60 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <p className="text-center font-body text-events-cream/50 text-sm mb-4">
            Click a colored state to explore its outdoor recreation office
          </p>
          <ConfluenceMap />
        </motion.div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-12 text-sm font-body">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ background: "linear-gradient(135deg, #4ECDC4, #FF6B6B, #FFE66D, #2ECC71)" }} />
            <span className="text-events-cream/70">Member state (click to explore)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-events-cream/10" />
            <span className="text-events-cream/70">Not yet a member</span>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <a
            href="https://www.confluenceofstates.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-display font-bold text-lg shadow-xl transition-all duration-300 hover:scale-105 bg-events-coral text-events-cream"
          >
            Learn more about Confluence of States <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ConfluenceSpotlight;
