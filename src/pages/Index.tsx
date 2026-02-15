import HeroSection from "@/components/HeroSection";
import LogoTicker from "@/components/LogoTicker";
import EventOverview from "@/components/EventOverview";
import ValueProps from "@/components/ValueProps";
import RecruiterValue from "@/components/RecruiterValue";
import StatsSection from "@/components/StatsSection";
import Testimonials from "@/components/Testimonials";
import PartnershipTiers from "@/components/PartnershipTiers";
import Schedule from "@/components/Schedule";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <main className="bg-background min-h-screen">
      <HeroSection />
      <LogoTicker />
      <EventOverview />
      <ValueProps />
      <RecruiterValue />
      <StatsSection />
      <Testimonials />
      <Schedule />
      <PartnershipTiers />
      <CTASection />
    </main>
  );
};

export default Index;
