import EditableText from "@/components/EditableText";
import EditableLink from "@/components/EditableLink";

const FOREST = "#1A2520";
const CREAM = "#F2E7D5";

const SPONSORS = ["REI", "QBP", "Adidas", "The Dyrt"];

const MNSponsors = () => (
  <section className="px-6 py-20 md:py-28" style={{ backgroundColor: CREAM, color: FOREST }}>
    <div className="mx-auto" style={{ maxWidth: 1080 }}>
      <div className="text-center space-y-3 mb-12">
        <h2 className="font-normal" style={{ fontSize: 36, color: FOREST }}>
          <EditableText settingKey="sponsors_headline" defaultText="Brought to you by." as="span" />
        </h2>
        <p className="italic" style={{ fontSize: 16, color: FOREST }}>
          <EditableText
            settingKey="sponsors_sub"
            defaultText="Outdoor brands making this room free for everyone."
            as="span"
          />
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {SPONSORS.map((name, i) => (
          <div
            key={i}
            className="aspect-square flex items-center justify-center text-center font-bold"
            style={{
              backgroundColor: CREAM,
              border: `1px solid ${FOREST}`,
              color: FOREST,
              fontSize: 22,
            }}
          >
            <EditableText settingKey={`sponsors_name_${i + 1}`} defaultText={name} as="span" />
          </div>
        ))}
      </div>

      <p className="text-center mt-10 italic" style={{ fontSize: 14, color: FOREST }}>
        <EditableText
          settingKey="sponsors_cta_prefix"
          defaultText="Want to sponsor? "
          as="span"
        />
        <EditableLink
          textKey="sponsors_cta_text"
          urlKey="sponsors_cta_url"
          defaultText="Reach Jenna at jenna@wearetheoutdoorindustry.com →"
          defaultUrl="mailto:jenna@wearetheoutdoorindustry.com"
          target="_self"
          className="underline"
          style={{ color: FOREST }}
        />
      </p>
    </div>
  </section>
);

export default MNSponsors;
