import { useState } from "react";
import { EditableTextProvider } from "@/components/EditableTextProvider";
import EditableText from "@/components/EditableText";
import PageMetaApplier from "@/components/event/PageMetaApplier";
import OrderedSections from "@/components/event/OrderedSections";
import SiteFooter from "@/components/SiteFooter";
import MentorExpertStrip from "@/components/mentor-network/MentorExpertStrip";
import ExpertIntakeForm from "@/components/experts/ExpertIntakeForm";
import hbcusOutsideLogo from "@/assets/mentor-network/hbcus-outside.png";
import heroAsset from "@/assets/mentor-network/hero.jpg.asset.json";

const PAGE_SLUG = "mentor-experts";
const CITY_SLUG = "mentor-network";
const CITY_NAME = "Mentor Network";

const C = {
  forest: "#12241c",
  forestDeep: "#0c1913",
  moss: "#2d5a3d",
  clay: "#c4654a",
  gold: "#e8c07a",
  cream: "#f5efe3",
  creamDim: "rgba(245,239,227,0.72)",
};

const display: React.CSSProperties = {
  fontFamily: "'Archivo Black', 'Hind', system-ui, sans-serif",
  letterSpacing: "-0.02em",
  lineHeight: 1.04,
};
const body: React.CSSProperties = { fontFamily: "'Hind', system-ui, sans-serif" };

const Fonts = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Hind:wght@300;400;500;600;700&display=swap');`}</style>
);

const T = ({ k, d, multiline }: { k: string; d: string; multiline?: boolean }) => (
  <EditableText settingKey={k} defaultText={d} as="span" multiline={multiline} />
);

const Eyebrow = ({ k, d, tone = C.gold }: { k: string; d: string; tone?: string }) => (
  <p className="text-[10px] sm:text-[11px] font-bold uppercase" style={{ ...body, letterSpacing: "0.24em", color: tone }}>
    <T k={k} d={d} />
  </p>
);

const scrollToForm = () =>
  document.getElementById("mentor-card-form")?.scrollIntoView({ behavior: "smooth", block: "start" });

/* --------------------------------- hero --------------------------------- */

const Hero = () => (
  <section className="relative overflow-hidden" style={{ background: C.forestDeep }}>
    <div className="absolute inset-0">
      <img src={heroAsset.url} alt="Outdoor industry professionals talking together" className="h-full w-full object-cover" />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(100deg, ${C.forestDeep}f7 0%, ${C.forestDeep}e6 50%, ${C.forest}96 100%)` }}
      />
    </div>
    <div className="relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <div className="max-w-3xl">
        <img src={hbcusOutsideLogo} alt="HBCUs Outside" className="mb-8 h-14 w-auto sm:h-16" />
        <Eyebrow k="hero_eyebrow" d="BASECAMP INDUSTRY EXPERT · MENTOR NETWORK" />
        <h1 className="mt-5 text-[34px] sm:text-[52px]" style={{ ...display, color: C.cream }}>
          <T k="hero_headline" d="Be the person a student calls when it counts." multiline />
        </h1>
        <p className="mt-6 max-w-2xl text-base sm:text-lg" style={{ ...body, color: C.creamDim, lineHeight: 1.6 }}>
          <T
            k="hero_subhead"
            d="An Industry Expert gives 1 to 2 hours a month for 10 months to one HBCU student heading into the outdoor industry. Build your card below and you're on the roster."
            multiline
          />
        </p>
        <button
          type="button"
          onClick={scrollToForm}
          className="mt-9 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-[0.14em] transition-transform hover:scale-[1.03]"
          style={{ ...body, background: C.clay, color: "#fff" }}
        >
          <T k="hero_cta" d="I'm in, build my card" />
        </button>
      </div>
    </div>
  </section>
);

/* -------------------------------- what -------------------------------- */

const PERKS = [
  {
    key: "match",
    title: "One student, one year",
    body: "You get matched with one HBCU student, then meet 1 to 2 hours a month across the academic year. No curriculum to write.",
  },
  {
    key: "card",
    title: "Your own expert card",
    body: "Your profile goes live on the mentor network page, the same card system we run at Basecamp events across the country.",
  },
  {
    key: "network",
    title: "The room around it",
    body: "You join a roster of outdoor industry people already giving their time, plus invitations to Basecamp gatherings near you.",
  },
];

const WhatItMeans = () => (
  <section className="px-5 py-20 sm:px-8 sm:py-24" style={{ background: C.forest }}>
    <div className="mx-auto max-w-6xl">
      <Eyebrow k="what_eyebrow" d="WHAT YOU'RE SIGNING UP FOR" />
      <h2 className="mt-4 max-w-3xl text-[26px] sm:text-[40px]" style={{ ...display, color: C.cream }}>
        <T k="what_headline" d="An Industry Expert is someone willing to answer the phone once a month." />
      </h2>
      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {PERKS.map((p) => (
          <article
            key={p.key}
            className="rounded-2xl p-7"
            style={{ background: "rgba(245,239,227,0.06)", border: "1px solid rgba(232,192,122,0.28)" }}
          >
            <h3 className="text-[19px]" style={{ ...display, color: C.cream }}>
              <T k={`what_${p.key}_title`} d={p.title} />
            </h3>
            <p className="mt-3 text-[15px]" style={{ ...body, color: C.creamDim, lineHeight: 1.6 }}>
              <T k={`what_${p.key}_body`} d={p.body} multiline />
            </p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------- the room ------------------------------- */

const TheRoom = () => (
  <section className="px-5 py-20 sm:px-8 sm:py-24" style={{ background: C.forestDeep }}>
    <div className="mx-auto max-w-5xl text-center">
      <Eyebrow k="room_eyebrow" d="THE ROOM YOU'RE JOINING" />
      <h2 className="mt-4 text-[26px] sm:text-[38px]" style={{ ...display, color: C.cream }}>
        <T k="room_headline" d="Real experts. Real companies." />
      </h2>
      <div className="mt-10">
        <MentorExpertStrip />
      </div>
    </div>
  </section>
);

/* --------------------------------- form --------------------------------- */

const FormSection = () => {
  const [done, setDone] = useState(false);
  return (
    <section id="mentor-card-form" className="px-5 py-20 sm:px-8 sm:py-24" style={{ background: C.cream }}>
      <div className="mx-auto max-w-4xl">
        <h2 className="text-[26px] sm:text-[38px]" style={{ ...display, color: C.forest }}>
          <T k="form_headline" d="Build your Industry Expert card" />
        </h2>
        <p className="mt-4 max-w-2xl text-[15px]" style={{ ...body, color: "rgba(18,36,28,0.72)", lineHeight: 1.6 }}>
          <T
            k="form_subhead"
            d="Takes about five minutes. Enter your full name and give it a second, if you already have a card it will pop up so you can edit it."
            multiline
          />
        </p>
        <div className="mt-10">
          {done ? (
            <p className="text-base font-semibold" style={{ ...body, color: C.moss }}>
              <T k="form_done" d="Got it. You're on the mentor roster. We'll be in touch as matching opens." />
            </p>
          ) : (
            <ExpertIntakeForm
              citySlug={CITY_SLUG}
              cityName={CITY_NAME}
              onComplete={() => setDone(true)}
            />
          )}
        </div>
      </div>
    </section>
  );
};

/* --------------------------------- page --------------------------------- */

const MentorExpertsInner = () => (
  <div style={{ background: C.forest }}>
    <Fonts />
    <PageMetaApplier title="Become a Mentor | Basecamp Industry Expert Mentor Network" />
    <OrderedSections
      sections={[
        { key: "hero", content: <Hero /> },
        { key: "what-it-means", content: <WhatItMeans /> },
        { key: "the-room", content: <TheRoom /> },
        { key: "form", content: <FormSection /> },
        { key: "footer", content: <SiteFooter /> },
      ]}
    />
  </div>
);

const MentorExperts = () => (
  <EditableTextProvider pageSlug={PAGE_SLUG}>
    <MentorExpertsInner />
  </EditableTextProvider>
);

export default MentorExperts;
