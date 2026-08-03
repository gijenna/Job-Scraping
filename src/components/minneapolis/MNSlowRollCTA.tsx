import { Link } from "react-router-dom";
import EditableText from "@/components/EditableText";
import EditableLink from "@/components/EditableLink";
import slowRollHero from "@/assets/slowroll/hero.jpg.asset.json";

const FOREST = "#1A2520";
const CREAM = "#F2E7D5";
const CORAL = "#E8836B";

const REGISTER_URL = "https://basecampoutdoor.typeform.com/to/yumTbpY7";

const MNSlowRollCTA = () => (
  <section className="px-6 py-20 md:py-28" style={{ backgroundColor: CREAM, color: FOREST }}>
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      <div className="rounded-lg overflow-hidden" style={{ backgroundColor: FOREST }}>
        <img
          src={slowRollHero.url}
          alt="Riders on a community Slow Roll bike ride through Minneapolis"
          className="w-full h-full object-cover"
          style={{ maxHeight: 420 }}
          loading="lazy"
        />
      </div>

      <div className="space-y-5">
        <p className="uppercase tracking-[0.2em]" style={{ fontSize: 13, color: CORAL }}>
          <EditableText settingKey="slowroll_cta_eyebrow" defaultText="The night before" as="span" />
        </p>
        <h2 className="font-normal" style={{ fontSize: 36, lineHeight: 1.1 }}>
          <EditableText
            settingKey="slowroll_cta_headline"
            defaultText="Slow Roll x Basecamp."
            as="span"
          />
        </h2>
        <p style={{ fontSize: 17, lineHeight: 1.55 }}>
          <EditableText
            settingKey="slowroll_cta_body"
            defaultText="A community bike ride through Minneapolis on Wednesday, August 19. Free, easy pace, everyone welcome. Bikes and lights available if you need them."
            as="span"
            multiline
          />
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <EditableLink
            textKey="slowroll_cta_register_text"
            urlKey="slowroll_cta_register_url"
            defaultText="Register for the ride →"
            defaultUrl={REGISTER_URL}
            className="inline-block px-8 py-3.5 font-bold rounded-full transition hover:opacity-85"
            style={{ backgroundColor: CORAL, color: CREAM, fontSize: 16 }}
          />
          <Link
            to="/slow-roll"
            className="inline-block px-8 py-3.5 font-bold rounded-full transition hover:opacity-85"
            style={{ backgroundColor: FOREST, color: CREAM, fontSize: 16 }}
          >
            <EditableText settingKey="slowroll_cta_button" defaultText="See the ride" as="span" />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default MNSlowRollCTA;
