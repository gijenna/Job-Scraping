import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, MapPin, Briefcase, DollarSign, Calendar } from "lucide-react";
import { statePathData } from "./usStatePaths";
import { memberAbbrs, getStateOffice, type StateOffice } from "./confluenceData";

const ConfluenceMap = () => {
  const [hoveredState, setHoveredState] = useState<StateOffice | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 10,
    });
  };

  const handleStateHover = (abbr: string) => {
    const office = getStateOffice(abbr);
    if (office) setHoveredState(office);
  };

  const handleStateLeave = () => setHoveredState(null);

  const handleStateClick = (abbr: string) => {
    const office = getStateOffice(abbr);
    if (office) {
      // On mobile, toggle the tooltip; on desktop it's hover-driven
      if (hoveredState?.abbr === abbr) {
        setHoveredState(null);
      } else if (office) {
        setHoveredState(office);
      }
    }
  };

  return (
    <div className="relative w-full">
      <svg
        ref={svgRef}
        viewBox="60 80 870 480"
        className="w-full h-auto"
        onMouseMove={handleMouseMove}
      >
        {Object.entries(statePathData).map(([abbr, path]) => {
          const isMember = memberAbbrs.has(abbr);
          const isHovered = hoveredState?.abbr === abbr;

          return (
            <path
              key={abbr}
              d={path}
              fill={
                isMember
                  ? isHovered
                    ? "#E1B624"
                    : "#ED7660"
                  : "rgba(245, 230, 211, 0.12)"
              }
              stroke={isMember ? "#F5E6D3" : "rgba(245, 230, 211, 0.2)"}
              strokeWidth={isMember ? 1.5 : 0.5}
              className={`transition-all duration-200 ${
                isMember ? "cursor-pointer hover:brightness-110" : ""
              }`}
              onMouseEnter={() => handleStateHover(abbr)}
              onMouseLeave={handleStateLeave}
              onClick={() => handleStateClick(abbr)}
            />
          );
        })}
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredState && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute pointer-events-none z-30"
            style={{
              left: Math.min(tooltipPos.x, 600),
              top: tooltipPos.y,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="bg-events-card border border-events-cream/20 rounded-xl p-4 shadow-2xl min-w-[260px] max-w-[320px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-display font-bold px-2 py-0.5 rounded bg-events-coral text-events-cream">
                  {hoveredState.abbr}
                </span>
                <h4 className="font-headline font-bold text-events-cream text-sm">
                  {hoveredState.name}
                </h4>
              </div>

              <p className="text-events-cream/60 text-xs mb-3 leading-relaxed">
                {hoveredState.officeName}
              </p>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center gap-1.5 text-xs text-events-cream/80">
                  <Calendar className="w-3 h-3 text-events-yellow" />
                  <span>Joined {hoveredState.yearJoined}</span>
                </div>
                {hoveredState.director && (
                  <div className="flex items-center gap-1.5 text-xs text-events-cream/80">
                    <MapPin className="w-3 h-3 text-events-yellow" />
                    <span>{hoveredState.director}</span>
                  </div>
                )}
                {hoveredState.economicImpact && (
                  <div className="flex items-center gap-1.5 text-xs text-events-cream/80">
                    <DollarSign className="w-3 h-3 text-events-yellow" />
                    <span>{hoveredState.economicImpact} impact</span>
                  </div>
                )}
                {hoveredState.jobs && (
                  <div className="flex items-center gap-1.5 text-xs text-events-cream/80">
                    <Briefcase className="w-3 h-3 text-events-yellow" />
                    <span>{hoveredState.jobs} jobs</span>
                  </div>
                )}
              </div>

              <a
                href={hoveredState.website}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto inline-flex items-center gap-1 text-xs text-events-yellow hover:underline"
              >
                Visit office <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConfluenceMap;
