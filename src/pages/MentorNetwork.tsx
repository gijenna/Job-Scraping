import { useState } from "react";
import { EditableTextProvider, useEditableTextContext } from "@/components/EditableTextProvider";
import EditableText from "@/components/EditableText";
import EditableLink from "@/components/EditableLink";
import PageMetaApplier from "@/components/event/PageMetaApplier";
import OrderedSections from "@/components/event/OrderedSections";
import AdminLogoManager from "@/components/event/AdminLogoManager";
import { useEventLogos } from "@/hooks/useEventLogos";
import SiteFooter from "@/components/SiteFooter";
import MentorExpertStrip from "@/components/mentor-network/MentorExpertStrip";
import {
  SponsorInquiryDialog,
  MentorApplyDialog,
  StudentWaitlistForm,
} from "@/components/mentor-network/MentorForms";
import PartnershipConstellation, {
  ConstellationStyles,
  ConstellationHeading,
  type ConstellationStar,
  type Edge,
} from "@/components/mentor-network/PartnershipConstellation";
import hbcusOutsideLogo from "@/assets/mentor-network/hbcus-outside.png";
import sierraClubLogo from "@/assets/mentor-network/sierra-club.png";
import sierraClubCream from "@/assets/mentor-network/sierra-club-cream.png";
import ncobsCream from "@/assets/mentor-network/ncobs-cream.png";
import ncobsLogo from "@/assets/mentor-network/ncobs.png";
import basecampOutdoorLogo from "@/assets/basecamp-outdoor-logo.png";
import basecampGreen from "@/assets/mentor-network/basecamp-green.png";
import tennesseeStateLogo from "@/assets/mentor-network/campuses/tennessee-state.png";
import ncatLogo from "@/assets/mentor-network/campuses/nc-at.png";
import spelmanLogo from "@/assets/mentor-network/campuses/spelman.png";
import morehouseLogo from "@/assets/mentor-network/campuses/morehouse.png";
import clarkAtlantaLogo from "@/assets/mentor-network/campuses/clark-atlanta.png";
import morehouseMedicineLogo from "@/assets/mentor-network/campuses/morehouse-medicine.png";
import heroAsset from "@/assets/mentor-network/hero.jpg.asset.json";

const heroPhoto = heroAsset.url;

const PAGE_SLUG = "mentor-network";

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
  lineHeight: 1.02,
};
const body: React.CSSProperties = { fontFamily: "'Hind', system-ui, sans-serif" };

const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Hind:wght@300;400;500;600;700&display=swap');
    .mn-rise { animation: mn-rise .7s cubic-bezier(.2,.7,.3,1) both; }
    @keyframes mn-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
  `}</style>
);

const Eyebrow = ({ settingKey, defaultText, tone = C.gold }: { settingKey: string; defaultText: string; tone?: string }) => (
  <p
    className="text-[10px] sm:text-[11px] font-bold uppercase"
    style={{ ...body, letterSpacing: "0.24em", color: tone }}
  >
    <EditableText settingKey={settingKey} defaultText={defaultText} as="span" />
  </p>
);

const Rule = ({ color = C.gold }: { color?: string }) => (
  <div style={{ height: 3, width: 64, background: color, borderRadius: 2 }} />
);

/* ================================ HERO ================================ */

const Hero = ({ onBrand }: { onBrand: () => void }) => (
  <section className="relative overflow-hidden" style={{ background: C.forestDeep }}>
    <div className="absolute inset-0">
      <img src={heroPhoto} alt="Outdoor industry professionals talking together outside" className="h-full w-full object-cover" />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(100deg, ${C.forestDeep}f5 0%, ${C.forestDeep}e0 46%, ${C.forest}90 100%)` }}
      />
    </div>

    <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28 lg:py-36">
      <div className="max-w-3xl mn-rise">
        <img src={hbcusOutsideLogo} alt="HBCUs Outside" className="h-16 sm:h-20 w-auto mb-8" />
        <Eyebrow
          settingKey="hero_eyebrow"
          defaultText="HBCUS OUTSIDE x SIERRA CLUB x NORTH CAROLINA OUTWARD BOUND SCHOOL x BASECAMP"
        />
        <div className="mt-5 mb-6">
          <Rule />
        </div>
        <h1 className="text-[34px] sm:text-[54px] lg:text-[64px]" style={{ ...display, color: C.cream }}>
          <EditableText
            settingKey="hero_headline"
            defaultText="One hour a month can change where someone's career goes."
            as="span"
          />
        </h1>
        <p className="mt-6 text-base sm:text-xl max-w-2xl" style={{ ...body, color: C.creamDim, lineHeight: 1.55 }}>
          <EditableText
            settingKey="hero_subhead"
            defaultText="Basecamp is building the mentor network behind the HBCUs Outside partnership, pairing outdoor industry experts with HBCU students heading into the field."
            as="span"
            multiline
          />
        </p>

        <div className="mt-10 flex flex-col gap-5">
          <button
            onClick={onBrand}
            className="inline-flex w-full items-center justify-center rounded-full px-8 py-5 text-center text-[15px] sm:text-lg font-bold uppercase tracking-[0.1em] transition-transform hover:scale-[1.02] sm:w-auto sm:self-start"
            style={{ ...body, background: C.clay, color: "#fff", boxShadow: "0 14px 40px rgba(196,101,74,0.35)" }}
          >
            <EditableText
              settingKey="hero_cta_primary_text"
              defaultText="Help us build a braided river of talent"
              as="span"
            />
          </button>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href="/mentor-experts"
              className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] transition-colors"
              style={{ border: `2px solid ${C.gold}`, color: C.gold, ...body }}
            >
              <EditableText settingKey="hero_cta_secondary" defaultText="Become a mentor" as="span" />
            </a>
            <a
              href="#students"
              className="text-xs font-semibold uppercase tracking-[0.14em] underline underline-offset-4"
              style={{ ...body, color: C.creamDim }}
            >
              <EditableText settingKey="hero_cta_tertiary" defaultText="I'm a student" as="span" />
            </a>
          </div>
        </div>

      </div>
    </div>
  </section>
);

/* ============================ THE PARTNERSHIP ============================ */

const STARS: ConstellationStar[] = [
  {
    key: "sierra",
    name: "Sierra Club",
    logo: sierraClubCream,
    tier: "partner",
    role: "Certification",
    x: 31,
    y: 33,
    scale: 1.1,
  },
  {
    key: "hbcus",
    name: "HBCUs Outside",
    logo: hbcusOutsideLogo,
    tier: "partner",
    role: "Belonging",
    x: 69,
    y: 33,
    scale: 1.05,
  },
  {
    key: "ncobs",
    name: "North Carolina Outward Bound School",
    logo: ncobsCream,
    tier: "partner",
    role: "Experiential Training",
    x: 31,
    y: 66,
    scale: 1.2,
  },
  {
    key: "basecamp",
    name: "Basecamp Outdoor",
    logo: basecampOutdoorLogo,
    tier: "partner",
    role: "Mentorship",
    x: 69,
    y: 66,
    scale: 1.1,
  },
  { key: "tsu", name: "Tennessee State University", logo: tennesseeStateLogo, tier: "campus", x: 13, y: 13 },
  { key: "ncat", name: "North Carolina A&T State University", logo: ncatLogo, tier: "campus", x: 83, y: 12, scale: 1.0 },
  { key: "spelman", name: "Spelman College", logo: spelmanLogo, tier: "campus", x: 10, y: 49, scale: 0.9 },
  { key: "msm", name: "Morehouse School of Medicine", logo: morehouseMedicineLogo, tier: "campus", x: 86, y: 49, scale: 0.95 },
  { key: "morehouse", name: "Morehouse College", logo: morehouseLogo, tier: "campus", x: 18, y: 88 },
  { key: "cau", name: "Clark Atlanta University", logo: clarkAtlantaLogo, tier: "campus", x: 82, y: 88 },
];

const CONSTELLATION_EDGES: Edge[] = [
  ["sierra", "hbcus"],
  ["sierra", "ncobs"],
  ["ncobs", "basecamp"],
  ["basecamp", "hbcus"],
  ["sierra", "basecamp"],
  ["hbcus", "ncobs"],
  ["tsu", "sierra"],
  ["spelman", "sierra"],
  ["ncat", "hbcus"],
  ["msm", "hbcus"],
  ["morehouse", "ncobs"],
  ["cau", "basecamp"],
];

const OutcomeStar = () => (
  <svg width="46" height="46" viewBox="0 0 24 24" aria-hidden className="mn-spark">
    <path d="M12 0 L13.6 9.2 L24 12 L13.6 14.8 L12 24 L10.4 14.8 L0 12 L10.4 9.2 Z" fill={C.gold} />
  </svg>
);

const Partnership = () => (
  <section style={{ background: C.forestDeep }} className="py-20 sm:py-28">
    <ConstellationStyles />
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      <ConstellationHeading
        eyebrowKey="partnership_eyebrow"
        headlineKey="partnership_intro"
        headlineDefault="This mentor network is one piece of a bigger partnership. Here's the rest of it."
        subheadKey="partnership_subhead"
        subheadDefault="Seven HBCU campuses are building certified student leaders through this partnership, now extending into a full year of mentorship."
      />

      <div className="mt-12">
        <PartnershipConstellation stars={STARS} edges={CONSTELLATION_EDGES} />
      </div>

      {/* line running down from the constellation into the outcome */}
      <div className="flex justify-center" aria-hidden>
        <div
          style={{
            width: 2,
            height: 64,
            background: `linear-gradient(180deg, rgba(232,192,122,0) 0%, ${C.gold} 55%, ${C.gold} 100%)`,
            boxShadow: "0 0 12px rgba(232,192,122,0.6)",
          }}
        />
      </div>

      <div
        className="relative rounded-2xl px-7 pt-14 pb-9 sm:px-10 sm:pt-16 sm:pb-11 text-center"
        style={{ background: "rgba(232,192,122,0.08)", border: "1px solid rgba(232,192,122,0.32)" }}
      >
        <span
          className="absolute left-1/2 -translate-x-1/2 -top-6 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: C.forestDeep, boxShadow: "0 0 26px 8px rgba(232,192,122,0.28)" }}
        >
          <OutcomeStar />
        </span>
        <p className="text-[11px] font-bold uppercase" style={{ ...body, letterSpacing: "0.26em", color: C.gold }}>
          <EditableText settingKey="outcome_label" defaultText="THE OUTCOME" as="span" />
        </p>
        <p
          className="mt-5 mx-auto max-w-4xl text-lg sm:text-2xl"
          style={{ ...body, color: C.cream, lineHeight: 1.5, fontWeight: 500 }}
        >
          <EditableText
            settingKey="outcome_body"
            defaultText="Certified leaders equipped to return to campus, lead belonging-centered experiences, train the next generation of leaders, and stay connected through a full academic year, positioning them to succeed as students and advance in their careers."
            as="span"
            multiline
          />
        </p>
      </div>
    </div>
  </section>
);

/* ============================ BE PART OF THIS ============================ */

const BePartOfThis = ({
  onBrand,
  variant = "dark",
  idSuffix,
}: {
  onBrand: () => void;
  variant?: "dark" | "light";
  idSuffix: string;
}) => {

  const light = variant === "light";
  return (
    <section style={{ background: light ? C.cream : C.forest }} className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Eyebrow
          settingKey={`bepart_${idSuffix}_eyebrow`}
          defaultText="BE PART OF THIS"
          tone={light ? C.clay : C.gold}
        />
        <h2 className="mt-4 text-[26px] sm:text-[38px] max-w-3xl" style={{ ...display, color: light ? C.forest : C.cream }}>
          <EditableText
            settingKey={`bepart_${idSuffix}_headline`}
            defaultText="There are two ways in."
            as="span"
          />
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <div
            className="rounded-2xl p-7 flex flex-col"
            style={{
              background: light ? "#ffffff" : "rgba(245,239,227,0.06)",
              border: light ? "1px solid rgba(18,36,28,0.10)" : "1px solid rgba(232,192,122,0.28)",
            }}
          >
            <h3 className="text-[19px] sm:text-[22px]" style={{ ...display, color: light ? C.forest : C.cream }}>
              <EditableText
                settingKey={`bepart_${idSuffix}_shape_title`}
                defaultText="Shape or support the program"
                as="span"
              />
            </h3>
            <p
              className="mt-4 text-[15px] flex-1"
              style={{ ...body, color: light ? "rgba(18,36,28,0.72)" : C.creamDim, lineHeight: 1.6 }}
            >
              <EditableText
                settingKey={`bepart_${idSuffix}_shape_body`}
                defaultText="Fund the pilot, help design it, or bring your organization in as a program partner. Start a conversation with Ron Griswell."
                as="span"
                multiline
              />
            </p>
            <div className="mt-7">
              <button
                onClick={onBrand}
                className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] transition-transform hover:scale-[1.03]"
                style={{ background: C.clay, color: "#fff", ...body }}
              >
                <EditableText
                  settingKey={`bepart_${idSuffix}_shape_cta_text`}
                  defaultText="Sponsor the program"
                  as="span"
                />
              </button>
            </div>

          </div>

          <div
            className="rounded-2xl p-7 flex flex-col"
            style={{
              background: light ? "#ffffff" : "rgba(245,239,227,0.06)",
              border: light ? "1px solid rgba(18,36,28,0.10)" : "1px solid rgba(232,192,122,0.28)",
            }}
          >
            <h3 className="text-[19px] sm:text-[22px]" style={{ ...display, color: light ? C.forest : C.cream }}>
              <EditableText
                settingKey={`bepart_${idSuffix}_mentor_title`}
                defaultText="Contribute a mentor from your organization"
                as="span"
              />
            </h3>
            <p
              className="mt-4 text-[15px] flex-1"
              style={{ ...body, color: light ? "rgba(18,36,28,0.72)" : C.creamDim, lineHeight: 1.6 }}
            >
              <EditableText
                settingKey={`bepart_${idSuffix}_mentor_body`}
                defaultText="Put forward someone on your team to mentor one student for 1 to 2 hours a month across the academic year."
                as="span"
                multiline
              />
            </p>
            <div className="mt-7">
              <a
                href="/mentor-experts"
                className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] transition-transform hover:scale-[1.03]"
                style={{ background: C.gold, color: C.forest, ...body }}
              >
                <EditableText
                  settingKey={`bepart_${idSuffix}_mentor_cta`}
                  defaultText="Contribute a mentor"
                  as="span"
                />
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

/* ============================ WHY THIS MATTERS ============================ */

const TENETS = [
  {
    key: "representation",
    name: "Representation",
    body: "A pathway of leaders drawn directly from the communities you're trying to reach.",
  },
  {
    key: "pathways",
    name: "Pathways",
    body: "Turning participants into certified instructors, and over time, into employees.",
  },
  {
    key: "access",
    name: "Access",
    body: "Activating underprogrammed locations with communities that fuel long-term partnership.",
  },
  {
    key: "wellbeing",
    name: "Wellbeing",
    body: "A measurable sense of belonging, treated as a student success metric in its own right.",
  },
];

const TENET_PHOTOS = [
  "/__l5e/assets-v1/e02f0d3b-521f-4e5a-89e4-f8557d6652f4/AnthonyMarz_Basecamp-019.jpg",
  "/__l5e/assets-v1/a03ec4ff-b58e-4048-8ccc-0f2dee800d39/AnthonyMarz_Basecamp-046.jpg",
  "/__l5e/assets-v1/54a59ae4-e76d-401e-9ea4-dd70f7cbd927/AnthonyMarz_Basecamp-094-2.jpg",
  "/__l5e/assets-v1/f81467b8-5d3e-4887-8583-10b3dac9b7c7/AnthonyMarz_Basecamp-139.jpg",
];

const WhyThisMatters = () => (
  <section style={{ background: C.forest }} className="py-20 sm:py-28">
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      <Eyebrow settingKey="tenets_eyebrow" defaultText="WHY THIS MATTERS" />
      <h2 className="mt-4 max-w-3xl text-[28px] sm:text-[42px]" style={{ ...display, color: C.cream }}>
        <EditableText
          settingKey="tenets_headline"
          defaultText="Four things this program is built to do."
          as="span"
        />
      </h2>

      <div className="mt-14 grid gap-px sm:grid-cols-2 lg:grid-cols-4 rounded-2xl overflow-hidden" style={{ background: "rgba(232,192,122,0.20)" }}>
        {TENETS.map((t, i) => (
          <article
            key={t.key}
            className="relative isolate overflow-hidden p-7 sm:p-8"
            style={{ background: C.forest }}
          >
            <img
              src={TENET_PHOTOS[i % TENET_PHOTOS.length]}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 -z-20 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0 -z-10"
              style={{ background: `linear-gradient(180deg, ${C.forest}e8 0%, ${C.forest}f2 55%, ${C.forestDeep}fa 100%)` }}
            />
            <span className="block text-[42px] leading-none" style={{ ...display, color: C.gold }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-5 text-[20px] sm:text-[24px]" style={{ ...display, color: C.cream }}>
              <EditableText settingKey={`tenet_${t.key}_name`} defaultText={t.name} as="span" />
            </h3>
            <p className="mt-4 text-[15px]" style={{ ...body, color: C.creamDim, lineHeight: 1.6 }}>
              <EditableText settingKey={`tenet_${t.key}_body`} defaultText={t.body} as="span" multiline />
            </p>
          </article>
        ))}
      </div>

    </div>
  </section>
);

/* ============================ THE PILOT IN MOTION ============================ */

const PILOT_ROWS = [
  {
    key: "when",
    label: "Dates and location",
    body: "October 1 to 4, 2026 at Cedar Rock, North Carolina.",
  },
  {
    key: "campuses",
    label: "Target campuses",
    body: "Seven, including Tennessee State University, North Carolina A&T, and the four universities of the Atlanta University Consortium.",
  },
  {
    key: "leaders",
    label: "Student leaders",
    body: "3 to 5 per campus, already leading on their campuses, returning home certified.",
  },
  {
    key: "after",
    label: "Beyond October",
    body: "Certified leaders run their own Sierra Club outings, continue NCOBS virtual modules, build mental health literacy with a wellbeing partner, and stay connected year-round through HBCUs Outside.",
  },
];

const PILOT_ROLES = [
  { key: "sierra", name: "Sierra Club", logo: sierraClubLogo, body: "Certification, insurance, and advocacy. Students finish as officially recognized outings leaders." },
  { key: "ncobs", name: "North Carolina Outward Bound School", logo: ncobsLogo, body: "Experiential education in teamwork, resilience, and leadership, inside the national Outward Bound network." },
  { key: "hbcus", name: "HBCUs Outside", logo: hbcusOutsideLogo, body: "Belonging and cross-campus community, built in quality nature and carried back to campus." },
  { key: "basecamp", name: "Basecamp Outdoor", logo: basecampGreen, body: "Mentorship and industry access. Certified leaders get matched with outdoor industry mentors for a full academic year." },
];


const PilotInMotion = () => (
  <section style={{ background: C.cream }} className="py-20 sm:py-28">
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      <Eyebrow settingKey="pilot_eyebrow" defaultText="THE PILOT IN MOTION" tone={C.clay} />
      <h2 className="mt-4 max-w-3xl text-[28px] sm:text-[42px]" style={{ ...display, color: C.forest }}>
        <EditableText settingKey="pilot_headline" defaultText="What is already scheduled." as="span" />
      </h2>

      <div className="mt-12 rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(18,36,28,0.14)" }}>
        {PILOT_ROWS.map((r, i) => (
          <div
            key={r.key}
            className="grid gap-2 sm:grid-cols-[220px_1fr] px-6 sm:px-8 py-6"
            style={{
              borderTop: i === 0 ? "none" : "1px solid rgba(18,36,28,0.12)",
              background: i % 2 === 0 ? "rgba(45,90,61,0.05)" : "transparent",
            }}
          >
            <p className="text-[11px] font-bold uppercase" style={{ ...body, letterSpacing: "0.18em", color: C.clay }}>
              <EditableText settingKey={`pilot_${r.key}_label`} defaultText={r.label} as="span" />
            </p>
            <p className="text-[15px] sm:text-base" style={{ ...body, color: "rgba(18,36,28,0.82)", lineHeight: 1.6 }}>
              <EditableText settingKey={`pilot_${r.key}_body`} defaultText={r.body} as="span" multiline />
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PILOT_ROLES.map((p) => (
          <article
            key={p.key}
            className="rounded-2xl p-6"
            style={{ background: "#ffffff", border: "1px solid rgba(18,36,28,0.10)" }}
          >
            <div className="flex items-center gap-3">
              <img src={p.logo} alt={p.name} loading="lazy" className="h-10 w-10 shrink-0 object-contain" />
              <h3 className="text-[16px]" style={{ ...display, color: C.forest }}>
                <EditableText settingKey={`pilotrole_${p.key}_name`} defaultText={p.name} as="span" />
              </h3>
            </div>

            <p className="mt-3 text-[15px]" style={{ ...body, color: "rgba(18,36,28,0.72)", lineHeight: 1.6 }}>
              <EditableText settingKey={`pilotrole_${p.key}_body`} defaultText={p.body} as="span" multiline />
            </p>
          </article>
        ))}
      </div>
    </div>
  </section>
);



/* ========================= WHAT BASECAMP IS BUILDING ========================= */

const BasecampSection = ({ onSponsor }: { onSponsor: () => void; onMentor?: () => void }) => (
  <section style={{ background: C.forest }} className="py-20 sm:py-28">
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-start">
        <div>
          <Eyebrow settingKey="building_eyebrow" defaultText="WHAT BASECAMP IS BUILDING" />
          <h2 className="mt-4 text-[30px] sm:text-[46px]" style={{ ...display, color: C.cream }}>
            <EditableText
              settingKey="building_headline"
              defaultText="The part that doesn't end when October does."
              as="span"
            />
          </h2>
          <p className="mt-6 text-base sm:text-lg" style={{ ...body, color: C.creamDim, lineHeight: 1.65 }}>
            <EditableText
              settingKey="building_body"
              defaultText="Certification is four days. A career is longer than that. Basecamp is recruiting 20 outdoor industry mentors, each giving 1 to 2 hours a month for 10 months to a matched HBCU student. This runs on the same Industry Expert Program already connecting experts with our community at events across the country, applied here as a real, season-long commitment to one student."
              as="span"
              multiline
            />
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-4">
            <button
              onClick={onSponsor}
              className="rounded-full px-7 py-4 text-sm font-bold uppercase tracking-[0.14em] transition-transform hover:scale-[1.03]"
              style={{ background: C.gold, color: C.forest, ...body }}
            >
              <EditableText settingKey="building_cta_sponsor" defaultText="Sponsor a mentor" as="span" />
            </button>
            <a
              href="/mentor-experts"
              className="inline-flex items-center justify-center rounded-full px-7 py-4 text-sm font-bold uppercase tracking-[0.14em] transition-transform hover:scale-[1.03]"
              style={{ background: C.clay, color: "#fff", ...body }}
            >
              <EditableText settingKey="building_cta_mentor" defaultText="Become a mentor" as="span" />
            </a>
          </div>
        </div>

        <div className="rounded-2xl p-7" style={{ background: "rgba(245,239,227,0.06)", border: `1px solid rgba(232,192,122,0.28)` }}>
          <p className="text-[11px] font-bold uppercase mb-6" style={{ ...body, letterSpacing: "0.2em", color: C.gold }}>
            <EditableText
              settingKey="building_cards_label"
              defaultText="What a mentor profile looks like"
              as="span"
            />
          </p>
          <MentorExpertStrip limit={8} />
          <p className="mt-6 text-sm" style={{ ...body, color: C.creamDim }}>
            <EditableText
              settingKey="building_cards_caption"
              defaultText="Real industry experts from our Minneapolis lineup. Mentors get a profile like this."
              as="span"
              multiline
            />
          </p>
        </div>
      </div>
    </div>
  </section>
);

/* ============================== HOW IT WORKS ============================== */

const STEPS = [
  { key: "step1", text: "Mentors sign up and build a profile.", soon: true },
  { key: "step2", text: "Students take a short quiz.", soon: true },
  { key: "step3", text: "We match them.", soon: false },
  { key: "step4", text: "They meet 1 to 2 hours a month for 10 months.", soon: false },
];

const HowItWorks = () => (
  <section style={{ background: C.cream }} className="py-20 sm:py-28">
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      <Eyebrow
        settingKey="how_kicker"
        defaultText="WHAT THIS LOOKS LIKE ONCE IT'S FULLY LIVE"
        tone={C.clay}
      />
      <h2 className="mt-4 text-[28px] sm:text-[40px]" style={{ ...display, color: C.forest }}>
        <EditableText settingKey="how_headline" defaultText="How it works" as="span" />
      </h2>

      <ol className="mt-12 grid gap-px sm:grid-cols-2 lg:grid-cols-4 rounded-2xl overflow-hidden" style={{ background: "rgba(18,36,28,0.12)" }}>
        {STEPS.map((s, i) => (
          <li key={s.key} className="p-7" style={{ background: C.cream }}>
            <span className="text-[38px] block mb-3" style={{ ...display, color: C.gold }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="text-[17px] font-semibold" style={{ ...body, color: C.forest, lineHeight: 1.45 }}>
              <EditableText settingKey={`how_${s.key}`} defaultText={s.text} as="span" multiline />
            </p>
            {s.soon && (
              <span
                className="mt-4 inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{ background: "rgba(196,101,74,0.14)", color: C.clay, ...body }}
              >
                Coming soon
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  </section>
);

/* ================================ BRANDS ================================ */

const ForBrands = ({ onSponsor }: { onSponsor: () => void }) => (
  <section style={{ background: C.moss }} className="py-20 sm:py-28">
    <div className="max-w-5xl mx-auto px-5 sm:px-8">
      <Eyebrow settingKey="brands_eyebrow" defaultText="FOR BRANDS" />
      <h2 className="mt-4 text-[30px] sm:text-[46px]" style={{ ...display, color: C.cream }}>
        <EditableText
          settingKey="brands_headline"
          defaultText="A booth gets your logo walked past. This gets you known as the brand that opened a door."
          as="span"
        />
      </h2>
      <p className="mt-6 text-base sm:text-lg max-w-3xl" style={{ ...body, color: "rgba(245,239,227,0.85)", lineHeight: 1.65 }}>
        <EditableText
          settingKey="brands_body"
          defaultText="Provide a mentor from your team, or sponsor the program directly. Either way, you're not starting from zero. These mentors are already giving their time for free because they believe in this. You get to build off that goodwill, and be the name a student remembers when they land their first real job in this industry."
          as="span"
          multiline
        />
      </p>
      <button
        onClick={onSponsor}
        className="mt-9 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-[0.14em] transition-transform hover:scale-[1.03]"
        style={{ background: C.gold, color: C.forest, ...body }}
      >
        <EditableText settingKey="brands_cta" defaultText="Talk to us about sponsoring" as="span" />
      </button>
    </div>
  </section>
);

/* ================================ MENTORS ================================ */

const ForMentors = ({ onMentor }: { onMentor?: () => void }) => (
  <section style={{ background: C.cream }} className="py-20 sm:py-28">
    <div className="max-w-5xl mx-auto px-5 sm:px-8">
      <Eyebrow settingKey="mentors_eyebrow" defaultText="FOR MENTORS" tone={C.clay} />
      <h2 className="mt-4 text-[30px] sm:text-[46px]" style={{ ...display, color: C.forest }}>
        <EditableText settingKey="mentors_headline" defaultText="Give an hour. Change a trajectory." as="span" />
      </h2>
      <p className="mt-6 text-base sm:text-lg max-w-3xl" style={{ ...body, color: "rgba(18,36,28,0.78)", lineHeight: 1.65 }}>
        <EditableText
          settingKey="mentors_body"
          defaultText="We're looking for 20 people already working in the outdoor industry who can give 1 to 2 hours a month for 10 months to one HBCU student. No curriculum to write, no big time ask, just real conversations and real access for someone who might not otherwise have it."
          as="span"
          multiline
        />
      </p>
      <a
        href="/mentor-experts"
        className="mt-9 inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-bold uppercase tracking-[0.14em] transition-transform hover:scale-[1.03]"
        style={{ background: C.clay, color: "#fff", ...body }}
      >
        <EditableText settingKey="mentors_cta" defaultText="Apply to mentor" as="span" />
      </a>
    </div>
  </section>
);

/* ================================ STUDENTS ================================ */

const ForStudents = () => (
  <section id="students" style={{ background: C.forestDeep }} className="py-16 sm:py-20">
    <div className="max-w-4xl mx-auto px-5 sm:px-8">
      <Eyebrow settingKey="students_eyebrow" defaultText="FOR STUDENTS" />
      <h2 className="mt-4 text-[24px] sm:text-[32px]" style={{ ...display, color: C.cream }}>
        <EditableText settingKey="students_headline" defaultText="Coming to your campus" as="span" />
      </h2>
      <p className="mt-5 text-[15px] sm:text-base max-w-2xl" style={{ ...body, color: C.creamDim, lineHeight: 1.6 }}>
        <EditableText
          settingKey="students_body"
          defaultText="If you're a student at one of the seven partner campuses, this is where you'll get matched with a mentor working in the outdoor industry, someone you'll talk to for an hour or two a month, all year. The matching quiz isn't live yet."
          as="span"
          multiline
        />
      </p>
      <div className="mt-8">
        <StudentWaitlistForm />
      </div>
    </div>
  </section>
);

/* =============================== SUPPORTED BY =============================== */

const CORE_LOGOS = [
  { name: "HBCUs Outside", src: hbcusOutsideLogo, url: "https://www.hbcusoutside.com/" },
  { name: "Sierra Club", src: sierraClubLogo, url: "https://www.sierraclub.org/" },
  { name: "North Carolina Outward Bound School", src: ncobsLogo, url: "https://www.ncobs.org/" },
  { name: "Basecamp Outdoor", src: basecampGreen, url: "https://basecampoutdoorevents.com" },
];

const TierLabel = ({ settingKey, defaultText }: { settingKey: string; defaultText: string }) => (
  <p className="text-[11px] font-bold uppercase mb-5" style={{ ...body, letterSpacing: "0.22em", color: C.clay }}>
    <EditableText settingKey={settingKey} defaultText={defaultText} as="span" />
  </p>
);

const SupportedBy = () => {
  const { isAdmin } = useEditableTextContext();
  const { logos } = useEventLogos(PAGE_SLUG);

  return (
    <section style={{ background: C.cream }} className="py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[26px] sm:text-[34px]" style={{ ...display, color: C.forest }}>
              <EditableText settingKey="supported_headline" defaultText="Supported by" as="span" />
            </h2>
            <div className="mt-4">
              <Rule color={C.clay} />
            </div>
          </div>
          {isAdmin && (
            <AdminLogoManager lists={[{ eventSlug: PAGE_SLUG, label: "Mentor network supporters" }]} />
          )}
        </div>

        <div className="mt-12">
          <TierLabel settingKey="supported_tier_partners" defaultText="PROGRAM PARTNERS" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {CORE_LOGOS.map((l) => (
              <a
                key={l.name}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-32 items-center justify-center rounded-2xl px-6 transition-transform hover:scale-[1.02]"
                style={{
                  background: l.name === "HBCUs Outside" ? C.forest : "#ffffff",
                  border: "1px solid rgba(18,36,28,0.10)",
                }}
              >
                <img src={l.src} alt={l.name} className="max-h-16 max-w-full w-auto object-contain" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <TierLabel settingKey="supported_tier_supporters" defaultText="SUPPORTERS BRINGING IN MENTORS" />
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-4">
            {logos.map((logo) => (
              <a
                key={logo.id}
                href={logo.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-20 items-center justify-center rounded-xl px-4"
                style={{ background: "#ffffff", border: "1px solid rgba(18,36,28,0.10)" }}
              >
                {logo.logo_url ? (
                  <img src={logo.logo_url} alt={logo.name} className="max-h-10 max-w-full w-auto object-contain" />
                ) : (
                  <span className="text-[13px] font-semibold text-center" style={{ ...body, color: C.forest }}>{logo.name}</span>
                )}
              </a>
            ))}

            {[0, 1].map((i) => (
              <div
                key={`placeholder-${i}`}
                className="flex h-20 items-center justify-center rounded-xl"
                style={{ background: "transparent", border: "1px dashed rgba(18,36,28,0.22)" }}
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-center" style={{ ...body, color: "rgba(18,36,28,0.45)" }}>
                  Your logo here
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ================================= PAGE ================================= */

const MentorNetworkContent = () => {
  const [sponsorOpen, setSponsorOpen] = useState(false);
  const [mentorOpen, setMentorOpen] = useState(false);

  return (
    <div style={{ background: C.cream }}>
      <Fonts />
      <PageMetaApplier title="Basecamp Industry Expert Mentor Network" />

      <OrderedSections
        sections={[
          { key: "hero", content: <Hero onBrand={() => setSponsorOpen(true)} /> },
          { key: "partnership", content: <Partnership /> },
          { key: "why-this-matters", content: <WhyThisMatters /> },
          {
            key: "be-part-of-this-top",
            content: <BePartOfThis idSuffix="top" variant="dark" onBrand={() => setSponsorOpen(true)} />,
          },
          { key: "pilot-in-motion", content: <PilotInMotion /> },
          {
            key: "basecamp-building",
            content: (
              <BasecampSection
                onSponsor={() => setSponsorOpen(true)}
                onMentor={() => setMentorOpen(true)}
              />
            ),
          },
          { key: "how-it-works", content: <HowItWorks /> },
          { key: "for-brands", content: <ForBrands onSponsor={() => setSponsorOpen(true)} /> },
          { key: "for-mentors", content: <ForMentors onMentor={() => setMentorOpen(true)} /> },
          { key: "for-students", content: <ForStudents /> },
          {
            key: "be-part-of-this-bottom",
            content: <BePartOfThis idSuffix="bottom" variant="light" onBrand={() => setSponsorOpen(true)} />,
          },

          { key: "supported-by", content: <SupportedBy /> },
        ]}
      />

      <SiteFooter />

      <SponsorInquiryDialog open={sponsorOpen} onOpenChange={setSponsorOpen} />
      <MentorApplyDialog open={mentorOpen} onOpenChange={setMentorOpen} />
    </div>
  );
};

const MentorNetwork = () => (
  <EditableTextProvider pageSlug={PAGE_SLUG}>
    <MentorNetworkContent />
  </EditableTextProvider>
);

export default MentorNetwork;
