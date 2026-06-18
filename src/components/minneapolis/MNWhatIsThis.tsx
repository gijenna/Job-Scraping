import EditableText from "@/components/EditableText";
import bg1 from "@/assets/mn26/AnthonyMarz_Basecamp-083.jpg.asset.json";
import bg2 from "@/assets/mn26/AnthonyMarz_Basecamp-094.jpg.asset.json";
import bg3 from "@/assets/mn26/Copy_of_AnthonyMarz_Basecamp-045.jpg.asset.json";
import lounge from "@/assets/mn26/lounge-watercolor.jpg.asset.json";

const FOREST = "#1A2520";
const CREAM = "#F2E7D5";
const CORAL = "#E8836B";

const cards = [
  {
    bg: bg1.url,
    labelKey: "what_card1_label",
    labelDefault: "LEVEL UP",
    headKey: "what_card1_head",
    headDefault: "Already in the industry, ready to level up.",
    bodyKey: "what_card1_body",
    bodyDefault:
      "Skip the cold-email game. The people who can shortcut your next move are in this room.",
  },
  {
    bg: bg2.url,
    labelKey: "what_card2_label",
    labelDefault: "BREAK IN",
    headKey: "what_card2_head",
    headDefault: "Mid-career, industry-curious.",
    bodyKey: "what_card2_body",
    bodyDefault:
      "You've got the skills. You need the network and the intel. Two hours, the right room, real conversations.",
  },
  {
    bg: bg3.url,
    labelKey: "what_card3_label",
    labelDefault: "NO FOMO",
    headKey: "what_card3_head",
    headDefault: "Curious about the OR show.",
    bodyKey: "what_card3_body",
    bodyDefault:
      "Not a buyer, not press, not invited? Doesn't matter. Hug your friends. See what the show is actually about. Walk in free.",
  },
];


const MNWhatIsThis = () => (
  <section className="px-6 py-20 md:py-28" style={{ backgroundColor: CREAM, color: FOREST }}>
    <div className="mx-auto" style={{ maxWidth: 720 }}>
      <div className="text-center space-y-6">
        <h2 className="font-normal" style={{ fontSize: 36, color: FOREST }}>
          <EditableText
            settingKey="what_headline"
            defaultText="OR Gatherings × Basecamp Outdoor Lounge"
            as="span"
          />
        </h2>
        <p style={{ fontSize: 18, color: FOREST }}>
          <EditableText
            settingKey="what_sub"
            defaultText="Three reasons people walk in: break into the industry, check out the OR show, or just avoid the FOMO."
            as="span"
            multiline
          />
        </p>

        <p className="font-bold pt-4" style={{ fontSize: 22, color: FOREST }}>
          <EditableText
            settingKey="what_made_for"
            defaultText="Made for three kinds of people."
            as="span"
          />
        </p>
      </div>
    </div>

    <div className="mx-auto mt-10 rounded-2xl overflow-hidden shadow-lg" style={{ maxWidth: 1080 }}>
      <img
        src={lounge.url}
        alt="Illustrated watercolor scene of the Basecamp Outdoor Lounge with rocking chairs, high-top tables, expert cards, and category signage"
        className="w-full h-auto block"
      />
    </div>

    <div className="mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6" style={{ maxWidth: 1080 }}>
      {cards.map((c, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-lg p-8 space-y-4 min-h-[280px] flex flex-col justify-end"
        >
          <img
            src={c.bg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(180deg, rgba(26,37,32,0.35) 0%, rgba(26,37,32,0.92) 100%)` }}
          />
          <div className="relative z-10 space-y-4" style={{ color: CREAM }}>
            <span
              className="inline-flex items-center justify-center uppercase rounded-full font-semibold"
              style={{
                backgroundColor: CORAL,
                color: CREAM,
                fontSize: 11,
                padding: "6px 14px",
                letterSpacing: "1.2px",
                minWidth: 96,
              }}
            >
              <EditableText settingKey={c.labelKey} defaultText={c.labelDefault} as="span" />
            </span>

            <h3 className="font-bold" style={{ fontSize: 22, color: CREAM }}>
              <EditableText settingKey={c.headKey} defaultText={c.headDefault} as="span" />
            </h3>
            <p style={{ fontSize: 15, color: CREAM, opacity: 0.95 }}>
              <EditableText settingKey={c.bodyKey} defaultText={c.bodyDefault} as="span" multiline />
            </p>
          </div>
        </div>
      ))}
    </div>

    <div className="mx-auto mt-14" style={{ maxWidth: 1080 }}>
      <blockquote
        className="rounded-lg italic text-center px-8 py-10"
        style={{ backgroundColor: FOREST, color: CREAM, fontSize: 24 }}
      >
        <EditableText
          settingKey="what_pullquote"
          defaultText={`"Most of these people don't reply to LinkedIn DMs. For two days in August, they're answering in person."`}
          as="span"
          multiline
        />
      </blockquote>
    </div>
  </section>
);

export default MNWhatIsThis;
