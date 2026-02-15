import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "We all met GREAT candidates. Three of us have a candidate in play, and I am hopefully extending an offer to one today. Huge success.",
    name: "Martine Knights",
    title: "Sr Recruiter, VF Corporation",
  },
  {
    quote: "We generated a LOT of excellent candidates & would be very happy to sponsor again! We were so impressed by the depth of talent — AWESOMELY tenured individuals.",
    name: "Hillary St. John",
    title: "Sr. HR, Elevate Outdoor Collective",
  },
  {
    quote: "The job seekers were super motivated and highly aligned. I will definitely seek out this event in the future!",
    name: "Crystal Weaver",
    title: "Recruiting Manager",
  },
  {
    quote: "We use Gather as a branding opportunity for when we're hiring in the future.",
    name: "Liz Berry",
    title: "Sr Manager, Talent Acquisition",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 px-6 border-y border-border">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4 font-body">Social Proof</p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground">
            Recruiters Love Gather
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-card border border-border rounded-xl p-8 shadow-card"
            >
              <p className="text-foreground font-body text-sm leading-relaxed mb-6 italic">
                "{t.quote}"
              </p>
              <div>
                <p className="font-display font-semibold text-foreground">{t.name}</p>
                <p className="text-muted-foreground text-sm">{t.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
