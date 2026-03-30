import { motion } from "framer-motion";
import { Heart, Eye, Users, Shield } from "lucide-react";

const SoberEventSection = () => {
  const benefits = [
    {
      icon: Eye,
      title: "Clear-Headed Networking",
      desc: "Every conversation is intentional. Candidates and recruiters connect at their best — no awkward, alcohol-fueled interactions.",
    },
    {
      icon: Users,
      title: "Inclusive for Everyone",
      desc: "Whether you're sober-curious, in recovery, or simply prefer non-alcoholic options — everyone feels welcome and comfortable.",
    },
    {
      icon: Shield,
      title: "Professional Atmosphere",
      desc: "Brands trust that their team will represent them well, and candidates make genuine first impressions that stick.",
    },
  ];

  return (
    <section className="py-20 md:py-28 px-6 bg-gradient-to-b from-events-teal via-[#0d1f22] to-events-teal">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 text-xs font-display font-bold tracking-widest uppercase text-events-yellow mb-4">
            <Heart className="w-4 h-4" /> Why It Matters
          </span>
          <h2 className="font-headline font-bold text-3xl md:text-5xl text-events-cream mb-6">
            We're a Proudly Sober Event
          </h2>
          <p className="font-body text-events-cream/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Last year we shifted to fully sober events — and the response from both job seekers and brands was incredible. Clear eyes, real connections, and a professional atmosphere that lets the outdoor industry's best talent shine.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {benefits.map((item, i) => (
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
      </div>
    </section>
  );
};

export default SoberEventSection;
