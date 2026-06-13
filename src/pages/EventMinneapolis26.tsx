import MNHero from "@/components/minneapolis/MNHero";
import MNWhatIsThis from "@/components/minneapolis/MNWhatIsThis";
import MNTwoSessions from "@/components/minneapolis/MNTwoSessions";
import MNExpertGrid from "@/components/minneapolis/MNExpertGrid";
import MNSponsors from "@/components/minneapolis/MNSponsors";
import MNFinalCTA from "@/components/minneapolis/MNFinalCTA";
import { EditableTextProvider } from "@/components/EditableTextProvider";
import PageMetaApplier from "@/components/event/PageMetaApplier";

const EventMinneapolis26 = () => {
  return (
    <EditableTextProvider pageSlug="minneapolis26">
      <PageMetaApplier title="Basecamp Outdoor Lounge × OR Gatherings · Minneapolis · Aug 20–21" />
      <main className="font-body" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
        <MNHero />
        <MNWhatIsThis />
        <MNTwoSessions />
        <MNExpertGrid />
        <MNSponsors />
        <MNFinalCTA />
      </main>
    </EditableTextProvider>
  );
};

export default EventMinneapolis26;
