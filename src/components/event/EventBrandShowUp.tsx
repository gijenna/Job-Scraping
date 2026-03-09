import { motion } from "framer-motion";
import { Briefcase, MessageCircle, Mic, Globe, Mail, Share2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import eventYeti from "@/assets/event-yeti.jpg";
import eventRei from "@/assets/event-rei.jpg";
import eventBoa from "@/assets/event-boa.jpg";
import eventCareerCoaching from "@/assets/event-career-coaching.jpg";
import eventShar from "@/assets/event-shar.jpg";
import eventPow from "@/assets/event-pow.jpg";
import eventOutsideBooth from "@/assets/event-outside-booth.jpg";

const carouselPhotos = [
  { src: eventYeti, alt: "YETI brand booth at Basecamp Outdoor event" },
  { src: eventRei, alt: "REI booth with attendees at Basecamp Outdoor" },
  { src: eventBoa, alt: "BOA booth engaging with attendees" },
  { src: eventCareerCoaching, alt: "Career Coaching Pop-Up at Outside Festival" },
  { src: eventShar, alt: "Shar Snacks booth at Basecamp Outdoor" },
  { src: eventPow, alt: "Protect Our Winters booth at event" },
  { src: eventOutsideBooth, alt: "Outside+ booth at Basecamp Outdoor" },
];

interface ShowUpOption {
  icon: typeof Briefcase;
  title: string;
  desc: string;
  tag: string;
  example: string;
  photos?: string[]; // placeholder for future photo carousel
}

interface DigitalPerk {
  icon: typeof Globe;
  title: string;
  desc: string;
}

interface EventBrandShowUpProps {
  options: ShowUpOption[];
}

const digitalPerks: DigitalPerk[] = [
  {
    icon: Globe,
    title: "Website & Registration Placement",
    desc: "Your logo featured prominently on the event website and registration page - seen by every single attendee before they arrive.",
  },
  {
    icon: Mail,
    title: "Newsletter Promotion",
    desc: "Dedicated feature in our newsletter reaching our full community. Your involvement announced to thousands of engaged outdoor industry professionals.",
  },
  {
    icon: Share2,
    title: "Social Media Amplification",
    desc: "Event posts will reach industry leaders, athletes & influencers across our 50K LinkedIn, 80K Facebook, and 40K Instagram channels - promoting your brand to our full 300K+ audience.",
  },
];

const EventBrandShowUp = ({ options }: EventBrandShowUpProps) => {
  return (
    <section className="py-24 px-6 border-y border-border">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4 font-body">
            Your Presence
          </p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4">
            How Brands Show Up
          </h2>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            Three ways to engage in person - plus powerful digital reach to our 300K+ community.
          </p>
        </motion.div>

        {/* Photo Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Carousel opts={{ loop: true }} className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {carouselPhotos.map((photo, i) => (
                <CarouselItem key={i} className="md:basis-1/3">
                  <div className="p-2">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-56 object-cover rounded-xl border border-border"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </motion.div>

        {/* In-Person Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {options.map((opt, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-card border border-border rounded-xl p-8 shadow-card flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <opt.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[10px] tracking-wider uppercase font-body text-primary bg-primary/10 px-2 py-1 rounded-full">
                  {opt.tag}
                </span>
              </div>

              <h4 className="font-display font-bold text-lg text-foreground mb-3">
                {opt.title}
              </h4>
              <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4">
                {opt.desc}
              </p>
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 mt-auto">
                <p className="text-xs text-muted-foreground font-body leading-relaxed">
                  <span className="text-primary font-semibold">What brands have done: </span>
                  {opt.example}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Digital Perks */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h3 className="font-display font-bold text-2xl md:text-3xl text-foreground">
            Digital Reach & Perks
          </h3>
          <p className="text-muted-foreground font-body mt-2 max-w-xl mx-auto">
            Every sponsor gets powerful digital visibility across our full network.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {digitalPerks.map((perk, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-card border border-primary/20 rounded-xl p-8 shadow-card text-center"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <perk.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-display font-bold text-foreground mb-2">
                {perk.title}
              </h4>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                {perk.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventBrandShowUp;
