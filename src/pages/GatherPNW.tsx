import { motion } from "framer-motion";

import PnwHero from "@/components/event/PnwHero";
import EventLogoTicker from "@/components/event/EventLogoTicker";
import PnwPowerfulPremium from "@/components/event/PnwPowerfulPremium";
import PnwByTheNumbers from "@/components/event/PnwByTheNumbers";
import PnwHowItWorks from "@/components/event/PnwHowItWorks";
import PnwUOPartner from "@/components/event/PnwUOPartner";
import PnwWhoAttends from "@/components/event/PnwWhoAttends";
import MobileTestimonialCarousel from "@/components/event/MobileTestimonialCarousel";

const pnwBrands = [
  { name: "Nike", domain: "nike.com" },
  { name: "Adidas", domain: "adidas.com" },
  { name: "Columbia", domain: "columbia.com" },
  { name: "Patagonia", domain: "patagonia.com" },
  { name: "REI", domain: "rei.com" },
  { name: "KEEN", domain: "keenfootwear.com" },
  { name: "On Running", domain: "on-running.com" },
  { name: "Lululemon", domain: "lululemon.com" },
  { name: "Rumpl", domain: "rumpl.com" },
  { name: "Arc'teryx", domain: "arcteryx.com" },
  { name: "Brooks", domain: "brooksrunning.com" },
  { name: "Specialized", domain: "specialized.com" },
  { name: "Superfeet", domain: "superfeet.com" },
  { name: "Dovetail Workwear", domain: "dovetailworkwear.com" },
  { name: "Ruffwear", domain: "ruffwear.com" },
  { name: "Snow Peak", domain: "snowpeak.com" },
  { name: "AllTrails", domain: "alltrails.com" },
  { name: "Microsoft", domain: "microsoft.com" },
];

const GatherPNW = () => {
  return (
    <main className="bg-background min-h-screen">
      <PnwHero />

      <EventLogoTicker
        brands={pnwBrands}
        headline="Network alongside professionals from the industry's top brands"
      />

      <PnwUOPartner />

      <PnwPowerfulPremium />
      <PnwByTheNumbers />
      <MobileTestimonialCarousel />
      <PnwHowItWorks />

      <PnwWhoAttends />

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
              className="inline-block font-display font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 mb-6"
              style={{ backgroundColor: "#FEE123", color: "#154733" }}
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

export default GatherPNW;
