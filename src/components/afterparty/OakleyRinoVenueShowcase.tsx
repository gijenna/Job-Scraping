import { MapPin, ExternalLink } from "lucide-react";
import rinoHero from "@/assets/oakley-rino/rino-hero.jpg";
import rino1 from "@/assets/oakley-rino/rino-1.jpg";
import rino2 from "@/assets/oakley-rino/rino-2.jpg";
import rino3 from "@/assets/oakley-rino/rino-3.jpg";
import rino4 from "@/assets/oakley-rino/rino-4.jpg";

/**
 * Venue showcase for the Oakley RiNo store. Replaces the event-info column
 * on /guestsoakley. Photos sourced from the official Oakley press release:
 * https://oakley-media-hub.prezly.com/oakley-unveils-next-gen-retail-hub-in-denvers-river-north-arts-district-5f206e
 *
 * The "rino-hero.jpg" shot from the press kit is the alley/exterior frame.
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

const OakleyRinoVenueShowcase = () => {
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        backgroundColor: "rgba(17,17,17,0.7)",
        border: "1px solid rgba(245,230,211,0.12)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div
          className="text-[10px] uppercase mb-2"
          style={{
            letterSpacing: "0.22em",
            color: "#FAC775",
            fontWeight: 600,
          }}
        >
          The Venue
        </div>
        <h2
          className="font-afterparty text-[22px] sm:text-[26px] leading-tight"
          style={{ color: "#F5E6D3", fontWeight: 500 }}
        >
          Oakley RiNo
        </h2>
        <p
          className="text-[12px] mt-1.5 leading-relaxed"
          style={{ color: "rgba(245,230,211,0.7)" }}
        >
          Oakley's brand-new next-gen retail hub in Denver's River North Arts
          District. Brutalist architecture, a Chelsea Lewinsky mural, a Prizm
          wall, and a rooftop lounge — built for the athletes, artists, and
          creators of RiNo.
        </p>

        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-start gap-2 text-[12.5px] group transition-colors"
          style={{ color: "#ED7660" }}
        >
          <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span className="leading-snug">
            <span className="block underline-offset-2 group-hover:underline">
              {ADDRESS_LINE_1}
            </span>
            <span
              className="block"
              style={{ color: "rgba(245,230,211,0.55)" }}
            >
              {ADDRESS_LINE_2}
            </span>
          </span>
          <ExternalLink className="w-3 h-3 mt-1 opacity-60" />
        </a>

        <div
          className="mt-3 text-[11.5px] leading-relaxed"
          style={{ color: "rgba(245,230,211,0.5)" }}
        >
          Open daily 10:00 AM – 6:00 PM
        </div>
      </div>

      {/* Scrollable gallery */}
      <div
        className="px-5 pb-5"
        aria-label="Photos of the Oakley RiNo store"
      >
        <div
          className="rounded-xl overflow-y-auto overflow-x-hidden custom-scroll"
          style={{
            maxHeight: 420,
            border: "1px solid rgba(245,230,211,0.08)",
            backgroundColor: "rgba(8,8,8,0.4)",
          }}
        >
          <div className="flex flex-col gap-2 p-2">
            {VENUE_PHOTOS.map((photo) => (
              <figure key={photo.src} className="relative">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="w-full h-auto rounded-lg object-cover"
                  style={{ aspectRatio: "16 / 10" }}
                />
              </figure>
            ))}
          </div>
        </div>
        <div
          className="mt-2 text-[10.5px] text-center"
          style={{ color: "rgba(245,230,211,0.4)" }}
        >
          Scroll for more · Photos by Oakley
        </div>
      </div>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(245,230,211,0.18);
          border-radius: 3px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(245,230,211,0.32);
        }
      `}</style>
    </div>
  );
};

export default OakleyRinoVenueShowcase;
