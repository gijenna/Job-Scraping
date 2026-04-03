import { Zap, Star, Crown, Briefcase, MessageCircle, Target, Users, Check, Clock, Shield, BarChart3, HeartHandshake } from "lucide-react";
import denverLogo from "@/assets/denver-logo.png";
import eventYeti from "@/assets/event-yeti.jpg";
import eventRei from "@/assets/event-rei.jpg";
import eventBoa from "@/assets/event-boa.jpg";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

// ── Data ──────────────────────────────────────────────

const denverBrands = [
  "REI", "Patagonia", "The North Face", "Cotopaxi", "Alterra Mountain Co",
  "Black Diamond", "Vail Resorts", "Smartwool", "Nike", "Google",
  "Apple", "KPMG", "Amazon", "Backbone Media", "Outside Inc", "Yeti",
];

const donutData = [
  { name: "Marketing", value: 26, color: "#ED7660" },
  { name: "Operations", value: 22, color: "#19363B" },
  { name: "Creative", value: 16, color: "#809482" },
  { name: "Communications & PR", value: 11, color: "#E1B624" },
  { name: "Product Design/Dev", value: 9, color: "#BD665A" },
  { name: "Sales", value: 7, color: "#715F61" },
  { name: "Tech/Engineering", value: 5, color: "#5F4A4D" },
  { name: "Science/Conservation", value: 4, color: "#EE6853" },
];

const barData = [
  { role: "Brand Strategy & Marketing", count: 78 },
  { role: "Operations & Supply Chain", count: 66 },
  { role: "Creative Directors & Designers", count: 46 },
  { role: "PR & Communications", count: 32 },
  { role: "Product Design & Dev", count: 26 },
  { role: "Sales & Partnerships", count: 20 },
  { role: "Sustainability & ESG", count: 17 },
];

const stats = [
  { num: "500+", label: "Expected Attendees" },
  { num: "40K+", label: "Festival Attendees" },
  { num: "67%", label: "6+ Years Experience" },
  { num: "88%", label: "Management Experience" },
];

const showUpOptions = [
  { icon: Star, title: "Branding / Discovery Partner", desc: "This isn't just a career fair — it's a product showcase. Bring your new lines, gear demos, and brand activations to the people who manage the social feeds of the entire industry.", tag: "High Visibility", example: "Yeti, REI, and Cotopaxi have set up product discovery zones — turning career fair foot traffic into organic brand moments shared across the industry." },
  { icon: Briefcase, title: "Employer Partner", desc: "Set up in our Recruitment Zone for quality 5–10 minute conversations with highly experienced candidates. Space for banners, product samples, QR codes, and swag.", tag: "Most Popular", example: "VF brands set up interactive QR-code stations; REI brings their team leads for on-the-spot conversations; Yeti showcases new product alongside career info." },
  { icon: MessageCircle, title: "Industry Expert / Mentor", desc: "Your leaders are featured by name — called out just as prominently as your brand. 1:1 mentorship conversations with mid-to-senior career professionals.", tag: "Low Lift", example: "Leaders from Patagonia, Black Diamond, and The North Face have shown up as individual mentors — building authentic connections beyond their corporate role." },
];

const schedule = [
  { time: "1–2:30 PM", label: "Brand Load-In", desc: "Set up your booth and settle in" },
  { time: "3–3:30 PM", label: "VIP Access", desc: "Select candidates get exclusive early access" },
  { time: "3–6 PM", label: "Main Event", desc: "Registrants network with brands, career coaches, and each other" },
  { time: "6–6:30 PM", label: "Wrap Up", desc: "Teardown and final conversations" },
  { time: "7 PM+", label: "Festival Music Starts", desc: "Head to the main stage!" },
];

const tiers = [
  { name: "Hiring Table", price: "$3,000+", spots: "10 available", icon: Zap, popular: false, bestFor: "Outdoor/active lifestyle brands hiring anytime in 2026–27", perks: ["Hiring table inside event", "Up to 5 brand representatives", "Logo & careers page link on event website & registration", "Exposure to our 300K+ community"] },
  { name: "Deluxe Hiring + Branding", price: "$6,000–12,000", spots: "4 available", icon: Star, popular: true, bestFor: "Brands wanting hiring access AND marketing activation at Outside Days", perks: ["Everything in Hiring Table, plus:", "Much larger activation space", "Up to 20 brand representatives", "Room for product display or activation", "Dedicated social post to 50K LinkedIn / 80K Facebook / 40K IG", "Free Candidate Match boost ($400) from Basecamp Match"] },
  { name: "Title Sponsorship", price: "$15,000–$25,000", spots: "1–2 available", icon: Crown, popular: false, bestFor: "Major players wanting top billing at the biggest outdoor career event of the year", perks: ['"Outside Days Career Fair presented by [You]"', "Prime branding at entrance & stage", "Post-event engagement & lead report", "Custom in-person and/or digital activation built with your creative team"] },
];

const testimonials = [
  { quote: "We all met GREAT candidates. Three of us have a candidate in play, and I am hopefully extending an offer to one today. Huge success.", name: "Martine Knights", title: "Sr Recruiter, VF Corporation" },
  { quote: "We generated a LOT of excellent candidates & would be very happy to sponsor again! We were so impressed by the depth of talent.", name: "Hillary St. John", title: "Sr. HR, Elevate Outdoor Collective" },
  { quote: "We had a GREAT time at Gather! I thought it was a very successful event.", name: "Jessica Martin", title: "Talent Acquisition, YETI" },
  { quote: "We use Gather as a branding opportunity for when we're hiring in the future.", name: "Liz Berry", title: "Sr Manager, Talent Acquisition, Cotopaxi" },
];

const qualityPoints = [
  { icon: Target, stat: "92%", label: "Role-Relevant", desc: "Attendees are in product, design, creative, and corporate roles adjacent to outdoor/active lifestyle — not random job fair traffic." },
  { icon: Users, stat: "500–800", label: "Per Event", desc: "A concentrated, high-quality talent pool. Every conversation is intentional — no 30-second drive-bys." },
  { icon: Star, stat: "Mid-to-Senior", label: "Career Level", desc: "Awesomely tenured professionals already at brands like Patagonia, Columbia, Nike, REI, Deloitte, The North Face, and Arc'teryx." },
];

const roiPoints = [
  { icon: Users, headline: "Quality Over Volume", detail: "You're meeting 1 of 50, not 1 of 1,200. Every conversation is meaningful." },
  { icon: Shield, headline: "We Help You Show Up Right", detail: "Table setup, signage guidance, and coordination so your team looks polished from the moment doors open." },
  { icon: BarChart3, headline: "Easy Internal Pitch", detail: "Clear sponsorship tiers, transparent pricing, and a post-event engagement report." },
  { icon: HeartHandshake, headline: "Candidate Experience First", detail: "Attendees leave saying 'I actually had a real conversation with that recruiter.'" },
];

// ── Styles ──────────────────────────────────────────────

const sectionClass = "py-12 px-8 border-b-2 border-gray-200 bg-white";
const headingClass = "font-bold text-3xl text-gray-900 mb-2";
const subheadClass = "text-sm text-gray-500 uppercase tracking-widest mb-4";
const bodyClass = "text-gray-700 text-sm leading-relaxed";
const cardClass = "border border-gray-200 rounded-lg p-6 bg-gray-50";

// ── Component ──────────────────────────────────────────────

const GatherDenverExport = () => {
  return (
    <div className="bg-white text-gray-900 max-w-[1200px] mx-auto" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Hero */}
      <section className="py-16 px-8 bg-[#19363B] text-white text-center border-b-4 border-[#ED7660]">
        <img src={denverLogo} alt="Gather Denver Logo" className="w-64 mx-auto mb-6" />
        <p className="text-[#ED7660] text-xs tracking-widest uppercase mb-3">Basecamp Outdoor × Outside Days Festival</p>
        <p className="text-white/80 text-base max-w-xl mx-auto mb-2">
          The outdoor industry's best career event of the year.<br />
          500+ candidates, 25+ brands.<br />
          Right before Friday night music at the 40,000 person Outside Days Festival.
        </p>
        <p className="text-white font-bold text-xl mt-4">May 29, 2026 · 1–4 PM · Denver, CO</p>
        <p className="text-white/50 text-xs mt-2 italic">Named one of two top activations from 2024 & 2025 by Outside, Inc</p>
        <p className="mt-4 text-white/60 text-sm">jenna@wearetheoutdoorindustry.com</p>
      </section>

      {/* Brand Logos */}
      <section className={sectionClass}>
        <p className={subheadClass}>Where leaders from the outdoor industry's most iconic brands gather</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {denverBrands.map((b) => (
            <span key={b} className="bg-gray-100 border border-gray-200 rounded-full px-4 py-1.5 text-sm font-medium text-gray-700">{b}</span>
          ))}
        </div>
      </section>

      {/* Quality Over Quantity */}
      <section className={sectionClass}>
        <p className={subheadClass}>What Recruiters Asked For</p>
        <h2 className={headingClass}>Quality Over Quantity</h2>
        <p className={`${bodyClass} max-w-2xl mb-6`}>Top recruiters at Nike, VF Corp, and Columbia all asked: <em>"What's the quality of candidates?"</em></p>
        <div className="grid grid-cols-3 gap-4">
          {qualityPoints.map((p, i) => (
            <div key={i} className={cardClass + " text-center"}>
              <p className="text-[#ED7660] font-extrabold text-2xl mb-1">{p.stat}</p>
              <p className="font-bold text-sm text-gray-900 mb-2">{p.label}</p>
              <p className={bodyClass}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className={sectionClass}>
        <p className={subheadClass}>Social Proof</p>
        <h2 className={headingClass}>Brands Love Gather</h2>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {testimonials.map((t, i) => (
            <div key={i} className={cardClass}>
              <p className={bodyClass + " italic mb-3"}>"{t.quote}"</p>
              <p className="font-bold text-sm text-gray-900">{t.name}</p>
              <p className="text-xs text-gray-500">{t.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats & Charts */}
      <section className={sectionClass}>
        <p className={subheadClass}>The Data That Matters</p>
        <h2 className={headingClass}>Who Is In The Room?</h2>
        <p className={`${bodyClass} max-w-2xl mb-6`}>We don't just fill seats — we curate a community. Denver draws a uniquely experienced talent pool: 67% have 6+ years of experience, 88% have management backgrounds.</p>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className={cardClass + " text-center"}>
              <p className="text-[#ED7660] font-extrabold text-2xl">{s.num}</p>
              <p className="text-gray-600 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className={cardClass}>
            <h3 className="font-bold text-sm mb-4">Attendee Career Fields</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {donutData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {donutData.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-gray-600">{d.name} ({d.value}%)</span>
                </div>
              ))}
            </div>
          </div>

          <div className={cardClass}>
            <h3 className="font-bold text-sm mb-4">Top Roles Represented</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="role" type="category" width={180} tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Bar dataKey="count" fill="#ED7660" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* How Brands Show Up */}
      <section className={sectionClass}>
        <p className={subheadClass}>Your Presence</p>
        <h2 className={headingClass}>How Brands Show Up</h2>
        <div className="grid grid-cols-3 gap-4 mt-4 mb-8">
          <div className="rounded-lg overflow-hidden border border-gray-200"><img src={eventYeti} alt="YETI booth" className="w-full h-40 object-cover" /></div>
          <div className="rounded-lg overflow-hidden border border-gray-200"><img src={eventRei} alt="REI booth" className="w-full h-40 object-cover" /></div>
          <div className="rounded-lg overflow-hidden border border-gray-200"><img src={eventBoa} alt="BOA booth" className="w-full h-40 object-cover" /></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {showUpOptions.map((opt, i) => (
            <div key={i} className={cardClass}>
              <span className="text-[10px] tracking-wider uppercase text-[#ED7660] bg-red-50 px-2 py-1 rounded-full font-semibold">{opt.tag}</span>
              <h4 className="font-bold text-base text-gray-900 mt-3 mb-2">{opt.title}</h4>
              <p className={bodyClass + " mb-3"}>{opt.desc}</p>
              <div className="bg-red-50/50 border border-red-100 rounded p-2">
                <p className="text-xs text-gray-600"><span className="text-[#ED7660] font-semibold">What brands have done: </span>{opt.example}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Schedule */}
      <section className={sectionClass}>
        <p className={subheadClass}>Run of Show</p>
        <h2 className={headingClass}>The Afternoon</h2>
        <div className="space-y-3 mt-4 max-w-2xl">
          {schedule.map((item, i) => (
            <div key={i} className="flex items-start gap-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
              <Clock className="w-5 h-5 text-[#ED7660] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-gray-900">{item.time} — {item.label}</p>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Setup */}
      <section className={sectionClass}>
        <p className={subheadClass}>Your Physical Setup</p>
        <h2 className={headingClass}>What You Get On-Site</h2>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {[
            "6-ft skirted table & 2 chairs", "Space for pull-up banner or backdrop", "Power outlets available on request",
            "Venue Wi-Fi access", "Room for product samples, swag bags & handouts", "Branded name placard & table signage",
            "Up to 5 brand reps included (more with Deluxe)", "Free 3-day festival tickets for your attending team",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#ED7660] shrink-0" />
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4"><strong>Venue:</strong> Auraria Campus — this year's Outside Days Festival grounds in Denver.</p>
      </section>

      {/* ROI */}
      <section className={sectionClass}>
        <p className={subheadClass}>For Recruiting & TA Teams</p>
        <h2 className={headingClass}>Why This Event Delivers</h2>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {roiPoints.map((point, i) => (
            <div key={i} className={cardClass + " flex gap-4"}>
              <point.icon className="w-6 h-6 text-[#ED7660] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-gray-900 mb-1">{point.headline}</h4>
                <p className={bodyClass}>{point.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="py-12 px-8 bg-[#19363B] text-center border-b-2 border-gray-200">
        <p className="text-[#ED7660] text-xs tracking-widest uppercase mb-4">Make it a collab with marketing</p>
        <p className="text-white text-xl italic max-w-3xl mx-auto leading-relaxed">
          "You aren't just buying a table — you are setting up a product demo for the people who manage the social feeds of the entire industry. This is your chance to get your new line into the hands of the storytellers."
        </p>
      </section>

      {/* Tiers */}
      <section className={sectionClass}>
        <p className={subheadClass}>Partnership Options</p>
        <h2 className={headingClass}>Find Your Fit</h2>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {tiers.map((tier, i) => (
            <div key={i} className={`${cardClass} flex flex-col ${tier.popular ? "border-[#ED7660] border-2 relative" : ""}`}>
              {tier.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ED7660] text-white text-[10px] font-bold px-3 py-0.5 rounded-full">Most Popular</span>}
              <h3 className="font-bold text-lg text-gray-900">{tier.name}</h3>
              <p className="text-[#ED7660] font-extrabold text-2xl mt-1">{tier.price}</p>
              <p className="text-[#ED7660] text-xs mt-1">{tier.spots}</p>
              <p className="text-gray-600 text-xs mt-3 mb-4"><strong>Best for:</strong> {tier.bestFor}</p>
              <ul className="space-y-2 flex-1">
                {tier.perks.map((perk, j) => (
                  <li key={j} className="flex gap-2 text-xs text-gray-700">
                    <Check className="w-3.5 h-3.5 text-[#ED7660] shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-8 bg-[#19363B] text-white text-center">
        <h2 className="font-bold text-3xl mb-3">Ready to Be Part of This?</h2>
        <p className="text-white/70 text-sm max-w-xl mx-auto mb-6">
          Spots are limited. Secure your presence at the outdoor industry's biggest career event — embedded inside the 40,000-person Outside Days Festival in Denver.
        </p>
        <p className="text-[#ED7660] font-bold text-lg">jenna@wearetheoutdoorindustry.com</p>
      </section>
    </div>
  );
};

export default GatherDenverExport;
