import { Zap, Star, Crown, Briefcase, MessageCircle, Mic } from "lucide-react";
import heroDenver from "@/assets/hero-denver.mp4";
import denverLogo from "@/assets/denver-logo.png";
import EventHero from "@/components/event/EventHero";
import EventLogoTicker from "@/components/event/EventLogoTicker";
import EventQuote from "@/components/event/EventQuote";
import EventBrandShowUp from "@/components/event/EventBrandShowUp";
import EventStats from "@/components/event/EventStats";
import EventTiers from "@/components/event/EventTiers";
import EventCTA from "@/components/event/EventCTA";
import EventROI from "@/components/event/EventROI";
import EventSetup from "@/components/event/EventSetup";
import Testimonials from "@/components/Testimonials";
import Schedule from "@/components/Schedule";
import RecruiterValue from "@/components/RecruiterValue";

const denverBrands = [
  { name: "REI", domain: "rei.com" },
  { name: "Patagonia", domain: "patagonia.com" },
  { name: "The North Face", domain: "thenorthface.com" },
  { name: "Cotopaxi", domain: "cotopaxi.com" },
  { name: "Alterra Mountain Co", domain: "alterramtnco.com" },
  { name: "Black Diamond", domain: "blackdiamondequipment.com" },
  { name: "Vail Resorts", domain: "vailresorts.com" },
  { name: "Smartwool", domain: "smartwool.com" },
  { name: "Nike", domain: "nike.com" },
  { name: "Google", domain: "google.com" },
  { name: "Apple", domain: "apple.com" },
  { name: "KPMG", domain: "kpmg.com" },
  { name: "Amazon", domain: "amazon.com" },
  { name: "Backbone Media", domain: "backbonemedia.com" },
  { name: "Outside Inc", domain: "outsideinc.com" },
  { name: "Yeti", domain: "yeti.com" },
];

const denverDonutData = [
  { name: "Marketing", value: 26, color: "#ED7660" },
  { name: "Operations", value: 22, color: "#19363B" },
  { name: "Creative", value: 16, color: "#809482" },
  { name: "Communications & PR", value: 11, color: "#E1B624" },
  { name: "Product Design/Dev", value: 9, color: "#BD665A" },
  { name: "Sales", value: 7, color: "#715F61" },
  { name: "Tech/Engineering", value: 5, color: "#5F4A4D" },
  { name: "Science/Conservation", value: 4, color: "#EE6853" },
];

const denverBarData = [
  { role: "Brand Strategy & Marketing", count: 78 },
  { role: "Operations & Supply Chain", count: 66 },
  { role: "Creative Directors & Designers", count: 46 },
  { role: "PR & Communications", count: 32 },
  { role: "Product Design & Dev", count: 26 },
  { role: "Sales & Partnerships", count: 20 },
  { role: "Sustainability & ESG", count: 17 },
];

const denverStats = [
  { num: "900+", label: "Expected Attendees" },
  { num: "40K+", label: "Festival Attendees" },
  { num: "67%", label: "6+ Years Experience" },
  { num: "88%", label: "Management Experience" },
];

const denverShowUpOptions = [
  {
    icon: Briefcase,
    title: "Employer Table / Booth",
    desc: "Set up in our Recruitment Zone for quality 5–10 minute conversations with highly experienced candidates. Space for banners, product samples, QR codes, and swag.",
    tag: "Most Popular",
    example: "VF brands set up interactive QR-code stations; REI brings their team leads for on-the-spot conversations; Yeti showcases new product alongside career info.",
  },
  {
    icon: MessageCircle,
    title: "Industry Expert / Mentor",
    desc: "Your leaders are featured by name — called out just as prominently as your brand. 1:1 mentorship conversations with mid-to-senior career professionals looking for guidance.",
    tag: "Low Lift",
    example: "Leaders from Patagonia, Black Diamond, and Cotopaxi have shown up as individual mentors — building authentic connections beyond their corporate role.",
  },
  {
    icon: Mic,
    title: "Panel Speaker",
    desc: "Join the 'How I Broke In' panel — 45 minutes of concrete career journeys, networking tactics, and live Q&A. The most-requested segment at every Gather event.",
    tag: "High Visibility",
    example: "Panelists from Google, Nike, and REI have shared their exact career trajectories — creating unforgettable brand impressions with hundreds of attendees.",
  },
];

const denverTiers = [
  {
    name: "Hiring Table",
    price: "$3,000+",
    spots: "10 available",
    icon: Zap,
    popular: true,
    bestFor: "Outdoor/active lifestyle brands hiring anytime in 2026–27",
    perks: [
      "Hiring table inside event",
      "Up to 5 brand representatives",
      "Logo & careers page link on event website & registration",
      "Exposure to our 300K+ community",
    ],
  },
  {
    name: "Deluxe Hiring + Branding",
    price: "$6,000–12,000",
    spots: "4 available",
    icon: Star,
    popular: false,
    bestFor: "Brands wanting hiring access AND marketing activation at Outside Days",
    perks: [
      "Everything in Hiring Table, plus:",
      "Much larger activation space",
      "Up to 20 brand representatives",
      "Room for product display or activation",
      "2-minute stage spotlight during main program",
      "Dedicated social post to 50K LinkedIn / 80K Facebook / 40K IG",
      'Free Candidate Match boost ($400) from <a href="https://basecampjobs.com" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:opacity-80">Basecamp Match</a>',
    ],
  },
  {
    name: "Title Sponsorship",
    price: "$15,000–$25,000",
    spots: "1–2 available",
    icon: Crown,
    popular: false,
    bestFor: "Major players wanting top billing at the biggest outdoor career event of the year",
    perks: [
      '"Gather Denver 2026, Presented by [You]"',
      "Keynote introduction opportunity",
      "Prime branding at entrance, bar & stage",
      "Post-event engagement & lead report",
      "Custom in-person and/or digital activation built with your creative team",
    ],
  },
];

const GatherDenver = () => {
  return (
    <main className="bg-background min-h-screen">
      <EventHero
        videoSrc={heroDenver}
        tagline="Basecamp Outdoor × Outside Days Festival"
        title=""
        titleAccent=""
        subtitle={'The outdoor industry\'s best career event of the year.\n500+ candidates, 25+ brands.\nRight before Friday night music at the 40,000 person'}
        subtitleLink={{ text: "Outside Days Festival", url: "https://bit.ly/4bDCrsv" }}
        date="May 29, 2026 · 2–5 PM · Denver, CO"
        ctaEmail="Jenna@wearetheoutdoorindustry.com"
        ctaSubject="I'd like to sponsor Gather Denver 2026"
        accolade="Named one of two top activations from 2024 & 2025 by Outside, Inc"
        logoSrc={denverLogo}
      />

      <EventLogoTicker
        brands={denverBrands}
        headline="Where leaders from the outdoor industry's most iconic brands gather"
      />

      <RecruiterValue />

      

      <Testimonials />

      <EventStats
        donutData={denverDonutData}
        barData={denverBarData}
        stats={denverStats}
        subtitle="We don't just fill seats — we curate a community. Denver draws a uniquely experienced talent pool: 67% have 6+ years of experience, 88% have management backgrounds."
      />

      <EventBrandShowUp options={denverShowUpOptions} />

      <Schedule />

      <EventSetup variant="denver" />
      <EventROI eventSize="600–900" />

      <EventQuote title="Make it a collab with marketing" quote="You aren't just buying a table — you are setting up a product demo for the people who manage the social feeds of the entire industry. This is your chance to get your new line into the hands of the storytellers." />

      <EventTiers
        tiers={denverTiers}
        ctaEmail="Jenna@wearetheoutdoorindustry.com"
        eventName="Gather Denver 2026"
      />

      <EventCTA
        ctaEmail="Jenna@wearetheoutdoorindustry.com"
        eventName="Gather Denver 2026"
        subtitle="Spots are limited. Secure your presence at the outdoor industry's biggest career event — embedded inside the 40,000-person Outside Days Festival in Denver."
      />
    </main>
  );
};

export default GatherDenver;
