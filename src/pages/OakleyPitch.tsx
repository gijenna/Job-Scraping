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
import OakleySpotlight from "@/components/event/OakleySpotlight";
import OakleyMetaDemo from "@/components/event/OakleyMetaDemo";
import OakleyRinoStorefront from "@/components/event/OakleyRinoStorefront";
import EventPhotoGallery from "@/components/event/EventPhotoGallery";
import EventTiers, { type Tier } from "@/components/event/EventTiers";
import SiteFooter from "@/components/SiteFooter";
import SponsorPageNav from "@/components/event/SponsorPageNav";
import { useEventLogos } from "@/hooks/useEventLogos";

const OAKLEY_LOGO = "https://logo.clearbit.com/oakley.com";
const CTA_EMAIL = "jenna@wearetheoutdoorindustry.com";
const SUBJECT = "Oakley × Outside Days Title Sponsorship";

const oakleyTiers: Tier[] = [
  {
    name: "Activation Partner",
    price: "$7,500",
    spots: "Limited availability",
    icon: Zap,
    popular: false,
    bestFor: "Brands ready to put product in front of outdoor creators, athletes, and recruiters with a branded sampling/demo footprint.",
    perks: [
      "Branded sampling & demo footprint in high-traffic zone",
      "On-site signage at activation",
      "Logo in event ticker & on event website",
      "Social media mention across Basecamp channels",
      "Inclusion in pre-event email to attendees",
    ],
  },
  {
    name: "Official Eyewear Sponsor",
    price: "$15,000",
    spots: "1 spot available",
    icon: Star,
    popular: true,
    bestFor: "The brand that wants to own the eyewear category at the outdoor industry's biggest sober career event.",
    perks: [
      "Everything in Activation Partner",
      "<strong>Exclusive eyewear category</strong> — only eyewear brand on-site",
      "Meta demo station co-branding",
      "Dedicated social posts + story feature",
      '<strong>&ldquo;Proudly seen through Oakley&rdquo;</strong> callout in all communications',
      "Branded swag in attendee welcome bags",
      "Logo on all event signage & printed materials",
    ],
  },
  {
    name: "Title Presenter",
    price: "$30,000",
    spots: "Exclusive — 1 partner only",
    icon: Crown,
    popular: false,
    bestFor: "The brand that wants naming rights, a custom Oakley × RiNo lounge moment, and full integration into the event's identity.",
    perks: [
      "Everything in Official Eyewear Sponsor",
      '<strong>&ldquo;Outside Days Denver, presented by Oakley&rdquo;</strong> naming rights',
      "Keynote introduction & welcome remarks",
      "Custom Oakley × RiNo lounge activation",
      "Co-branded content series (pre & post-event)",
      "Brand integration in post-event recap video",
      "Foot-traffic referral campaign to Oakley RiNo",
      "Post-event attendee insights report",
    ],
  },
];

const OakleyPitch = () => {
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
      <a
        href="https://www.basecampjobs.com"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-4 right-4 z-50"
      >
        <img src={basecampMatchLogo} alt="Basecamp Match" className="h-8 md:h-10 w-auto drop-shadow-lg" />
      </a>

      {/* Hero */}
      <RegistrantHero
        backgroundSrc={heroMountains}
        backgroundType="image"
        logoSrc={denverLogo}
        logoAlt="Outside Days Denver logo"
        date="May 28, 2026"
        location="Auraria Campus Wellness Center · Denver, CO"
        time="3:00 – 6:00 PM MT"
        tagline="The outdoor industry's biggest career discovery event — meet the athletes, creators, and recruiters shaping what's next."
        registrationUrl={`mailto:${CTA_EMAIL}?subject=${encodeURIComponent(SUBJECT)}`}
        accentColor="#E1B624"
        sponsorPageUrl="/gather-denver"
      />

      {/* Proposal pill */}
      <div className="bg-events-teal py-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="inline-flex items-center gap-4 px-6 py-3 rounded-full border border-events-yellow/30 bg-events-card/50"
        >
          <span className="text-events-cream/60 text-sm font-body">A title sponsorship proposal for</span>
          <img
            src={OAKLEY_LOGO}
            alt="Oakley"
            className="h-8 w-auto"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://www.google.com/s2/favicons?domain=oakley.com&sz=128";
            }}
          />
        </motion.div>
      </div>

      {/* Logo Ticker */}
      <EventLogoTicker brands={tickerBrands} headline="The brands & athletes Oakley already lives alongside" />

      {/* Marquee value statement */}
      <section className="py-16 md:py-20 px-6 bg-events-teal">
        <div className="container mx-auto max-w-5xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-headline font-bold text-2xl md:text-4xl lg:text-5xl text-events-cream text-center leading-tight"
          >
            Oakley makes eyewear for{" "}
            <span className="text-events-yellow">everyone who moves</span> — from the morning walker, to the Olympic medalist, to the rider dropping into Loveland at 6 a.m.
          </motion.p>
        </div>
      </section>

      {/* Oakley Spotlight */}
      <OakleySpotlight />

      {/* Meta Demo */}
      <OakleyMetaDemo />

      {/* RiNo Storefront */}
      <OakleyRinoStorefront />

      {/* Community Quote */}
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

      {/* Sober */}
      <SoberEventSection />

      {/* Photo Gallery */}
      <EventPhotoGallery photos={eventPhotos} />

      {/* Title Sponsor Tiers */}
      <div className="bg-events-teal [&_section]:bg-transparent [&_.bg-gradient-card]:bg-events-card/60 [&_.bg-gradient-card]:border-events-cream/10 [&_.text-foreground]:text-events-cream [&_.text-muted-foreground]:text-events-cream/60 [&_.text-primary]:text-events-yellow [&_.bg-primary\\/10]:bg-events-yellow/10 [&_.border-primary\\/50]:border-events-yellow/50 [&_.border-primary\\/30]:border-events-yellow/30 [&_.bg-gradient-gold]:bg-events-yellow [&_.text-primary-foreground]:text-events-teal [&_.text-gradient-gold]:text-events-yellow [&_.shadow-gold]:shadow-none [&_.hover\\:bg-primary\\/10]:hover:bg-events-yellow/10">
        <EventTiers
          tiers={oakleyTiers}
          ctaEmail={CTA_EMAIL}
          eventName="Outside Days Denver 2026 — Oakley Title Sponsorship"
        />
      </div>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-events-teal">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-headline font-bold text-3xl md:text-4xl text-events-cream mb-6">
              Let's put Oakley at the center of Denver's biggest outdoor industry moment.
            </h2>
            <p className="font-body text-events-cream/60 mb-8">
              Title sponsorship gets you naming rights, a custom RiNo lounge activation, foot-traffic referral, and direct access to 1,500+ outdoor industry pros, creators, and athletes.
            </p>
            <a
              href={`mailto:${CTA_EMAIL}?subject=${encodeURIComponent(SUBJECT)}`}
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

export default OakleyPitch;
