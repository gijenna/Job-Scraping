interface Brand {
  name: string;
  domain: string;
}

interface EventLogoTickerProps {
  brands: Brand[];
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
        <div className="flex animate-logo-scroll whitespace-nowrap items-center">
          {[...brands, ...brands].map((brand, i) => (
            <div
              key={i}
              className="inline-flex items-center justify-center mx-6 md:mx-10 shrink-0"
            >
              <img
                src={`https://www.google.com/s2/favicons?domain=${brand.domain}&sz=128`}
                alt={brand.name}
                className="h-8 md:h-10 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                loading="lazy"
                onError={(e) => {
                  // Fallback to text if logo fails
                  const target = e.currentTarget;
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="text-muted-foreground/60 font-display font-semibold text-sm md:text-base whitespace-nowrap">${brand.name}</span>`;
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export type { Brand };
export default EventLogoTicker;
