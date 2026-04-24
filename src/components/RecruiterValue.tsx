import { motion } from "framer-motion";
import { Users, Star, Target } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface QualityPoint {
  icon: LucideIcon;
  stat: string;
  label: string;
  desc: string;
}

interface RecruiterValueProps {
  qualityPoints?: QualityPoint[];
}

const defaultQualityPoints: QualityPoint[] = [
{
  icon: Target,
  stat: "92%",
  label: "Role-Relevant",
  desc: "Attendees are in product, design, creative, and corporate roles adjacent to outdoor/active lifestyle, not random job fair traffic."
},
{
  icon: Users,
  stat: "250–500",
  label: "Per Event",
  desc: "Smaller pool, far higher concentration of relevant candidates. Every conversation is intentional, no 30-second drive-bys."
},
{
  icon: Star,
  stat: "Mid-to-Senior",
  label: "Career Level",
  desc: "Awesomely tenured professionals already at brands like Patagonia, Columbia, Nike, and REI, plus hungry SPM grads."
}];



const RecruiterValue = ({ qualityPoints: qualityPointsProp }: RecruiterValueProps) => {
  const points = qualityPointsProp || defaultQualityPoints;
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16">

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
          {points.map((point, i) =>
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-gradient-card border border-border rounded-xl p-8 shadow-card text-center">

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
          )}
        </div>

        {/* Intimate Format Callout */}
        


































      </div>
    </section>);

};

export default RecruiterValue;