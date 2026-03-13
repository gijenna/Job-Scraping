import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroMountains from "@/assets/hero-denver-mountains.jpg";
import denverLogo from "@/assets/denver-logo.png";
import basecampMatchLogo from "@/assets/basecamp-match-logo-dark.png";
import eventCrowd from "@/assets/event-crowd.jpg";
import eventBoa from "@/assets/event-boa.jpg";
import eventGroupPhoto from "@/assets/event-group-photo.jpg";
import RegistrantHero from "@/components/event/RegistrantHero";
import RegistrantHowToTapIn from "@/components/event/RegistrantHowToTapIn";
import RegistrantVenue from "@/components/event/RegistrantVenue";
import EventLogoTicker from "@/components/event/EventLogoTicker";
import DenverFestivalPartner from "@/components/event/DenverFestivalPartner";
import DenverAttendeeSections from "@/components/event/DenverAttendeeSections";
import RegistrantDenverStats from "@/components/event/RegistrantDenverStats";
import AdminLogoManager from "@/components/event/AdminLogoManager";
import { EventLogo } from "@/hooks/useEventLogos";

const denverBrands = [
  { name: "REI", domain: "rei.com" },
  { name: "Patagonia", domain: "patagonia.com" },
  { name: "Cotopaxi", domain: "cotopaxi.com" },
  { name: "Yeti", domain: "yeti.com" },
  { name: "The North Face", domain: "thenorthface.com" },
  { name: "Alterra Mountain Co", domain: "alterramtnco.com" },
  { name: "Smartwool", domain: "smartwool.com" },
  { name: "Black Diamond", domain: "blackdiamondequipment.com" },
  { name: "Vail Resorts", domain: "vailresorts.com" },
  { name: "AllTrails", domain: "alltrails.com" },
  { name: "onX", domain: "onxmaps.com" },
  { name: "Outside Inc", domain: "outsideonline.com" },
  { name: "Outward Bound", domain: "outwardbound.org" },
  { name: "The Wilderness Society", domain: "wilderness.org" },
  { name: "Peak Design", domain: "peakdesign.com" },
];

const TYPEFORM_DENVER = "https://basecampoutdoor.typeform.com/outsidedays";

const EventOutsideDays26 = () => {
  const [dbLogos, setDbLogos] = useState<EventLogo[]>([]);

  const allBrands = [
    ...denverBrands,
    ...dbLogos.map((l) => ({
      name: l.name,
      domain: l.domain || "",
      url: l.url || undefined,
    })),
  ];

  return (
    <main className="bg-events-teal min-h-screen relative">
      <AdminLogoManager eventSlug="denver26" onLogosChange={setDbLogos} />
      {/* Basecamp Match logo top-left */}
      <a
        href="https://www.basecampjobs.com"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-4 left-4 z-50"
      >
        <img
          src={basecampMatchLogo}
          alt="Basecamp Match"
          className="h-8 md:h-10 w-auto drop-shadow-lg"
        />
      </a>

      <RegistrantHero
        backgroundSrc={heroMountains}
        backgroundType="image"
        logoSrc={denverLogo}
        logoAlt="Gather Denver logo"
        date="May 29, 2026"
        location="Auraria Campus Wellness Center · Denver, CO"
        time="1:00 – 4:00 PM MT"
        tagline="The outdoor industry's biggest career discovery event inside the Outside Days festival."
        registrationUrl={TYPEFORM_DENVER}
        accentColor="#E1B624"
        sponsorPageUrl="/gather-denver"
      />

      <EventLogoTicker
        brands={allBrands}
        headline="Brands & professionals in the room"
      />

      <DenverAttendeeSections accentColor="#E1B624" bgColor="#0d1f22" />

      <RegistrantDenverStats />

      <RegistrantHowToTapIn
        registrationUrl={TYPEFORM_DENVER}
        sponsorPageUrl="/gather-denver"
        expertsPageUrl="/Denverexperts"
        accentColor="#E1B624"
        bgColor="#0d1f22"
        images={[eventCrowd, eventBoa, eventGroupPhoto]}
      />

      <RegistrantVenue
        venueName="Auraria Campus Wellness Center"
        address="Auraria Campus, Denver, CO"
        googleMapsUrl="https://maps.google.com/?q=Auraria+Campus+Wellness+Center+Denver+CO"
        date="May 29, 2026"
        eventTime="1:00 – 4:00 PM MT"
        accentColor="#E1B624"
        description="Gather is a free outdoor industry career discovery zone inside the Outside Days festival — a 3-day celebration of music, culture, and the outdoors in Denver."
      />

      {/* Discovery Zone section */}
      <DenverFestivalPartner />

      {/* Bottom CTA */}
      <section className="py-20 px-6 bg-events-teal">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-headline font-bold text-3xl md:text-4xl text-events-cream mb-6">
              Ready to Gather?
            </h2>
            <p className="font-body text-events-cream/60 mb-8">
              Free registration. Part of Outside Days. The outdoor industry's career event of the year.
            </p>
            <a
              href={TYPEFORM_DENVER}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-display font-bold text-lg shadow-xl transition-all duration-300 hover:scale-105 bg-events-yellow text-events-teal"
            >
              Register Free
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default EventOutsideDays26;
