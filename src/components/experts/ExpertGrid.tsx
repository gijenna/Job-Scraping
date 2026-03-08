import { useState } from "react";
import { Expert } from "@/lib/expert-types";
import ExpertCard from "./ExpertCard";
import { X } from "lucide-react";

interface ExpertGridProps {
  experts: Expert[];
}

const ExpertGrid = ({ experts }: ExpertGridProps) => {
  const [focused, setFocused] = useState<string | null>(null);

  if (experts.length === 0) {
    return <p className="text-events-cream/50 text-center py-12">No experts to display yet.</p>;
  }

  const focusedExpert = experts.find(e => e.id === focused);

  return (
    <div className="relative">
      {/* Focused overlay */}
      {focusedExpert && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setFocused(null)}>
          <div className="relative max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setFocused(null)}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-events-coral text-events-cream flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
            <ExpertCard expert={focusedExpert} expanded />
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {experts.map((expert) => (
          <div
            key={expert.id}
            className="cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => setFocused(expert.id)}
          >
            <ExpertCard expert={expert} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpertGrid;
