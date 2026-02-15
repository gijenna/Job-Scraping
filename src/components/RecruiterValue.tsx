import { motion } from "framer-motion";
import { Users, Star, MessageCircle, Target, Briefcase, Mic } from "lucide-react";

const qualityPoints = [
  {
    icon: Target,
    stat: "92%",
    label: "Role-Relevant",
    desc: "Attendees are in product, design, creative, and corporate roles adjacent to outdoor/active lifestyle — not random job fair traffic.",
  },
  {
    icon: Users,
    stat: "250–500",
    label: "Per Event",
    desc: "Smaller pool, far higher concentration of relevant candidates. Every conversation is intentional — no 30-second drive-bys.",
  },
  {
    icon: Star,
    stat: "Mid-to-Senior",
    label: "Career Level",
    desc: "Awesomely tenured professionals already at brands like Patagonia, Columbia, Nike, and REI — plus hungry SPM grads.",
  },
];

const showUpOptions = [
  {
    icon: Briefcase,
    title: "Employer Table / Booth",
    desc: "Recruiters or hiring managers take 5–10 minute quality conversations. Space for banners, pull-ups, printed materials, QR codes to your careers page, and swag.",
    tag: "Most Popular",
    example: "Columbia brings product samples and a banner; VF brands set up QR-code stands linking directly to open roles. Keen brings swag bags with branded materials.",
  },
  {
    icon: MessageCircle,
    title: "Industry Expert / Mentor",
    desc: "Your leaders are featured by name — called out just as prominently as the brand itself. Show up as approachable mentors, not just a logo. 1:1 mini-mentorship conversations.",
    tag: "Low Lift",
    example: "Individual leaders from Nike, Adidas, and Columbia have participated as named mentors — even when their company wasn't formally tabling.",
  },
  {
    icon: Mic,
    title: "Panel Speaker",
    desc: "Join the 'How I Broke In' panel — 45 minutes of concrete career steps, networking tactics, and Q&A. Your people become the face of what it means to work at your brand.",
    tag: "High Visibility",
    example: "Panelists share their exact career trajectory — who they talked to, what they said, how they found the role. It's the most-requested segment at every event.",
  },
];

const RecruiterValue = () => {
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
            What Recruiters Asked For
          </p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4">
            Quality Over Quantity
          </h2>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            Top recruiters at Nike, VF Corp, and Columbia all asked the same question:{" "}
            <span className="text-foreground italic">"What's the quality of candidates?"</span>{" "}
            Here's the answer.
          </p>
        </motion.div>

        {/* Candidate Quality Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {qualityPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-card border border-border rounded-xl p-8 shadow-card text-center"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <point.icon className="w-6 h-6 text-primary" />
              </div>
              <p className="font-display font-extrabold text-3xl text-gradient-gold mb-1">
                {point.stat}
              </p>
              <p className="font-display font-semibold text-foreground text-sm mb-3">
                {point.label}
              </p>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                {point.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Intimate Format Callout */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-card border border-primary/20 rounded-xl p-8 mb-16 shadow-gold"
        >
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4 font-body">
              The Format
            </p>
            <h3 className="font-display font-bold text-2xl text-foreground mb-4">
              Intimate, High-Quality Networking
            </h3>
            <p className="text-muted-foreground font-body leading-relaxed mb-6">
              Hundreds, not tens of thousands. Every attendee is pre-qualified and
              aligned with outdoor, product, and creative corporate roles. Your
              recruiters have real conversations — not shouting over a convention
              floor.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Avg. Conversation", value: "5–10 min" },
                { label: "Candidate NPS", value: "94" },
                { label: "Offers Extended", value: "Same Week" },
              ].map((s, i) => (
                <div key={i} className="bg-background/50 rounded-lg p-4">
                  <p className="font-display font-extrabold text-xl text-gradient-gold">
                    {s.value}
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default RecruiterValue;
