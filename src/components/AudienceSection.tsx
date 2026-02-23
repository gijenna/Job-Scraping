import { motion } from "framer-motion";
import { Building2, Cpu, Handshake, Megaphone, Wrench, ArrowRightLeft, Palette, GraduationCap, Target } from "lucide-react";

const companyCategories = [
  {
    label: "Outdoor Brands",
    icon: Building2,
    names: ["REI", "Patagonia", "The North Face", "Cotopaxi", "Alterra Mountain Company", "Black Diamond", "Vail Resorts", "Smartwool"],
  },
  {
    label: "Tech & Corporate",
    icon: Cpu,
    names: ["Google", "Nike", "Apple", "KPMG", "Marriott", "Amazon"],
  },
  {
    label: "Industry Agencies",
    icon: Handshake,
    names: ["Backbone Media", "Outside Inc.", "Sustainable Apparel Coalition"],
  },
];

const audienceSummary = [
  {
    icon: Megaphone,
    stat: "50%",
    title: 'The Industry "Tastemakers"',
    desc: "Marketing and Communications professionals — brand strategists, creators, and storytellers who are the primary voice of the outdoor and sports industries.",
  },
  {
    icon: Wrench,
    stat: "16%",
    title: 'A "Makers" Hub',
    desc: "Technical Product Designers, Apparel Developers, and Merchandisers — the people who actually build the products, not just those who sell them.",
  },
  {
    icon: ArrowRightLeft,
    stat: "17%",
    title: "The Career Pivot Point",
    desc: "Professionals like nurses, military officers, and educators actively seeking to bring their specialized skills into the outdoor space — a critical talent pipeline.",
  },
];

const personas = [
  { icon: Palette, pct: "30%", label: "Creative Leaders", desc: "Graphic Designers, Creative Directors, Content Producers" },
  { icon: GraduationCap, pct: "22%", label: "Emerging Talent", desc: "Graduate Students and MS Candidates from specialized programs" },
  { icon: Target, pct: "18%", label: "Strategic Decision Makers", desc: "Founders, Directors, and Program Managers" },
];

const AudienceSection = () => {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Companies of Note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4 font-body">
            Companies of Note Represented
          </p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4">
            Who's in the Room
          </h2>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto mb-12">
            Attendees come from a mix of major outdoor brands, tech giants, and specialized agencies.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {companyCategories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-card border border-border rounded-xl p-6 shadow-card"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <cat.icon className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-foreground">{cat.label}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.names.map((name) => (
                    <span
                      key={name}
                      className="bg-secondary text-secondary-foreground text-xs font-body px-3 py-1.5 rounded-full"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Executive Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4 font-body text-center">
            Event Audience Executive Summary
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {audienceSummary.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-card border border-border rounded-xl p-6 shadow-card"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-primary font-display font-extrabold text-3xl">{item.stat}</span>
                </div>
                <h3 className="font-display font-bold text-foreground text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm font-body">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Persona Snapshot */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4 font-body text-center">
            Attendee Persona Snapshot
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {personas.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-card border border-primary/20 rounded-xl p-6 text-center shadow-gold"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <p.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-primary font-display font-extrabold text-4xl mb-1">{p.pct}</p>
                <p className="font-display font-bold text-foreground text-lg mb-1">{p.label}</p>
                <p className="text-muted-foreground text-sm font-body">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AudienceSection;
