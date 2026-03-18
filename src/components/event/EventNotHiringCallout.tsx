import { motion } from "framer-motion";

const EventNotHiringCallout = () => (
  <section className="py-16 px-6">
    <div className="container mx-auto max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h3 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-4">
          You don't have to be hiring.
        </h3>
        <div className="space-y-4 max-w-2xl mx-auto">
          <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed">
            Employer branding is the long game. You need to be unforgettable before the role ever opens.
          </p>
          <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed">
            This isn't about collecting resumes. It's about staying in the back of someone's mind until the timing is right. So when it is, you're not a cold option. You're the obvious one.
          </p>
          <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed">
            That ticker above? That's who's in the room. Top performers choosing where to buy, who to trust, and who's building something worth being part of.
          </p>
          <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed">
            Employer branding isn't a recruiting tactic. It's a revenue strategy.
          </p>
          <p className="font-body text-base md:text-lg text-foreground font-semibold leading-relaxed">
            Show up like it matters. Because it does.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

export default EventNotHiringCallout;
