import { Zap, Star, Crown, Briefcase, MessageCircle, Mic } from "lucide-react";
import heroPnw from "@/assets/hero-pnw.mp4";
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

const pnwBrands = [
  { name: "Nike", domain: "nike.com" },
  { name: "Adidas", domain: "adidas.com" },
  { name: "Columbia", domain: "columbia.com" },
  { name: "Patagonia", domain: "patagonia.com" },
  { name: "REI", domain: "rei.com" },
  { name: "KEEN", domain: "keenfootwear.com" },
  { name: "On Running", domain: "on-running.com" },
  { name: "Lululemon", domain: "lululemon.com" },
  { name: "Garmin", domain: "garmin.com" },
  { name: "Snow Peak", domain: "snowpeak.com" },
  { name: "Ruffwear", domain: "ruffwear.com" },
  { name: "Rivian", domain: "rivian.com" },
  { name: "HP Inc", domain: "hp.com" },
  { name: "AllTrails", domain: "alltrails.com" },
  { name: "Dovetail Workwear", domain: "dovetailworkwear.com" },
  { name: "Superfeet", domain: "superfeet.com" },
  { name: "Microsoft", domain: "microsoft.com" },
  { name: "Bob's Red Mill", domain: "bobsredmill.com" },
];

const pnwDonutData = [
  { name: "Marketing & Creative", value: 38, color: "#ED7660" },
  { name: "Product, Design & Engineering", value: 22, color: "#19363B" },
  { name: "Operations & Supply Chain", value: 15, color: "#809482" },
  { name: "Sales & Biz Dev", value: 12, color: "#E1B624" },
  { name: "Outdoor Ed & Tech", value: 8, color: "#BD665A" },
  { name: "Career Transitioners", value: 5, color: "#715F61" },
];

const pnwBarData = [
  { role: "Brand Strategy & PR", count: 85 },
  { role: "Product Development", count: 62 },
  { role: "UX/Graphic Design", count: 48 },
  { role: "Graduate Students (SPM)", count: 55 },
  { role: "Operations & Logistics", count: 38 },
  { role: "Sales & Partnerships", count: 32 },
  { role: "Directors & VPs", count: 28 },
];

const pnwStats = [
  { num: "425+", label: "Registrants (2025)" },
  { num: "38%", label: "Marketing & Creative" },
  { num: "22%", label: "Product & Design" },
  { num: "20%+", label: "UO SPM Students" },
];

const pnwShowUpOptions = [
  {
    icon: Briefcase,
    title: "Employer Table / Booth",
    desc: "Recruiters or hiring managers take 5–10 minute quality conversations. Space for banners, pull-ups, printed materials, QR codes to your careers page, and swag.",
    tag: "Most Popular",
    example: "Columbia brings product samples and a banner; VF brands set up QR-code stands linking directly to open roles. Keen brings swag bags with branded materials.",
  },
  {
    icon: MessageCircle,
    title: "Industry Expert / Mentor",
    desc: "Your leaders are featured by name — called out just as prominently as the brand itself. Show up as approachable mentors, not just a logo. 1:1 mini-mentorship conversations.",
    tag: "Low Lift",
    example: "Individual leaders from Nike, Adidas, and Columbia have participated as named mentors — even when their company wasn't formally tabling.",
  },
  {
    icon: Mic,
    title: "Panel Speaker",
    desc: "Join the 'How I Broke In' panel — 45 minutes of concrete career steps, networking tactics, and Q&A. Your people become the face of what it means to work at your brand.",
    tag: "High Visibility",
    example: "Panelists share their exact career trajectory — who they talked to, what they said, how they found the role. It's the most-requested segment at every event.",
  },
];

const pnwTiers = [
  {
    name: "Hiring Table",
    price: "$2,500",
    spots: "7 available",
    icon: Zap,
    popular: true,
    bestFor: "Outdoor/active lifestyle brands hiring anytime in 2025–26",
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
    price: "$5,000",
    spots: "4 available",
    icon: Star,
    popular: false,
    bestFor: "Hiring AND marketing teams looking to split budget, or brands consolidating niche influence",
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
    bestFor: "Major industry players wanting top billing and full integration",
    perks: [
      '"Gather PNW 2026, Presented by [You]"',
      "Keynote introduction opportunity",
      "Prime branding at entrance, bar & stage",
      "Post-event engagement & lead report",
      "Custom activation built with your creative team",
    ],
  },
];

const GatherPNW = () => {
  return (
    <main className="bg-background min-h-screen">
      <EventHero
        videoSrc={heroPnw}
        tagline="Basecamp Outdoor × University of Oregon"
        title="GATHER"
        titleAccent="PNW 2026"
        subtitle="The Pacific Northwest's premier outdoor industry career event. 425+ registrants. 20+ brands. Intimate, high-quality networking at UO Portland."
        date="April 16, 2026 · Portland, OR"
        ctaEmail="Jenna@wearetheoutdoorindustry.com"
        ctaSubject="I'd like to sponsor Gather PNW 2026"
        accolade="Named one of two top activations from 2024 & 2025 by Outside, Inc"
      />

      <EventLogoTicker
        brands={pnwBrands}
        headline="Network alongside professionals from the industry's top brands"
      />

      <RecruiterValue />

      <EventQuote quote="You aren't just buying a table — you are setting up a product demo for the people who manage the social feeds of the entire industry. This is your chance to get your new line into the hands of the storytellers." />

      <EventStats
        donutData={pnwDonutData}
        barData={pnwBarData}
        stats={pnwStats}
        subtitle="We don't just fill seats — we curate a community. Based on 425+ registrants from our 2025 PNW event, plus the UO Sports Product Management pipeline."
      />

      <EventBrandShowUp options={pnwShowUpOptions} />

      <EventROI eventSize="250–500" />
      <EventSetup variant="pnw" />

      <Testimonials />
      <Schedule />

      <EventTiers
        tiers={pnwTiers}
        ctaEmail="Jenna@wearetheoutdoorindustry.com"
        eventName="Gather PNW 2026"
      />

      <EventCTA
        ctaEmail="Jenna@wearetheoutdoorindustry.com"
        eventName="Gather PNW 2026"
        subtitle="Spots are limited. Secure your presence at Portland's most impactful outdoor industry career event — where 250–500 highly relevant professionals gather in one room."
      />
    </main>
  );
};

export default GatherPNW;
