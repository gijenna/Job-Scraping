import { EditableTextProvider } from "@/components/EditableTextProvider";
import EditableText from "@/components/EditableText";
import PageMetaApplier from "@/components/event/PageMetaApplier";

// Brand palette (page-scoped, matches spec exactly)
const C = {
  forest: "#2f4a3c",
  forestDark: "#1e332a",
  rust: "#c1602f",
  cream: "#faf7f2",
  ink: "#22261f",
  muted: "#5b5f57",
  line: "#e2ddd2",
};

const REGISTER_URL = "https://basecampoutdoor.typeform.com/to/yumTbpY7";

const font = { fontFamily: "'Inter', system-ui, sans-serif" };

const Badge = ({
  settingKey,
  defaultText,
  variant = "solid",
}: {
  settingKey: string;
  defaultText: string;
  variant?: "solid" | "outline";
}) => (
  <span
    className="inline-block uppercase font-semibold rounded-full"
    style={{
      fontSize: 11,
      letterSpacing: "0.16em",
      padding: "6px 14px",
      background: variant === "solid" ? C.rust : "transparent",
      color: variant === "solid" ? "#fff" : C.rust,
      border: variant === "outline" ? `1px solid ${C.rust}` : "none",
    }}
  >
    <EditableText settingKey={settingKey} defaultText={defaultText} as="span" />
  </span>
);

const CTAButton = ({
  settingKey,
  defaultText,
  size = "md",
}: {
  settingKey: string;
  defaultText: string;
  size?: "md" | "lg";
}) => (
  <a
    href={REGISTER_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block rounded-lg font-semibold transition-opacity hover:opacity-90"
    style={{
      background: C.rust,
      color: "#fff",
      padding: size === "lg" ? "16px 28px" : "12px 22px",
      fontSize: size === "lg" ? 17 : 15,
    }}
  >
    <EditableText settingKey={settingKey} defaultText={defaultText} as="span" />
  </a>
);

const Hero = () => (
  <section style={{ background: C.forest, color: "#fff" }} className="px-6 py-20 md:py-28">
    <div className="max-w-4xl mx-auto text-center">
      <div className="mb-6">
        <Badge settingKey="sr_hero_pill" defaultText="OFFICIAL OUTDOOR RETAILER EVENT" />
      </div>
      <p
        className="uppercase font-medium mb-5"
        style={{ letterSpacing: "0.22em", fontSize: 12, color: "rgba(255,255,255,0.7)" }}
      >
        <EditableText
          settingKey="sr_hero_eyebrow"
          defaultText="Basecamp Outdoor x Slow Roll"
          as="span"
        />
      </p>
      <h1
        className="font-bold leading-[1.05] mb-6"
        style={{ fontSize: "clamp(40px, 7vw, 76px)", color: "#fff" }}
      >
        <EditableText settingKey="sr_hero_headline" defaultText="Slow Roll x Basecamp." as="span" />
      </h1>
      <p className="mb-3" style={{ fontSize: 19, color: "rgba(255,255,255,0.85)" }}>
        <EditableText
          settingKey="sr_hero_subline"
          defaultText="Minneapolis · Wednesday, August 19, 2026 · Evening"
          as="span"
        />
      </p>
      <p className="mb-8 font-semibold" style={{ fontSize: 17, color: C.rust }}>
        <EditableText
          settingKey="sr_hero_capline"
          defaultText="Only 100 riders. Bring your bike or borrow one."
          as="span"
        />
      </p>
      <p
        className="max-w-2xl mx-auto mb-10"
        style={{ fontSize: 16.5, lineHeight: 1.65, color: "rgba(255,255,255,0.82)" }}
      >
        <EditableText
          settingKey="sr_hero_pitch"
          defaultText="A curated 90-minute community bike ride through Minneapolis. Not a race. A moving experience with stops for stories about the city's history of public land access, equity, and outdoor culture, ending in a DJ set and a community meal. Open to everyone. No OR badge required."
          as="span"
          multiline
        />
      </p>
      <CTAButton settingKey="sr_hero_cta" defaultText="Register — only 100 spots" size="lg" />
    </div>
  </section>
);

const WhatItIs = () => (
  <section style={{ background: C.cream, color: C.ink }} className="px-6 py-20 md:py-28">
    <div className="max-w-3xl mx-auto">
      <p
        className="uppercase font-semibold mb-4"
        style={{ letterSpacing: "0.18em", fontSize: 12, color: C.rust }}
      >
        <EditableText settingKey="sr_what_eyebrow" defaultText="What it is" as="span" />
      </p>
      <h2 className="font-bold mb-6" style={{ fontSize: "clamp(30px, 4.5vw, 44px)", color: C.forest }}>
        <EditableText
          settingKey="sr_what_headline"
          defaultText="A Critical Mass-style ride, at a humane pace."
          as="span"
        />
      </h2>
      <div className="space-y-5" style={{ fontSize: 17, lineHeight: 1.7, color: C.ink }}>
        <p>
          <EditableText
            settingKey="sr_what_p1"
            defaultText="Ninety minutes on two wheels. Riders don't know the exact route ahead of time, only the theme, so the pace stays comfortable for everyone from first-time riders to seasoned cyclists."
            as="span"
            multiline
          />
        </p>
        <p>
          <EditableText
            settingKey="sr_what_p2"
            defaultText="Volunteers hold intersections so the group moves as one. The ride stops along the way for short talks tied to the theme, and ends with a DJ and a free community meal."
            as="span"
            multiline
          />
        </p>
        <p style={{ color: C.muted, fontSize: 15 }}>
          <EditableText
            settingKey="sr_what_context"
            defaultText="A note on timing: this ride happens to fall during Black Bike Week in Minneapolis. Nice context, not the headline."
            as="span"
            multiline
          />
        </p>
      </div>
    </div>
  </section>
);

const ThemeCard = ({
  labelKey,
  labelDefault,
  headKey,
  headDefault,
  bodyKey,
  bodyDefault,
}: {
  labelKey: string;
  labelDefault: string;
  headKey: string;
  headDefault: string;
  bodyKey: string;
  bodyDefault: string;
}) => (
  <div
    className="rounded-[12px] p-6 md:p-7"
    style={{ background: "#fff", border: `1px solid ${C.line}` }}
  >
    <p
      className="uppercase font-semibold mb-3"
      style={{ letterSpacing: "0.16em", fontSize: 11, color: C.rust }}
    >
      <EditableText settingKey={labelKey} defaultText={labelDefault} as="span" />
    </p>
    <h3 className="font-semibold mb-3" style={{ fontSize: 21, color: C.forest, lineHeight: 1.25 }}>
      <EditableText settingKey={headKey} defaultText={headDefault} as="span" />
    </h3>
    <p style={{ fontSize: 15.5, lineHeight: 1.65, color: C.ink }}>
      <EditableText settingKey={bodyKey} defaultText={bodyDefault} as="span" multiline />
    </p>
  </div>
);

const Theme = () => (
  <section style={{ background: "#fff", color: C.ink }} className="px-6 py-20 md:py-28">
    <div className="max-w-5xl mx-auto">
      <div className="max-w-3xl mb-12">
        <p
          className="uppercase font-semibold mb-4"
          style={{ letterSpacing: "0.18em", fontSize: 12, color: C.rust }}
        >
          <EditableText settingKey="sr_theme_eyebrow" defaultText="The theme" as="span" />
        </p>
        <h2 className="font-bold mb-5" style={{ fontSize: "clamp(30px, 4.5vw, 44px)", color: C.forest }}>
          <EditableText
            settingKey="sr_theme_headline"
            defaultText="The story of Minneapolis, told from a bike."
            as="span"
          />
        </h2>
        <p style={{ fontSize: 17, lineHeight: 1.7, color: C.muted }}>
          <EditableText
            settingKey="sr_theme_intro"
            defaultText="Here's what's here, and here's the story behind it. Light stops and heavier ones, woven together. Not a lecture, just the full texture of the city."
            as="span"
            multiline
          />
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ThemeCard
          labelKey="sr_theme_c1_label"
          labelDefault="PUBLIC WATER"
          headKey="sr_theme_c1_head"
          headDefault="A lakefront that belongs to everyone."
          bodyKey="sr_theme_c1_body"
          bodyDefault="Minnesota's history of public waterway access is rare in this country. The entire Minneapolis lakefront is public land, and that fact is worth knowing before you ride past it."
        />
        <ThemeCard
          labelKey="sr_theme_c2_label"
          labelDefault="POOLS & POLICY"
          headKey="sr_theme_c2_head"
          headDefault="Segregated pools, and who swims today."
          bodyKey="sr_theme_c2_body"
          bodyDefault="Minneapolis has a real history of segregated public pools, and that policy history still echoes in who learns to swim and who feels welcome at the water. We tell it straight, not as trivia."
        />
        <ThemeCard
          labelKey="sr_theme_c3_label"
          labelDefault="RECLAIMED LAND"
          headKey="sr_theme_c3_head"
          headDefault="A waterway uncovered, a neighborhood rebuilt."
          bodyKey="sr_theme_c3_body"
          bodyDefault="An affordable-housing community here was built over a formerly covered urban waterway. When it was redeveloped, the waterway was uncovered, replanted with prairie grass, and the housing went back in around it. Proof that reclamation is possible."
        />
        <ThemeCard
          labelKey="sr_theme_c4_label"
          labelDefault="MUSIC & TRAILS"
          headKey="sr_theme_c4_head"
          headDefault="Prince, First Avenue, and rails turned into trails."
          bodyKey="sr_theme_c4_body"
          bodyDefault="Minneapolis music history runs deep: Prince, Lake Minnetonka, First Avenue. The city's rails-to-trails success is another quiet win. The ride isn't all heavy. This is the lighter thread."
        />
      </div>
    </div>
  </section>
);

const Guide = () => (
  <section style={{ background: C.cream, color: C.ink }} className="px-6 py-20 md:py-28">
    <div className="max-w-5xl mx-auto">
      <p
        className="uppercase font-semibold mb-4 text-center"
        style={{ letterSpacing: "0.18em", fontSize: 12, color: C.rust }}
      >
        <EditableText settingKey="sr_guide_eyebrow" defaultText="Meet your guide" as="span" />
      </p>
      <h2
        className="font-bold mb-12 text-center"
        style={{ fontSize: "clamp(30px, 4.5vw, 44px)", color: C.forest }}
      >
        <EditableText settingKey="sr_guide_headline" defaultText="Anthony Taylor." as="span" />
      </h2>
      <div
        className="rounded-[12px] overflow-hidden grid grid-cols-1 md:grid-cols-[minmax(0,320px)_1fr] gap-0"
        style={{ background: "#fff", border: `1px solid ${C.line}` }}
      >
        {/* Press photo — credit: Trust for Public Land. Permission pending, swap for cleared photo once confirmed. */}
        <img
          src="https://e7jecw7o93n.exactdn.com/wp-content/uploads/2024/02/tx_renaissancepark_05012022_049_fallback.jpg"
          alt="Anthony Taylor"
          className="w-full h-full object-cover"
          style={{ minHeight: 320 }}
        />
        <div className="p-6 md:p-8">
          <h3 className="font-bold mb-2" style={{ fontSize: 26, color: C.forest }}>
            <EditableText
              settingKey="sr_guide_name"
              defaultText="Anthony Taylor"
              as="span"
            />
          </h3>
          <p
            className="uppercase font-medium mb-5"
            style={{ letterSpacing: "0.14em", fontSize: 12, color: C.muted }}
          >
            <EditableText
              settingKey="sr_guide_title"
              defaultText="Ride Leader · Advocate · Minneapolis"
              as="span"
            />
          </p>
          <div className="space-y-4" style={{ fontSize: 16, lineHeight: 1.7, color: C.ink }}>
            <p>
              <EditableText
                settingKey="sr_guide_p1"
                defaultText="Anthony Taylor leads this ride. Founder of Slow Roll Twin Cities with the Cultural Wellness Center, co-founder of the Major Taylor Bicycling Club of Minnesota, and a nationally recognized advocate for equity in the outdoors and mobility justice."
                as="span"
                multiline
              />
            </p>
            <p>
              <EditableText
                settingKey="sr_guide_p2"
                defaultText="He's led Slow Rolls through Minneapolis for years. This isn't a one-off. It's his life's work, and we're honored he's showing us the city."
                as="span"
                multiline
              />
            </p>
          </div>
        </div>
      </div>
      {/* Press photo — credit: Minnesota Spokesman-Recorder. Permission pending, swap for cleared photo once confirmed. */}
      <div className="mt-6 rounded-[12px] overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
        <img
          src="https://i0.wp.com/spokesman-recorder.com/wp-content/uploads/2021/10/slow-roll-bike-ride-Anthony-Taylor.jpg"
          alt="Anthony Taylor leading a past Slow Roll ride in Minneapolis"
          className="w-full h-auto block"
        />
        <p className="px-4 py-2" style={{ fontSize: 12, color: C.muted, background: "#fff" }}>
          <EditableText
            settingKey="sr_guide_caption"
            defaultText="Anthony leading a past Slow Roll. Photo credit: Minnesota Spokesman-Recorder."
            as="span"
          />
        </p>
      </div>
    </div>
  </section>
);

const PartnerCard = ({
  nameKey,
  nameDefault,
  descKey,
  descDefault,
  logoUrl,
  logoAlt,
}: {
  nameKey: string;
  nameDefault: string;
  descKey: string;
  descDefault: string;
  logoUrl?: string;
  logoAlt: string;
}) => (
  <div
    className="rounded-[12px] p-6 md:p-7 flex flex-col"
    style={{ background: "#fff", border: `1px solid ${C.line}` }}
  >
    <div
      className="mb-5 flex items-center justify-center rounded-md"
      style={{ height: 90, background: C.cream, border: `1px solid ${C.line}` }}
    >
      {logoUrl ? (
        <img src={logoUrl} alt={logoAlt} className="max-h-14 max-w-[70%] object-contain" />
      ) : (
        <span
          className="uppercase font-medium"
          style={{ letterSpacing: "0.16em", fontSize: 11, color: C.muted }}
        >
          Logo pending
        </span>
      )}
    </div>
    <h3 className="font-semibold mb-2" style={{ fontSize: 18, color: C.forest }}>
      <EditableText settingKey={nameKey} defaultText={nameDefault} as="span" />
    </h3>
    <p style={{ fontSize: 14.5, lineHeight: 1.6, color: C.muted }}>
      <EditableText settingKey={descKey} defaultText={descDefault} as="span" multiline />
    </p>
  </div>
);

const alsoLogo = "/__l5e/assets-v1/b06c9430-a522-4188-bdd1-333d9b3b5005/also-logo.webp";

const Partners = () => (
  <section style={{ background: "#fff", color: C.ink }} className="px-6 py-20 md:py-28">
    <div className="max-w-5xl mx-auto">
      <p
        className="uppercase font-semibold mb-4 text-center"
        style={{ letterSpacing: "0.18em", fontSize: 12, color: C.rust }}
      >
        <EditableText settingKey="sr_partners_eyebrow" defaultText="Partners" as="span" />
      </p>
      <h2
        className="font-bold mb-12 text-center"
        style={{ fontSize: "clamp(28px, 4vw, 40px)", color: C.forest }}
      >
        <EditableText
          settingKey="sr_partners_headline"
          defaultText="Made possible by."
          as="span"
        />
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <PartnerCard
          nameKey="sr_p1_name"
          nameDefault="Slow Roll MSP / Cultural Wellness Center"
          descKey="sr_p1_desc"
          descDefault="The ride organizer, led by Anthony Taylor."
          logoAlt="Slow Roll MSP"
        />
        <PartnerCard
          nameKey="sr_p2_name"
          nameDefault="ALSO"
          descKey="sr_p2_desc"
          descDefault="E-bikes provided for the ride. Several loaners available on-site for anyone who doesn't bring their own."
          logoUrl={alsoLogo}
          logoAlt="ALSO"
        />
        <PartnerCard
          nameKey="sr_p3_name"
          nameDefault="QBP"
          descKey="sr_p3_desc"
          descDefault="Pending. May provide additional loaner bikes."
          logoAlt="QBP"
        />
      </div>
    </div>
  </section>
);

const DetailRow = ({
  labelKey,
  labelDefault,
  valueKey,
  valueDefault,
}: {
  labelKey: string;
  labelDefault: string;
  valueKey: string;
  valueDefault: string;
}) => (
  <div
    className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-4"
    style={{ borderBottom: `1px solid ${C.line}` }}
  >
    <div
      className="uppercase font-semibold"
      style={{
        letterSpacing: "0.14em",
        fontSize: 11,
        color: C.muted,
        minWidth: 150,
      }}
    >
      <EditableText settingKey={labelKey} defaultText={labelDefault} as="span" />
    </div>
    <div style={{ fontSize: 16, color: C.ink, lineHeight: 1.55 }}>
      <EditableText settingKey={valueKey} defaultText={valueDefault} as="span" multiline />
    </div>
  </div>
);

const Details = () => (
  <section style={{ background: C.cream, color: C.ink }} className="px-6 py-20 md:py-28">
    <div className="max-w-3xl mx-auto">
      <p
        className="uppercase font-semibold mb-4"
        style={{ letterSpacing: "0.18em", fontSize: 12, color: C.rust }}
      >
        <EditableText settingKey="sr_details_eyebrow" defaultText="The details" as="span" />
      </p>
      <h2
        className="font-bold mb-10"
        style={{ fontSize: "clamp(30px, 4.5vw, 44px)", color: C.forest }}
      >
        <EditableText settingKey="sr_details_headline" defaultText="Everything you need." as="span" />
      </h2>
      <div
        className="rounded-[12px] p-6 md:p-8"
        style={{ background: "#fff", border: `1px solid ${C.line}` }}
      >
        <div style={{ borderTop: `1px solid ${C.line}` }}>
          <DetailRow
            labelKey="sr_det_date_l"
            labelDefault="Date"
            valueKey="sr_det_date_v"
            valueDefault="Wednesday, August 19, 2026"
          />
          <DetailRow
            labelKey="sr_det_time_l"
            labelDefault="Time"
            valueKey="sr_det_time_v"
            valueDefault="Evening. Exact start TBD."
          />
          <DetailRow
            labelKey="sr_det_start_l"
            labelDefault="Start"
            valueKey="sr_det_start_v"
            valueDefault="Near the Minneapolis Convention Center. Exact spot TBD."
          />
          <DetailRow
            labelKey="sr_det_cap_l"
            labelDefault="Capacity"
            valueKey="sr_det_cap_v"
            valueDefault="Capped at 100 riders."
          />
          <DetailRow
            labelKey="sr_det_bring_l"
            labelDefault="What to bring"
            valueKey="sr_det_bring_v"
            valueDefault="Your own bike, or borrow one of the ALSO e-bikes provided on-site. No bike required to join."
          />
          <DetailRow
            labelKey="sr_det_cost_l"
            labelDefault="Cost"
            valueKey="sr_det_cost_v"
            valueDefault="Free and open to the public."
          />
        </div>
        <div className="mt-8">
          <CTAButton settingKey="sr_details_cta" defaultText="Register — only 100 spots" size="lg" />
        </div>
      </div>
    </div>
  </section>
);

const Watch = () => (
  <section style={{ background: "#fff", color: C.ink }} className="px-6 py-20 md:py-28">
    <div className="max-w-3xl mx-auto">
      <p
        className="uppercase font-semibold mb-4 text-center"
        style={{ letterSpacing: "0.18em", fontSize: 12, color: C.rust }}
      >
        <EditableText settingKey="sr_watch_eyebrow" defaultText="Watch" as="span" />
      </p>
      <h2
        className="font-bold mb-8 text-center"
        style={{ fontSize: "clamp(28px, 4vw, 40px)", color: C.forest }}
      >
        <EditableText
          settingKey="sr_watch_headline"
          defaultText="Hear it from Anthony."
          as="span"
        />
      </h2>
      <div
        className="w-full rounded-[12px] overflow-hidden"
        style={{ aspectRatio: "16 / 9", border: `1px solid ${C.line}` }}
      >
        <iframe
          src="https://www.youtube.com/embed/4sTkjejTZPA"
          title="Bridging the gap: How Anthony Taylor is making outdoor recreation welcoming for all"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          style={{ border: 0 }}
        />
      </div>
      <p className="mt-4 text-center" style={{ fontSize: 13, color: C.muted }}>
        <EditableText
          settingKey="sr_watch_caption"
          defaultText="MPR News · Bridging the gap: How Anthony Taylor is making outdoor recreation welcoming for all (1:42)."
          as="span"
        />
      </p>
    </div>
  </section>
);

const FooterCTA = () => (
  <section style={{ background: C.forestDark, color: "#fff" }} className="px-6 py-20 md:py-28">
    <div className="max-w-3xl mx-auto text-center">
      <div className="mb-6">
        <Badge settingKey="sr_footer_pill" defaultText="OFFICIAL OUTDOOR RETAILER EVENT" />
      </div>
      <h2
        className="font-bold mb-5"
        style={{ fontSize: "clamp(34px, 5.5vw, 56px)", color: "#fff", lineHeight: 1.05 }}
      >
        <EditableText settingKey="sr_footer_headline" defaultText="Come ride with us." as="span" />
      </h2>
      <p className="mb-8 font-semibold" style={{ fontSize: 17, color: C.rust }}>
        <EditableText
          settingKey="sr_footer_capline"
          defaultText="Only 100 spots. Bring your bike or borrow one."
          as="span"
        />
      </p>
      <div className="mb-10">
        <CTAButton settingKey="sr_footer_cta" defaultText="Register — only 100 spots" size="lg" />
      </div>
      <div
        className="pt-8 space-y-2"
        style={{ borderTop: `1px solid rgba(255,255,255,0.12)`, color: "rgba(255,255,255,0.7)", fontSize: 14 }}
      >
        <p>
          <EditableText
            settingKey="sr_footer_presented"
            defaultText="Presented by Basecamp Outdoor and Slow Roll MSP."
            as="span"
          />
        </p>
        <p>
          <a
            href="mailto:jenna@wearetheoutdoorindustry.com"
            className="underline hover:text-white transition-colors"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            jenna@wearetheoutdoorindustry.com
          </a>
        </p>
      </div>
    </div>
  </section>
);

const EventSlowRoll = () => (
  <EditableTextProvider pageSlug="slow-roll">
    <PageMetaApplier title="Slow Roll x Basecamp · Minneapolis · Aug 19, 2026" />
    <main style={{ ...font, background: C.cream, color: C.ink }}>
      <Hero />
      <WhatItIs />
      <Theme />
      <Guide />
      <Partners />
      <Details />
      <Watch />
      <FooterCTA />
    </main>
  </EditableTextProvider>
);

export default EventSlowRoll;
