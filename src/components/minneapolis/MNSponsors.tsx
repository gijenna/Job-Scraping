import EditableText from "@/components/EditableText";
import EditableLink from "@/components/EditableLink";
import orLogo from "@/assets/mn26/sponsors/or-logo.png.asset.json";
import alsoLogo from "@/assets/mn26/sponsors/also-logo.webp.asset.json";
import basecampJobsLogo from "@/assets/mn26/sponsors/basecamp-match-logo.png.asset.json";

const FOREST = "#1A2520";
const CREAM = "#F2E7D5";

const SPONSORS = [
  {
    name: "Outdoor Retailer",
    logo: orLogo.url,
    url: "https://outdoorretailer.com",
  },
  {
    name: "ALSO",
    logo: alsoLogo.url,
    url: "https://ridealso.com",
  },
  {
    name: "Basecamp Jobs",
    logo: basecampJobsLogo.url,
    url: "https://basecampjobs.com",
  },
];

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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {SPONSORS.map((s, i) => (
          <a
            key={i}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-4 p-8 transition hover:opacity-80"
            style={{
              backgroundColor: CREAM,
              border: `1px solid ${FOREST}`,
              color: FOREST,
              minHeight: 220,
            }}
          >
            <div className="flex-1 flex items-center justify-center w-full">
              <img
                src={s.logo}
                alt={`${s.name} logo`}
                className="max-h-24 max-w-[70%] w-auto object-contain"
              />
            </div>
            <span className="font-bold text-center" style={{ fontSize: 18, color: FOREST }}>
              <EditableText settingKey={`sponsors_name_${i + 1}`} defaultText={s.name} as="span" />
            </span>
          </a>
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
