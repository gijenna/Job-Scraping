import { useMemo } from "react";
import MNHero from "@/components/minneapolis/MNHero";
import MNWhatIsThis from "@/components/minneapolis/MNWhatIsThis";
import MNHowItWorks from "@/components/minneapolis/MNHowItWorks";
import MNExpertGrid from "@/components/minneapolis/MNExpertGrid";
import MNPastExperts from "@/components/minneapolis/MNPastExperts";
import MNGallery from "@/components/minneapolis/MNGallery";
import MNSponsors from "@/components/minneapolis/MNSponsors";
import MNFinalCTA from "@/components/minneapolis/MNFinalCTA";
import { EditableTextProvider } from "@/components/EditableTextProvider";
import PageMetaApplier from "@/components/event/PageMetaApplier";
import PageMetaEditor from "@/components/event/PageMetaEditor";
import OrderedSections, { SectionDef } from "@/components/event/OrderedSections";

const EventMinneapolis26 = () => {
  const sections: SectionDef[] = useMemo(
    () => [
      { key: "mn_hero", content: <MNHero /> },
      { key: "mn_what_is_this", content: <MNWhatIsThis /> },
      { key: "mn_how_it_works", content: <MNHowItWorks /> },
      { key: "mn_expert_grid", content: <MNExpertGrid /> },
      { key: "mn_past_experts", content: <MNPastExperts eventSlug="minneapolis26" /> },
      { key: "mn_gallery", content: <MNGallery /> },
      { key: "mn_sponsors", content: <MNSponsors /> },
      { key: "mn_final_cta", content: <MNFinalCTA /> },
    ],
    []
  );


  return (
    <EditableTextProvider pageSlug="minneapolis26">
      <PageMetaApplier title="Basecamp Outdoor @ OR Gatherings · Minneapolis · Aug 20–21" />
      <main className="font-body" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
        <PageMetaEditor />
        <OrderedSections sections={sections} />
      </main>
    </EditableTextProvider>
  );
};

export default EventMinneapolis26;
