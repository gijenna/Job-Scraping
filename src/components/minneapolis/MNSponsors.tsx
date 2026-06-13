const FOREST = "#1A2520";
const CREAM = "#F2E7D5";

// NOTE: Placeholder sponsor name tiles. Jenna will swap in real logos later.
const SPONSORS = ["REI", "QBP", "Adidas", "The Dyrt"];

const MNSponsors = () => (
  <section className="px-6 py-20 md:py-28" style={{ backgroundColor: CREAM, color: FOREST }}>
    <div className="mx-auto" style={{ maxWidth: 1080 }}>
      <div className="text-center space-y-3 mb-12">
        <h2 className="font-normal" style={{ fontSize: 36, color: FOREST }}>
          Brought to you by.
        </h2>
        <p className="italic" style={{ fontSize: 16, color: FOREST }}>
          Outdoor brands making this room free for everyone.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {SPONSORS.map((name) => (
          <div
            key={name}
            className="aspect-square flex items-center justify-center text-center font-bold"
            style={{
              backgroundColor: CREAM,
              border: `1px solid ${FOREST}`,
              color: FOREST,
              fontSize: 22,
            }}
          >
            {name}
          </div>
        ))}
      </div>

      <p className="text-center mt-10 italic" style={{ fontSize: 14, color: FOREST }}>
        Want to sponsor?{" "}
        <a href="mailto:jenna@wearetheoutdoorindustry.com" className="underline">
          Reach Jenna at jenna@wearetheoutdoorindustry.com →
        </a>
      </p>
    </div>
  </section>
);

export default MNSponsors;
