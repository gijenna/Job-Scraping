import { motion } from "framer-motion";

import DenverHero from "@/components/event/DenverHero";
import EventLogoTicker from "@/components/event/EventLogoTicker";
import DenverPowerfulPremium from "@/components/event/DenverPowerfulPremium";
import DenverByTheNumbers from "@/components/event/DenverByTheNumbers";
import DenverGallery from "@/components/event/DenverGallery";
import DenverHowItWorks from "@/components/event/DenverHowItWorks";
import DenverFestivalPartner from "@/components/event/DenverFestivalPartner";
import DenverWhoAttends from "@/components/event/DenverWhoAttends";
import MobileTestimonialCarousel from "@/components/event/MobileTestimonialCarousel";

const denverBrands = [
  { name: "REI", domain: "rei.com" },
  { name: "Patagonia", domain: "patagonia.com" },
  { name: "The North Face", domain: "thenorthface.com" },
  { name: "Cotopaxi", domain: "cotopaxi.com" },
  { name: "Alterra Mountain Co", domain: "alterramtnco.com" },
  { name: "Black Diamond", domain: "blackdiamondequipment.com" },
  { name: "Vail Resorts", domain: "vailresorts.com" },
  { name: "Smartwool", domain: "smartwool.com" },
  { name: "Brooks", domain: "brooksrunning.com" },
  { name: "Nike", domain: "nike.com" },
  { name: "Google", domain: "google.com" },
  { name: "Apple", domain: "apple.com" },
  { name: "Amazon", domain: "amazon.com" },
  { name: "Outside Inc", domain: "outsideonline.com" },
  { name: "Yeti", domain: "yeti.com" },
  { name: "Gaia", domain: "gaiagps.com" },
  { name: "onX", domain: "onxmaps.com" },
  { name: "lululemon", domain: "lululemon.com" },
  { name: "AllTrails", domain: "alltrails.com" },
];

const GatherDenver = () => {
  return (
    <main className="bg-background min-h-screen">
      <DenverHero />

      <EventLogoTicker
        brands={denverBrands}
        headline="Where leaders from the outdoor industry's most iconic brands gather"
      />

      <DenverFestivalPartner />

      <DenverPowerfulPremium />
      <DenverByTheNumbers />
      <MobileTestimonialCarousel />
      <DenverHowItWorks />
      <DenverGallery />

      <DenverWhoAttends />

      {/* Be Part of This CTA */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-8">
              Be Part of This
            </h2>
            <a
              href="mailto:jenna@wearetheoutdoorindustry.com"
              className="inline-block bg-[#E1B624] hover:bg-[#E1B624]/90 text-black font-display font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 mb-6"
            >
              Jenna will take care of you
            </a>
            <p className="text-muted-foreground font-body text-sm max-w-md mx-auto">
              Basecamp works with every budget, because every brand deserves to Gather.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default GatherDenver;
