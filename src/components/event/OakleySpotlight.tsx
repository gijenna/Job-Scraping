import { motion } from "framer-motion";
import { ArrowRight, Eye, Mountain, Sparkles } from "lucide-react";

const OAKLEY_LOGO = "https://logo.clearbit.com/oakley.com";

const lifestyle = [
  {
    name: "Performance Eyewear",
    img: "https://images.oakley.com/is/image/OakleyEU/888392489715__STD__shad__qt.png?impolicy=OO_ratio&width=800",
  },
  {
    name: "Prizm Snow",
    img: "https://images.oakley.com/is/image/OakleyEU/888392554215__STD__shad__qt.png?impolicy=OO_ratio&width=800",
  },
  {
    name: "Everyday Icons",
    img: "https://images.oakley.com/is/image/OakleyEU/888392460479__STD__shad__qt.png?impolicy=OO_ratio&width=800",
  },
];

const valueProps = [
  {
    icon: Mountain,
    title: "Built for Every Athlete",
    desc: "From the morning walker to the elite snowboarder to the Olympic medalist, Oakley meets every level of movement.",
  },
  {
    icon: Eye,
    title: "Prizm Lens Technology",
    desc: "See the trail, the snow, the road sharper than ever. Oakley's proprietary lens science is unmatched in the field.",
  },
  {
    icon: Sparkles,
    title: "Future Genesis",
    desc: "Where performance meets culture and creators. Oakley sits at the intersection of sport, art, and storytelling.",
  },
];

const OakleySpotlight = () => {
  return (
    <section className="py-20 md:py-28 px-6 bg-gradient-to-b from-events-teal via-[#0d1f22] to-events-teal">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-display font-bold tracking-widest uppercase text-events-yellow mb-4">
            Title Sponsor Spotlight
          </span>
          <div className="flex items-center justify-center mb-6">
            <img
              src={OAKLEY_LOGO}
              alt="Oakley"
              className="h-16 md:h-20 w-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://www.google.com/s2/favicons?domain=oakley.com&sz=128";
              }}
            />
          </div>
          <p className="font-body text-events-cream/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            For 50 years, Oakley has been the eyewear of athletes who push limits, and the everyday creators, riders, runners, and adventurers who shape the outdoor industry from the ground up.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {valueProps.map((item, i) => (
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          {lifestyle.map((item, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden group bg-events-card/40 border border-events-cream/10">
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-64 object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-events-teal/80 via-transparent to-transparent pointer-events-none" />
              <p className="absolute bottom-4 left-4 font-headline font-bold text-events-cream text-lg">
                {item.name}
              </p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <a
            href="https://www.oakley.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-display font-bold text-lg shadow-xl transition-all duration-300 hover:scale-105 bg-events-yellow text-events-teal"
          >
            Explore Oakley <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default OakleySpotlight;
