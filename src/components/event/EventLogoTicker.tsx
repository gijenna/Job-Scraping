import creamTexture from "@/assets/cream-fabric-texture.jpg";

interface Brand {
  name: string;
  domain: string;
  logo_url?: string | null;
  url?: string | null;
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
          {tripled.map((brand, i) => {
            const imgSrc = brand.logo_url || `https://www.google.com/s2/favicons?domain=${brand.domain}&sz=128`;
            const inner = (
              <div className="inline-flex items-center justify-center mx-6 md:mx-10 shrink-0">
                <img
                  src={imgSrc}
                  alt={brand.name}
                  className="h-6 md:h-8 w-auto object-contain transition-transform hover:scale-110 mix-blend-multiply"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const parent = target.parentElement;
                    if (parent) {
                      const span = document.createElement('span');
                      span.className = 'font-display font-semibold text-sm md:text-base whitespace-nowrap';
                      span.style.color = '#9A8B76';
                      span.textContent = brand.name;
                      parent.replaceChildren(span);
                    }
                  }}
                />
              </div>
            );

            return brand.url ? (
              <a key={i} href={brand.url} target="_blank" rel="noopener noreferrer">
                {inner}
              </a>
            ) : (
              <div key={i}>{inner}</div>
            );
          })}
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
