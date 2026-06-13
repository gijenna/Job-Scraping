const FOREST = "#1A2520";
const CREAM = "#F2E7D5";
const CORAL = "#E8836B";
const SAGE = "#A8B5A0";
const REGISTER = "https://basecampoutdoor.typeform.com/ORgatherings";

const MNTwoSessions = () => (
  <section className="px-6 py-20 md:py-28" style={{ backgroundColor: FOREST, color: CREAM }}>
    <div className="max-w-5xl mx-auto">
      <div className="text-center space-y-3 mb-12">
        <h2 className="font-normal" style={{ fontSize: 36, color: CREAM }}>
          The two open windows.
        </h2>
        <p className="italic" style={{ fontSize: 16, color: SAGE }}>
          Same Typeform. Pick one or both.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a
          href={REGISTER}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg p-8 transition hover:scale-[1.01] space-y-4"
          style={{ backgroundColor: CREAM, color: FOREST }}
        >
          <p
            className="uppercase font-semibold"
            style={{ fontSize: 13, letterSpacing: "1.4px", color: CORAL }}
          >
            THURSDAY · AUG 20 · 3–5PM
          </p>
          <h3 className="font-bold" style={{ fontSize: 32, color: FOREST }}>
            Happy Hour
          </h3>
          <p style={{ fontSize: 16, color: FOREST }}>
            Come early, stay late. Drinks, snacks, and the most relaxed networking you'll do all year.
          </p>
        </a>

        <a
          href={REGISTER}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg p-8 transition hover:scale-[1.01] space-y-4"
          style={{ backgroundColor: CREAM, color: FOREST }}
        >
          <p
            className="uppercase font-semibold"
            style={{ fontSize: 13, letterSpacing: "1.4px", color: CORAL }}
          >
            FRIDAY · AUG 21 · 10AM–12PM
          </p>
          <h3 className="font-bold" style={{ fontSize: 32, color: FOREST }}>
            Women's Brunch
          </h3>
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
            WOMEN IN THE OUTDOOR INDUSTRY
          </span>
          <p style={{ fontSize: 16, color: FOREST }}>
            Morning gathering for women in the industry, and women trying to break in. Coffee, food, real talk.
          </p>
        </a>
      </div>
    </div>
  </section>
);

export default MNTwoSessions;
