import HeroSection from "@/components/HeroSection";
import LogoTicker from "@/components/LogoTicker";
import EventOverview from "@/components/EventOverview";
import ValueProps from "@/components/ValueProps";
import RecruiterValue from "@/components/RecruiterValue";
import AudienceSection from "@/components/AudienceSection";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <main className="bg-background min-h-screen">
      <HeroSection />
      <LogoTicker />
      <EventOverview />
      <ValueProps />
      <RecruiterValue />
      <AudienceSection />
      <Testimonials />
      <CTASection />
    </main>
  );
};

export default Index;
