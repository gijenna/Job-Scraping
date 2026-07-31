import { EditableTextProvider } from "@/components/EditableTextProvider";
import EditableText from "@/components/EditableText";
import PageMetaApplier from "@/components/event/PageMetaApplier";
import OrderedSections from "@/components/event/OrderedSections";
import SiteFooter from "@/components/SiteFooter";
import SponsorExpertRow from "@/components/sponsor-mentor/SponsorExpertRow";
import SponsorTierForm from "@/components/sponsor-mentor/SponsorTierForm";
import NewsletterProof from "@/components/sponsor-mentor/NewsletterProof";
import hbcusOutsideLogo from "@/assets/mentor-network/hbcus-outside.png";
import sierraClubLogo from "@/assets/mentor-network/sierra-club.png";
import ncobsLogo from "@/assets/mentor-network/ncobs.png";
import basecampGreen from "@/assets/mentor-network/basecamp-green.png";
import heroAsset from "@/assets/mn26/Copy_of_AnthonyMarz_Basecamp-183.jpg.asset.json";

const PAGE_SLUG = "sponsor-a-mentor";

const C = {
  forest: "#12241c",
  forestDeep: "#0c1913",
  moss: "#2d5a3d",
  clay: "#c4654a",
  gold: "#e8c07a",
  cream: "#f5efe3",
  creamDim: "rgba(245,239,227,0.72)",
};

const body: React.CSSProperties = { fontFamily: "'Hind', system-ui, sans-serif" };
const display: React.CSSProperties = {
  fontFamily: "'Archivo Black', 'Hind', system-ui, sans-serif",
  letterSpacing: "-0.02em",
  lineHeight: 1.05,
};

const T = ({
  k,
  d,
  multiline,
}: {
  k: string;
  d: string;
  multiline?: boolean;
}) => <EditableText settingKey={k} defaultText={d} as="span" multiline={multiline} />;

const Eyebrow = ({ k, d, color = C.gold }: { k: string; d: string; color?: string }) => (
  <p
    className="text-[10px] font-bold uppercase sm:text-[11px]"
    style={{ ...body, letterSpacing: "0.24em", color }}
  >
    <T k={k} d={d} />
  </p>
);

const scrollToOffer = () => {
  document.getElementById("the-offer")?.scrollIntoView({ behavior: "smooth", block: "start" });
};

/* --------------------------------- 1. hero -------------------------------- */

const Hero = () => (
  <section className="relative overflow-hidden px-6 py-24 sm:py-32" style={{ background: C.forestDeep }}>
    <img
      src={heroAsset.url}
      alt="Outdoor industry professional smiling in conversation with a recruiter"
      className="absolute inset-0 h-full w-full object-cover"
      style={{ transform: "scaleX(-1)" }}
    />
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(90deg, rgba(12,25,19,0.95) 0%, rgba(12,25,19,0.88) 45%, rgba(12,25,19,0.35) 100%)",
      }}
    />
    <div className="relative mx-auto max-w-4xl">
      <Eyebrow k="hero_eyebrow" d="FOR BRANDS" />
      <h1 className="mt-5 max-w-3xl text-[30px] sm:text-[46px]" style={{ ...display, color: C.cream }}>
        <T
          k="hero_headline"
          d="The brands that actually diversify this industry aren't the ones with the best statement. They're the ones with a mentor on the roster."
          multiline
        />
      </h1>
      <p className="mt-6 max-w-2xl text-base sm:text-lg" style={{ ...body, color: C.creamDim, lineHeight: 1.6 }}>
        <T
          k="hero_subhead"
          d="The most underrated diversity tool in this industry isn't a program. It's a person willing to answer the phone once a month."
          multiline
        />
      </p>
      <button
        type="button"
        onClick={scrollToOffer}
        className="mt-9 rounded-full px-8 py-3.5 text-sm font-bold uppercase tracking-[0.14em] transition-transform hover:scale-[1.03]"
        style={{ ...body, background: C.clay, color: "#fff" }}
      >
        <T k="hero_cta" d="Get involved" />
      </button>
    </div>
  </section>
);

/* ------------------------------ 2. who's in ------------------------------ */

const WhosIn = () => (
  <section className="px-6 py-20 sm:py-24" style={{ background: C.forest }}>
    <div className="mx-auto max-w-6xl">
      <Eyebrow k="whosin_eyebrow" d="WHO'S ALREADY IN THE NETWORK" />
      <h2 className="mt-4 text-[26px] sm:text-[38px]" style={{ ...display, color: C.cream }}>
        <T k="whosin_headline" d="This is what the program can look like." />
      </h2>
      <p className="mt-4 max-w-2xl text-base" style={{ ...body, color: C.creamDim, lineHeight: 1.6 }}>
        <T
          k="whosin_intro"
          d="A preview from our existing Industry Expert network, real mentors, real companies."
        />
      </p>

      <div className="mt-10">
        <SponsorExpertRow />
      </div>

      <p className="mt-8 max-w-2xl text-sm" style={{ ...body, color: "rgba(245,239,227,0.55)" }}>
        <T
          k="whosin_caption"
          d="These are examples from our existing expert network. HBCU mentor assignments open once the program launches."
          multiline
        />
      </p>
    </div>
  </section>
);

/* ------------------------------ 3. stat band ------------------------------ */

const StatBanner = () => (
  <section className="px-6 py-20 sm:py-28" style={{ background: C.clay }}>
    <div className="mx-auto max-w-4xl text-center">
      <p className="text-[30px] sm:text-[52px]" style={{ ...display, color: "#fff" }}>
        <T k="stat_line" d="Twenty mentors. One measurably more diverse industry." />
      </p>
    </div>
  </section>
);

/* -------------------------------- 4. the ask ------------------------------- */

const ASK_CARDS = [
  {
    key: "mentor",
    title: "Provide a mentor",
    body: "Put someone from your team on the roster as a Mentor Partner. 1 to 2 hours a month, 10 months, one HBCU student.",
  },
  {
    key: "sponsor",
    title: "Sponsor the program",
    body: "Fund the mentor network directly. Your name goes up alongside Sierra Club, North Carolina Outward Bound School, HBCUs Outside, and Basecamp.",
  },
];

const TheAsk = () => (
  <section className="px-6 py-20 sm:py-24" style={{ background: C.cream }}>
    <div className="mx-auto max-w-5xl">
      <Eyebrow k="ask_eyebrow" d="HOW THIS WORKS" color={C.clay} />
      <p className="mt-5 max-w-3xl text-base sm:text-lg" style={{ ...body, color: C.forest, lineHeight: 1.65 }}>
        <T
          k="ask_body"
          d="Sierra Club, North Carolina Outward Bound School, and REI Cooperative Action Fund already covered the October training that kicked this off. What happens after October, the year of mentorship that keeps these students connected to the industry, needs people and it needs funding. Two ways in, both detailed below:"
          multiline
        />
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {ASK_CARDS.map((c) => (
          <div
            key={c.key}
            className="rounded-2xl p-7"
            style={{ background: "#fff", border: `1px solid rgba(18,36,28,0.12)` }}
          >
            <h3 className="text-[20px]" style={{ ...display, color: C.forest }}>
              <T k={`ask_${c.key}_title`} d={c.title} />
            </h3>
            <p className="mt-3 text-[15px]" style={{ ...body, color: "rgba(18,36,28,0.75)", lineHeight: 1.6 }}>
              <T k={`ask_${c.key}_body`} d={c.body} multiline />
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------- 5. the offer ------------------------------ */

const TIERS = [
  {
    key: "mentor_partner",
    name: "Mentor Partner",
    price: "$1,000",
    items: [
      "Your logo on the mentor network page",
      "Provide one mentor, your team member matched with an HBCU student for the year",
      "A Mentor Partner card, the same visual system as our Industry Expert cards, official and shareable, real proof you're one of the brands backing this",
    ],
    dark: false,
  },
  {
    key: "megaphone_partner",
    name: "Megaphone Partner",
    price: "$5,000",
    lead: "Everything in Mentor Partner, plus:",
    items: [
      "A dedicated feature in the newsletter",
      "A dedicated social post",
      "A full storytelling piece on your involvement, the same custom content format sold on its own elsewhere, bundled in here",
    ],
    dark: true,
  },
];

const TheOffer = () => (
  <section id="the-offer" className="px-6 py-20 sm:py-24" style={{ background: C.forest }}>
    <div className="mx-auto max-w-6xl">
      <Eyebrow k="offer_eyebrow" d="THE OFFER" />
      <h2 className="mt-4 max-w-3xl text-[26px] sm:text-[40px]" style={{ ...display, color: C.cream }}>
        <T k="offer_headline" d="Use your DEI budget on a program that actually creates change." />
      </h2>
      <p className="mt-5 max-w-3xl text-base sm:text-lg" style={{ ...body, color: C.creamDim, lineHeight: 1.6 }}>
        <T
          k="offer_subhead"
          d="Everything here is already built. Already funded through October. Already backed by three national partners. You're not starting a program, you're funding one that already works."
          multiline
        />
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {TIERS.map((t) => (
          <div
            key={t.key}
            className="flex flex-col rounded-2xl p-8"
            style={{
              background: t.dark ? C.forestDeep : C.cream,
              border: `1px solid ${t.dark ? "rgba(232,192,122,0.35)" : "rgba(18,36,28,0.12)"}`,
            }}
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-[22px]" style={{ ...display, color: t.dark ? C.cream : C.forest }}>
                <T k={`tier_${t.key}_name`} d={t.name} />
              </h3>
              <span className="text-[24px]" style={{ ...display, color: t.dark ? C.gold : C.clay }}>
                <T k={`tier_${t.key}_price`} d={t.price} />
              </span>
            </div>

            {t.lead && (
              <p
                className="mt-4 text-[13px] font-bold uppercase"
                style={{ ...body, letterSpacing: "0.14em", color: t.dark ? C.gold : C.clay }}
              >
                <T k={`tier_${t.key}_lead`} d={t.lead} />
              </p>
            )}

            <ul className="mt-5 space-y-4">
              {t.items.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: t.dark ? C.gold : C.clay }}
                  />
                  <span
                    className="text-[15px]"
                    style={{
                      ...body,
                      color: t.dark ? C.creamDim : "rgba(18,36,28,0.78)",
                      lineHeight: 1.6,
                    }}
                  >
                    <T k={`tier_${t.key}_item_${i}`} d={item} multiline />
                  </span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() =>
                document.getElementById("sponsor-form")?.scrollIntoView({ behavior: "smooth" })
              }
              className="mt-8 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] transition-transform hover:scale-[1.02]"
              style={{ ...body, background: C.clay, color: "#fff" }}
            >
              <T k={`tier_${t.key}_cta`} d="Start here" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-2xl p-6 sm:p-8" style={{ background: C.cream }}>
        <p className="mb-6 text-[13px] font-bold uppercase" style={{ ...body, letterSpacing: "0.18em", color: C.clay }}>
          <T k="offer_news_label" d="What the Megaphone feature looks like" />
        </p>
        <NewsletterProof />
      </div>
    </div>
  </section>
);

/* ---------------------------- 6. standing with ---------------------------- */

const PARTNERS: { key: string; name: string; logo: string; darkTile?: boolean }[] = [
  { key: "sierra", name: "Sierra Club", logo: sierraClubLogo },
  { key: "ncobs", name: "North Carolina Outward Bound School", logo: ncobsLogo },
  { key: "hbcus", name: "HBCUs Outside", logo: hbcusOutsideLogo, darkTile: true },
  { key: "basecamp", name: "Basecamp Outdoor", logo: basecampGreen },
];

const StandingWith = () => (
  <section className="px-6 py-20 sm:py-24" style={{ background: C.cream }}>
    <div className="mx-auto max-w-5xl text-center">
      <Eyebrow k="partners_eyebrow" d="AN ESTABLISHED PARTNERSHIP" color={C.clay} />
      <div className="mt-10 grid grid-cols-2 items-center gap-8 sm:grid-cols-4">
        {PARTNERS.map((p) => (
          <div
            key={p.key}
            className="flex h-20 items-center justify-center rounded-xl px-3"
            style={p.darkTile ? { background: C.forest } : undefined}
          >
            <img
              src={p.logo}
              alt={p.name}
              className="max-h-16 max-w-[80%] object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <p className="mt-10 text-base" style={{ ...body, color: "rgba(18,36,28,0.7)" }}>
        <T k="partners_line" d="Established partnership, not a first-time ask." />
      </p>
    </div>
  </section>
);

/* -------------------------------- 7. form -------------------------------- */

const FormSection = () => (
  <section id="sponsor-form" className="px-6 py-20 sm:py-24" style={{ background: C.forest }}>
    <div className="mx-auto max-w-2xl">
      <h2 className="text-center text-[26px] sm:text-[36px]" style={{ ...display, color: C.cream }}>
        <T k="form_headline" d="Put your name on the thing that actually works." />
      </h2>
      <div className="mt-10">
        <SponsorTierForm />
      </div>
    </div>
  </section>
);

/* --------------------------------- page ---------------------------------- */

const SponsorAMentorInner = () => (
  <div style={{ background: C.forest }}>
    <PageMetaApplier title="Sponsor a Mentor | Basecamp Outdoor" />
    <OrderedSections
      sections={[
        { key: "hero", content: <Hero /> },
        { key: "whos-in", content: <WhosIn /> },
        { key: "stat-banner", content: <StatBanner /> },
        { key: "the-ask", content: <TheAsk /> },
        { key: "the-offer", content: <TheOffer /> },
        { key: "standing-with", content: <StandingWith /> },
        { key: "form", content: <FormSection /> },
        { key: "footer", content: <SiteFooter /> },
      ]}
    />
  </div>
);

const SponsorAMentor = () => (
  <EditableTextProvider pageSlug={PAGE_SLUG}>
    <SponsorAMentorInner />
  </EditableTextProvider>
);

export default SponsorAMentor;
