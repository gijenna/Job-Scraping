const FOREST = "#1A2520";
const CREAM = "#F2E7D5";
const CORAL = "#E8836B";

const cards = [
  {
    label: "ALREADY IN",
    head: "Industry, leveling up.",
    body: "Skip the cold-email game. Meet the people who can shortcut your next move.",
  },
  {
    label: "ALREADY IN",
    head: "Industry, just engaging.",
    body: "No motive. You just love this community and want to be in the room with it. See old friends. Make new ones.",
  },
  {
    label: "NOT IN YET",
    head: "Industry-curious.",
    body: "Historically that's been the wall. Too expensive, not a buyer, not press, not invited. For these two windows, you walk right in. Free.",
  },
];

const MNWhatIsThis = () => (
  <section className="px-6 py-20 md:py-28" style={{ backgroundColor: CREAM, color: FOREST }}>
    <div className="mx-auto" style={{ maxWidth: 720 }}>
      <div className="text-center space-y-6">
        <h2 className="font-normal" style={{ fontSize: 36, color: FOREST }}>
          OR Gatherings × Basecamp Outdoor Lounge
        </h2>
        <p style={{ fontSize: 18, color: FOREST }}>
          OR Gatherings is your opportunity to network with industry legends. Perfect for anyone who works in the outdoor industry, or wants to.
        </p>
        <p className="font-bold pt-4" style={{ fontSize: 22, color: FOREST }}>
          Made for three kinds of people.
        </p>
      </div>
    </div>

    <div className="mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6" style={{ maxWidth: 1080 }}>
      {cards.map((c, i) => (
        <div
          key={i}
          className="rounded-lg p-8 space-y-4"
          style={{
            backgroundColor: CREAM,
            border: `1px solid ${FOREST}`,
            color: FOREST,
          }}
        >
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
            {c.label}
          </span>
          <h3 className="font-bold" style={{ fontSize: 20, color: FOREST }}>
            {c.head}
          </h3>
          <p style={{ fontSize: 16, color: FOREST }}>{c.body}</p>
        </div>
      ))}
    </div>

    <div className="mx-auto mt-14" style={{ maxWidth: 1080 }}>
      <blockquote
        className="rounded-lg italic text-center px-8 py-10"
        style={{ backgroundColor: FOREST, color: CREAM, fontSize: 26 }}
      >
        "Most of these people don't reply to LinkedIn DMs. For two days in August, they're answering in person."
      </blockquote>
    </div>
  </section>
);

export default MNWhatIsThis;
