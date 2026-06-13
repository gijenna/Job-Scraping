const FOREST = "#1A2520";
const CREAM = "#F2E7D5";
const CORAL = "#E8836B";
const SAGE = "#A8B5A0";
const REGISTER = "https://basecampoutdoor.typeform.com/ORgatherings";
const APPLY = "https://basecampoutdoor.typeform.com/MNExperts";

const MNHero = () => (
  <section
    className="w-full flex items-center justify-center px-6 py-20 md:py-0 md:min-h-screen min-h-[60vh]"
    style={{ backgroundColor: FOREST, color: CREAM }}
  >
    <div className="max-w-4xl text-center space-y-8">
      <p
        className="uppercase"
        style={{ fontSize: 13, letterSpacing: "1.6px", color: CREAM }}
      >
        INDUSTRY EXPERTS · OR GATHERINGS
      </p>
      <h1
        className="font-normal leading-tight"
        style={{ fontSize: "clamp(36px, 5.5vw, 56px)", color: CREAM }}
      >
        This is the room you've been trying to get into.
      </h1>
      <p className="italic" style={{ fontSize: 20, color: SAGE }}>
        Two days. Industry experts. No OR badge needed.
      </p>
      <p
        className="uppercase"
        style={{ fontSize: 14, letterSpacing: "1.4px", color: CREAM }}
      >
        AUG 20 + 21 · MINNEAPOLIS CONVENTION CENTER · INSIDE OUTDOOR RETAILER
      </p>
      <div className="pt-4 flex flex-col items-center gap-5">
        <a
          href={REGISTER}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full font-bold transition hover:opacity-90"
          style={{
            backgroundColor: CORAL,
            color: CREAM,
            fontSize: 18,
            padding: "18px 40px",
          }}
        >
          Register free · no badge needed
        </a>
        <a
          href={APPLY}
          target="_blank"
          rel="noopener noreferrer"
          className="italic underline-offset-4 hover:underline"
          style={{ color: CREAM, fontSize: 14 }}
        >
          Are you an industry expert? Apply here →
        </a>
      </div>
    </div>
  </section>
);

export default MNHero;
