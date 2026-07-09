import EditableText from "@/components/EditableText";
import EditableLink from "@/components/EditableLink";

const FOREST = "#1A2520";
const CREAM = "#F2E7D5";
const CORAL = "#E8836B";
const SAGE = "#A8B5A0";
const REGISTER = "https://basecampoutdoor.typeform.com/ORgatherings";

const MNTwoSessions = () => (
  <section className="px-6 py-20 md:py-28" style={{ backgroundColor: FOREST, color: CREAM }}>
    <div className="max-w-5xl mx-auto">
      <div className="text-center space-y-3 mb-12">
        <h2 className="font-normal" style={{ fontSize: 36, color: CREAM }}>
          <EditableText settingKey="sessions_headline" defaultText="The one open window." as="span" />
        </h2>
        <p className="italic" style={{ fontSize: 16, color: SAGE }}>
          <EditableText settingKey="sessions_sub" defaultText="One focused session. Free to register." as="span" />
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="rounded-lg p-8 space-y-4" style={{ backgroundColor: CREAM, color: FOREST }}>
          <p
            className="uppercase font-semibold"
            style={{ fontSize: 13, letterSpacing: "1.4px", color: CORAL }}
          >
            <EditableText
              settingKey="sessions_happy_when"
              defaultText="THURSDAY · AUG 20 · 10:30 AM–12:30 PM"
              as="span"
            />
          </p>
          <h3 className="font-bold" style={{ fontSize: 32, color: FOREST }}>
            <EditableText settingKey="sessions_happy_title" defaultText="Basecamp Outdoor Lounge" as="span" />
          </h3>
          <p style={{ fontSize: 16, color: FOREST }}>
            <EditableText
              settingKey="sessions_happy_body"
              defaultText="The most intentional networking you'll do all year, built around warm introductions and real conversations."
              as="span"
              multiline
            />
          </p>
          <EditableLink
            textKey="sessions_happy_cta_text"
            urlKey="sessions_happy_cta_url"
            defaultText="Register Free →"
            defaultUrl={REGISTER}
            className="inline-block font-bold underline underline-offset-4"
            style={{ color: CORAL, fontSize: 14 }}
          />
        </div>
      </div>
    </div>
  </section>
);

export default MNTwoSessions;
