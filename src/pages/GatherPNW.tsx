import { motion } from "framer-motion";
import PnwHero from "@/components/event/PnwHero";
import EventLogoTicker from "@/components/event/EventLogoTicker";
import PnwPowerfulPremium from "@/components/event/PnwPowerfulPremium";
import PnwByTheNumbers from "@/components/event/PnwByTheNumbers";
import PnwHowItWorks from "@/components/event/PnwHowItWorks";
import PnwUOPartner from "@/components/event/PnwUOPartner";
import PnwWhoAttends from "@/components/event/PnwWhoAttends";
import MobileTestimonialCarousel from "@/components/event/MobileTestimonialCarousel";
import AdminLogoManager from "@/components/event/AdminLogoManager";
import { useEventLogos } from "@/hooks/useEventLogos";
import SiteFooter from "@/components/SiteFooter";
import EventNotHiringCallout from "@/components/event/EventNotHiringCallout";
import SponsorPageNav from "@/components/event/SponsorPageNav";
import { EditableTextProvider } from "@/components/EditableTextProvider";
import EditableText from "@/components/EditableText";
import PageMetaEditor from "@/components/event/PageMetaEditor";
import { usePageMeta } from "@/hooks/usePageMeta";

const GatherPNW = () => {
  const { logos: tickerLogos } = useEventLogos("gather-pnw");
  const { logos: partnerLogos } = useEventLogos("gather-pnw-partners");

  const tickerBrands = tickerLogos.map((l) => ({
    name: l.name, domain: l.domain || "", url: l.url || undefined, logo_url: l.logo_url || undefined,
  }));

  const partnerBrandLogos = partnerLogos.map((l) => ({
    name: l.name, domain: l.domain, logo_url: l.logo_url, url: l.url,
  }));

  return (
    <EditableTextProvider pageSlug="gather-pnw">
      <main className="bg-background min-h-screen">
        <SponsorPageNav otherEvent={{ label: "Outside Days Denver", path: "/gather-denver" }} />
        <AdminLogoManager lists={[
          { eventSlug: "gather-pnw", label: "Ticker Logos (Attending)" },
          { eventSlug: "gather-pnw-partners", label: "Partner Logos (By the Numbers)" },
        ]} />
        <PnwHero />

        <EventLogoTicker brands={tickerBrands} headline="Network alongside professionals from the industry's top brands" />

        <EventNotHiringCallout />
        <PnwUOPartner />
        <PnwPowerfulPremium />
        <PnwByTheNumbers logos={partnerBrandLogos} />
        <MobileTestimonialCarousel />
        <PnwHowItWorks />
        <PnwWhoAttends />

        <section className="py-24 px-6">
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-8">
                <EditableText settingKey="cta_headline" defaultText="Be Part of This" as="span" />
              </h2>
              <a href="mailto:jenna@wearetheoutdoorindustry.com" className="inline-block font-display font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 mb-6" style={{ backgroundColor: "#FEE123", color: "#154733" }}>
                Jenna will take care of you
              </a>
              <p className="text-muted-foreground font-body text-sm max-w-md mx-auto">
                <EditableText settingKey="cta_subtitle" defaultText="Basecamp works with every budget, because every brand deserves to Gather." as="span" />
              </p>
            </motion.div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </EditableTextProvider>
  );
};

export default GatherPNW;
