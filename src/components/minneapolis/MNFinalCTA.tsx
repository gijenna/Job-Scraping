import EditableText from "@/components/EditableText";
import EditableLink from "@/components/EditableLink";

const FOREST = "#1A2520";
const CREAM = "#F2E7D5";
const CORAL = "#E8836B";
const REGISTER = "https://basecampoutdoor.typeform.com/ORgatherings";

const MNFinalCTA = () => (
  <section
    className="px-6 py-24 md:py-32 text-center"
    style={{ backgroundColor: CORAL, color: FOREST }}
  >
    <div className="max-w-3xl mx-auto space-y-6">
      <h2
        className="font-bold leading-tight"
        style={{ fontSize: "clamp(32px, 5vw, 48px)", color: FOREST }}
      >
        <EditableText
          settingKey="final_headline"
          defaultText="Free. No badge. No gatekeepers."
          as="span"
        />
      </h2>
      <p style={{ fontSize: 18, color: FOREST }}>
        <EditableText
          settingKey="final_sub"
          defaultText="One Thursday morning window. Walk right in."
          as="span"
        />
      </p>
      <div className="pt-4">
        <EditableLink
          textKey="final_cta_text"
          urlKey="final_cta_url"
          defaultText="Register now →"
          defaultUrl={REGISTER}
          className="inline-block rounded-full font-bold transition hover:opacity-90"
          style={{ backgroundColor: CREAM, color: CORAL, fontSize: 20, padding: "20px 44px" }}
        />
      </div>
    </div>
  </section>
);

export default MNFinalCTA;
