import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const schedule = [
  { time: "4:30–5 PM", label: "Brand Load-In", desc: "Set up your booth and settle in" },
  { time: "3–4 PM", label: "VIP Hour", desc: "200 candidates from underrepresented communities get exclusive early access" },
  { time: "4–6 PM", label: "Main Event", desc: "Up to 1,000 registrants network with brands, career coaches, and each other" },
  { time: "6–7 PM", label: "Wrap Up", desc: "Teardown and final conversations" },
  { time: "8 PM+", label: "Unofficial After-Party", desc: "Just ask us!" },
];

const Schedule = () => {
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
            The Evening
          </h2>
        </motion.div>

        <div className="space-y-4">
          {schedule.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-6 items-start bg-gradient-card border border-border rounded-xl p-6 shadow-card"
            >
              <div className="shrink-0 w-20 text-center">
                <Clock className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="font-display font-bold text-sm text-primary">{item.time}</p>
              </div>
              <div>
                <p className="font-display font-semibold text-foreground">{item.label}</p>
                <p className="text-muted-foreground text-sm font-body">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Schedule;
