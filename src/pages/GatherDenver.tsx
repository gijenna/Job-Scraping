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
import AdminLogoManager from "@/components/event/AdminLogoManager";
import { useEventLogos } from "@/hooks/useEventLogos";
import SiteFooter from "@/components/SiteFooter";
import EventNotHiringCallout from "@/components/event/EventNotHiringCallout";
import SponsorPageNav from "@/components/event/SponsorPageNav";

const GatherDenver = () => {
  const { logos: dbLogos } = useEventLogos("gather-denver");

  const allBrands = dbLogos.map((l) => ({
    name: l.name,
    domain: l.domain || "",
    url: l.url || undefined,
    logo_url: l.logo_url || undefined,
  }));

  const statsLogos = dbLogos.map((l) => ({
    name: l.name,
    domain: l.domain,
    logo_url: l.logo_url,
    url: l.url,
  }));

  return (
    <main className="bg-background min-h-screen">
      <SponsorPageNav otherEvent={{ label: "Gather PNW", path: "/gather-pnw" }} />
      <AdminLogoManager eventSlug="gather-denver" />
      <DenverHero />

      <EventLogoTicker
        brands={allBrands}
        headline="Where leaders from the outdoor industry's most iconic brands gather"
      />

      <EventNotHiringCallout />
      <DenverFestivalPartner />
      <DenverPowerfulPremium />
      <DenverByTheNumbers logos={statsLogos} />
      <MobileTestimonialCarousel />
      <DenverHowItWorks />
      <DenverGallery />
      <DenverWhoAttends />

      <section className="py-12 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-8">Be Part of This</h2>
            <a href="mailto:jenna@wearetheoutdoorindustry.com" className="inline-block bg-[#E1B624] hover:bg-[#E1B624]/90 text-black font-display font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 mb-6">
              Jenna will take care of you
            </a>
            <p className="text-muted-foreground font-body text-sm max-w-md mx-auto">Basecamp works with every budget, because every brand deserves to Gather.</p>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
};

export default GatherDenver;
