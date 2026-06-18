import EditableText from "@/components/EditableText";
import EditableLink from "@/components/EditableLink";
import { Link } from "react-router-dom";
import lounge from "@/assets/mn26/lounge-watercolor.jpg.asset.json";

const FOREST = "#1A2520";
const CREAM = "#F2E7D5";
const CORAL = "#E8836B";
const SAGE = "#A8B5A0";

const REGISTER = "https://basecampoutdoor.typeform.com/ORgatherings";
const PRESS_URL =
  "https://outdoorretailer.com/news/outdoor-retailer-introduces-or-gatherings-igniting-meaningful-industry-dialogue-on-the-show-floor/";

const Step = ({
  n,
  titleKey,
  titleDefault,
  bodyKey,
  bodyDefault,
}: {
  n: string;
  titleKey: string;
  titleDefault: string;
  bodyKey: string;
  bodyDefault: string;
}) => (
  <div className="flex gap-5">
    <div
      className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold"
      style={{ backgroundColor: CORAL, color: CREAM, fontSize: 20 }}
    >
      {n}
    </div>
    <div className="space-y-2">
      <h3 className="font-bold" style={{ fontSize: 22, color: FOREST }}>
        <EditableText settingKey={titleKey} defaultText={titleDefault} as="span" />
      </h3>
      <p style={{ fontSize: 16, color: FOREST, lineHeight: 1.55 }}>
        <EditableText settingKey={bodyKey} defaultText={bodyDefault} as="span" multiline />
      </p>
    </div>
  </div>
);

const MNHowItWorks = () => (
  <section className="px-6 py-20 md:py-28" style={{ backgroundColor: CREAM, color: FOREST }}>
    <div className="max-w-6xl mx-auto">
      <div className="text-center space-y-4 mb-12">
        <p
          className="uppercase font-semibold"
          style={{ fontSize: 12, letterSpacing: "1.6px", color: CORAL }}
        >
          <EditableText settingKey="how_eyebrow" defaultText="HOW IT WORKS" as="span" />
        </p>
        <h2 className="font-normal" style={{ fontSize: 40, color: FOREST, lineHeight: 1.1 }}>
          <EditableText
            settingKey="how_headline"
            defaultText="Two Gatherings. 100 seats each. Here's the play."
            as="span"
            multiline
          />
        </h2>
      </div>

      {/* Watercolor scene */}
      <div className="rounded-2xl overflow-hidden shadow-lg mb-14">
        <img
          src={lounge.url}
          alt="Illustrated watercolor scene of the Basecamp Outdoor Lounge at OR Gatherings with rocking chairs, high-top tables, and category signage"
          className="w-full h-auto block"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 mb-16">
        {/* Step 1 + session cards */}
        <div className="md:col-span-2 space-y-6">
          <Step
            n="1"
            titleKey="how_step1_title"
            titleDefault="Pick your session."
            bodyKey="how_step1_body"
            bodyDefault="Two windows on the OR show floor. First 100 people per session get a seat. Same Typeform, pick one or both."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 ml-0 md:ml-[68px]">
            <div
              className="rounded-lg p-6 space-y-3"
              style={{ backgroundColor: FOREST, color: CREAM }}
            >
              <p
                className="uppercase font-semibold"
                style={{ fontSize: 12, letterSpacing: "1.4px", color: CORAL }}
              >
                <EditableText
                  settingKey="how_happy_when"
                  defaultText="THURSDAY · AUG 20 · 3–5 PM"
                  as="span"
                />
              </p>
              <h4 className="font-bold" style={{ fontSize: 24, color: CREAM }}>
                <EditableText settingKey="how_happy_title" defaultText="Happy Hour" as="span" />
              </h4>
              <p style={{ fontSize: 14, color: CREAM, opacity: 0.9 }}>
                <EditableText
                  settingKey="how_happy_body"
                  defaultText="Drinks, snacks, and the most relaxed networking you'll do all year."
                  as="span"
                  multiline
                />
              </p>
              <EditableLink
                textKey="how_happy_cta_text"
                urlKey="how_happy_cta_url"
                defaultText="Apply for this session →"
                defaultUrl={REGISTER}
                className="inline-block rounded-full font-bold"
                style={{
                  backgroundColor: CORAL,
                  color: CREAM,
                  fontSize: 13,
                  padding: "10px 20px",
                }}
              />
            </div>

            <div
              className="rounded-lg p-6 space-y-3"
              style={{ backgroundColor: FOREST, color: CREAM }}
            >
              <p
                className="uppercase font-semibold"
                style={{ fontSize: 12, letterSpacing: "1.4px", color: CORAL }}
              >
                <EditableText
                  settingKey="how_brunch_when"
                  defaultText="FRIDAY · AUG 21 · 10 AM–12 PM"
                  as="span"
                />
              </p>
              <h4 className="font-bold" style={{ fontSize: 24, color: CREAM }}>
                <EditableText
                  settingKey="how_brunch_title"
                  defaultText="Women's Brunch"
                  as="span"
                />
              </h4>
              <p style={{ fontSize: 14, color: CREAM, opacity: 0.9 }}>
                <EditableText
                  settingKey="how_brunch_body"
                  defaultText="Morning gathering for women in the industry and women trying to break in. Coffee, food, real talk."
                  as="span"
                  multiline
                />
              </p>
              <EditableLink
                textKey="how_brunch_cta_text"
                urlKey="how_brunch_cta_url"
                defaultText="Apply for this session →"
                defaultUrl={REGISTER}
                className="inline-block rounded-full font-bold"
                style={{
                  backgroundColor: CORAL,
                  color: CREAM,
                  fontSize: 13,
                  padding: "10px 20px",
                }}
              />
            </div>
          </div>
        </div>

        <Step
          n="2"
          titleKey="how_step2_title"
          titleDefault="Plan your conversations."
          bodyKey="how_step2_body"
          bodyDefault="Browse the expert cards and pick who you want to chat with. Each card tells you what they actually know, so your two hours land."
        />

        <Step
          n="3"
          titleKey="how_step3_title"
          titleDefault="Grab your OR guest pass."
          bodyKey="how_step3_body"
          bodyDefault="We send your guest pass the day of the event. No OR Summer Market badge required to walk in."
        />

        <Step
          n="4"
          titleKey="how_step4_title"
          titleDefault="Walk into the Basecamp Outdoor Lounge."
          bodyKey="how_step4_body"
          bodyDefault="Find your experts. Pull up a rocker. Hug old friends. Meet the rest of the room."
        />

        <div className="flex items-center">
          <Link
            to="/MNexperts"
            className="inline-block rounded-full font-bold transition hover:opacity-90"
            style={{
              backgroundColor: FOREST,
              color: CREAM,
              fontSize: 15,
              padding: "14px 28px",
            }}
          >
            See the experts →
          </Link>
        </div>
      </div>

      <div
        className="rounded-lg p-6 md:p-8 text-center space-y-3"
        style={{ backgroundColor: FOREST, color: CREAM }}
      >
        <p
          className="uppercase font-semibold"
          style={{ fontSize: 11, letterSpacing: "1.6px", color: CORAL }}
        >
          <EditableText
            settingKey="how_or_eyebrow"
            defaultText="PRESENTED WITH OUTDOOR RETAILER"
            as="span"
          />
        </p>
        <p style={{ fontSize: 16, color: CREAM, lineHeight: 1.55 }}>
          <EditableText
            settingKey="how_or_body"
            defaultText="These are official OR Gatherings — Outdoor Retailer's new format for intentional, intimate conversations on the show floor. Basecamp Outdoor is hosting two of them in Minneapolis."
            as="span"
            multiline
          />
        </p>
        <EditableLink
          textKey="how_or_link_text"
          urlKey="how_or_link_url"
          defaultText="Read the announcement from Outdoor Retailer →"
          defaultUrl={PRESS_URL}
          className="inline-block italic underline underline-offset-4"
          style={{ color: CORAL, fontSize: 14 }}
        />
      </div>
    </div>
  </section>
);

export default MNHowItWorks;
