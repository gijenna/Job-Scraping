import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Users, Music, Building2, GraduationCap } from "lucide-react";

const events = [
  {
    label: "Basecamp @ UO Portland",
    date: "April 16, 2026",
    location: "U of O Portland Downtown Campus",
    scale: "250+",
    scaleNote: "intimate, high-concentration",
    audience: [
      "Active job seekers (especially in current market)",
      "Mid-career outdoor industry professionals",
      "SPM students & recent grads",
      "People already at Patagonia, TNF, Columbia, Keen, Nike, Adidas",
    ],
    format: [
      "Employer tables with 5–10 min recruiter conversations",
      "Industry Expert / Mentor Zone (leaders featured by name)",
      '"How I Broke In" panel — 45 min career tactics',
      "Light snacks & drinks provided by U of O",
    ],
    icon: GraduationCap,
    highlight: "5th annual — proven format, growing every year",
    link: "/gather-pnw",
  },
  {
    label: "Gather Denver @ Outside Days",
    date: "May 28, 2026",
    location: "Denver, CO — part of Outside Days Festival",
    scale: "600+",
    scaleNote: "career event · 40,000+ at full festival",
    audience: [
      "Strong presence of passive experts — not actively searching but networking",
      "Outdoor-oriented talent applying skills at mission-aligned companies",
      "Heavily product, design, creative, and corporate roles",
      "Professionals from VF brands, Yeti, REI, and more",
    ],
    format: [
      "Same employer table + mentor + panel format at larger scale",
      "VIP hour for underrepresented communities (200 candidates)",
      "Full festival access for brand reps (Death Cab headlining)",
      "Unofficial after-party — ask us",
    ],
    icon: Music,
    highlight: "3rd year with Outside Inc — named top activation 2024 & 2025",
    link: "/gather-denver",
  },
];

const EventOverview = () => {
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
            Two Opportunities in 2026
          </p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4">
            The Events
          </h2>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            Two distinct events, one mission: connect your brand with the highest-quality
            outdoor industry talent in the most intentional format possible.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-gradient-card border border-border rounded-xl overflow-hidden shadow-card"
            >
              {/* Header */}
              <div className="bg-primary/5 border-b border-border p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <event.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-foreground">
                      {event.label}
                    </h3>
                    <p className="text-primary text-xs font-body mt-1 italic">
                      {event.highlight}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Quick Facts */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-foreground text-sm font-semibold font-display">{event.date}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-foreground text-sm font-semibold font-display">{event.scale}</p>
                      <p className="text-muted-foreground text-xs">{event.scaleNote}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 col-span-2">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-muted-foreground text-sm">{event.location}</p>
                  </div>
                </div>

                {/* Who Attends */}
                <div>
                  <p className="font-display font-semibold text-foreground text-sm mb-3">
                    Who Attends
                  </p>
                  <ul className="space-y-2">
                    {event.audience.map((item, j) => (
                      <li key={j} className="flex gap-2 text-sm text-muted-foreground font-body">
                        <span className="text-primary shrink-0">›</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Format */}
                <div>
                  <p className="font-display font-semibold text-foreground text-sm mb-3">
                    Format
                  </p>
                  <ul className="space-y-2">
                    {event.format.map((item, j) => (
                      <li key={j} className="flex gap-2 text-sm text-muted-foreground font-body">
                        <span className="text-primary shrink-0">›</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Learn More */}
                <Link
                  to={event.link}
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-gold text-primary-foreground font-display font-bold text-sm rounded-lg hover:opacity-90 transition-opacity shadow-gold"
                >
                  Learn More →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Candidate Experience Callout */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 bg-gradient-card border border-primary/20 rounded-xl p-8 text-center shadow-gold"
        >
          <p className="text-foreground font-display text-lg md:text-xl italic max-w-3xl mx-auto">
            "I actually got more than 30 seconds with a recruiter. I had a deep, meaningful
            conversation and got really good advice — and I could follow up personally
            afterwards. I was one of 50, not one of 1,200."
          </p>
          <p className="text-muted-foreground text-sm mt-4 font-body">
            — The candidate experience brands tell us they're looking for
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default EventOverview;
