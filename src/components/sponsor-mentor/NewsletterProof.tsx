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
    <div className="grid gap-5 md:grid-cols-2">
      <div style={{ background: "#fff", border: `1px solid ${TEAL}22`, borderRadius: 14 }} className="p-6">
        <div style={{ color: `${TEAL}88` }} className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em]">
          <T k="news_mention_label" d="Newsletter · Mention" />
        </div>
        <div style={{ color: TEAL }} className="text-sm font-light leading-relaxed">
          <T
            k="news_mention_body"
            d="Thank you to the brands putting mentors on the roster for the HBCU mentor network this year, including your brand."
            multiline
          />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <LogoChip size={32} />
          <span style={{ color: `${TEAL}99` }} className="text-xs">
            <T k="news_mention_brand" d="Your brand" />
          </span>
        </div>
        <div style={{ color: `${TEAL}55` }} className="mt-5 text-[11px] italic">
          <T k="news_mention_note" d="Included with Mentor Partner ($1,000)" />
        </div>
      </div>

      <div style={{ background: TEAL, border: `1px solid ${CORAL}`, borderRadius: 14 }} className="p-6 md:p-7">
        <div style={{ color: GOLD }} className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em]">
          <T k="news_feature_label" d="Newsletter · Full Feature" />
        </div>
        <LogoChip size={56} />
        <h4 style={{ color: CREAM, fontWeight: 600 }} className="mt-5 text-2xl leading-tight">
          <T k="news_feature_title" d="On the roster: your brand" />
        </h4>
        <p style={{ color: `${CREAM}cc` }} className="mt-3 text-sm font-light leading-relaxed">
          <T
            k="news_feature_body"
            d="Your brand put a mentor on the roster for the HBCU mentor network. One team member, one student, a full academic year. Here is who they are, why they said yes, and what the student is building."
            multiline
          />
        </p>
        <span
          style={{ background: CORAL, color: "#fff" }}
          className="mt-5 inline-block rounded-md px-3 py-1.5 text-xs font-semibold"
        >
          <T k="news_feature_cta" d="Read more" />
        </span>
        <div style={{ color: `${CREAM}77` }} className="mt-5 text-[11px] italic">
          <T k="news_feature_note" d="Included with Megaphone Partner ($5,000)" />
        </div>
      </div>
    </div>

    <div className="mt-6">
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
