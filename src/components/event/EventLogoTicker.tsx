import { useRef, useEffect, useState } from "react";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    if (scrollRef.current) {
      // Measure width of one set of brands
      const children = scrollRef.current.children;
      let w = 0;
      for (let i = 0; i < brands.length; i++) {
        const child = children[i] as HTMLElement;
        if (child) w += child.offsetWidth;
      }
      setScrollWidth(w);
    }
  }, [brands]);

  return (
    <section className="py-12 bg-white overflow-hidden">
      <p className="text-center text-gray-500 text-xs tracking-[0.3em] uppercase mb-8 font-body">
        {headline}
      </p>
      <div className="relative overflow-hidden">
        <div
          ref={scrollRef}
          className="flex whitespace-nowrap items-center"
          style={{
            animation: scrollWidth
              ? `ticker-scroll ${brands.length * 2.5}s linear infinite`
              : undefined,
          }}
        >
          {/* Render brands 3x for seamless wrapping */}
          {[...brands, ...brands, ...brands].map((brand, i) => (
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
                    parent.innerHTML = `<span class="text-gray-400 font-display font-semibold text-sm md:text-base whitespace-nowrap">${brand.name}</span>`;
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
