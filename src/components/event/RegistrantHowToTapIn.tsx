import { motion } from "framer-motion";
import { Compass, Building2, Users, ArrowRight } from "lucide-react";

interface TapInOption {
  icon: React.ElementType;
  title: string;
  description: string;
  linkUrl: string;
  linkLabel: string;
  accentColor: string;
}

interface RegistrantHowToTapInProps {
  registrationUrl: string;
  sponsorPageUrl: string;
  expertsPageUrl: string;
  accentColor?: string;
  bgColor?: string;
}

const RegistrantHowToTapIn = ({
  registrationUrl,
  sponsorPageUrl,
  expertsPageUrl,
  accentColor = "#E1B624",
  bgColor = "#19363B",
}: RegistrantHowToTapInProps) => {
  const options: TapInOption[] = [
    {
      icon: Compass,
      title: "Network & Job Search",
      description: "Free registration. Show up, meet brands, talk to experts, and discover your next opportunity in the outdoor industry.",
      linkUrl: registrationUrl,
      linkLabel: "Register Free →",
      accentColor,
    },
    {
      icon: Building2,
      title: "Show Up as a Brand",
      description: "Bring your team, set up a discovery zone, and connect with 300–800 of the most engaged professionals in the industry.",
      linkUrl: sponsorPageUrl,
      linkLabel: "Learn About Sponsorship →",
      accentColor: "#ED7660",
    },
    {
      icon: Users,
      title: "Become an Industry Expert",
      description: "Share your story 1:1 with attendees as a named expert. Low lift, high impact — you'll be featured on the event page.",
      linkUrl: expertsPageUrl,
      linkLabel: "Sign Up as an Expert →",
      accentColor: "#ED7660",
    },
  ];

  return (
    <section className="py-20 md:py-28 px-6" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-4 font-body" style={{ color: "#ED7660" }}>
            3 Ways to Tap In
          </p>
          <h2 className="font-headline font-bold text-3xl md:text-5xl text-white leading-tight">
            How do you want to{" "}
            <span style={{ color: accentColor }}>show up</span>?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((option, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="rounded-2xl p-8 border border-white/10 flex flex-col"
              style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: `${option.accentColor}20` }}
              >
                <option.icon className="w-6 h-6" style={{ color: option.accentColor }} />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-3">{option.title}</h3>
              <p className="font-body text-sm text-white/60 leading-relaxed flex-1 mb-6">{option.description}</p>
              <a
                href={option.linkUrl}
                target={option.linkUrl.startsWith("http") ? "_blank" : undefined}
                rel={option.linkUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 font-body text-sm font-medium transition-opacity hover:opacity-80"
                style={{ color: option.accentColor }}
              >
                {option.linkLabel}
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RegistrantHowToTapIn;
