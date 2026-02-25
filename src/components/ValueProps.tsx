import { motion } from "framer-motion";
import { Megaphone, Eye, Sparkles, TrendingUp } from "lucide-react";

const props = [
  {
    icon: Eye,
    title: "Reach the Tastemakers",
    desc: "50% of our audience are Marketing, PR, and Communications pros — the people who decide which brands get amplified across the outdoor industry's biggest platforms.",
  },
  {
    icon: Sparkles,
    title: "Product Discovery, Live",
    desc: "This isn't a tradeshow floor. It's a curated, high-energy environment where attendees actively seek out new brands, gear, and partnerships. Your product gets hands-on time with decision-makers.",
  },
  {
    icon: TrendingUp,
    title: "Brand Visibility That Compounds",
    desc: "Creative directors, content producers, and social strategists walk away talking about the brands they discovered. One activation becomes months of organic reach.",
  },
  {
    icon: Megaphone,
    title: "Access an Untapped Pipeline",
    desc: "Founders, program managers, and emerging talent from top outdoor programs — all in one room. Build partnerships, seed ambassador relationships, and plant your flag with the next generation.",
  },
];

const ValueProps = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Lead quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-card border border-primary/20 rounded-xl p-10 md:p-14 text-center shadow-gold mb-16"
        >
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4 font-body">
            Why Brands Choose Gather
          </p>
          <p className="text-foreground font-display text-xl md:text-2xl lg:text-3xl italic leading-relaxed max-w-3xl mx-auto">
            "Gather is where our audience discovers what's next. Half the room manages social feeds and brand stories for the biggest names in outdoor — your product doesn't just get seen, it gets talked about."
          </p>
        </motion.div>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4 font-body">For Brands & Marketers</p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4">
            Your Audience Is Already Here
          </h2>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            Gather puts your brand in front of the outdoor industry's most influential voices — the storytellers, creatives, and leaders who shape what the market pays attention to.
          </p>
        </motion.div>

        {/* Value cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {props.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-card border border-border rounded-xl p-8 shadow-card group hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <p.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-foreground mb-2">{p.title}</h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProps;
