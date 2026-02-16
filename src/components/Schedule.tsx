import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const schedule = [
{ time: "1–3 PM", label: "Brand Load-In", desc: "Set up your booth and settle in" },
{ time: "3–4 PM", label: "VIP Hour", desc: "200 candidates from underrepresented communities get exclusive early access" },
{ time: "4–6 PM", label: "Main Event", desc: "Up to 1,000 registrants network with brands, career coaches, and each other" },
{ time: "6–7 PM", label: "Wrap Up", desc: "Teardown and final conversations" },
{ time: "8 PM+", label: "Unofficial After-Party", desc: "Just ask us!" }];


const Schedule = () => {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16">

          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4 font-body">Run of Show</p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground">
            The Evening
          </h2>
        </motion.div>

        <div className="space-y-4">
          {schedule.map((item, i) => {}

















          )}
        </div>
      </div>
    </section>);

};

export default Schedule;