import { Link } from "react-router-dom";
import EditableText from "@/components/EditableText";

const FOREST = "#1A2520";
const CREAM = "#F2E7D5";

const MNBrandCTA = () => (
  <section className="px-6 py-20 md:py-28" style={{ backgroundColor: FOREST, color: CREAM }}>
    <div className="mx-auto text-center space-y-5" style={{ maxWidth: 820 }}>
      <p className="uppercase tracking-[0.2em]" style={{ fontSize: 13, color: "#ED7660" }}>
        <EditableText settingKey="brand_cta_eyebrow" defaultText="For brands" as="span" />
      </p>
      <h2 className="font-normal" style={{ fontSize: 36 }}>
        <EditableText
          settingKey="brand_cta_headline"
          defaultText="See your brand in the room."
          as="span"
        />
      </h2>
      <p style={{ fontSize: 17, opacity: 0.85 }}>
        <EditableText
          settingKey="brand_cta_body"
          defaultText="Bring an expert, or partner on the lounge the whole industry walks through. Sponsorship options, pricing, and what you get are all laid out."
          as="span"
        />
      </p>
      <div className="pt-2">
        <Link
          to="/minneapolis26-brands"
          className="inline-block px-8 py-3.5 font-bold transition hover:opacity-85"
          style={{ backgroundColor: "#ED7660", color: FOREST, fontSize: 16 }}
        >
          <EditableText
            settingKey="brand_cta_button"
            defaultText="See sponsorship options"
            as="span"
          />
        </Link>
      </div>
    </div>
  </section>
);

export default MNBrandCTA;
