const brands = [
  "Nike", "Adidas", "REI", "Patagonia", "Columbia", "The North Face",
  "KEEN", "On Running", "Lululemon", "Cotopaxi", "Garmin", "Rivian",
  "BOA", "VF Corporation", "Snow Peak", "Ruffwear", "Backbone",
  "A-Basin", "Outside Inc", "AllTrails", "Superfeet", "Dovetail Workwear",
  "Microsoft", "HP Inc",
];

const LogoTicker = () => {
  return (
    <section className="py-12 border-y border-border overflow-hidden">
      <p className="text-center text-muted-foreground text-xs tracking-[0.3em] uppercase mb-8 font-body">
        Where leaders from the world's most iconic brands gather
      </p>
      <div className="relative">
        <div className="flex animate-logo-scroll whitespace-nowrap">
          {[...brands, ...brands].map((brand, i) => (
            <span
              key={i}
              className="inline-block mx-6 md:mx-10 text-muted-foreground/60 font-display font-semibold text-sm md:text-base whitespace-nowrap hover:text-primary transition-colors"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoTicker;
