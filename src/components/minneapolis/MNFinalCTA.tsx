const FOREST = "#1A2520";
const CREAM = "#F2E7D5";
const CORAL = "#E8836B";
const REGISTER = "https://basecampoutdoor.typeform.com/ORgatherings";

const MNFinalCTA = () => (
  <section
    className="px-6 py-24 md:py-32 text-center"
    style={{ backgroundColor: CORAL, color: FOREST }}
  >
    <div className="max-w-3xl mx-auto space-y-6">
      <h2
        className="font-bold leading-tight"
        style={{ fontSize: "clamp(32px, 5vw, 48px)", color: FOREST }}
      >
        Free. No badge. No gatekeepers.
      </h2>
      <p style={{ fontSize: 18, color: FOREST }}>
        Two open windows in August. Walk right in.
      </p>
      <div className="pt-4">
        <a
          href={REGISTER}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full font-bold transition hover:opacity-90"
          style={{
            backgroundColor: CREAM,
            color: CORAL,
            fontSize: 20,
            padding: "20px 44px",
          }}
        >
          Register now →
        </a>
      </div>
    </div>
  </section>
);

export default MNFinalCTA;
