import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroMountains from "@/assets/hero-denver-mountains.jpg";
import denverLogo from "@/assets/denver-logo.png";
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
];

const TYPEFORM_DENVER = "https://basecampoutdoor.typeform.com/denver2026";

const EventOutsideDays26 = () => {
  return (
    <main className="bg-events-teal min-h-screen">
      <RegistrantHero
        backgroundSrc={heroMountains}
        backgroundType="image"
        logoSrc={denverLogo}
        logoAlt="Gather Denver logo"
        date="May 29, 2026"
        location="Auraria Campus Wellness Center · Denver, CO"
        time="1:00 – 4:00 PM MT · Doors at 12:00 PM"
        tagline="The outdoor industry's biggest career discovery event — inside the Outside Days festival."
        registrationUrl={TYPEFORM_DENVER}
        accentColor="#E1B624"
        sponsorPageUrl="/gather-denver"
      />

      <EventLogoTicker
        brands={denverBrands}
        headline="Brands & professionals in the room"
      />

      <DenverFestivalPartner />

      <DenverAttendeeSections accentColor="#E1B624" bgColor="#0d1f22" />

      <RegistrantDenverStats />

      <RegistrantHowToTapIn
        registrationUrl={TYPEFORM_DENVER}
        sponsorPageUrl="/gather-denver"
        expertsPageUrl="/Denverexperts"
        accentColor="#E1B624"
        bgColor="#0d1f22"
      />

      <RegistrantVenue
        venueName="Auraria Campus Wellness Center"
        address="Auraria Campus, Denver, CO"
        googleMapsUrl="https://maps.google.com/?q=Auraria+Campus+Wellness+Center+Denver+CO"
        date="May 29, 2026"
        arrivalTime="12:00 PM MT"
        eventTime="1:00 – 4:00 PM MT"
        description="Located inside the Outside Days festival grounds — Denver's 3-day outdoor celebration featuring live music, food, and the outdoor industry's most iconic brands. Your Gather registration includes festival access."
        accentColor="#E1B624"
      />

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
