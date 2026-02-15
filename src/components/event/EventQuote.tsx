import { motion } from "framer-motion";

interface EventQuoteProps {
  quote: string;
}

const EventQuote = ({ quote }: EventQuoteProps) => {
  return (
    <section className="py-16 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-card border border-primary/20 rounded-xl p-10 md:p-14 text-center shadow-gold"
        >
          <p className="text-foreground font-display text-xl md:text-2xl lg:text-3xl italic leading-relaxed max-w-3xl mx-auto">
            "{quote}"
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default EventQuote;
