import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
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
import FeaturedTeamsSection from "@/components/event/FeaturedTeamsSection";
import BrandRepCardsSection from "@/components/event/BrandRepCardsSection";
import IndustryExpertCardsSection from "@/components/event/IndustryExpertCardsSection";
import DenverFestivalPartner from "@/components/event/DenverFestivalPartner";
import RegistrantDenverStats from "@/components/event/RegistrantDenverStats";
import EventMapCanvas from "@/components/event/EventMapCanvas";
import MapBrandPanel from "@/components/event/MapBrandPanel";
import OakleyMetaDemo from "@/components/event/OakleyMetaDemo";
import OakleyRinoStorefront from "@/components/event/OakleyRinoStorefront";
import AdminLogoManager from "@/components/event/AdminLogoManager";
import OrderedSections, { SectionDef } from "@/components/event/OrderedSections";
import PageMetaEditor from "@/components/event/PageMetaEditor";
import PageMetaApplier from "@/components/event/PageMetaApplier";
import { EditableTextProvider } from "@/components/EditableTextProvider";
import EditableText from "@/components/EditableText";
import EditableLink from "@/components/EditableLink";
import { useEventLogos } from "@/hooks/useEventLogos";
import { useEventAttendees } from "@/hooks/useEventAttendees";
import { useEventMapBrands, MapBrand } from "@/hooks/useEventMapBrands";
import { useEventMapLayouts } from "@/hooks/useEventMapLayouts";
import SiteFooter from "@/components/SiteFooter";
import SponsorPageNav from "@/components/event/SponsorPageNav";

const TYPEFORM_DENVER = "https://basecampoutdoor.typeform.com/outsidedays";
const OAKLEY_LOGO = "https://logo.clearbit.com/oakley.com";

const OakleyPitch = () => {
  const [searchParams] = useSearchParams();
  const highlightExpert = searchParams.get("expert") || undefined;
  const highlightBrandRep = searchParams.get("brand") || undefined;
  const { logos: tickerLogos } = useEventLogos("denver26");
  const { logos: partnerLogos } = useEventLogos("denver26-partners");
  const { logos: bubbleLogos } = useEventLogos("denver26-bubbles");
  const { brandReps, setBrandReps, industryExperts, setIndustryExperts, handleDragEnd } = useEventAttendees("denver");
  const { brands: mapBrands } = useEventMapBrands("denver26");
  const { layouts: mapLayouts } = useEventMapLayouts("denver26", "live");
  const [selectedMapBrand, setSelectedMapBrand] = useState<MapBrand | null>(null);

  const tickerBrands = useMemo(() => tickerLogos.map((l) => ({
    name: l.name, domain: l.domain || "", url: l.url || undefined, logo_url: l.logo_url || undefined,
  })), [tickerLogos]);

  const statsLogos = partnerLogos.length > 0
    ? partnerLogos.map((l) => ({ name: l.name, domain: l.domain, logo_url: l.logo_url, url: l.url }))
    : tickerLogos.map((l) => ({ name: l.name, domain: l.domain, logo_url: l.logo_url, url: l.url }));

  const bubbleBrands = bubbleLogos.length > 0
    ? bubbleLogos.map((l) => ({ name: l.name, domain: l.domain || "", logo_url: l.logo_url, url: l.url || null }))
    : tickerLogos.map((l) => ({ name: l.name, domain: l.domain || "", logo_url: l.logo_url, url: l.url || null }));

  const sections: SectionDef[] = useMemo(() => [
    {
      key: "oakley_hero",
      content: (
        <RegistrantHero
          backgroundSrc={heroMountains}
          backgroundType="image"
          logoSrc={denverLogo}
          logoAlt="Gather Denver logo"
          date="May 28, 2026"
          location="Auraria Campus Wellness Center · Denver, CO"
          time="3:00 – 6:00 PM MT"
          tagline="The outdoor industry's biggest career discovery event inside the Outside Days festival."
          registrationUrl={TYPEFORM_DENVER}
          accentColor="#E1B624"
          sponsorPageUrl="/gather-denver"
        />
      ),
    },
    {
      key: "oakley_pill",
      content: (
        <div className="bg-events-teal py-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-4 px-6 py-3 rounded-full border border-events-yellow/30 bg-events-card/50"
          >
            <span className="text-events-cream/80 text-sm font-body">Free registration thanks to</span>
            <img
              src={OAKLEY_LOGO}
              alt="Oakley"
              className="h-7 w-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://www.google.com/s2/favicons?domain=oakley.com&sz=128";
              }}
            />
          </motion.div>
        </div>
      ),
    },
    {
      key: "oakley_ticker",
      content: <EventLogoTicker brands={tickerBrands} headline="Brands & professionals in the room" />,
    },
    {
      key: "oakley_meta_demo",
      content: <OakleyMetaDemo />,
    },
    {
      key: "oakley_rino_storefront",
      content: <OakleyRinoStorefront />,
    },
    {
      key: "oakley_featured_teams",
      content: (
        <FeaturedTeamsSection
          brandReps={brandReps}
          bubbleLogos={bubbleBrands}
          accentColor="#E1B624"
          bgColor="#0d1f22"
          bubbleColor="#F5E6D3"
          editKeyPrefix="denver_bubbles"
          eyebrowKey="denver_brand_reps_eyebrow"
          headlineKey="denver_brand_reps_headline"
          eventSlug="denver26"
          highlightBrandRep={highlightBrandRep}
        />
      ),
    },
    {
      key: "oakley_brand_reps",
      content: (
        <BrandRepCardsSection
          brandReps={brandReps}
          setBrandReps={setBrandReps}
          handleDragEnd={handleDragEnd}
          accentColor="#E1B624"
          bgColor="#0d1f22"
          eventSlug="denver26"
          eyebrowKey="denver_brand_rep_cards_eyebrow"
          headlineKey="denver_brand_rep_cards_headline"
        />
      ),
    },
    {
      key: "oakley_industry_experts",
      content: (
        <IndustryExpertCardsSection
          experts={industryExperts}
          setExperts={setIndustryExperts}
          handleDragEnd={handleDragEnd}
          accentColor="#E1B624"
          bgColor="#0d1f22"
          eventSlug="denver26"
          eyebrowKey="denver_experts_eyebrow"
          headlineKey="denver_experts_headline"
          highlightExpert={highlightExpert}
          registrationUrl={TYPEFORM_DENVER}
        />
      ),
    },
    {
      key: "oakley_event_map",
      content: mapLayouts.length > 0 ? (
        <section className="py-16 md:py-24 px-6 bg-events-teal">
          <div className="container mx-auto max-w-6xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
              <p className="text-xs tracking-[0.3em] uppercase mb-4 font-body text-events-yellow">Venue Map</p>
              <h2 className="font-headline font-bold text-2xl md:text-4xl text-events-cream">Explore the Event Floor</h2>
            </motion.div>
            <EventMapCanvas
              brands={mapBrands}
              layouts={mapLayouts}
              onClick={(b) => setSelectedMapBrand(b)}
            />
          </div>
        </section>
      ) : null,
    },
    {
      key: "oakley_stats",
      content: <RegistrantDenverStats logos={statsLogos} />,
    },
    {
      key: "oakley_how_to_tap_in",
      content: (
        <RegistrantHowToTapIn
          registrationUrl={TYPEFORM_DENVER}
          sponsorPageUrl="/gather-denver"
          expertsPageUrl="/Denverexperts"
          accentColor="#E1B624"
          bgColor="#0d1f22"
          images={[eventCrowd, eventBoa, eventGroupPhoto]}
        />
      ),
    },
    {
      key: "oakley_venue",
      content: (
        <RegistrantVenue
          venueName="Auraria Campus Wellness Center"
          address="Auraria Campus, Denver, CO"
          googleMapsUrl="https://maps.google.com/?q=Auraria+Campus+Wellness+Center+Denver+CO"
          date="May 28, 2026"
          eventTime="3:00 – 6:00 PM MT"
          accentColor="#E1B624"
          description="Gather is a free outdoor industry career discovery zone inside the Outside Days festival, a 3-day celebration of music, culture, and the outdoors in Denver."
        />
      ),
    },
    {
      key: "oakley_festival_partner",
      content: <DenverFestivalPartner />,
    },
    {
      key: "oakley_final_cta",
      content: (
        <section className="py-20 px-6 bg-events-teal">
          <div className="container mx-auto max-w-2xl text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-headline font-bold text-3xl md:text-4xl text-events-cream mb-6">
                <EditableText settingKey="final_cta_headline" defaultText="Ready to Gather?" as="span" />
              </h2>
              <p className="font-body text-events-cream/60 mb-8">
                <EditableText settingKey="final_cta_subtitle" defaultText="Free registration thanks to Oakley. Part of Outside Days. The outdoor industry's career event of the year." as="span" />
              </p>
              <EditableLink
                textKey="final_cta_button_text"
                urlKey="final_cta_button_url"
                defaultText="Register Free"
                defaultUrl={TYPEFORM_DENVER}
                className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-display font-bold text-lg shadow-xl transition-all duration-300 hover:scale-105 bg-events-yellow text-events-teal"
              />
            </motion.div>
          </div>
        </section>
      ),
    },
  ], [tickerBrands, statsLogos, bubbleBrands, brandReps, setBrandReps, industryExperts, setIndustryExperts, handleDragEnd, highlightExpert, highlightBrandRep, mapBrands, mapLayouts]);

  return (
    <EditableTextProvider pageSlug="oakley">
      <PageMetaApplier title="Outside Days Denver 2026, Presented by Oakley" />
      <main className="bg-events-teal min-h-screen relative">
        <PageMetaEditor />
        <AdminLogoManager lists={[
          { eventSlug: "denver26", label: "Ticker Logos (Attending)" },
          { eventSlug: "denver26-partners", label: "Partner Logos (Stats)" },
          { eventSlug: "denver26-bubbles", label: "Bubble Logos (Meet the Teams)" },
        ]} />
        <SponsorPageNav otherEvent={{ label: "Gather PNW", path: "/PNW26" }} />
        <a href="https://www.basecampjobs.com" target="_blank" rel="noopener noreferrer" className="fixed top-4 right-4 z-50">
          <img src={basecampMatchLogo} alt="Basecamp Match" className="h-8 md:h-10 w-auto drop-shadow-lg" />
        </a>

        <OrderedSections sections={sections} />

        <SiteFooter />
        <MapBrandPanel brand={selectedMapBrand} onClose={() => setSelectedMapBrand(null)} />
      </main>
    </EditableTextProvider>
  );
};

export default OakleyPitch;
