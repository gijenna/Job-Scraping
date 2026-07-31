import { useState } from "react";
import { EditableTextProvider } from "@/components/EditableTextProvider";
import EditableText from "@/components/EditableText";
import PageMetaApplier from "@/components/event/PageMetaApplier";
import OrderedSections from "@/components/event/OrderedSections";
import SiteFooter from "@/components/SiteFooter";
import MentorNav from "@/components/mentor-network/MentorNav";
import MentorExpertStrip from "@/components/mentor-network/MentorExpertStrip";
import ExpertIntakeForm from "@/components/experts/ExpertIntakeForm";
import type { Expert } from "@/lib/expert-types";
import hbcusOutsideLogo from "@/assets/mentor-network/hbcus-outside.png";
import heroAsset from "@/assets/mentor-network/hero.jpg.asset.json";

const PAGE_SLUG = "mentor-experts";
const CITY_SLUG = "mentor-network";
const CITY_NAME = "HBCU Mentor Network";

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
        <Eyebrow k="hero_eyebrow" d="BASECAMP INDUSTRY EXPERT · HBCU MENTOR NETWORK" />
        <h1 className="mt-5 text-[34px] sm:text-[52px]" style={{ ...display, color: C.cream }}>
          <T k="hero_headline" d="Be the person a student calls when it counts." multiline />
        </h1>
        <p className="mt-6 max-w-2xl text-base sm:text-lg" style={{ ...body, color: C.creamDim, lineHeight: 1.6 }}>
          <T
            k="hero_subhead"
            d="An Industry Expert gives at least one hour a month for 10 months to one HBCU student heading into the outdoor industry. Build your card below and you're on the roster."
            multiline
          />
        </p>
        <button
          type="button"
          onClick={scrollToForm}
          className="mt-9 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-[0.14em] transition-transform hover:scale-[1.03]"
          style={{ ...body, background: C.clay, color: "#fff" }}
        >
          <T k="hero_cta" d="Build my mentor card" />
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
    body: "You get matched with one HBCU student, then meet at least one hour a month across the academic year. No curriculum to write.",
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

/* --------------------------------- faq --------------------------------- */

const FAQS = [
  {
    key: "time",
    q: "How much time is this really?",
    a: "At least one hour a month for 10 months. You and your student set the times together, based on your schedule and theirs.",
  },
  {
    key: "scheduling",
    q: "Do I have to chase down scheduling?",
    a: "No. We provide the scheduling software if you want it, so your student can book time straight into your calendar.",
  },
  {
    key: "matching",
    q: "How do I get matched?",
    a: "Students choose their mentor. They read your card and pick based on your background, your field, and the parts of your story that overlap with theirs.",
  },
  {
    key: "training",
    q: "Is there training?",
    a: "Yes. A 90 minute training is required to join the program if you're selected. It's one session and we schedule it around the group.",
  },
  {
    key: "cost",
    q: "Does it cost anything?",
    a: "No. Mentoring is volunteer. Your company can also sponsor the program separately if they want their name on it.",
  },
  {
    key: "edit",
    q: "Can I change my card later?",
    a: "Anytime. Come back to this page, type your full name in the form, wait a second for your card to load, then edit what you want.",
  },
];

const FAQ = () => (
  <section className="px-5 py-20 sm:px-8 sm:py-24" style={{ background: C.forestDeep }}>
    <div className="mx-auto max-w-5xl">
      <Eyebrow k="faq_eyebrow" d="QUESTIONS PEOPLE ACTUALLY ASK" />
      <h2 className="mt-4 text-[26px] sm:text-[38px]" style={{ ...display, color: C.cream }}>
        <T k="faq_headline" d="How the mentorship actually runs." />
      </h2>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {FAQS.map((f) => (
          <div
            key={f.key}
            className="rounded-2xl p-6"
            style={{ background: "rgba(245,239,227,0.06)", border: "1px solid rgba(232,192,122,0.22)" }}
          >
            <h3 className="text-[16px] font-bold" style={{ ...body, color: C.gold }}>
              <T k={`faq_${f.key}_q`} d={f.q} />
            </h3>
            <p className="mt-2 text-[15px]" style={{ ...body, color: C.creamDim, lineHeight: 1.6 }}>
              <T k={`faq_${f.key}_a`} d={f.a} multiline />
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------- the room ------------------------------- */

const TheRoom = () => (
  <section className="px-5 py-20 sm:px-8 sm:py-24" style={{ background: C.forest }}>
    <div className="mx-auto max-w-6xl text-center">
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

const FormSection = ({ editMode }: { editMode?: boolean }) => {
  const [formExpertId, setFormExpertId] = useState<string | undefined>(undefined);
  const [formExistingData, setFormExistingData] = useState<Partial<Expert> | undefined>(undefined);

  return (
    <section id="mentor-card-form" className="px-5 py-20 sm:px-8 sm:py-24" style={{ background: C.forestDeep }}>
      <div className="mx-auto max-w-6xl">
        <h2 className="text-[26px] sm:text-[38px]" style={{ ...display, color: C.cream }}>
          <T k="form_headline" d="Build your Industry Expert card" />
        </h2>
        <p className="mt-4 max-w-2xl text-[15px]" style={{ ...body, color: C.creamDim, lineHeight: 1.6 }}>
          <T
            k="form_subhead"
            d="Takes about five minutes. Your card fills in beside you as you type. Already have a card? Enter your full name, wait a second, and it will pop up so you can edit it."
            multiline
          />
        </p>

        <div
          className="mt-6 rounded-xl px-4 py-3 text-sm"
          style={{ ...body, background: "rgba(196,101,74,0.14)", border: "1px solid rgba(196,101,74,0.45)", color: C.cream }}
        >
          <T
            k="form_edit_banner"
            d="Editing your card? Just type your full name below and wait a second. Your card will load and you can change anything."
            multiline
          />
        </div>

        <div className="mt-10">
          <ExpertIntakeForm
            expertId={formExpertId}
            existingData={formExistingData}
            citySlug={CITY_SLUG}
            cityName={CITY_NAME}
            expertType="industry_expert"
            onComplete={(savedExpert) => {
              if (savedExpert) {
                setFormExpertId(savedExpert.id);
                setFormExistingData((prev) => ({ ...prev, ...savedExpert }));
              }
            }}
          />
        </div>
      </div>
    </section>
  );
};

/* --------------------------------- page --------------------------------- */

const MentorExpertsInner = ({ editMode }: { editMode?: boolean }) => (
  <div style={{ background: C.forest }}>
    <Fonts />
    <PageMetaApplier title="Become a Mentor | HBCU Mentor Network" />
    <MentorNav backHref="/mentor-network" backLabel="HBCU Mentor Network" />
    <OrderedSections
      sections={[
        { key: "hero", content: <Hero /> },
        { key: "what-it-means", content: <WhatItMeans /> },
        { key: "faq", content: <FAQ /> },
        { key: "the-room", content: <TheRoom /> },
        { key: "form", content: <FormSection editMode={editMode} /> },
        { key: "footer", content: <SiteFooter /> },
      ]}
    />
  </div>
);

const MentorExperts = ({ editMode = false }: { editMode?: boolean }) => (
  <EditableTextProvider pageSlug={PAGE_SLUG}>
    <MentorExpertsInner editMode={editMode} />
  </EditableTextProvider>
);

export default MentorExperts;
