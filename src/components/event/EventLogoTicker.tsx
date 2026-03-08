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
  // Triple the brands for seamless infinite scroll
  const tripled = [...brands, ...brands, ...brands];

  return (
    <section className="py-12 bg-white overflow-hidden">
      <p className="text-center text-gray-500 text-xs tracking-[0.3em] uppercase mb-8 font-body">
        {headline}
      </p>
      <div className="relative">
        <div
          className="flex whitespace-nowrap items-center"
          style={{
            animation: `logo-scroll 60s linear infinite`,
            width: 'max-content',
          }}
        >
          {tripled.map((brand, i) => (
            <div
              key={i}
              className="inline-flex items-center justify-center mx-6 md:mx-10 shrink-0"
            >
              <img
                src={`https://www.google.com/s2/favicons?domain=${brand.domain}&sz=128`}
                alt={brand.name}
                className="h-8 md:h-10 w-auto object-contain transition-transform hover:scale-110"
                loading="lazy"
                onError={(e) => {
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
