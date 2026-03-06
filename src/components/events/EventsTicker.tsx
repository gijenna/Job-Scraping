const words = [
  "Career Exploration",
  "Expert Sessions",
  "Industry Workshops",
  "Mentor Meetups",
  "Brand Connections",
  "Outdoor Leaders",
  "Skill Building",
  "Networking",
  "Career Pivots",
  "Discovery",
  "Panel Discussions",
  "Resume Reviews",
  "Leadership Talks",
];

const colors = ["text-events-coral", "text-events-yellow", "text-events-cream"];

const EventsTicker = () => {
  const doubled = [...words, ...words];

  return (
    <section className="bg-events-teal py-5 overflow-hidden border-y border-events-cream/10">
      <div className="flex animate-events-ticker whitespace-nowrap">
        {doubled.map((word, i) => (
          <span
            key={i}
            className={`inline-block mx-6 text-xl md:text-2xl font-ticker ${colors[i % colors.length]}`}
          >
            {word} ✦
          </span>
        ))}
      </div>
    </section>
  );
};

export default EventsTicker;
