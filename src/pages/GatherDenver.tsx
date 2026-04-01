import { useMemo } from "react";
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
import OrderedSections, { SectionDef } from "@/components/event/OrderedSections";
import { useEventLogos } from "@/hooks/useEventLogos";
import SiteFooter from "@/components/SiteFooter";
import EventNotHiringCallout from "@/components/event/EventNotHiringCallout";
import SponsorPageNav from "@/components/event/SponsorPageNav";
import { EditableTextProvider } from "@/components/EditableTextProvider";
import EditableText from "@/components/EditableText";
import PageMetaEditor from "@/components/event/PageMetaEditor";
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

  const sections: SectionDef[] = useMemo(() => [
    { key: "gd_hero", content: <DenverHero /> },
    { key: "gd_ticker", content: <EventLogoTicker brands={tickerBrands} headline="Where leaders from the outdoor industry's most iconic brands gather" /> },
    { key: "gd_not_hiring", content: <EventNotHiringCallout /> },
    { key: "gd_festival_partner", content: <DenverFestivalPartner /> },
    { key: "gd_powerful_premium", content: <DenverPowerfulPremium /> },
    { key: "gd_by_the_numbers", content: <DenverByTheNumbers logos={statsLogos} /> },
    { key: "gd_testimonials", content: <MobileTestimonialCarousel /> },
    { key: "gd_how_it_works", content: <DenverHowItWorks /> },
    { key: "gd_gallery", content: <DenverGallery /> },
    { key: "gd_who_attends", content: <DenverWhoAttends /> },
    {
      key: "gd_cta",
      content: (
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
      ),
    },
  ], [tickerBrands, statsLogos]);

  return (
    <EditableTextProvider pageSlug="gather-denver">
      <PageMetaApplier title="Gather Denver — Sponsors" />
      <main className="bg-background min-h-screen">
        <PageMetaEditor />
        <SponsorPageNav otherEvent={{ label: "Gather PNW", path: "/gather-pnw" }} />
        <AdminLogoManager lists={[
          { eventSlug: "gather-denver", label: "Ticker Logos (Attending)" },
          { eventSlug: "gather-denver-partners", label: "Partner Logos (By the Numbers)" },
        ]} />

        <OrderedSections sections={sections} />

        <SiteFooter />
      </main>
    </EditableTextProvider>
  );
};

export default GatherDenver;
