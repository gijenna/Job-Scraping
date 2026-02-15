import { Zap, Star, Crown, Briefcase, MessageCircle, Mic } from "lucide-react";
import heroDenver from "@/assets/hero-denver.mp4";
import EventHero from "@/components/event/EventHero";
import EventLogoTicker from "@/components/event/EventLogoTicker";
import EventQuote from "@/components/event/EventQuote";
import EventBrandShowUp from "@/components/event/EventBrandShowUp";
import EventStats from "@/components/event/EventStats";
import EventTiers from "@/components/event/EventTiers";
import EventCTA from "@/components/event/EventCTA";
import EventROI from "@/components/event/EventROI";
import Testimonials from "@/components/Testimonials";
import Schedule from "@/components/Schedule";

const denverBrands = [
  "REI", "Patagonia", "The North Face", "Cotopaxi", "Alterra Mountain Co",
  "Black Diamond", "Vail Resorts", "Smartwool", "Nike", "Google", "Apple",
  "KPMG", "Amazon", "Backbone Media", "Outside Inc", "Yeti",
];

const denverDonutData = [
  { name: "Marketing", value: 26, color: "hsl(5, 65%, 65%)" },
  { name: "Operations", value: 22, color: "hsl(180, 30%, 45%)" },
  { name: "Creative", value: 16, color: "hsl(35, 50%, 55%)" },
  { name: "Communications & PR", value: 11, color: "hsl(15, 70%, 55%)" },
  { name: "Product Design/Dev", value: 9, color: "hsl(160, 25%, 50%)" },
  { name: "Sales", value: 7, color: "hsl(200, 25%, 50%)" },
  { name: "Tech/Engineering", value: 5, color: "hsl(280, 20%, 50%)" },
  { name: "Science/Conservation", value: 4, color: "hsl(120, 25%, 45%)" },
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
    price: "$3,000",
    spots: "10 available",
    icon: Zap,
    popular: true,
    bestFor: "Outdoor/active lifestyle brands looking to recruit experienced talent",
    perks: [
      "Hiring table inside event",
      "Up to 5 brand representatives",
      "Logo & careers page link on event website & registration",
      "Exposure to our 300K+ community",
      "Logo across all digital channels",
      "Dedicated social post to 50K LinkedIn / 75K Facebook / 40K IG",
    ],
  },
  {
    name: "Deluxe Hiring + Branding",
    price: "$6,000",
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
      "Dedicated email blast to 1,000+ member list",
    ],
  },
  {
    name: "Title Sponsorship",
    price: "$10–20K",
    spots: "1–2 available",
    icon: Crown,
    popular: false,
    bestFor: "Major players wanting top billing at the biggest outdoor career event of the year",
    perks: [
      '"Gather Denver 2026, Presented by [You]"',
      "Keynote introduction opportunity",
      "Prime branding at entrance, bar & stage",
      "Post-event engagement & lead report",
      "Custom activation built with your creative team",
    ],
  },
];

const GatherDenver = () => {
  return (
    <main className="bg-background min-h-screen">
      <EventHero
        videoSrc={heroDenver}
        tagline="Basecamp Outdoor × Outside Days Festival"
        title="GATHER"
        titleAccent="DENVER 2026"
        subtitle="The outdoor industry's largest career event. 900+ candidates. 25+ brands. Set inside the 40,000-person Outside Days Festival."
        date="May 29, 2026 · Denver, CO"
        ctaEmail="Jenna@wearetheoutdoorindustry.com"
        ctaSubject="I'd like to sponsor Gather Denver 2026"
        accolade="Named one of two top activations from 2024 & 2025 by Outside, Inc"
      />

      <EventLogoTicker
        brands={denverBrands}
        headline="Where leaders from the outdoor industry's most iconic brands gather"
      />

      <EventQuote quote="You aren't just buying a table — you are setting up a product demo for the people who manage the social feeds of the entire industry. This is your chance to get your new line into the hands of the storytellers." />

      <EventBrandShowUp options={denverShowUpOptions} />

      <EventROI eventSize="600–900" />

      <EventStats
        donutData={denverDonutData}
        barData={denverBarData}
        stats={denverStats}
        subtitle="We don't just fill seats — we curate a community. Denver draws a uniquely experienced talent pool: 67% have 6+ years of experience, 88% have management backgrounds."
      />

      <Testimonials />
      <Schedule />

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
