interface EventLogoTickerProps {
  brands: string[];
  headline?: string;
}

const EventLogoTicker = ({
  brands,
  headline = "Where leaders from the world's most iconic brands gather",
}: EventLogoTickerProps) => {
  return (
    <section className="py-12 border-y border-border overflow-hidden">
      <p className="text-center text-muted-foreground text-xs tracking-[0.3em] uppercase mb-8 font-body">
        {headline}
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
      <p className="text-center text-muted-foreground/40 text-xs mt-6 font-body italic">
        Logos coming soon — brand names shown as placeholder
      </p>
    </section>
  );
};

export default EventLogoTicker;
