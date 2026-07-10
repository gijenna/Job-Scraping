import EditableText from "@/components/EditableText";
import EditableLink from "@/components/EditableLink";
import lockup from "@/assets/mn26/or-gatherings-stacked.png.asset.json";

const CREAM = "#F2E7D5";
const FOREST = "#1A2520";
const SAGE = "#A8B5A0";
const CORAL = "#E8836B";

const PRESS_URL =
  "https://outdoorretailer.com/news/outdoor-retailer-introduces-or-gatherings-igniting-meaningful-industry-dialogue-on-the-show-floor/";

const MNORGatherings = () => (
  <section className="px-6 py-20 md:py-24" style={{ backgroundColor: FOREST, color: CREAM }}>
    <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[320px_1fr] gap-10 md:gap-16 items-center">
      <div className="flex justify-center md:justify-start">
        <div
          className="rounded-2xl p-6 flex items-center justify-center border"
          style={{ backgroundColor: FOREST, borderColor: "rgba(242,231,213,0.15)" }}
        >
          <img
            src={lockup.url}
            alt="Basecamp Outdoor @ Minneapolis × OR Gatherings"
            className="w-full max-w-[220px] h-auto"
          />
        </div>
      </div>
      <div className="space-y-5">
        <p
          className="uppercase font-semibold"
          style={{ fontSize: 12, letterSpacing: "1.6px", color: CORAL }}
        >
          <EditableText
            settingKey="or_gatherings_eyebrow"
            defaultText="PRESENTED WITH OUTDOOR RETAILER"
            as="span"
          />
        </p>
        <h2 className="font-normal leading-tight" style={{ fontSize: 36, color: CREAM }}>
          <EditableText
            settingKey="or_gatherings_headline"
            defaultText="An OR Gathering, hosted by Basecamp Outdoor."
            as="span"
            multiline
          />
        </h2>
        <p style={{ fontSize: 17, color: CREAM, lineHeight: 1.55 }}>
          <EditableText
            settingKey="or_gatherings_body"
              defaultText="OR Gatherings are Outdoor Retailer's new format for intentional, intimate conversations on the show floor, built to spark meaningful industry dialogue. Basecamp Outdoor is hosting one focused Thursday morning session in Minneapolis."
            as="span"
            multiline
          />
        </p>
        <p className="italic" style={{ fontSize: 14, color: SAGE }}>
          <EditableText
            settingKey="or_gatherings_note"
              defaultText="Experts receive a free Outdoor Retailer badge for the show."
            as="span"
          />
        </p>
        <EditableLink
          textKey="or_gatherings_press_text"
          urlKey="or_gatherings_press_url"
          defaultText="Read the announcement from Outdoor Retailer →"
          defaultUrl={PRESS_URL}
          className="inline-block italic underline underline-offset-4"
          style={{ color: CORAL, fontSize: 14 }}
        />
      </div>
    </div>
  </section>
);

export default MNORGatherings;
