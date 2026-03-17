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
        <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Basecamp events are an opportunity for outdoor brands to discuss their culture and values. So even if you don't have open roles immediately, aligned candidates will open your job opportunities when you are.
        </p>
      </motion.div>
    </div>
  </section>
);

export default EventNotHiringCallout;
