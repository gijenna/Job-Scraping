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

const EventsTicker = () => {
  const doubled = [...words, ...words];

  return (
    <section className="bg-events-cream py-5 overflow-hidden">
      <div className="flex animate-events-ticker whitespace-nowrap">
        {doubled.map((word, i) => (
          <span
            key={i}
            className="inline-block mx-6 text-xl md:text-2xl uppercase tracking-widest text-events-teal"
            style={{ fontFamily: '"Josefin Sans", sans-serif', fontWeight: 300 }}
          >
            {word} ✦
          </span>
        ))}
      </div>
    </section>
  );
};

export default EventsTicker;
