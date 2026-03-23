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
import { EditableTextProvider } from "@/components/EditableTextProvider";
import EditableText from "@/components/EditableText";
import PageMetaEditor from "@/components/event/PageMetaEditor";
import { usePageMeta } from "@/hooks/usePageMeta";
import PageMetaApplier from "@/components/event/PageMetaApplier";

const GatherDenver = () => {
  const { logos: tickerLogos } = useEventLogos("gather-denver");
  const { logos: partnerLogos } = useEventLogos("gather-denver-partners");

  const tickerBrands = tickerLogos.map((l) => ({
    name: l.name, domain: l.domain || "", url: l.url || undefined, logo_url: l.logo_url || undefined,
  }));

  const statsLogos = partnerLogos.map((l) => ({
    name: l.name, domain: l.domain, logo_url: l.logo_url, url: l.url,
  }));

  return (
    <EditableTextProvider pageSlug="gather-denver">
      <main className="bg-background min-h-screen">
        <SponsorPageNav otherEvent={{ label: "Gather PNW", path: "/gather-pnw" }} />
        <AdminLogoManager lists={[
          { eventSlug: "gather-denver", label: "Ticker Logos (Attending)" },
          { eventSlug: "gather-denver-partners", label: "Partner Logos (By the Numbers)" },
        ]} />
        <DenverHero />

        <EventLogoTicker brands={tickerBrands} headline="Where leaders from the outdoor industry's most iconic brands gather" />

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
              <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-8">
                <EditableText settingKey="cta_headline" defaultText="Be Part of This" as="span" />
              </h2>
              <a href="mailto:jenna@wearetheoutdoorindustry.com" className="inline-block bg-[#E1B624] hover:bg-[#E1B624]/90 text-black font-display font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 mb-6">
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

export default GatherDenver;
