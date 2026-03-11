import { motion } from "framer-motion";

interface TapInOption {
  title: string;
  description: string;
  linkUrl: string;
  linkLabel: string;
  imageSrc: string;
  secondaryLink?: { url: string; label: string };
}

interface RegistrantHowToTapInProps {
  registrationUrl: string;
  sponsorPageUrl: string;
  expertsPageUrl: string;
  accentColor?: string;
  bgColor?: string;
  images?: [string, string, string];
  attendeeCount?: string;
}

const DEFAULT_IMAGES: [string, string, string] = [
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=900&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=900&fit=crop&q=80",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=900&fit=crop&q=80",
];

const RegistrantHowToTapIn = ({
  registrationUrl,
  sponsorPageUrl,
  expertsPageUrl,
  images,
  attendeeCount = "500+",
}: RegistrantHowToTapInProps) => {
  const imgs = images || DEFAULT_IMAGES;

  const options: TapInOption[] = [
    {
      title: "ATTEND FOR FREE",
      description: "Show up, meet brands, and discover your next opportunity",
      linkUrl: registrationUrl,
      linkLabel: "REGISTER NOW",
      imageSrc: imgs[0],
    },
    {
      title: "SHOW UP AS A BRAND",
      description: `Create a discovery zone for your brand. Engage with ${attendeeCount} leaders, athletes, and influencers in the outdoor industry`,
      linkUrl: sponsorPageUrl,
      linkLabel: "MORE INFO",
      imageSrc: imgs[1],
    },
    {
      title: "BECOME AN INDUSTRY EXPERT",
      description: "Share your story and be featured on the event page",
      linkUrl: expertsPageUrl,
      linkLabel: "SIGN UP",
      imageSrc: imgs[2],
    },
  ];

  return (
    <section className="py-20 md:py-28 px-6 bg-events-cream">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-4 font-body text-events-coral">
            3 Ways to Tap In
          </p>
          <h2 className="font-headline font-bold text-3xl md:text-5xl text-events-teal leading-tight">
            How do you want to show up?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {options.map((option, i) => (
            <motion.a
              key={i}
              href={option.linkUrl}
              target={option.linkUrl.startsWith("http") ? "_blank" : undefined}
              rel={option.linkUrl.startsWith("http") ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer block"
            >
              {/* Background image */}
              <img
                src={option.imageSrc}
                alt={option.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/25 transition-opacity duration-300 group-hover:from-black/90" />

              {/* Content centered vertically */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-8">
                <h3 className="font-headline font-bold text-2xl md:text-3xl text-white tracking-wide leading-tight mb-3">
                  {option.title}
                </h3>
                <p className="font-body text-sm text-white/70 leading-relaxed mb-6 max-w-[240px] min-h-[60px] flex items-center">
                  {option.description}
                </p>
                <span className="inline-block px-6 py-3 border-2 border-white text-white font-display font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 group-hover:bg-white group-hover:text-events-teal">
                  {option.linkLabel}
                </span>
                {option.secondaryLink && (
                  <span className="inline-block mt-3 px-6 py-3 border-2 border-white text-white font-display font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 group-hover:bg-white group-hover:text-events-teal">
                    {option.secondaryLink.label}
                  </span>
                )}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RegistrantHowToTapIn;
