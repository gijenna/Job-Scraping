import { motion } from "framer-motion";
import { ArrowRight, Zap, Star, Crown } from "lucide-react";
import heroMountains from "@/assets/hero-denver-mountains.jpg";
import denverLogo from "@/assets/denver-logo.png";
import basecampMatchLogo from "@/assets/basecamp-match-logo-dark.png";
import bestdayEvent1 from "@/assets/bestday-event-1.jpg";
import bestdayEvent2 from "@/assets/bestday-event-2.jpg";
import bestdayEvent3 from "@/assets/bestday-event-3.jpg";
import bestdayEvent4 from "@/assets/bestday-event-4.jpg";
import RegistrantHero from "@/components/event/RegistrantHero";
import EventLogoTicker from "@/components/event/EventLogoTicker";
import SoberEventSection from "@/components/event/SoberEventSection";
import EventQuote from "@/components/event/EventQuote";
import BestDaySpotlight from "@/components/event/BestDaySpotlight";
import EventPhotoGallery from "@/components/event/EventPhotoGallery";
import EventTiers, { type Tier } from "@/components/event/EventTiers";
import SiteFooter from "@/components/SiteFooter";
import SponsorPageNav from "@/components/event/SponsorPageNav";
import { useEventLogos } from "@/hooks/useEventLogos";

const BEST_DAY_LOGO = "https://bestdaybrewing.com/cdn/shop/files/916_IG_Feed_Ads_1200_x_1200_px_3.png?v=1739926696&width=400";

const CTA_EMAIL = "jenna@wearetheoutdoorindustry.com";

const beverageTiers: Tier[] = [
  {
    name: "Sampling Partner",
    price: "$5,000",
    spots: "Limited availability",
    icon: Zap,
    popular: false,
    bestFor: "Brands looking to get product in hands and build awareness at the outdoor industry's biggest sober career event.",
    perks: [
      "Branded sampling table in high-traffic zone",
      "Logo on all event marketing materials",
      "Product placement in attendee welcome bags",
      "Social media mention across Basecamp channels",
      "Logo on event website with link",
      "On-site signage near sampling area",
    ],
  },
  {
    name: "Official Beverage Sponsor",
    price: "$10,000",
    spots: "1 spot available",
    icon: Star,
    popular: true,
    bestFor: "The brand that wants to own the beverage experience and be synonymous with 'Proudly Sober' at Outside Days.",
    perks: [
      "Everything in Sampling Partner",
      "Exclusive bar branding — <strong>the only beverage on-site</strong>",
      "Branded cups, koozies & drinkware",
      "Dedicated social media post + story feature",
      "Logo on <strong>all</strong> event signage & printed materials",
      "<strong>"Proudly Sober — Powered by Best Day"</strong> callout in all communications",
      "Product integration into networking activations",
    ],
  },
  {
    name: "Title Beverage Presenter",
    price: "$20,000",
    spots: "Exclusive — 1 partner only",
    icon: Crown,
    popular: false,
    bestFor: "The brand that wants naming rights and full integration into the event's identity and marketing.",
    perks: [
      "Everything in Official Beverage Sponsor",
      "<strong>"Outside Days, refreshed by Best Day Brewing"</strong> naming rights",
      "Keynote introduction & welcome remarks",
      "Custom activation space (branded lounge, photo moment, etc.)",
      "Co-branded content series (pre & post-event)",
      "Post-event engagement report with attendee insights",
      "Brand integration in post-event recap video",
      "Priority partnership renewal for future events",
    ],
  },
];

const BestDayPitch = () => {
  const { logos: tickerLogos } = useEventLogos("denver26");

  const tickerBrands = tickerLogos.map((l) => ({
    name: l.name,
    domain: l.domain || "",
    url: l.url || undefined,
    logo_url: l.logo_url || undefined,
  }));

  const eventPhotos = [bestdayEvent1, bestdayEvent2, bestdayEvent3, bestdayEvent4];

  return (
    <main className="bg-events-teal min-h-screen relative">
      <SponsorPageNav otherEvent={{ label: "Gather PNW", path: "/PNW26" }} />
      <a href="https://www.basecampjobs.com" target="_blank" rel="noopener noreferrer" className="fixed top-4 right-4 z-50">
        <img src={basecampMatchLogo} alt="Basecamp Match" className="h-8 md:h-10 w-auto drop-shadow-lg" />
      </a>

      {/* Hero */}
      <RegistrantHero
        backgroundSrc={heroMountains}
        backgroundType="image"
        logoSrc={denverLogo}
        logoAlt="Outside Days Denver logo"
        date="May 29, 2026"
        location="Auraria Campus Wellness Center · Denver, CO"
        time="1:00 – 4:00 PM MT"
        tagline="The outdoor industry's biggest career discovery event — proudly alcohol-free."
        registrationUrl={`mailto:${CTA_EMAIL}?subject=Best Day Brewing x Outside Days Partnership`}
        accentColor="#E1B624"
        sponsorPageUrl="/gather-denver"
      />

      {/* Presented by Best Day */}
      <div className="bg-events-teal py-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="inline-flex items-center gap-4 px-6 py-3 rounded-full border border-events-yellow/30 bg-events-card/50"
        >
          <span className="text-events-cream/60 text-sm font-body">A beverage partnership proposal for</span>
          <img src={BEST_DAY_LOGO} alt="Best Day Brewing" className="h-10 w-auto" />
        </motion.div>
      </div>

      {/* Logo Ticker */}
      <EventLogoTicker brands={tickerBrands} headline="Brands & professionals in the room" />

      {/* Proudly Sober Section */}
      <SoberEventSection />

      {/* The North Face Quote */}
      <section className="py-16 px-6 bg-events-teal">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-events-card/60 border border-events-yellow/20 rounded-xl p-10 md:p-14 text-center shadow-lg"
          >
            <p className="text-events-yellow text-xs tracking-[0.3em] uppercase mb-4 font-body">
              From Our Community
            </p>
            <p className="text-events-cream font-display text-lg md:text-xl lg:text-2xl italic leading-relaxed max-w-3xl mx-auto mb-6">
              "On a personal note, I LOVED that it was a sober event. Celebrating 4 years of sobriety in August (wooo!) and I often feel out of place at events, nervously clutching my seltzer water. Huge win that everyone was clear-eyed and sober for this event, and I could blend into the crowd. I know the team really appreciated that too, because drunk, pushy candidates are NEVER an ideal Friday night."
            </p>
            <p className="text-events-cream/50 font-body text-sm">
              — Recruiter, <span className="text-events-cream/70 font-semibold">The North Face</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Best Day Spotlight */}
      <BestDaySpotlight />

      {/* Event Photo Gallery */}
      <EventPhotoGallery photos={eventPhotos} />

      {/* Beverage Tiers */}
      <div className="bg-events-teal [&_section]:bg-transparent [&_.bg-gradient-card]:bg-events-card/60 [&_.bg-gradient-card]:border-events-cream/10 [&_.text-foreground]:text-events-cream [&_.text-muted-foreground]:text-events-cream/60 [&_.text-primary]:text-events-yellow [&_.bg-primary\\/10]:bg-events-yellow/10 [&_.border-primary\\/50]:border-events-yellow/50 [&_.border-primary\\/30]:border-events-yellow/30 [&_.bg-gradient-gold]:bg-events-yellow [&_.text-primary-foreground]:text-events-teal [&_.text-gradient-gold]:text-events-yellow [&_.shadow-gold]:shadow-none [&_.hover\\:bg-primary\\/10]:hover:bg-events-yellow/10">
        <EventTiers
          tiers={beverageTiers}
          ctaEmail={CTA_EMAIL}
          eventName="Outside Days Denver 2026 — Best Day Brewing Beverage Partnership"
        />
      </div>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-events-teal">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-headline font-bold text-3xl md:text-4xl text-events-cream mb-6">
              Let's Make It the Best Day Yet
            </h2>
            <p className="font-body text-events-cream/60 mb-8">
              Outside Days is the outdoor industry's biggest career discovery event — and it's proudly sober. Let's put Best Day Brewing at the center of it.
            </p>
            <a
              href={`mailto:${CTA_EMAIL}?subject=Best Day Brewing x Outside Days Partnership`}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-display font-bold text-lg shadow-xl transition-all duration-300 hover:scale-105 bg-events-yellow text-events-teal"
            >
              Start the Conversation <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
};

export default BestDayPitch;
