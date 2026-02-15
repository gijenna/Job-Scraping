import { motion } from "framer-motion";
import { Briefcase, MessageCircle, Mic, Globe, Mail, Share2 } from "lucide-react";

interface ShowUpOption {
  icon: typeof Briefcase;
  title: string;
  desc: string;
  tag: string;
  example: string;
  photos?: string[]; // placeholder for future photo carousel
}

interface DigitalPerk {
  icon: typeof Globe;
  title: string;
  desc: string;
}

interface EventBrandShowUpProps {
  options: ShowUpOption[];
}

const digitalPerks: DigitalPerk[] = [
  {
    icon: Globe,
    title: "Website & Registration Placement",
    desc: "Your logo featured prominently on the event website and registration page — seen by every single attendee before they arrive.",
  },
  {
    icon: Mail,
    title: "Newsletter Promotion",
    desc: "Dedicated feature in our newsletter reaching our full community. Your involvement announced to thousands of engaged outdoor industry professionals.",
  },
  {
    icon: Share2,
    title: "Social Media Amplification",
    desc: "Dedicated posts across our 50K LinkedIn, 75K Facebook, and 40K Instagram channels — promoting your brand to our full 300K+ audience.",
  },
];

const EventBrandShowUp = ({ options }: EventBrandShowUpProps) => {
  return (
    <section className="py-24 px-6 border-y border-border">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4 font-body">
            Your Presence
          </p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4">
            How Brands Show Up
          </h2>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            Three ways to engage in person — plus powerful digital reach to our 300K+ community.
          </p>
        </motion.div>

        {/* In-Person Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {options.map((opt, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-card border border-border rounded-xl shadow-card relative flex flex-col"
            >
              <span className="absolute top-4 right-4 text-[10px] tracking-wider uppercase font-body text-primary bg-primary/10 px-2 py-1 rounded-full">
                {opt.tag}
              </span>

              {/* Photo carousel placeholder */}
              <div className="h-48 bg-muted/30 rounded-t-xl flex items-center justify-center border-b border-border overflow-hidden">
                <div className="text-center px-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <opt.icon className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground/50 text-xs font-body">
                    Add photos from past events here
                  </p>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-1">
                <h4 className="font-display font-bold text-lg text-foreground mb-3">
                  {opt.title}
                </h4>
                <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4">
                  {opt.desc}
                </p>
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 mt-auto">
                  <p className="text-xs text-muted-foreground font-body leading-relaxed">
                    <span className="text-primary font-semibold">What brands have done: </span>
                    {opt.example}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Digital Perks */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h3 className="font-display font-bold text-2xl md:text-3xl text-foreground">
            Digital Reach & Perks
          </h3>
          <p className="text-muted-foreground font-body mt-2 max-w-xl mx-auto">
            Every sponsor gets powerful digital visibility across our full network.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {digitalPerks.map((perk, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-card border border-primary/20 rounded-xl p-8 shadow-card text-center"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <perk.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-display font-bold text-foreground mb-2">
                {perk.title}
              </h4>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                {perk.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventBrandShowUp;
