import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
import AdminLogoManager from "@/components/event/AdminLogoManager";
import HideableSection from "@/components/event/HideableSection";
import { useEventLogos } from "@/hooks/useEventLogos";
import { useEventAttendees } from "@/hooks/useEventAttendees";
import SiteFooter from "@/components/SiteFooter";
import SponsorPageNav from "@/components/event/SponsorPageNav";
import { EditableTextProvider } from "@/components/EditableTextProvider";
import EditableText from "@/components/EditableText";
import EditableLink from "@/components/EditableLink";
import PageMetaEditor from "@/components/event/PageMetaEditor";
import PageMetaApplier from "@/components/event/PageMetaApplier";

const TYPEFORM_DENVER = "https://basecampoutdoor.typeform.com/outsidedays";

const EventOutsideDays26 = () => {
  const [searchParams] = useSearchParams();
  const highlightExpert = searchParams.get("expert") || undefined;
  const highlightBrandRep = searchParams.get("brand") || undefined;
  const { logos: tickerLogos } = useEventLogos("denver26");
  const { logos: partnerLogos } = useEventLogos("denver26-partners");
  const { logos: bubbleLogos } = useEventLogos("denver26-bubbles");
  const { brandReps, setBrandReps, industryExperts, setIndustryExperts, handleDragEnd } = useEventAttendees("denver");

  const tickerBrands = tickerLogos.map((l) => ({
    name: l.name, domain: l.domain || "", url: l.url || undefined, logo_url: l.logo_url || undefined,
  }));

  const statsLogos = partnerLogos.length > 0
    ? partnerLogos.map((l) => ({ name: l.name, domain: l.domain, logo_url: l.logo_url, url: l.url }))
    : tickerLogos.map((l) => ({ name: l.name, domain: l.domain, logo_url: l.logo_url, url: l.url }));

  const bubbleBrands = bubbleLogos.length > 0
    ? bubbleLogos.map((l) => ({ name: l.name, domain: l.domain || "", logo_url: l.logo_url, url: l.url || null }))
    : tickerLogos.map((l) => ({ name: l.name, domain: l.domain || "", logo_url: l.logo_url, url: l.url || null }));

  return (
    <EditableTextProvider pageSlug="outsidedays26">
      <PageMetaApplier title="Outside Days Denver 2026" />
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

        <HideableSection sectionKey="denver_hero">
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
        </HideableSection>

        <HideableSection sectionKey="denver_ticker">
          <EventLogoTicker brands={tickerBrands} headline="Brands & professionals in the room" />
        </HideableSection>

        <HideableSection sectionKey="denver_featured_teams">
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
        </HideableSection>

        <HideableSection sectionKey="denver_brand_reps">
          <BrandRepCardsSection
            brandReps={brandReps}
            setBrandReps={setBrandReps}
            handleDragEnd={handleDragEnd}
            accentColor="#E1B624"
            bgColor="#0d1f22"
            eventSlug="denver26"
            eyebrowKey="denver_brand_rep_cards_eyebrow"
            headlineKey="denver_brand_rep_cards_headline"
            highlightExpert={highlightExpert}
          />
        </HideableSection>

        <HideableSection sectionKey="denver_industry_experts">
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
        </HideableSection>

        <HideableSection sectionKey="denver_stats">
          <RegistrantDenverStats logos={statsLogos} />
        </HideableSection>

        <HideableSection sectionKey="denver_how_to_tap_in">
          <RegistrantHowToTapIn
            registrationUrl={TYPEFORM_DENVER}
            sponsorPageUrl="/gather-denver"
            expertsPageUrl="/Denverexperts"
            accentColor="#E1B624"
            bgColor="#0d1f22"
            images={[eventCrowd, eventBoa, eventGroupPhoto]}
          />
        </HideableSection>

        <HideableSection sectionKey="denver_venue">
          <RegistrantVenue
            venueName="Auraria Campus Wellness Center"
            address="Auraria Campus, Denver, CO"
            googleMapsUrl="https://maps.google.com/?q=Auraria+Campus+Wellness+Center+Denver+CO"
            date="May 29, 2026"
            eventTime="1:00 – 4:00 PM MT"
            accentColor="#E1B624"
            description="Gather is a free outdoor industry career discovery zone inside the Outside Days festival — a 3-day celebration of music, culture, and the outdoors in Denver."
          />
        </HideableSection>

        <HideableSection sectionKey="denver_festival_partner">
          <DenverFestivalPartner />
        </HideableSection>

        <HideableSection sectionKey="denver_final_cta">
          <section className="py-20 px-6 bg-events-teal">
            <div className="container mx-auto max-w-2xl text-center">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="font-headline font-bold text-3xl md:text-4xl text-events-cream mb-6">
                  <EditableText settingKey="final_cta_headline" defaultText="Ready to Gather?" as="span" />
                </h2>
                <p className="font-body text-events-cream/60 mb-8">
                  <EditableText settingKey="final_cta_subtitle" defaultText="Free registration. Part of Outside Days. The outdoor industry's career event of the year." as="span" />
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
        </HideableSection>

        <SiteFooter />
      </main>
    </EditableTextProvider>
  );
};

export default EventOutsideDays26;
