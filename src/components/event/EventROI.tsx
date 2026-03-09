import { motion } from "framer-motion";
import { Users, Shield, BarChart3, HeartHandshake } from "lucide-react";

interface ROIPoint {
  icon: typeof Users;
  headline: string;
  detail: string;
}

interface EventROIProps {
  eventSize: string;
  points?: ROIPoint[];
}

const defaultPoints: ROIPoint[] = [
  {
    icon: Users,
    headline: "Quality Over Volume",
    detail:
      "You're meeting 1 of 50, not 1 of 1,200. Every conversation is meaningful. Attendees are pre-qualified industry professionals - not a mass career fair crowd.",
  },
  {
    icon: Shield,
    headline: "We Help You Show Up Right",
    detail:
      "We know your brand needs to arrive at a certain standard. We provide table setup, signage guidance, and coordination so your team looks polished from the moment doors open.",
  },
  {
    icon: BarChart3,
    headline: "Easy Internal Pitch",
    detail:
      "Clear sponsorship tiers, transparent pricing, and a post-event engagement report. Everything your leadership and finance teams need to greenlight participation.",
  },
  {
    icon: HeartHandshake,
    headline: "Candidate Experience First",
    detail:
      "Attendees leave saying 'I actually had a real conversation with that recruiter.' That's the brand impression that turns into applications, referrals, and loyalty.",
  },
];

const EventROI = ({ eventSize, points = defaultPoints }: EventROIProps) => {
  return (
    <section className="py-24 px-6 border-y border-border">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4 font-body">
            For Recruiting & TA Teams
          </p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4">
            Why This Event Delivers
          </h2>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            With {eventSize} attendees, this isn't a mass career fair - it's a curated room where every interaction counts. Here's what makes it easy to say yes internally.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {points.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-card border border-border rounded-xl p-8 shadow-card flex gap-5"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <point.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-display font-bold text-lg text-foreground mb-2">
                  {point.headline}
                </h4>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  {point.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventROI;
