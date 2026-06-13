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
          <EditableText settingKey="sessions_headline" defaultText="The two open windows." as="span" />
        </h2>
        <p className="italic" style={{ fontSize: 16, color: SAGE }}>
          <EditableText settingKey="sessions_sub" defaultText="Same Typeform. Pick one or both." as="span" />
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg p-8 space-y-4" style={{ backgroundColor: CREAM, color: FOREST }}>
          <p
            className="uppercase font-semibold"
            style={{ fontSize: 13, letterSpacing: "1.4px", color: CORAL }}
          >
            <EditableText
              settingKey="sessions_happy_when"
              defaultText="THURSDAY · AUG 20 · 3–5PM"
              as="span"
            />
          </p>
          <h3 className="font-bold" style={{ fontSize: 32, color: FOREST }}>
            <EditableText settingKey="sessions_happy_title" defaultText="Happy Hour" as="span" />
          </h3>
          <p style={{ fontSize: 16, color: FOREST }}>
            <EditableText
              settingKey="sessions_happy_body"
              defaultText="Come early, stay late. Drinks, snacks, and the most relaxed networking you'll do all year."
              as="span"
              multiline
            />
          </p>
          <EditableLink
            textKey="sessions_happy_cta_text"
            urlKey="sessions_happy_cta_url"
            defaultText="Register for Happy Hour →"
            defaultUrl={REGISTER}
            className="inline-block font-bold underline underline-offset-4"
            style={{ color: CORAL, fontSize: 14 }}
          />
        </div>

        <div className="rounded-lg p-8 space-y-4" style={{ backgroundColor: CREAM, color: FOREST }}>
          <p
            className="uppercase font-semibold"
            style={{ fontSize: 13, letterSpacing: "1.4px", color: CORAL }}
          >
            <EditableText
              settingKey="sessions_brunch_when"
              defaultText="FRIDAY · AUG 21 · 10AM–12PM"
              as="span"
            />
          </p>
          <h3 className="font-bold" style={{ fontSize: 32, color: FOREST }}>
            <EditableText settingKey="sessions_brunch_title" defaultText="Women's Brunch" as="span" />
          </h3>
          <span
            className="inline-block uppercase rounded-full font-semibold"
            style={{
              backgroundColor: CORAL,
              color: CREAM,
              fontSize: 11,
              padding: "5px 12px",
              letterSpacing: "1px",
            }}
          >
            <EditableText
              settingKey="sessions_brunch_tag"
              defaultText="WOMEN IN THE OUTDOOR INDUSTRY"
              as="span"
            />
          </span>
          <p style={{ fontSize: 16, color: FOREST }}>
            <EditableText
              settingKey="sessions_brunch_body"
              defaultText="Morning gathering for women in the industry, and women trying to break in. Coffee, food, real talk."
              as="span"
              multiline
            />
          </p>
          <EditableLink
            textKey="sessions_brunch_cta_text"
            urlKey="sessions_brunch_cta_url"
            defaultText="Register for Women's Brunch →"
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
