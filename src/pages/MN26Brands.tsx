import { useMemo, useRef, useState } from "react";
import basecampLogo from "@/assets/basecamp-outdoor-logo.png";
import loungePhoto from "@/assets/mn26/AnthonyMarz_Basecamp-169.jpg.asset.json";
import heroPhoto from "@/assets/mn26/AnthonyMarz_Basecamp-094.jpg.asset.json";
import { EditableTextProvider } from "@/components/EditableTextProvider";
import EditableText from "@/components/EditableText";

const TEAL = "#19363B";
const CORAL = "#ED7660";
const GOLD = "#E1B624";
const CREAM = "#E6E1CE";
const SAGE = "#809482";

const font = { fontFamily: "'Josefin Sans', sans-serif" } as const;

// Shorthand editable text (span by default)
const T = ({
  k,
  d,
  as,
  className,
  style,
  multiline,
}: {
  k: string;
  d: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
}) => (
  <EditableText
    settingKey={k}
    defaultText={d}
    as={as}
    className={className}
    style={style}
    multiline={multiline}
  />
);

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
        <T k="pers.prompt" d="Want to see YOUR brand in the room? Add your name and logo." />
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

const FACT_KEYS: Array<[string, string, string]> = [
  ["fact.event.label", "Event", "OR Gatherings at the Basecamp Outdoor Lounge"],
  ["fact.date.label", "Date", "Thursday, August 20, 2026"],
  ["fact.time.label", "Time", "10:30am–12:30pm"],
  ["fact.location.label", "Location", "Minneapolis Convention Center, inside Outdoor Retailer"],
  ["fact.cost.label", "Cost", "Free to attend, no OR badge needed"],
];

const Hero = () => (
  <>
    <section style={{ background: TEAL, ...font }} className="px-6 pt-16 pb-14 md:pt-20 md:pb-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center">
        <div>
          <p style={{ color: GOLD }} className="text-xs md:text-sm tracking-[0.3em] uppercase font-medium">
            <T k="hero.eyebrow" d="Basecamp Outdoor Lounge · OR Minneapolis 2026" />
          </p>
          <h1
            style={{ color: CREAM, fontWeight: 300, letterSpacing: "-0.02em" }}
            className="mt-5 text-5xl md:text-6xl leading-[1.02]"
          >
            <T k="hero.headline.a" d="See your brand" as="span" />
            <br />
            <T k="hero.headline.b" d="in the room." as="span" style={{ fontWeight: 600 }} />
          </h1>
          <p style={{ color: CREAM, fontWeight: 400 }} className="mt-5 text-lg md:text-xl font-light">
            <T k="hero.sub" d="Some brands buy a booth. You could build a reputation instead." />
          </p>
          <div style={{ color: `${CREAM}cc` }} className="mt-5 text-base md:text-lg leading-relaxed font-light space-y-3">
            <p><T k="hero.body.1" d="OR Gatherings is our signature event, and your brand can power it." /></p>
            <p><T k="hero.body.2" d="Your people sit down with the next generation of the industry, and you become the brand that showed up for the community." /></p>
          </div>
        </div>
        <div className="relative">
          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              border: `1px solid ${CREAM}22`,
              boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
            }}
            className="aspect-[4/5] md:aspect-[4/5]"
          >
            <img
              src={heroPhoto.url}
              alt="People connecting at the Basecamp Outdoor Lounge"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    {/* Facts strip */}
    <section style={{ background: CREAM, borderTop: `1px solid ${TEAL}18`, borderBottom: `1px solid ${TEAL}18`, ...font }} className="px-6 py-8 md:py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4">
        {FACT_KEYS.map(([lk, ld, vd], i) => (
          <div key={lk} style={{ borderLeft: `2px solid ${CORAL}` }} className="pl-4">
            <div style={{ color: CORAL }} className="text-[10px] tracking-[0.25em] uppercase font-semibold">
              <T k={lk} d={ld} />
            </div>
            <div style={{ color: TEAL }} className="mt-1.5 text-sm md:text-[15px] font-medium leading-snug">
              <T k={`fact.${i}.value`} d={vd} />
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Model context line */}
    <section style={{ background: CREAM, ...font }} className="px-6 pb-8 md:pb-10">
      <div className="max-w-4xl mx-auto text-center">
        <p style={{ color: `${TEAL}cc` }} className="text-base md:text-lg font-light italic">
          <T k="hero.model" d="We line up the experts. Brands get to support theirs and share the spotlight." />
        </p>
      </div>
    </section>
  </>
);

const TierCard = ({
  nameKey,
  nameDefault,
  priceKey,
  priceDefault,
  copyKey,
  copyDefault,
  highlight,
}: {
  nameKey: string;
  nameDefault: string;
  priceKey: string;
  priceDefault: string;
  copyKey: string;
  copyDefault: string;
  highlight?: boolean;
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
    <div className="min-h-[3rem] md:min-h-[3.5rem]">
      <h3 style={{ color: TEAL, fontWeight: 600 }} className="text-2xl md:text-3xl uppercase tracking-wide">
        <T k={nameKey} d={nameDefault} as="span" />
      </h3>
    </div>
    <p style={{ color: highlight ? CORAL : TEAL, fontWeight: 300 }} className="text-4xl md:text-5xl mt-2">
      <T k={priceKey} d={priceDefault} as="span" />
    </p>
    <div
      style={{ color: `${TEAL}dd` }}
      className="mt-5 text-[15px] md:text-base leading-relaxed font-light"
    >
      <T k={copyKey} d={copyDefault} multiline />
    </div>
  </div>
);

const Tiers = () => (
  <section style={{ background: CREAM, ...font }} className="px-6 pt-6 pb-14 md:pt-8 md:pb-20">
    <div className="max-w-6xl mx-auto">
      <h2 style={{ color: TEAL, fontWeight: 300 }} className="text-3xl md:text-5xl">
        <T k="tiers.title.a" d="Three ways to " as="span" />
        <T k="tiers.title.b" d="partner." as="span" style={{ fontWeight: 600 }} />
      </h2>
      <div className="mt-8 grid md:grid-cols-3 gap-6 items-stretch">
        <TierCard
          nameKey="tier.a.name"
          nameDefault="Bring Your Expert"
          priceKey="tier.a.price"
          priceDefault="$1,500"
          copyKey="tier.a.copy"
          copyDefault="Your expert's generosity, working for your brand. Become the name top talent remembers."
        />
        <TierCard
          nameKey="tier.b.name"
          nameDefault="Lounge Partner"
          priceKey="tier.b.price"
          priceDefault="$5,000"
          copyKey="tier.b.copy"
          copyDefault="Own the room the whole industry wants into. Recruiting, reputation, and reach without a booth."
        />
        <TierCard
          nameKey="tier.c.name"
          nameDefault="Title Partner"
          priceKey="tier.c.price"
          priceDefault="$20,000"
          copyKey="tier.c.copy"
          copyDefault="Own the whole activation: the Lounge, the Slow Roll ride, and top billing. Fund free show access for 100 people who couldn't otherwise attend, and be known for it."
          highlight
        />
      </div>

      <ComparisonTable />

      <p style={{ color: CORAL, ...font }} className="mt-6 text-center italic text-sm md:text-base font-light max-w-3xl mx-auto">
        <T k="tiers.footnote" d="At $5,000 the team badges alone can exceed the price. $1,200 each, so three people is $3,600 in access before the $2,000 newsletter feature or the all-show presence. Title Partner scales the whole thing up from there." />
      </p>
    </div>
  </section>
);

const ROW_KEYS: Array<{ k: string; label: string; a: string; b: string; c: string }> = [
  { k: "row.expert", label: "Your expert in the lineup", a: "1 expert", b: "Your whole team", c: "Your whole team" },
  { k: "row.badges", label: "Team badges (OR show + after-party access, $1,200 ea)", a: "—", b: "✓", c: "✓" },
  { k: "row.logo", label: "Logo on the event page", a: "✓", b: "✓", c: "✓" },
  { k: "row.newsletter", label: "Newsletter", a: "Mention", b: "Feature ($2,000 value)", c: "Feature ($2,000 value)" },
  { k: "row.list", label: "Post-event attendee list (opt-ins, 90%+)", a: "✓", b: "✓", c: "✓" },
  { k: "row.social", label: "Social post", a: "—", b: "✓", c: "✓" },
  { k: "row.presence", label: "Present in the Lounge", a: "OR Gatherings event", b: "All show (Thu+Fri)", c: "All show (Thu+Fri)" },
  { k: "row.hightop", label: "Branded high-top (brand provided)", a: "—", b: "✓", c: "✓" },
  { k: "row.activation", label: "Your own activation (craft bar, e-bike, etc.)", a: "—", b: "✓", c: "✓" },
  { k: "row.slot", label: "Peak expert time slot", a: "—", b: "✓", c: "✓" },
  { k: "row.giveaway", label: "Option to participate in after-party giveaway", a: "—", b: "✓ ($500 add-on)", c: "✓" },
  { k: "row.slowroll", label: "Slow Roll community bike ride access", a: "Digital shoutout only", b: "✓ physical slots", c: "✓ physical slots" },
  { k: "row.fund100", label: "Funds free show access for 100 community members", a: "—", b: "—", c: "✓" },
  { k: "row.topbilling", label: "Top billing: presented by [Your Brand]", a: "—", b: "—", c: "✓" },
  { k: "row.renewal", label: "First right of renewal next year", a: "—", b: "—", c: "✓" },
];

const cellClass = (v: string) => {
  if (v === "✓" || v.startsWith("✓")) return "font-semibold";
  if (v === "—") return "opacity-40";
  return "font-medium";
};

const ComparisonTable = () => (
  <div className="mt-12">
    {/* Desktop */}
    <div
      style={{ background: "#fff", border: `1px solid ${TEAL}22`, borderRadius: 16, ...font }}
      className="hidden md:block overflow-hidden"
    >
      <div className="grid grid-cols-[1.5fr_1fr_1fr]">
        <div style={{ color: TEAL }} className="px-6 py-5 text-xs uppercase tracking-[0.2em] font-semibold">
          <T k="table.head" d="What's included" />
        </div>
        <div style={{ color: `${TEAL}99`, background: `${SAGE}18` }} className="px-6 py-5 text-center">
          <div className="text-xs uppercase tracking-[0.2em] font-medium">
            <T k="tier.a.name" d="Bring Your Expert" />
          </div>
          <div style={{ fontWeight: 300 }} className="text-2xl mt-1">
            <T k="tier.a.price" d="$1,500" />
          </div>
        </div>
        <div style={{ color: TEAL, background: `${CORAL}20` }} className="px-6 py-5 text-center">
          <div style={{ color: CORAL }} className="text-xs uppercase tracking-[0.2em] font-semibold">
            <T k="tier.b.name" d="Lounge Partner" />
          </div>
          <div style={{ fontWeight: 600 }} className="text-2xl mt-1">
            <T k="tier.b.price" d="$5,000" />
          </div>
        </div>
      </div>
      {ROW_KEYS.map((r, i) => (
        <div
          key={r.k}
          style={{ borderTop: `1px solid ${TEAL}15` }}
          className="grid grid-cols-[1.5fr_1fr_1fr]"
        >
          <div style={{ color: TEAL }} className="px-6 py-4 text-sm font-light">
            <T k={`${r.k}.label`} d={r.label} />
          </div>
          <div
            style={{ color: `${TEAL}bb`, background: i % 2 ? `${SAGE}10` : `${SAGE}18` }}
            className={`px-6 py-4 text-center text-sm ${cellClass(r.a)}`}
          >
            <T k={`${r.k}.a`} d={r.a} />
          </div>
          <div
            style={{ color: TEAL, background: i % 2 ? `${CORAL}12` : `${CORAL}20` }}
            className={`px-6 py-4 text-center text-sm ${cellClass(r.b)}`}
          >
            <T k={`${r.k}.b`} d={r.b} />
          </div>
        </div>
      ))}
    </div>

    {/* Mobile: stacked per-tier */}
    <div className="md:hidden space-y-6">
      {[
        { title: "Bring Your Expert", price: "$1,500", nameKey: "tier.a.name", priceKey: "tier.a.price", col: "a" as const, bg: `${SAGE}18`, accent: SAGE },
        { title: "Lounge Partner", price: "$5,000", nameKey: "tier.b.name", priceKey: "tier.b.price", col: "b" as const, bg: `${CORAL}18`, accent: CORAL },
      ].map((tier) => (
        <div
          key={tier.title}
          style={{ background: "#fff", border: `1px solid ${tier.accent}55`, borderRadius: 14, ...font }}
          className="overflow-hidden"
        >
          <div style={{ background: tier.bg, color: TEAL }} className="px-5 py-4">
            <div style={{ color: tier.accent }} className="text-[10px] uppercase tracking-[0.2em] font-semibold">
              <T k={tier.nameKey} d={tier.title} />
            </div>
            <div style={{ fontWeight: 600 }} className="text-2xl mt-0.5">
              <T k={tier.priceKey} d={tier.price} />
            </div>
          </div>
          <div className="divide-y" style={{ borderColor: `${TEAL}15` }}>
            {ROW_KEYS.map((r) => {
              const v = r[tier.col];
              return (
                <div key={r.k} className="flex justify-between gap-3 px-5 py-3">
                  <span style={{ color: `${TEAL}cc` }} className="text-sm font-light">
                    <T k={`${r.k}.label`} d={r.label} />
                  </span>
                  <span style={{ color: TEAL }} className={`text-sm ${cellClass(v)}`}>
                    <T k={`${r.k}.${tier.col}`} d={v} />
                  </span>
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
          <T k="mock.eyebrow" d="See it live" />
        </p>
        <h2 style={{ color: CREAM, fontWeight: 300 }} className="mt-3 text-3xl md:text-5xl">
          <T k="mock.title.a" d="See how you'll " as="span" />
          <T k="mock.title.b" d="show up." as="span" style={{ fontWeight: 600 }} />
        </h2>
        <p style={{ color: `${CREAM}99` }} className="mt-4 max-w-2xl text-base font-light">
          {personalization.active
            ? `Previewing with ${brand.name}. Nothing is saved, this is just for you.`
            : "Previewing with Basecamp Outdoor. Add your brand below to see it swap in."}
        </p>

        <div className="mt-8 max-w-3xl">
          <h3 style={{ color: CREAM, fontWeight: 400 }} className="text-lg md:text-xl mb-3 font-light">
            <T k="mock.personalize.heading" d="Want to see your brand in the room? Add your name and logo." />
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
        <T k="why.eyebrow" d="Why it's worth it" />
      </p>
      <h2 style={{ color: TEAL, fontWeight: 300 }} className="mt-3 text-3xl md:text-5xl">
        <T k="why.title" d="A booth costs more, does less." />
      </h2>
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div style={{ background: "#fff", border: `1px solid ${TEAL}22`, borderRadius: 14 }} className="p-6">
          <div style={{ color: CORAL, fontWeight: 600 }} className="text-4xl">
            <T k="why.a.stat" d="$5,000 to $8,000" />
          </div>
          <p style={{ color: `${TEAL}bb` }} className="mt-3 text-sm font-light leading-relaxed">
            <T k="why.a.body" d="OR floor space alone, before build-out, freight, and staff. Then you're on your own for programming." multiline />
          </p>
        </div>
        <div style={{ background: TEAL, borderRadius: 14 }} className="p-6">
          <div style={{ color: GOLD, fontWeight: 600 }} className="text-4xl">
            <T k="why.b.stat" d="300K community" />
          </div>
          <p style={{ color: `${CREAM}cc` }} className="mt-3 text-sm font-light leading-relaxed">
            <T k="why.b.body" d="70K newsletter, 180K social. Brand presence, recruiting, and content reach. You walk right in with none of the setup." multiline />
          </p>
        </div>
      </div>
    </div>
  </section>
);

const FinalCTA = () => (
  <section style={{ background: TEAL, ...font }} className="px-6 py-24 md:py-32">
    <div className="max-w-3xl mx-auto text-center">
      <h2 style={{ color: CREAM, fontWeight: 300 }} className="text-4xl md:text-6xl leading-tight">
        <T k="cta.title.a" d="Let's get your brand" as="span" />
        <br />
        <T k="cta.title.b" d="in the room." as="span" style={{ fontWeight: 600 }} />
      </h2>
      <a
        href="mailto:jenna@wearetheoutdoorindustry.com?subject=Basecamp Outdoor Lounge Partnership"
        style={{ background: CORAL, color: "#fff", ...font }}
        className="inline-block mt-10 px-8 py-4 rounded-md text-base font-semibold hover:opacity-90 transition"
      >
        <T k="cta.button" d="Email Jenna" />
      </a>
      <p style={{ color: `${CREAM}aa` }} className="mt-6 text-sm">
        jenna@wearetheoutdoorindustry.com
      </p>
      <p style={{ color: `${CREAM}77` }} className="mt-8 text-xs italic max-w-md mx-auto">
        <T k="cta.note" d="Payment can route through our nonprofit arm if that helps your team." />
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
    <EditableTextProvider pageSlug="minneapolis26-brands">
      <div style={{ background: TEAL, ...font }} className="min-h-screen">
        <Hero />
        <Tiers />
        <Mockups personalization={personalization} />
        <WhyWorthIt />
        <FinalCTA />
      </div>
    </EditableTextProvider>
  );
};

export default MN26Brands;
