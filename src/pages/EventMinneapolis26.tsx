import { useMemo } from "react";
import MNHero from "@/components/minneapolis/MNHero";
import MNWhatIsThis from "@/components/minneapolis/MNWhatIsThis";
import MNHowItWorks from "@/components/minneapolis/MNHowItWorks";
import MNExpertGrid from "@/components/minneapolis/MNExpertGrid";
import MNPastExperts from "@/components/minneapolis/MNPastExperts";
import MNGallery from "@/components/minneapolis/MNGallery";
import MNSponsors from "@/components/minneapolis/MNSponsors";
import MNFinalCTA from "@/components/minneapolis/MNFinalCTA";
import EventLogoTicker from "@/components/event/EventLogoTicker";
import AdminLogoManager from "@/components/event/AdminLogoManager";
import { useEventLogos } from "@/hooks/useEventLogos";
import { EditableTextProvider } from "@/components/EditableTextProvider";
import PageMetaApplier from "@/components/event/PageMetaApplier";
import PageMetaEditor from "@/components/event/PageMetaEditor";
import OrderedSections, { SectionDef } from "@/components/event/OrderedSections";

const EventMinneapolis26 = () => {
  const { logos: tickerLogos } = useEventLogos("minneapolis26-ticker");
  const { logos: denverTickerLogos } = useEventLogos("denver26");
  const activeTickerLogos = tickerLogos.length > 0 ? tickerLogos : denverTickerLogos;
  const tickerBrands = activeTickerLogos.map((l) => ({
    name: l.name,
    domain: l.domain || "",
    url: l.url || undefined,
    logo_url: l.logo_url || undefined,
  }));

  const sections: SectionDef[] = useMemo(
    () => [
      { key: "mn_hero", content: <MNHero /> },
      {
        key: "mn_ticker",
        content: <EventLogoTicker brands={tickerBrands} headline="Meet people from" />,
      },
      { key: "mn_what_is_this", content: <MNWhatIsThis /> },
      { key: "mn_how_it_works", content: <MNHowItWorks /> },
      { key: "mn_expert_grid", content: <MNExpertGrid /> },
      { key: "mn_past_experts", content: <MNPastExperts eventSlug="minneapolis26" /> },
      { key: "mn_gallery", content: <MNGallery /> },
      { key: "mn_sponsors", content: <MNSponsors /> },
      { key: "mn_final_cta", content: <MNFinalCTA /> },
    ],
    [tickerBrands]
  );

  return (
    <EditableTextProvider pageSlug="minneapolis26">
      <PageMetaApplier title="Basecamp Outdoor @ OR Gatherings · Minneapolis · Aug 20" />
      <main className="font-body" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
        <PageMetaEditor />
        <AdminLogoManager lists={[
          { eventSlug: "minneapolis26-ticker", label: "Ticker Logos (Meet people from)" },
        ]} />
        <OrderedSections sections={sections} />
      </main>
    </EditableTextProvider>
  );
};

export default EventMinneapolis26;
