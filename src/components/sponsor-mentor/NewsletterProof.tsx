import EditableText from "@/components/EditableText";
import basecampLogo from "@/assets/basecamp-outdoor-logo.png";

const TEAL = "#19363B";
const CORAL = "#ED7660";
const GOLD = "#E1B624";
const CREAM = "#E6E1CE";

const font = { fontFamily: "'Josefin Sans', sans-serif" } as const;

const T = ({ k, d, multiline }: { k: string; d: string; multiline?: boolean }) => (
  <EditableText settingKey={k} defaultText={d} as="span" multiline={multiline} />
);

const LogoChip = ({ size }: { size: number }) => (
  <div
    style={{ width: size, height: size, background: "#fff", border: `1px solid ${TEAL}22`, borderRadius: 8 }}
    className="flex shrink-0 items-center justify-center overflow-hidden"
  >
    <img src={basecampLogo} alt="Your brand" className="max-h-[80%] max-w-[80%] object-contain" />
  </div>
);

/**
 * Reuses the Minneapolis brand page newsletter mockup pattern, reworded for the
 * mentor network. MN26Brands.tsx itself is untouched.
 */
const NewsletterProof = () => (
  <div style={font}>
    <div>
      <p style={{ color: `${TEAL}88` }} className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em]">
        <T k="news_embed_label" d="A live example of the newsletter" />
      </p>
      <div
        style={{ background: "#fff", borderRadius: 16, border: `1px solid ${TEAL}22` }}
        className="overflow-hidden shadow-2xl"
      >
        <iframe
          src="https://www.partnerwithbasecamp.com/minneapolis"
          title="Basecamp newsletter example"
          className="w-full"
          style={{ height: "1100px", border: 0, display: "block" }}
          loading="lazy"
        />
      </div>
      <p className="mt-3 text-center text-xs">
        <a
          href="https://www.partnerwithbasecamp.com/minneapolis"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: TEAL }}
          className="underline hover:opacity-80"
        >
          Open in a new tab
        </a>
      </p>
    </div>
  </div>
);

export default NewsletterProof;
