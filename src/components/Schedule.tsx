import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const defaultSchedule = [
  { time: "4:30–5 PM", label: "Brand Load-In", desc: "Set up your booth and settle in" },
  { time: "5–5:30 PM", label: "VIP Hour", desc: "Select candidates get exclusive early access" },
  { time: "5:30–8 PM", label: "Main Event", desc: "Registrants network with brands, career coaches, and each other" },
  { time: "8–8:30 PM", label: "Wrap Up", desc: "Teardown and final conversations" },
  { time: "9 PM+", label: "Unofficial After-Party", desc: "Just ask us!" },
];

interface ScheduleProps {
  items?: { time: string; label: string; desc: string }[];
  heading?: string;
}

const Schedule = ({ items, heading = "The Evening" }: ScheduleProps) => {
  const schedule = items || defaultSchedule;
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4 font-body">Run of Show</p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground">
            {heading}
          </h2>
        </motion.div>

        <div className="space-y-4">
          {schedule.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-4 bg-gradient-card border border-border rounded-xl p-5 shadow-card"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-display font-bold text-foreground text-sm">{item.time} — {item.label}</p>
                <p className="text-muted-foreground font-body text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Schedule;
