import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, MapPin, Briefcase, DollarSign, Calendar, Linkedin, Instagram, X as XIcon, User } from "lucide-react";
import { statePathData, stateCentroids } from "./usStatePaths";
import { memberAbbrs, getStateOffice, stateColors, stateIcons, type StateOffice, type IconType } from "./confluenceData";
import { useEditableTextContext } from "../EditableTextProvider";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

/* Small inline SVG icons for outdoor activities */
const ActivityIcon = ({ type, x, y, size = 14 }: { type: IconType; x: number; y: number; size?: number }) => {
  const s = size;
  const hs = s / 2;
  switch (type) {
    case "mountains":
      return <g transform={`translate(${x - hs},${y - hs})`}><polygon points={`0,${s} ${hs},0 ${s},${s}`} fill="rgba(255,255,255,0.5)" /></g>;
    case "skiing":
      return <g transform={`translate(${x - hs},${y - hs})`}><line x1={2} y1={s - 2} x2={s - 2} y2={2} stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} /><circle cx={s - 3} cy={3} r={2} fill="rgba(255,255,255,0.5)" /></g>;
    case "trees":
      return <g transform={`translate(${x - hs},${y - hs})`}><polygon points={`${hs},0 0,${s * 0.7} ${s},${s * 0.7}`} fill="rgba(255,255,255,0.45)" /><rect x={hs - 1} y={s * 0.7} width={2} height={s * 0.3} fill="rgba(255,255,255,0.4)" /></g>;
    case "fishing":
      return <g transform={`translate(${x - hs},${y - hs})`}><path d={`M${hs},0 Q${s},${hs} ${hs},${s}`} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.2} /></g>;
    case "kayak":
      return <g transform={`translate(${x - hs},${y - hs})`}><ellipse cx={hs} cy={hs} rx={hs} ry={hs * 0.4} fill="rgba(255,255,255,0.45)" /><line x1={hs} y1={0} x2={hs} y2={s} stroke="rgba(255,255,255,0.4)" strokeWidth={1} /></g>;
    case "hiking":
      return <g transform={`translate(${x - hs},${y - hs})`}><circle cx={hs} cy={3} r={2.5} fill="rgba(255,255,255,0.5)" /><line x1={hs} y1={5} x2={hs} y2={s - 2} stroke="rgba(255,255,255,0.5)" strokeWidth={1.2} /></g>;
    case "wildlife":
      return <g transform={`translate(${x - hs},${y - hs})`}><circle cx={hs} cy={hs} r={hs * 0.7} fill="rgba(255,255,255,0.35)" /><circle cx={hs - 2} cy={hs - 1} r={1} fill="rgba(255,255,255,0.6)" /><circle cx={hs + 2} cy={hs - 1} r={1} fill="rgba(255,255,255,0.6)" /></g>;
    case "surfing":
      return <g transform={`translate(${x - hs},${y - hs})`}><path d={`M0,${hs} Q${hs},0 ${s},${hs}`} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} /></g>;
    case "lighthouse":
      return <g transform={`translate(${x - hs},${y - hs})`}><rect x={hs - 2} y={2} width={4} height={s - 4} fill="rgba(255,255,255,0.45)" /><polygon points={`${hs - 4},${s - 2} ${hs + 4},${s - 2} ${hs},${s - 4}`} fill="rgba(255,255,255,0.3)" /></g>;
    case "canoe":
      return <g transform={`translate(${x - hs},${y - hs})`}><path d={`M0,${hs} Q${hs},0 ${s},${hs} Q${hs},${s} 0,${hs}`} fill="rgba(255,255,255,0.4)" /></g>;
    case "desert":
      return <g transform={`translate(${x - hs},${y - hs})`}><circle cx={hs} cy={3} r={3} fill="rgba(255,255,255,0.4)" /><line x1={hs} y1={6} x2={hs} y2={s} stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} /><line x1={hs} y1={s * 0.5} x2={s - 2} y2={s * 0.3} stroke="rgba(255,255,255,0.4)" strokeWidth={1} /></g>;
    case "lake":
      return <g transform={`translate(${x - hs},${y - hs})`}><path d={`M0,${hs} Q${hs * 0.5},${hs - 3} ${hs},${hs} Q${hs * 1.5},${hs + 3} ${s},${hs}`} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} /></g>;
    case "camping":
      return <g transform={`translate(${x - hs},${y - hs})`}><polygon points={`0,${s} ${hs},${s * 0.2} ${s},${s}`} fill="rgba(255,255,255,0.4)" stroke="rgba(255,255,255,0.5)" strokeWidth={0.5} /></g>;
    case "biking":
      return <g transform={`translate(${x - hs},${y - hs})`}><circle cx={hs * 0.5} cy={hs * 1.2} r={hs * 0.4} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1} /><circle cx={hs * 1.5} cy={hs * 1.2} r={hs * 0.4} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1} /></g>;
    case "climbing":
      return <g transform={`translate(${x - hs},${y - hs})`}><polygon points={`${hs},0 0,${s} ${s},${s}`} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} /></g>;
    case "snowboard":
      return <g transform={`translate(${x - hs},${y - hs})`}><rect x={hs - 1.5} y={0} width={3} height={s} rx={1.5} fill="rgba(255,255,255,0.45)" /></g>;
    default:
      return null;
  }
};

const ConfluenceMap = () => {
  const [selectedState, setSelectedState] = useState<StateOffice | null>(null);
  const [hoveredAbbr, setHoveredAbbr] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { settings, isAdmin, setSetting } = useEditableTextContext();

  // Click outside to close
  useEffect(() => {
    if (!selectedState) return;
    const handler = (e: MouseEvent) => {
      if (cardRef.current?.contains(e.target as Node)) return;
      // Check if click was on an SVG state path
      const target = e.target as Element;
      if (target.tagName === "path" && target.closest("svg") === svgRef.current) return;
      setSelectedState(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [selectedState]);

  const handleStateClick = useCallback((abbr: string) => {
    const office = getStateOffice(abbr);
    if (office) {
      setSelectedState(prev => prev?.abbr === abbr ? null : office);
    }
  }, []);

  // Get admin-editable value with fallback
  const getVal = useCallback((abbr: string, field: string, fallback?: string) => {
    const key = `cos_${abbr}_${field}`;
    return settings[key] || fallback || "";
  }, [settings]);

  const setVal = useCallback(async (abbr: string, field: string, value: string) => {
    await setSetting(`cos_${abbr}_${field}`, value);
  }, [setSetting]);

  // Inline edit helper
  const EditableField = ({ abbr, field, fallback, className = "", label }: {
    abbr: string; field: string; fallback?: string; className?: string; label?: string;
  }) => {
    const val = getVal(abbr, field, fallback);
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(val);

    if (isAdmin && editing) {
      return (
        <input
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={() => { setVal(abbr, field, draft); setEditing(false); }}
          onKeyDown={e => {
            if (e.key === "Enter") { setVal(abbr, field, draft); setEditing(false); }
            if (e.key === "Escape") setEditing(false);
          }}
          className="bg-black/30 border border-events-coral/50 rounded px-1 py-0.5 text-xs text-events-cream w-full"
          placeholder={label || field}
        />
      );
    }

    return (
      <span
        className={`${className} ${isAdmin ? "cursor-pointer hover:underline decoration-dotted" : ""}`}
        onClick={isAdmin ? () => { setDraft(val); setEditing(true); } : undefined}
        title={isAdmin ? `Click to edit ${label || field}` : undefined}
      >
        {val || (isAdmin ? `[${label || field}]` : "")}
      </span>
    );
  };

  // Calculate card position from state centroid
  const getCardPosition = (abbr: string) => {
    const centroid = stateCentroids[abbr];
    if (!centroid || !svgRef.current || !containerRef.current) return { top: 0, left: 0 };

    const svgRect = svgRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    // Map SVG coords to screen coords
    const viewBox = { x: 0, y: 0, w: 960, h: 600 };
    const scaleX = svgRect.width / viewBox.w;
    const scaleY = svgRect.height / viewBox.h;

    const screenX = centroid[0] * scaleX + svgRect.left - containerRect.left;
    const screenY = centroid[1] * scaleY + svgRect.top - containerRect.top;

    return { top: screenY, left: screenX };
  };

  const selected = selectedState;
  const cardPos = selected ? getCardPosition(selected.abbr) : null;

  return (
    <div ref={containerRef} className="relative w-full">
      <svg
        ref={svgRef}
        viewBox="0 0 960 600"
        className="w-full h-auto"
      >
        <defs>
          {/* Clip paths for each member state */}
          {Object.entries(statePathData).map(([abbr, path]) => {
            if (!memberAbbrs.has(abbr)) return null;
            return (
              <clipPath key={`clip-${abbr}`} id={`clip-${abbr}`}>
                <path d={path} />
              </clipPath>
            );
          })}
        </defs>

        {/* Render all states */}
        {Object.entries(statePathData).map(([abbr, path]) => {
          const isMember = memberAbbrs.has(abbr);
          const isHovered = hoveredAbbr === abbr;
          const isSelected = selected?.abbr === abbr;
          const color = stateColors[abbr] || "#ccc";

          return (
            <g key={abbr}>
              {/* Base state fill */}
              <path
                d={path}
                fill={
                  isMember
                    ? isSelected
                      ? color
                      : isHovered
                        ? color
                        : `${color}CC`
                    : "rgba(245, 230, 211, 0.08)"
                }
                stroke={isMember ? "rgba(255,255,255,0.6)" : "rgba(245, 230, 211, 0.15)"}
                strokeWidth={isMember ? (isSelected || isHovered ? 2.5 : 1.5) : 0.5}
                className={`transition-all duration-200 ${isMember ? "cursor-pointer" : ""}`}
                style={isMember && (isSelected || isHovered) ? { filter: "brightness(1.15) saturate(1.2)" } : undefined}
                onMouseEnter={() => isMember && setHoveredAbbr(abbr)}
                onMouseLeave={() => setHoveredAbbr(null)}
                onClick={() => isMember && handleStateClick(abbr)}
              />
              {/* Activity icons inside member states */}
              {isMember && stateCentroids[abbr] && stateIcons[abbr] && (
                <g clipPath={`url(#clip-${abbr})`} pointerEvents="none">
                  {stateIcons[abbr].map((icon, i) => {
                    const [cx, cy] = stateCentroids[abbr];
                    const offset = i === 0 ? -8 : 8;
                    return <ActivityIcon key={i} type={icon} x={cx + offset} y={cy} size={16} />;
                  })}
                </g>
              )}
              {/* State abbreviation label */}
              {isMember && stateCentroids[abbr] && (
                <text
                  x={stateCentroids[abbr][0]}
                  y={stateCentroids[abbr][1] + 14}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight={700}
                  fill="rgba(255,255,255,0.85)"
                  pointerEvents="none"
                  className="font-display"
                >
                  {abbr}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Pinned info card */}
      <AnimatePresence>
        {selected && cardPos && (
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-40 pointer-events-auto"
            style={{
              top: cardPos.top,
              left: Math.min(Math.max(cardPos.left, 160), containerRef.current ? containerRef.current.offsetWidth - 180 : 600),
              transform: "translate(-50%, -110%)",
            }}
          >
            <div className="bg-events-card border border-events-cream/20 rounded-2xl p-5 shadow-2xl min-w-[300px] max-w-[360px] relative">
              {/* Close button */}
              <button
                onClick={() => setSelectedState(null)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-events-cream/10 flex items-center justify-center hover:bg-events-cream/20 transition-colors"
              >
                <XIcon className="w-3.5 h-3.5 text-events-cream/60" />
              </button>

              {/* Director photo + name header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  {isAdmin ? (
                    <div
                      className="cursor-pointer group"
                      onClick={() => {
                        const url = prompt("Enter director photo URL:", getVal(selected.abbr, "directorPhoto", selected.directorPhoto));
                        if (url !== null) setVal(selected.abbr, "directorPhoto", url);
                      }}
                    >
                      <Avatar className="w-14 h-14 border-2 border-events-yellow/50">
                        <AvatarImage src={getVal(selected.abbr, "directorPhoto", selected.directorPhoto)} />
                        <AvatarFallback className="bg-events-teal text-events-cream text-sm">
                          <User className="w-6 h-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] text-white font-bold">Edit</span>
                      </div>
                    </div>
                  ) : (
                    <Avatar className="w-14 h-14 border-2 border-events-yellow/50">
                      <AvatarImage src={getVal(selected.abbr, "directorPhoto", selected.directorPhoto)} />
                      <AvatarFallback className="bg-events-teal text-events-cream text-sm">
                        <User className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-display font-bold px-2 py-0.5 rounded-full text-events-cream"
                      style={{ backgroundColor: stateColors[selected.abbr] || "#ED7660" }}>
                      {selected.abbr}
                    </span>
                    <h4 className="font-headline font-bold text-events-cream text-base truncate">
                      {selected.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <EditableField abbr={selected.abbr} field="director" fallback={selected.director} className="text-events-cream/80 text-xs font-body" label="Director name" />
                    {(() => {
                      const linkedinUrl = getVal(selected.abbr, "directorLinkedin", selected.directorLinkedin);
                      return linkedinUrl ? (
                        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-events-yellow hover:text-events-coral transition-colors">
                          <Linkedin className="w-3.5 h-3.5" />
                        </a>
                      ) : isAdmin ? (
                        <button onClick={() => {
                          const url = prompt("Director LinkedIn URL:");
                          if (url) setVal(selected.abbr, "directorLinkedin", url);
                        }} className="text-events-cream/30 hover:text-events-yellow transition-colors">
                          <Linkedin className="w-3.5 h-3.5" />
                        </button>
                      ) : null;
                    })()}
                  </div>
                </div>
              </div>

              {/* Office name */}
              <div className="text-events-cream/60 text-xs mb-3 leading-relaxed font-body">
                <EditableField abbr={selected.abbr} field="officeName" fallback={selected.officeName} label="Office name" />
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center gap-1.5 text-xs text-events-cream/80">
                  <Calendar className="w-3 h-3 text-events-yellow shrink-0" />
                  <span>Joined {selected.yearJoined}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-events-cream/80">
                  <DollarSign className="w-3 h-3 text-events-yellow shrink-0" />
                  <EditableField abbr={selected.abbr} field="economicImpact" fallback={selected.economicImpact} label="Economic impact" />
                  <span className="text-events-cream/50">impact</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-events-cream/80">
                  <Briefcase className="w-3 h-3 text-events-yellow shrink-0" />
                  <EditableField abbr={selected.abbr} field="jobs" fallback={selected.jobs} label="Jobs" />
                  <span className="text-events-cream/50">jobs</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-events-cream/80">
                  <MapPin className="w-3 h-3 text-events-yellow shrink-0" />
                  <span>{selected.name}</span>
                </div>
              </div>

              {/* Links row */}
              <div className="flex items-center gap-3 pt-2 border-t border-events-cream/10">
                <a
                  href={getVal(selected.abbr, "website", selected.website) || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-events-yellow hover:text-events-coral transition-colors font-display font-bold"
                >
                  Visit Office <ExternalLink className="w-3 h-3" />
                </a>

                {/* Social links */}
                <div className="flex items-center gap-2 ml-auto">
                  {(() => {
                    const li = getVal(selected.abbr, "linkedin", selected.linkedin);
                    return li ? (
                      <a href={li} target="_blank" rel="noopener noreferrer" className="text-events-cream/50 hover:text-events-yellow transition-colors" title="LinkedIn">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    ) : isAdmin ? (
                      <button onClick={() => {
                        const url = prompt("Office LinkedIn URL:");
                        if (url) setVal(selected.abbr, "linkedin", url);
                      }} className="text-events-cream/20 hover:text-events-yellow transition-colors" title="Add LinkedIn">
                        <Linkedin className="w-4 h-4" />
                      </button>
                    ) : null;
                  })()}
                  {(() => {
                    const ig = getVal(selected.abbr, "instagram", selected.instagram);
                    return ig ? (
                      <a href={ig} target="_blank" rel="noopener noreferrer" className="text-events-cream/50 hover:text-events-yellow transition-colors" title="Instagram">
                        <Instagram className="w-4 h-4" />
                      </a>
                    ) : isAdmin ? (
                      <button onClick={() => {
                        const url = prompt("Office Instagram URL:");
                        if (url) setVal(selected.abbr, "instagram", url);
                      }} className="text-events-cream/20 hover:text-events-yellow transition-colors" title="Add Instagram">
                        <Instagram className="w-4 h-4" />
                      </button>
                    ) : null;
                  })()}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConfluenceMap;
