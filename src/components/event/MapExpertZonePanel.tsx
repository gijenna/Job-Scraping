import { X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Expert } from "@/lib/expert-types";
import ExpertCardMinimal from "@/components/experts/ExpertCardMinimal";
import edgesLogo from "@/assets/edges-first-logo.png";

interface MapExpertZonePanelProps {
  open: boolean;
  onClose: () => void;
  experts: Expert[];
}

const EDGES_URL = "https://edgesfirst.co/";

// Recolor the dark-blue Edges logo PNG to cream
const creamFilter: React.CSSProperties = {
  filter:
    "brightness(0) saturate(100%) invert(94%) sepia(13%) saturate(556%) hue-rotate(335deg) brightness(99%) contrast(94%)",
};

const isKelly = (e: Expert) =>
  (e?.full_name || "").toLowerCase().startsWith("kelly");

const MapExpertZonePanel = ({ open, onClose, experts }: MapExpertZonePanelProps) => {
  

  // Kelly first, then everyone else
  const ordered = [...experts].sort((a, b) => {
    const ak = isKelly(a) ? 0 : 1;
    const bk = isKelly(b) ? 0 : 1;
    return ak - bk;
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm flex items-start md:items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl my-8 rounded-2xl bg-events-teal border border-events-cream/15 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-events-cream/10 hover:bg-events-cream/20 text-events-cream flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-events-cream/10">
              <p className="text-[10px] tracking-[0.3em] uppercase mb-1.5 font-body text-events-yellow">
                Venue Map
              </p>
              <h2 className="font-headline font-bold text-2xl md:text-3xl text-events-cream">
                Industry Expert Zone
              </h2>
              <p className="text-sm text-events-cream/60 font-body mt-1">
                Sit down with these industry pros at the event.
              </p>

              {/* Edges First callout */}
              <a
                href={EDGES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-events-coral/40 bg-events-coral/10 hover:bg-events-coral/20 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-events-coral shrink-0" />
                <span className="text-[11px] font-body text-events-cream/80">
                  Free thanks to
                </span>
                <img
                  src={edgesLogo}
                  alt="Edges First"
                  style={creamFilter}
                  className="h-4 w-auto object-contain"
                />
              </a>
            </div>

            {/* Experts grid */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {ordered.length === 0 ? (
                <p className="text-events-cream/50 text-center py-12 font-body text-sm">
                  No experts to display yet.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {ordered.map((expert) => {
                    const kelly = isKelly(expert);
                    return (
                      <div key={expert.id} className="relative">
                        {kelly && (
                          <>
                            <span
                              aria-hidden
                              className="pointer-events-none absolute -inset-1.5 rounded-2xl ring-2 ring-events-coral/70 animate-pulse z-0"
                            />
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 rounded-full bg-events-coral text-events-cream text-[9px] font-display font-bold uppercase tracking-wider whitespace-nowrap shadow">
                              Made this possible
                            </span>
                          </>
                        )}
                        <div className="relative z-[1]">
                          <ExpertCardMinimal expert={expert} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MapExpertZonePanel;
