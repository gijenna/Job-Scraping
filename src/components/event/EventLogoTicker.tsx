import creamTexture from "@/assets/cream-fabric-texture.jpg";

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
  const tripled = [...brands, ...brands, ...brands];

  return (
    <section
      className="py-6 overflow-hidden relative"
      style={{
        backgroundImage: `url(${creamTexture})`,
        backgroundSize: '512px 512px',
        backgroundRepeat: 'repeat',
      }}
    >
      <p className="text-center text-sm tracking-[0.3em] uppercase mb-4 font-body" style={{ color: '#9A8B76' }}>
        {headline}
      </p>
      <div className="relative overflow-hidden">
        <div
          className="flex whitespace-nowrap items-center"
          style={{
            animation: `ticker-scroll ${brands.length * 2.5}s linear infinite`,
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
                className="h-6 md:h-8 w-auto object-contain transition-transform hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="font-display font-semibold text-sm md:text-base whitespace-nowrap" style="color: #9A8B76">${brand.name}</span>`;
                  }
                }}
              />
            </div>
          ))}
        </div>

        <style>{`
          @keyframes ticker-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.3333%); }
          }
        `}</style>
      </div>
    </section>
  );
};

export type { Brand };
export default EventLogoTicker;
