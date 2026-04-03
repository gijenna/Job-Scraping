import { Zap, Star, Crown, Briefcase, MessageCircle, Compass, Sparkles, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import EventQuote from "@/components/event/EventQuote";
import EventBrandShowUp from "@/components/event/EventBrandShowUp";
import EventStats from "@/components/event/EventStats";
import EventTiers from "@/components/event/EventTiers";
import EventCTA from "@/components/event/EventCTA";
import EventROI from "@/components/event/EventROI";
import EventSetup from "@/components/event/EventSetup";
import Testimonials from "@/components/Testimonials";
import Schedule from "@/components/Schedule";

const denverSchedule = [
  { time: "1–2:30 PM", label: "Brand Load-In", desc: "Set up your booth and settle in" },
  { time: "3–3:30 PM", label: "VIP Access", desc: "Select candidates get exclusive early access" },
  { time: "3–6 PM", label: "Main Event", desc: "Registrants network with brands, career coaches, and each other" },
  { time: "6–6:30 PM", label: "Wrap Up", desc: "Teardown and final conversations" },
  { time: "7 PM+", label: "Festival Music Starts", desc: "Head to the main stage!" },
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
  { num: "500+", label: "Expected Attendees" },
  { num: "40K+", label: "Festival Attendees" },
  { num: "67%", label: "6+ Years Experience" },
  { num: "88%", label: "Management Experience" },
];

const denverShowUpOptions = [
  {
    icon: Star,
    title: "Branding / Discovery Partner",
    desc: "This isn't just a career fair - it's a product showcase. Bring your new lines, gear demos, and brand activations to the people who manage the social feeds of the entire industry. Get your products into the hands of the storytellers.",
    tag: "High Visibility",
    example: "Yeti, REI, and Cotopaxi have set up product discovery zones - turning career fair foot traffic into organic brand moments shared across the industry.",
  },
  {
    icon: Briefcase,
    title: "Employer Partner",
    desc: "Set up in our Recruitment Zone for quality 5–10 minute conversations with highly experienced candidates. Space for banners, product samples, QR codes, and swag.",
    tag: "Most Popular",
    example: "VF brands set up interactive QR-code stations; REI brings their team leads for on-the-spot conversations; Yeti showcases new product alongside career info.",
  },
  {
    icon: MessageCircle,
    title: "Industry Expert / Mentor",
    desc: "Your leaders are featured by name - called out just as prominently as your brand. 1:1 mentorship conversations with mid-to-senior career professionals looking for guidance.",
    tag: "Low Lift",
    example: "Leaders from Patagonia, Black Diamond, and The North Face have shown up as individual mentors - building authentic connections beyond their corporate role.",
  },
];

const denverTiers = [
  {
    name: "Hiring Table",
    price: "$3,000+",
    spots: "10 available",
    icon: Zap,
    popular: false,
    bestFor: "Outdoor/active lifestyle brands hiring anytime in 2026–27",
    perks: [
      "6ft space inside event",
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
    popular: true,
    bestFor: "Brands wanting hiring access AND marketing activation at Outside Days",
    perks: [
      "Everything in Hiring Table, plus:",
      "Much larger activation space",
      "Up to 20 brand representatives",
      "Room for product display or activation",
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
      '"Outside Days Career Fair presented by [You]"',
      "Prime branding at entrance",
      "Post-event engagement & lead report",
      "Custom in-person and/or digital activation built with your creative team",
    ],
  },
];

const OldStuffByJenna = () => {
  return (
    <main className="bg-background min-h-screen">
      <div className="pt-16">
        {/* We Gather list */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-3xl">
            {[
              { icon: Briefcase, text: "The outdoor industry's most skilled talent currently innovating at your competitors" },
              { icon: Compass, text: "Outdoorsy folks currently working in sectors like tech, healthcare, aerospace who want to use their skills in a new industry" },
              { icon: Sparkles, text: "Industry tastemakers - leaders, creatives, athletes, influencers - not actively looking for a role, but making sure they know what's next" },
              { icon: GraduationCap, text: "Students and fresh grads hungry for entry-level, retail, or seasonal roles" },
            ].map((item, i, arr) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex items-start gap-4 py-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <p className="text-foreground font-body text-base md:text-lg leading-relaxed">
                    {item.text}
                  </p>
                </div>
                {i < arr.length - 1 && (
                  <div className="flex items-center gap-3 pl-3">
                    <span className="text-primary font-display font-extrabold text-2xl leading-none">+</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        <EventStats
          donutData={denverDonutData}
          barData={denverBarData}
          stats={denverStats}
          subtitle="We don't just fill seats - we curate a community. Denver draws a uniquely experienced talent pool: 67% have 6+ years of experience, 88% have management backgrounds."
        />

        <Testimonials />

        <EventBrandShowUp options={denverShowUpOptions} />

        <Schedule items={denverSchedule} heading="The Afternoon" />

        <EventSetup variant="denver" />
        <EventROI eventSize="600–900" />

        <EventQuote title="Make it a collab with marketing" quote="You aren't just buying a table - you are setting up a product demo for the people who manage the social feeds of the entire industry. This is your chance to get your new line into the hands of the storytellers." />

        <EventTiers
          tiers={denverTiers}
          ctaEmail="jenna@wearetheoutdoorindustry.com"
          eventName="Gather Denver 2026"
        />

        <EventCTA
          ctaEmail="jenna@wearetheoutdoorindustry.com"
          eventName="Gather Denver 2026"
          subtitle="Spots are limited. Secure your presence at the outdoor industry's biggest career event - embedded inside the 40,000-person Outside Days Festival in Denver."
        />
      </div>
    </main>
  );
};

export default OldStuffByJenna;
