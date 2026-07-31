import { Link } from "react-router-dom";
import EditableText from "@/components/EditableText";

const FOREST = "#1A2520";
const CREAM = "#F2E7D5";

const MNSlowRollCTA = () => (
  <section className="px-6 py-20 md:py-28" style={{ backgroundColor: CREAM, color: FOREST }}>
    <div className="mx-auto text-center space-y-5" style={{ maxWidth: 820 }}>
      <p className="uppercase tracking-[0.2em]" style={{ fontSize: 13, opacity: 0.7 }}>
        <EditableText settingKey="slowroll_cta_eyebrow" defaultText="The night before" as="span" />
      </p>
      <h2 className="font-normal" style={{ fontSize: 36 }}>
        <EditableText
          settingKey="slowroll_cta_headline"
          defaultText="Slow Roll x Basecamp."
          as="span"
        />
      </h2>
      <p style={{ fontSize: 17 }}>
        <EditableText
          settingKey="slowroll_cta_body"
          defaultText="A community bike ride through Minneapolis on Wednesday, August 19. Free, easy pace, everyone welcome."
          as="span"
        />
      </p>
      <div className="pt-2">
        <Link
          to="/slow-roll"
          className="inline-block px-8 py-3.5 font-bold transition hover:opacity-85"
          style={{ backgroundColor: FOREST, color: CREAM, fontSize: 16 }}
        >
          <EditableText settingKey="slowroll_cta_button" defaultText="See the ride" as="span" />
        </Link>
      </div>
    </div>
  </section>
);

export default MNSlowRollCTA;
