import { motion } from "framer-motion";
import { Megaphone, Eye, Sparkles, TrendingUp } from "lucide-react";
import EditableText from "@/components/EditableText";

const props = [
  {
    icon: Eye,
    titleKey: "vp1_title",
    titleDefault: "Reach the Tastemakers",
    descKey: "vp1_desc",
    descDefault: "50% of our audience are Marketing, PR, and Communications pros, the people who decide which brands get amplified across the outdoor industry's biggest platforms.",
  },
  {
    icon: Sparkles,
    titleKey: "vp2_title",
    titleDefault: "Product Discovery, Live",
    descKey: "vp2_desc",
    descDefault: "This isn't a tradeshow floor. It's a curated, high-energy environment where attendees actively seek out new brands, gear, and partnerships. Your product gets hands-on time with decision-makers.",
  },
  {
    icon: TrendingUp,
    titleKey: "vp3_title",
    titleDefault: "Brand Visibility That Compounds",
    descKey: "vp3_desc",
    descDefault: "Creative directors, content producers, and social strategists walk away talking about the brands they discovered. One activation becomes months of organic reach.",
  },
  {
    icon: Megaphone,
    titleKey: "vp4_title",
    titleDefault: "Access an Untapped Pipeline",
    descKey: "vp4_desc",
    descDefault: "Founders, program managers, and emerging talent from top outdoor programs, all in one room. Build partnerships, seed ambassador relationships, and plant your flag with the next generation.",
  },
];

const ValueProps = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-gradient-card border border-primary/20 rounded-xl p-10 md:p-14 text-center shadow-gold mb-16">
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4 font-body">
            <EditableText settingKey="vp_quote_eyebrow" defaultText="Why Brands Choose Gather" as="span" />
          </p>
          <p className="text-foreground font-display text-xl md:text-2xl lg:text-3xl italic leading-relaxed max-w-3xl mx-auto">
            <EditableText settingKey="vp_quote" defaultText={`"Gather is where our audience discovers what's next. Half the room manages social feeds and brand stories for the biggest names in outdoor, your product doesn't just get seen, it gets talked about."`} as="span" multiline />
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4 font-body">
            <EditableText settingKey="vp_section_eyebrow" defaultText="For Brands & Marketers" as="span" />
          </p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4">
            <EditableText settingKey="vp_section_headline" defaultText="Your Audience Is Already Here" as="span" />
          </h2>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            <EditableText settingKey="vp_section_subtitle" defaultText="Gather puts your brand in front of the outdoor industry's most influential voices, the storytellers, creatives, and leaders who shape what the market pays attention to." as="span" multiline />
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {props.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-gradient-card border border-border rounded-xl p-8 shadow-card group hover:border-primary/30 transition-colors">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <p.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-foreground mb-2">
                    <EditableText settingKey={p.titleKey} defaultText={p.titleDefault} as="span" />
                  </h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">
                    <EditableText settingKey={p.descKey} defaultText={p.descDefault} as="span" multiline />
                  </p>
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
