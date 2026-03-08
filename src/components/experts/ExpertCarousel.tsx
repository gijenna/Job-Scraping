import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Expert, getCompanyLogoUrl } from "@/lib/expert-types";
import ExpertCard from "./ExpertCard";

interface ExpertCarouselProps {
  experts: Expert[];
}

const ExpertCarousel = ({ experts }: ExpertCarouselProps) => {
  const [current, setCurrent] = useState(0);

  if (experts.length === 0) {
    return <p className="text-events-cream/50 text-center py-12">No experts to display yet.</p>;
  }

  const prev = () => setCurrent((c) => (c === 0 ? experts.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === experts.length - 1 ? 0 : c + 1));

  const getIndex = (offset: number) => (current + offset + experts.length) % experts.length;

  // Floating logos from off-screen experts
  const offScreenExperts = experts.filter((_, i) => i !== current);
  const leftLogos = offScreenExperts.slice(0, 3);
  const rightLogos = offScreenExperts.slice(3, 6);

  return (
    <div className="relative py-8">
      {/* Floating company logos - left */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-40">
        {leftLogos.map((expert) =>
          expert.current_company ? (
            <img
              key={expert.id}
              src={getCompanyLogoUrl(expert.current_company)}
              alt=""
              className="w-8 h-8 rounded bg-white/80 object-contain p-1"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : null
        )}
      </div>

      {/* Floating company logos - right */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-40">
        {rightLogos.map((expert) =>
          expert.current_company ? (
            <img
              key={expert.id}
              src={getCompanyLogoUrl(expert.current_company)}
              alt=""
              className="w-8 h-8 rounded bg-white/80 object-contain p-1"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : null
        )}
      </div>

      {/* Carousel container */}
      <div className="flex items-center justify-center gap-4 px-12">
        <button
          onClick={prev}
          className="shrink-0 w-10 h-10 rounded-full bg-events-card border border-events-cream/20 flex items-center justify-center text-events-cream hover:bg-events-coral/20 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 overflow-hidden max-w-2xl">
          {/* Previous card peek */}
          {experts.length > 2 && (
            <div className="shrink-0 w-24 opacity-30 scale-90 blur-[1px] hidden md:block">
              <ExpertCard expert={experts[getIndex(-1)]} />
            </div>
          )}

          {/* Center card */}
          <div className="shrink-0 w-72 transition-all duration-300">
            <ExpertCard expert={experts[current]} expanded />
          </div>

          {/* Next card peek */}
          {experts.length > 2 && (
            <div className="shrink-0 w-24 opacity-30 scale-90 blur-[1px] hidden md:block">
              <ExpertCard expert={experts[getIndex(1)]} />
            </div>
          )}
        </div>

        <button
          onClick={next}
          className="shrink-0 w-10 h-10 rounded-full bg-events-card border border-events-cream/20 flex items-center justify-center text-events-cream hover:bg-events-coral/20 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-6">
        {experts.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-events-coral' : 'bg-events-cream/20'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ExpertCarousel;
