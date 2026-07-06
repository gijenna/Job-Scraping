import { useMemo, useRef, useState } from "react";
import basecampLogo from "@/assets/basecamp-outdoor-logo.png";
import loungePhoto from "@/assets/mn26/AnthonyMarz_Basecamp-169.jpg.asset.json";

const TEAL = "#19363B";
const CORAL = "#ED7660";
const GOLD = "#E1B624";
const CREAM = "#E6E1CE";
const SAGE = "#809482";

const font = { fontFamily: "'Josefin Sans', sans-serif" } as const;

type BrandCtx = { name: string; logo: string };

const usePersonalization = () => {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const active = Boolean(name.trim() || logo);
  const brand: BrandCtx = {
    name: name.trim() || "Basecamp Outdoor",
    logo: logo || basecampLogo,
  };
  return { name, setName, logo, setLogo, active, brand };
};

const PersonalizationCard = ({
  name,
  setName,
  logo,
  setLogo,
  active,
  compact,
}: {
  name: string;
  setName: (v: string) => void;
  logo: string | null;
  setLogo: (v: string | null) => void;
  active: boolean;
  compact?: boolean;
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const onFile = (f: File | undefined) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setLogo(String(r.result));
    r.readAsDataURL(f);
  };
  return (
    <div
      style={{
        ...font,
        background: `${CREAM}12`,
        border: `1px solid ${CREAM}33`,
        borderRadius: 14,
      }}
      className={`p-5 md:p-6 ${compact ? "" : "mt-10"}`}
    >
      <p style={{ color: CREAM }} className="text-sm md:text-base font-light tracking-wide">
        Want to see <span style={{ color: CORAL }} className="font-semibold">YOUR</span> brand in the room? Add your name and logo.
      </p>
      <div className="mt-4 flex flex-col md:flex-row gap-3 md:items-center">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Brand name"
          style={{
            ...font,
            background: "transparent",
            border: `1px solid ${CREAM}55`,
            color: CREAM,
          }}
          className="flex-1 px-4 py-2.5 rounded-md text-sm placeholder:opacity-60 focus:outline-none focus:border-white"
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <button
          onClick={() => fileRef.current?.click()}
          style={{ ...font, border: `1px solid ${CREAM}55`, color: CREAM }}
          className="px-4 py-2.5 rounded-md text-sm hover:bg-white/10 transition"
        >
          {logo ? "Logo added ✓" : "Upload your logo"}
        </button>
        <button
          onClick={() => {
            const el = document.getElementById("mockups");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          style={{ ...font, background: CORAL, color: "#fff" }}
          className="px-5 py-2.5 rounded-md text-sm font-semibold hover:opacity-90 transition"
        >
          See it with my brand
        </button>
      </div>
      {active && (
        <button
          onClick={() => {
            setName("");
            setLogo(null);
          }}
          style={{ ...font, color: CREAM }}
          className="mt-3 text-xs opacity-70 hover:opacity-100 underline"
        >
          Reset to Basecamp
        </button>
      )}
    </div>
  );
};

const FACTS: Array<[string, string]> = [
  ["Event", "OR Gatherings at the Basecamp Outdoor Lounge"],
  ["Date", "Thursday, August 20, 2026"],
  ["Time", "10:30am–12:30pm"],
  ["Location", "Minneapolis Convention Center, inside Outdoor Retailer"],
  ["Cost", "Free to attend, no OR badge needed"],
];

const Hero = () => (
  <>
    <section style={{ background: TEAL, ...font }} className="px-6 pt-20 pb-16 md:pt-28 md:pb-20">
      <div className="max-w-5xl mx-auto">
        <p style={{ color: GOLD }} className="text-xs md:text-sm tracking-[0.3em] uppercase font-medium">
          Basecamp Outdoor Lounge · OR Minneapolis 2026
        </p>
        <h1
          style={{ color: CREAM, fontWeight: 300, letterSpacing: "-0.02em" }}
          className="mt-6 text-5xl md:text-7xl leading-[1.02]"
        >
          See your brand
          <br />
          <span style={{ fontWeight: 600 }}>in the room.</span>
        </h1>
        <p style={{ color: CREAM, fontWeight: 400 }} className="mt-6 text-lg md:text-2xl font-light max-w-2xl">
          Some brands buy a booth. You could build a reputation instead.
        </p>
        <div style={{ color: `${CREAM}cc` }} className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed font-light space-y-3">
          <p>OR Gatherings is our signature event, and your brand can power it.</p>
          <p>Your people sit down with the next generation of the industry, and you become the brand that showed up for the community.</p>
        </div>
      </div>
    </section>

    {/* Facts strip */}
    <section style={{ background: CREAM, borderTop: `1px solid ${TEAL}18`, borderBottom: `1px solid ${TEAL}18`, ...font }} className="px-6 py-8 md:py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4">
        {FACTS.map(([label, value], i) => (
          <div
            key={label}
            style={{
              borderLeft: `2px solid ${CORAL}`,
            }}
            className={`pl-4 md:pl-4 md:border-l-2 ${i === 0 ? "" : ""}`}
          >
            <div style={{ color: CORAL }} className="text-[10px] tracking-[0.25em] uppercase font-semibold">
              {label}
            </div>
            <div style={{ color: TEAL }} className="mt-1.5 text-sm md:text-[15px] font-medium leading-snug">
              {value}
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Model context line */}
    <section style={{ background: CREAM, ...font }} className="px-6 pb-10 md:pb-14">
      <div className="max-w-4xl mx-auto text-center">
        <p style={{ color: `${TEAL}cc` }} className="text-base md:text-lg font-light italic">
          We line up the experts. Brands get to support theirs and share the spotlight.
        </p>
      </div>
    </section>
  </>
);

const TierCard = ({
  name,
  price,
  highlight,
  children,
}: {
  name: string;
  price: string;
  highlight?: boolean;
  children: React.ReactNode;
}) => (
  <div
    style={{
      ...font,
      background: highlight ? `${CORAL}12` : "#fff",
      border: `1px solid ${highlight ? CORAL : `${TEAL}22`}`,
      borderRadius: 16,
    }}
    className="p-7 md:p-8 flex flex-col"
  >
    {highlight && (
      <span
        style={{ background: CORAL, color: "#fff", ...font }}
        className="self-start text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full font-semibold mb-4"
      >
        Most partners pick this
      </span>
    )}
    <h3 style={{ color: TEAL, fontWeight: 600 }} className="text-2xl md:text-3xl">
      {name}
    </h3>
    <p style={{ color: highlight ? CORAL : TEAL, fontWeight: 300 }} className="text-4xl md:text-5xl mt-2">
      {price}
    </p>
    <div style={{ color: `${TEAL}cc` }} className="mt-5 text-[15px] leading-relaxed font-light space-y-3">
      {children}
    </div>
  </div>
);

const Tiers = () => (
  <section style={{ background: CREAM, ...font }} className="px-6 py-20 md:py-28">
    <div className="max-w-6xl mx-auto">
      <h2 style={{ color: TEAL, fontWeight: 300 }} className="text-3xl md:text-5xl">
        Two ways to <span style={{ fontWeight: 600 }}>partner.</span>
      </h2>
      <div className="mt-10 grid md:grid-cols-2 gap-6">
        <TierCard name="Bring Your Expert" price="$1,500">
          <p>One expert in the lineup.</p>
          <p>Logo on the event page.</p>
          <p>A mention in the Basecamp newsletter.</p>
          <p>The post-event opted-in attendee list. Our opt-in rate is 90%+.</p>
          <p style={{ color: `${TEAL}99` }} className="text-sm italic pt-2 border-t" >
            Honest note: the expert gets an after-party invite. This tier does not include a show pass or team badges.
          </p>
        </TierCard>
        <TierCard name="Lounge Partner" price="$5,000" highlight>
          <p><strong style={{ color: TEAL }}>Everything in Bring Your Expert, plus:</strong></p>
          <p>Badges for your whole team. Each includes full OR show-floor access AND after-party access. That's a $1,200 value per person.</p>
          <p>Presence in the Lounge for the entire show. Like having a booth, for far less money and setup.</p>
          <p>A full feature in the Basecamp weekly newsletter. A $2,000 value.</p>
          <p>A social post.</p>
          <p>A branded high-top (brand-provided).</p>
          <p>Your own activation in the space. A decorate-your-boot craft bar, an e-bike to sit on, whatever fits your brand.</p>
          <p>A peak expert time slot.</p>
          <p>Option to provide a giveaway at the after-party for 150 creators and influencers. A $500 add-on.</p>
        </TierCard>
      </div>

      <ComparisonTable />

      <p style={{ color: CORAL, ...font }} className="mt-6 text-center italic text-sm md:text-base font-light max-w-3xl mx-auto">
        At $5,000 the team badges alone can exceed the price. $1,200 each, so three people is $3,600 in access before the $2,000 newsletter feature or the all-show presence.
      </p>
    </div>
  </section>
);

const ROWS: Array<[string, string, string]> = [
  ["Your expert in the lineup", "1 expert", "Your whole team"],
  ["Team badges (OR show + after-party access, $1,200 ea)", "—", "✓"],
  ["Logo on the event page", "✓", "✓"],
  ["Newsletter", "Mention", "Feature ($2,000 value)"],
  ["Post-event attendee list (opt-ins, 90%+)", "✓", "✓"],
  ["Social post", "—", "✓"],
  ["Present in the Lounge", "OR Gatherings event", "All show (Thu+Fri)"],
  ["Branded high-top (brand provided)", "—", "✓"],
  ["Your own activation (craft bar, e-bike, etc.)", "—", "✓"],
  ["Peak expert time slot", "—", "✓"],
  ["Option to participate in after-party giveaway", "—", "✓ ($500 add-on)"],
];

const cellClass = (v: string) => {
  if (v === "✓" || v.startsWith("✓")) return "font-semibold";
  if (v === "—") return "opacity-40";
  return "font-medium";
};

const ComparisonTable = () => (
  <div className="mt-14">
    {/* Desktop */}
    <div
      style={{ background: "#fff", border: `1px solid ${TEAL}22`, borderRadius: 16, ...font }}
      className="hidden md:block overflow-hidden"
    >
      <div className="grid grid-cols-[1.5fr_1fr_1fr]">
        <div style={{ color: TEAL }} className="px-6 py-5 text-xs uppercase tracking-[0.2em] font-semibold">
          What's included
        </div>
        <div style={{ color: `${TEAL}99`, background: `${SAGE}18` }} className="px-6 py-5 text-center">
          <div className="text-xs uppercase tracking-[0.2em] font-medium">Bring Your Expert</div>
          <div style={{ fontWeight: 300 }} className="text-2xl mt-1">$1,500</div>
        </div>
        <div style={{ color: TEAL, background: `${CORAL}20` }} className="px-6 py-5 text-center">
          <div style={{ color: CORAL }} className="text-xs uppercase tracking-[0.2em] font-semibold">Lounge Partner</div>
          <div style={{ fontWeight: 600 }} className="text-2xl mt-1">$5,000</div>
        </div>
      </div>
      {ROWS.map(([label, a, b], i) => (
        <div
          key={label}
          style={{ borderTop: `1px solid ${TEAL}15` }}
          className="grid grid-cols-[1.5fr_1fr_1fr]"
        >
          <div style={{ color: TEAL }} className="px-6 py-4 text-sm font-light">{label}</div>
          <div
            style={{ color: `${TEAL}bb`, background: i % 2 ? `${SAGE}10` : `${SAGE}18` }}
            className={`px-6 py-4 text-center text-sm ${cellClass(a)}`}
          >
            {a}
          </div>
          <div
            style={{ color: TEAL, background: i % 2 ? `${CORAL}12` : `${CORAL}20` }}
            className={`px-6 py-4 text-center text-sm ${cellClass(b)}`}
          >
            {b}
          </div>
        </div>
      ))}
    </div>

    {/* Mobile: stacked per-tier */}
    <div className="md:hidden space-y-6">
      {[
        { title: "Bring Your Expert", price: "$1,500", col: 1, bg: `${SAGE}18`, accent: SAGE },
        { title: "Lounge Partner", price: "$5,000", col: 2, bg: `${CORAL}18`, accent: CORAL },
      ].map((tier) => (
        <div
          key={tier.title}
          style={{ background: "#fff", border: `1px solid ${tier.accent}55`, borderRadius: 14, ...font }}
          className="overflow-hidden"
        >
          <div style={{ background: tier.bg, color: TEAL }} className="px-5 py-4">
            <div style={{ color: tier.accent }} className="text-[10px] uppercase tracking-[0.2em] font-semibold">
              {tier.title}
            </div>
            <div style={{ fontWeight: 600 }} className="text-2xl mt-0.5">{tier.price}</div>
          </div>
          <div className="divide-y" style={{ borderColor: `${TEAL}15` }}>
            {ROWS.map((r) => {
              const v = r[tier.col] as string;
              return (
                <div key={r[0]} className="flex justify-between gap-3 px-5 py-3">
                  <span style={{ color: `${TEAL}cc` }} className="text-sm font-light">{r[0]}</span>
                  <span style={{ color: TEAL }} className={`text-sm ${cellClass(v)}`}>{v}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ---------- Section 3: Mockups ----------

const LogoChip = ({ brand, size = 40 }: { brand: BrandCtx; size?: number }) => (
  <div
    style={{
      width: size,
      height: size,
      background: "#fff",
      border: `1px solid ${TEAL}22`,
      borderRadius: 8,
    }}
    className="flex items-center justify-center overflow-hidden shrink-0"
  >
    <img src={brand.logo} alt={brand.name} className="max-w-[80%] max-h-[80%] object-contain" />
  </div>
);

const NewsletterMention = ({ brand }: { brand: BrandCtx }) => (
  <div
    style={{ background: "#fff", border: `1px solid ${TEAL}22`, borderRadius: 14, ...font }}
    className="p-6"
  >
    <div style={{ color: `${TEAL}88` }} className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-4">
      Newsletter · Mention
    </div>
    <div style={{ color: TEAL }} className="text-sm font-light leading-relaxed">
      Big thanks to our OR Gatherings experts and partners this week, including{" "}
      <span style={{ fontWeight: 600 }}>{brand.name}</span>. See you in the Lounge.
    </div>
    <div className="mt-4 flex items-center gap-3">
      <LogoChip brand={brand} size={32} />
      <span style={{ color: `${TEAL}99` }} className="text-xs">{brand.name}</span>
    </div>
    <div style={{ color: `${TEAL}55` }} className="mt-5 text-[11px] italic">
      Included with Bring Your Expert ($1,500)
    </div>
  </div>
);

const NewsletterFeature = ({ brand }: { brand: BrandCtx }) => (
  <div
    style={{ background: TEAL, border: `1px solid ${CORAL}`, borderRadius: 14, ...font }}
    className="p-6 md:p-7"
  >
    <div style={{ color: GOLD }} className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-4">
      Newsletter · Full Feature
    </div>
    <LogoChip brand={brand} size={56} />
    <h4 style={{ color: CREAM, fontWeight: 600 }} className="mt-5 text-2xl leading-tight">
      In the Lounge this week: {brand.name}
    </h4>
    <p style={{ color: `${CREAM}cc` }} className="mt-3 text-sm font-light leading-relaxed">
      {brand.name} is showing up for the outdoor industry at OR Minneapolis. Meet their team in the Basecamp Outdoor Lounge, sit for a mentorship conversation, and learn how they're hiring, mentoring, and building community across the industry.
    </p>
    <span
      style={{ background: CORAL, color: "#fff", ...font }}
      className="inline-block mt-5 text-xs px-3 py-1.5 rounded-md font-semibold"
    >
      Read more →
    </span>
    <div style={{ color: `${CREAM}77` }} className="mt-5 text-[11px] italic">
      Included with Lounge Partner ($5,000) · $2,000 value
    </div>
  </div>
);

const PartnerSection = ({ brand }: { brand: BrandCtx }) => {
  const defaults = ["Cotopaxi", "Peak Design", "Smartwool", "Oakley", "REI", "Timberland"];
  return (
    <div
      style={{ background: CREAM, border: `1px solid ${TEAL}22`, borderRadius: 14, ...font }}
      className="p-6 md:p-8"
    >
      <div style={{ color: `${TEAL}88` }} className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-2">
        basecampoutdoorevents.com / minneapolis26
      </div>
      <h4 style={{ color: TEAL, fontWeight: 300 }} className="text-2xl md:text-3xl">
        With gratitude to our <span style={{ fontWeight: 600 }}>partners.</span>
      </h4>
      <div className="mt-6 grid grid-cols-3 md:grid-cols-4 gap-3">
        <div
          style={{ background: "#fff", border: `2px solid ${CORAL}`, borderRadius: 10 }}
          className="aspect-[3/2] flex flex-col items-center justify-center p-3 relative"
        >
          <img src={brand.logo} alt={brand.name} className="max-w-[75%] max-h-[60%] object-contain" />
          <span style={{ color: TEAL }} className="mt-1.5 text-[10px] font-semibold truncate w-full text-center">
            {brand.name}
          </span>
          <span
            style={{ background: CORAL, color: "#fff", ...font }}
            className="absolute -top-2 -right-2 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-semibold"
          >
            You
          </span>
        </div>
        {defaults.map((d) => (
          <div
            key={d}
            style={{ background: "#fff", border: `1px solid ${TEAL}18`, borderRadius: 10 }}
            className="aspect-[3/2] flex items-center justify-center p-3"
          >
            <span style={{ color: `${TEAL}99`, ...font }} className="text-xs font-medium">
              {d}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const EventPhoto = ({ brand }: { brand: BrandCtx }) => (
  <div>
    <div
      style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${TEAL}22` }}
      className="relative aspect-[4/3] bg-black"
    >
      <img src={loungePhoto.url} alt="Basecamp Outdoor Lounge" className="w-full h-full object-cover" />
      {/* signage overlay */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          right: "8%",
          width: "34%",
          background: "#fff",
          border: `3px solid ${CORAL}`,
          borderRadius: 10,
          padding: "10px 12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          transform: "rotate(-2deg)",
        }}
        className="flex flex-col items-center"
      >
        <span style={{ color: TEAL, ...font }} className="text-[9px] uppercase tracking-[0.2em] font-semibold">
          Presented by
        </span>
        <img src={brand.logo} alt={brand.name} className="max-h-12 max-w-full object-contain my-2" />
        <span style={{ color: TEAL, ...font }} className="text-[10px] font-semibold text-center leading-tight">
          {brand.name}
        </span>
      </div>
    </div>
    <p style={{ color: `${TEAL}cc`, ...font }} className="mt-3 text-sm italic text-center">
      Your brand, in the room.
    </p>
  </div>
);

const Mockups = ({ personalization }: { personalization: ReturnType<typeof usePersonalization> }) => {
  const brand = personalization.brand;
  return (
    <section id="mockups" style={{ background: TEAL, ...font }} className="px-6 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <p style={{ color: GOLD }} className="text-xs tracking-[0.3em] uppercase font-medium">
          See it live
        </p>
        <h2 style={{ color: CREAM, fontWeight: 300 }} className="mt-3 text-3xl md:text-5xl">
          See how you'll <span style={{ fontWeight: 600 }}>show up.</span>
        </h2>
        <p style={{ color: `${CREAM}99` }} className="mt-4 max-w-2xl text-base font-light">
          {personalization.active
            ? `Previewing with ${brand.name}. Nothing is saved, this is just for you.`
            : "Previewing with Basecamp Outdoor. Add your brand below to see it swap in."}
        </p>

        <div className="mt-8 max-w-3xl">
          <h3 style={{ color: CREAM, fontWeight: 400 }} className="text-lg md:text-xl mb-3 font-light">
            Want to see your brand in the room? Add your name and logo.
          </h3>
          <PersonalizationCard {...personalization} compact />
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-5">
          <NewsletterMention brand={brand} />
          <NewsletterFeature brand={brand} />
        </div>
        <div className="mt-5 grid md:grid-cols-2 gap-5">
          <PartnerSection brand={brand} />
          <EventPhoto brand={brand} />
        </div>
      </div>
    </section>
  );
};

const WhyWorthIt = () => (
  <section style={{ background: CREAM, ...font }} className="px-6 py-20 md:py-28">
    <div className="max-w-4xl mx-auto">
      <p style={{ color: CORAL }} className="text-xs tracking-[0.3em] uppercase font-semibold">
        Why it's worth it
      </p>
      <h2 style={{ color: TEAL, fontWeight: 300 }} className="mt-3 text-3xl md:text-5xl">
        A booth costs more, does less.
      </h2>
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div style={{ background: "#fff", border: `1px solid ${TEAL}22`, borderRadius: 14 }} className="p-6">
          <div style={{ color: CORAL, fontWeight: 600 }} className="text-4xl">$5,000 to $8,000</div>
          <p style={{ color: `${TEAL}bb` }} className="mt-3 text-sm font-light leading-relaxed">
            OR floor space alone, before build-out, freight, and staff. Then you're on your own for programming.
          </p>
        </div>
        <div style={{ background: TEAL, borderRadius: 14 }} className="p-6">
          <div style={{ color: GOLD, fontWeight: 600 }} className="text-4xl">300K community</div>
          <p style={{ color: `${CREAM}cc` }} className="mt-3 text-sm font-light leading-relaxed">
            70K newsletter, 180K social. Brand presence, recruiting, and content reach. You walk right in with none of the setup.
          </p>
        </div>
      </div>
      <div
        style={{ background: `${GOLD}22`, border: `1px solid ${GOLD}55`, borderRadius: 14 }}
        className="mt-6 p-6 md:p-7"
      >
        <p style={{ color: TEAL }} className="text-base md:text-lg font-light leading-relaxed">
          <span style={{ fontWeight: 600 }}>Proven format.</span> Our Denver Lounge generated{" "}
          <span style={{ color: CORAL, fontWeight: 600 }}>$55K in partnerships</span>, and experts return on their own time.
        </p>
      </div>
    </div>
  </section>
);

const FinalCTA = () => (
  <section style={{ background: TEAL, ...font }} className="px-6 py-24 md:py-32">
    <div className="max-w-3xl mx-auto text-center">
      <h2 style={{ color: CREAM, fontWeight: 300 }} className="text-4xl md:text-6xl leading-tight">
        Let's get your brand
        <br />
        <span style={{ fontWeight: 600 }}>in the room.</span>
      </h2>
      <a
        href="mailto:jenna@wearetheoutdoorindustry.com?subject=Basecamp Outdoor Lounge Partnership — OR Minneapolis 2026"
        style={{ background: CORAL, color: "#fff", ...font }}
        className="inline-block mt-10 px-8 py-4 rounded-md text-base font-semibold hover:opacity-90 transition"
      >
        Email Jenna
      </a>
      <p style={{ color: `${CREAM}aa` }} className="mt-6 text-sm">
        jenna@wearetheoutdoorindustry.com
      </p>
      <p style={{ color: `${CREAM}77` }} className="mt-8 text-xs italic max-w-md mx-auto">
        Payment can route through our nonprofit arm if that helps your team.
      </p>
      <div style={{ borderTop: `1px solid ${CREAM}22` }} className="mt-16 pt-6">
        <a
          href="https://basecampoutdoorevents.com"
          style={{ color: `${CREAM}88` }}
          className="text-xs tracking-[0.2em] uppercase hover:opacity-100"
        >
          basecampoutdoorevents.com
        </a>
      </div>
    </div>
  </section>
);

const MN26Brands = () => {
  const personalization = usePersonalization();
  return (
    <div style={{ background: TEAL, ...font }} className="min-h-screen">
      <Hero />
      <Tiers />
      <Mockups personalization={personalization} />
      <WhyWorthIt />
      <FinalCTA />
    </div>
  );
};

export default MN26Brands;
