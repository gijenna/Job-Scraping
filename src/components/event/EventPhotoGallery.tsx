import { motion } from "framer-motion";

interface EventPhotoGalleryProps {
  photos: string[];
  headline?: string;
  subheadline?: string;
}

const EventPhotoGallery = ({
  photos,
  headline = "Last Year's Event",
  subheadline = "Real moments from Gather — the outdoor industry's premier sober career event.",
}: EventPhotoGalleryProps) => {
  return (
    <section className="py-20 px-6 bg-events-teal">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-display font-bold tracking-widest uppercase text-events-yellow mb-4">
            The Vibe
          </span>
          <h2 className="font-headline font-bold text-3xl md:text-4xl text-events-cream mb-3">
            {headline}
          </h2>
          <p className="font-body text-events-cream/60 text-base max-w-2xl mx-auto">
            {subheadline}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {photos.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl overflow-hidden ${
                i === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <img
                src={src}
                alt={`Gather event photo ${i + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventPhotoGallery;
