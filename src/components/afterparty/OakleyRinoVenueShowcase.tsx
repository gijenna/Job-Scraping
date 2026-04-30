import { useEffect, useState } from "react";
import { MapPin, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import rinoHero from "@/assets/oakley-rino/rino-hero.jpg";
import rino1 from "@/assets/oakley-rino/rino-1.jpg";
import rino2 from "@/assets/oakley-rino/rino-2.jpg";
import rino3 from "@/assets/oakley-rino/rino-3.jpg";
import rino4 from "@/assets/oakley-rino/rino-4.jpg";

/**
 * Compact venue card for /guestsoakley. Sits in the side rail between
 * "X people coming" and the venue blurb. Photos rotate as a horizontal
 * carousel (CSS opacity stacking — never AnimatePresence, per project rule).
 */
const VENUE_PHOTOS: { src: string; alt: string }[] = [
  { src: rinoHero, alt: "Oakley RiNo storefront in the alleyway" },
  { src: rino1, alt: "Oakley RiNo interior detail" },
  { src: rino2, alt: "Oakley RiNo interior" },
  { src: rino3, alt: "Oakley RiNo interactive wall" },
  { src: rino4, alt: "Oakley RiNo product display" },
];

const ADDRESS_LINE_1 = "2660 Walnut Street, Unit 3";
const ADDRESS_LINE_2 = "Denver, CO";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("Oakley RiNo 2660 Walnut Street Unit 3 Denver CO");

const AUTO_ADVANCE_MS = 4000;

const OakleyRinoVenueShowcase = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % VENUE_PHOTOS.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(t);
  }, [paused]);

  const go = (delta: number) => {
    setIndex((i) => (i + delta + VENUE_PHOTOS.length) % VENUE_PHOTOS.length);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden grid grid-cols-[132px_minmax(0,1fr)] sm:grid-cols-[156px_minmax(0,1fr)] items-stretch"
      style={{
        backgroundColor: "rgba(17,17,17,0.7)",
        border: "1px solid rgba(245,230,211,0.12)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Compact carousel — single image visible, opacity-stacked */}
      <div
        className="relative min-h-[132px] sm:min-h-[138px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ backgroundColor: "rgba(8,8,8,0.4)" }}
          aria-label="Photos of the Oakley RiNo store"
        >
          {VENUE_PHOTOS.map((photo, i) => (
            <img
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              loading={i === 0 ? "eager" : "lazy"}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: i === index ? 1 : 0,
                transition: "opacity 700ms ease-in-out",
              }}
              aria-hidden={i === index ? undefined : true}
            />
          ))}

          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="absolute top-1/2 left-1.5 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
            style={{
              backgroundColor: "rgba(8,8,8,0.55)",
              color: "#F5E6D3",
              border: "1px solid rgba(245,230,211,0.18)",
            }}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="absolute top-1/2 right-1.5 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
            style={{
              backgroundColor: "rgba(8,8,8,0.55)",
              color: "#F5E6D3",
              border: "1px solid rgba(245,230,211,0.18)",
            }}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1.5">
            {VENUE_PHOTOS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to photo ${i + 1}`}
                className="rounded-full transition-all"
                style={{
                  width: i === index ? 14 : 5,
                  height: 5,
                  backgroundColor:
                    i === index ? "#ED7660" : "rgba(245,230,211,0.55)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Venue text, kept beside photos so this panel stays short */}
      <div className="px-4 py-3 sm:px-5 sm:py-3.5 min-w-0">
        <div
          className="text-[9px] uppercase mb-1.5"
          style={{
            letterSpacing: "0.2em",
            color: "#FAC775",
            fontWeight: 600,
          }}
        >
          The Venue
        </div>
        <h2
          className="font-afterparty text-[20px] sm:text-[23px] leading-none"
          style={{ color: "#F5E6D3", fontWeight: 500 }}
        >
          Oakley RiNo
        </h2>

        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 inline-flex items-start gap-1.5 text-[11px] group transition-colors"
          style={{ color: "#ED7660" }}
        >
          <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
          <span className="leading-snug">
            <span className="block underline-offset-2 group-hover:underline">
              {ADDRESS_LINE_1}
            </span>
            <span className="block" style={{ color: "rgba(245,230,211,0.55)" }}>
              {ADDRESS_LINE_2}
            </span>
          </span>
          <ExternalLink className="w-2.5 h-2.5 mt-1 opacity-60 shrink-0" />
        </a>

        <p
          className="mt-2 text-[11px] sm:text-[11.5px] leading-snug"
          style={{ color: "rgba(245,230,211,0.75)" }}
        >
          Oakley's brand-new next-gen retail hub in Denver's River North Arts
          District. Brutalist architecture, a Chelsea Lewinsky mural, a Prizm
          wall, and a rooftop lounge, built for the athletes, artists, and
          creators of RiNo.
        </p>
        <div
          className="mt-1.5 text-[9.5px] leading-none"
          style={{ color: "rgba(245,230,211,0.4)" }}
        >
          Open daily 10:00 AM – 6:00 PM · Photos by Oakley
        </div>
      </div>
    </div>
  );
};

export default OakleyRinoVenueShowcase;
