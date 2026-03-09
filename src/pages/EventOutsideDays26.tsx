import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroMountains from "@/assets/hero-denver-mountains.jpg";
import denverLogo from "@/assets/denver-logo.png";
import RegistrantHero from "@/components/event/RegistrantHero";
import RegistrantHowToTapIn from "@/components/event/RegistrantHowToTapIn";
import RegistrantVenue from "@/components/event/RegistrantVenue";
import EventLogoTicker from "@/components/event/EventLogoTicker";
import DenverFestivalPartner from "@/components/event/DenverFestivalPartner";
import DenverAttendeeSections from "@/components/event/DenverAttendeeSections";

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

      {/* What to Expect */}
      <section className="py-16 md:py-24 px-6 bg-events-teal">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-body text-events-coral">
              What to Expect
            </p>
            <h2 className="font-headline font-bold text-3xl md:text-5xl text-events-cream leading-tight">
              Not just a career fair.{" "}
              <span className="text-events-yellow">A discovery zone.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { num: "500–800", label: "Professionals Expected", desc: "The outdoor industry's largest gathering of career-minded talent in one room." },
              { num: "20+", label: "Brands & Activations", desc: "Product demos, swag, and face-to-face conversations with hiring teams." },
              { num: "3 Days", label: "Outside Days Festival", desc: "Your registration gives you access to the full festival — music, food, outdoor activities." },
              { num: "FREE", label: "Always Free to Attend", desc: "Basecamp believes the outdoor industry should be accessible to everyone." },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl p-6 border border-white/10"
                style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
              >
                <p className="font-headline font-bold text-3xl mb-1 text-events-yellow">{stat.num}</p>
                <p className="font-display font-bold text-base text-events-cream mb-2">{stat.label}</p>
                <p className="font-body text-sm text-events-cream/60">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
