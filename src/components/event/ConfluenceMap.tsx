import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Briefcase, DollarSign, Calendar, Linkedin, Instagram, X as XIcon, User, Globe } from "lucide-react";
import { statePathData, stateCentroids } from "./usStatePaths";
import { memberAbbrs, getStateOffice, stateColors, type StateOffice } from "./confluenceData";
import { useEditableTextContext } from "../EditableTextProvider";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

// Import all state illustrations
import imgCO from "@/assets/states/CO.png";
import imgMT from "@/assets/states/MT.png";
import imgNC from "@/assets/states/NC.png";
import imgOR from "@/assets/states/OR.png";
import imgUT from "@/assets/states/UT.png";
import imgVT from "@/assets/states/VT.png";
import imgWA from "@/assets/states/WA.png";
import imgWY from "@/assets/states/WY.png";
import imgME from "@/assets/states/ME.png";
import imgMI from "@/assets/states/MI.png";
import imgNM from "@/assets/states/NM.png";
import imgVA from "@/assets/states/VA.png";
import imgAR from "@/assets/states/AR.png";
import imgMD from "@/assets/states/MD.png";
import imgNH from "@/assets/states/NH.png";
import imgMA from "@/assets/states/MA.png";
import imgPA from "@/assets/states/PA.png";
import imgMN from "@/assets/states/MN.png";
import imgND from "@/assets/states/ND.png";
import imgWI from "@/assets/states/WI.png";
import imgNV from "@/assets/states/NV.png";

const stateImages: Record<string, string> = {
  CO: imgCO, MT: imgMT, NC: imgNC, OR: imgOR, UT: imgUT, VT: imgVT,
  WA: imgWA, WY: imgWY, ME: imgME, MI: imgMI, NM: imgNM, VA: imgVA,
  AR: imgAR, MD: imgMD, NH: imgNH, MA: imgMA, PA: imgPA, MN: imgMN,
  ND: imgND, WI: imgWI, NV: imgNV,
};

// Compute bounding box for a state path to position the image
const stateBounds: Record<string, { x: number; y: number; w: number; h: number }> = {};
function getBounds(abbr: string) {
  if (stateBounds[abbr]) return stateBounds[abbr];
  const path = statePathData[abbr];
  if (!path) return { x: 0, y: 0, w: 100, h: 100 };
  const nums = path.match(/[\d.]+/g)?.map(Number) || [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < nums.length; i += 2) {
    if (nums[i] < minX) minX = nums[i];
    if (nums[i] > maxX) maxX = nums[i];
    if (nums[i + 1] < minY) minY = nums[i + 1];
    if (nums[i + 1] > maxY) maxY = nums[i + 1];
  }
  const pad = 2;
  stateBounds[abbr] = { x: minX - pad, y: minY - pad, w: maxX - minX + pad * 2, h: maxY - minY + pad * 2 };
  return stateBounds[abbr];
}

const ConfluenceMap = () => {
  const [selectedState, setSelectedState] = useState<StateOffice | null>(null);
  const [hoveredAbbr, setHoveredAbbr] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { settings, isAdmin, setSetting } = useEditableTextContext();

  useEffect(() => {
    if (!selectedState) return;
    const handler = (e: MouseEvent) => {
      if (cardRef.current?.contains(e.target as Node)) return;
      const target = e.target as Element;
      if (target.tagName === "path" && target.closest("svg") === svgRef.current) return;
      setSelectedState(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [selectedState]);

  const handleStateClick = useCallback((abbr: string) => {
    const office = getStateOffice(abbr);
    if (office) setSelectedState(prev => prev?.abbr === abbr ? null : office);
  }, []);

  const getVal = useCallback((abbr: string, field: string, fallback?: string) => {
    return settings[`cos_${abbr}_${field}`] || fallback || "";
  }, [settings]);

  const setVal = useCallback(async (abbr: string, field: string, value: string) => {
    await setSetting(`cos_${abbr}_${field}`, value);
  }, [setSetting]);

  const EditableField = ({ abbr, field, fallback, className = "", label }: {
    abbr: string; field: string; fallback?: string; className?: string; label?: string;
  }) => {
    const val = getVal(abbr, field, fallback);
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(val);
    if (isAdmin && editing) {
      return (
        <input autoFocus value={draft} onChange={e => setDraft(e.target.value)}
          onBlur={() => { setVal(abbr, field, draft); setEditing(false); }}
          onKeyDown={e => { if (e.key === "Enter") { setVal(abbr, field, draft); setEditing(false); } if (e.key === "Escape") setEditing(false); }}
          className="bg-black/30 border border-events-coral/50 rounded px-1 py-0.5 text-xs text-events-cream w-full" placeholder={label || field} />
      );
    }
    return (
      <span className={`${className} ${isAdmin ? "cursor-pointer hover:underline decoration-dotted" : ""}`}
        onClick={isAdmin ? (e) => { e.preventDefault(); e.stopPropagation(); setDraft(val); setEditing(true); } : undefined}
        title={isAdmin ? `Click to edit ${label || field}` : undefined}>
        {val || (isAdmin ? `[${label || field}]` : "")}
      </span>
    );
  };

  const EditableLink = ({ abbr, field, fallback, children, className = "", label, icon: Icon }: {
    abbr: string; field: string; fallback?: string; children?: React.ReactNode; className?: string; label?: string; icon?: React.ElementType;
  }) => {
    const val = getVal(abbr, field, fallback);
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(val);
    if (isAdmin && editing) {
      return (
        <input autoFocus value={draft} onChange={e => setDraft(e.target.value)}
          onBlur={() => { setVal(abbr, field, draft); setEditing(false); }}
          onKeyDown={e => { if (e.key === "Enter") { setVal(abbr, field, draft); setEditing(false); } if (e.key === "Escape") setEditing(false); }}
          className="bg-black/30 border border-events-coral/50 rounded px-1 py-0.5 text-xs text-events-cream w-full" placeholder={label || field} />
      );
    }
    if (isAdmin) {
      return (
        <span className={`${className} cursor-pointer hover:underline decoration-dotted inline-flex items-center gap-1`}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDraft(val); setEditing(true); }}
          title={`Click to edit ${label || field}`}>
          {Icon && <Icon className="w-3.5 h-3.5" />}
          {children || val || `[${label || field}]`}
        </span>
      );
    }
    if (!val) return null;
    return (
      <a href={val} target="_blank" rel="noopener noreferrer" className={className}>
        {Icon && <Icon className="w-4 h-4" />}
        {children}
      </a>
    );
  };

  const SocialIcon = ({ abbr, field, fallback, icon: Icon, label }: {
    abbr: string; field: string; fallback?: string; icon: React.ElementType; label: string;
  }) => {
    const val = getVal(abbr, field, fallback);
    if (isAdmin) {
      return (
        <EditableLink abbr={abbr} field={field} fallback={fallback} icon={Icon} label={label}
          className={val ? "text-events-cream/50 hover:text-events-yellow transition-colors" : "text-events-cream/20 hover:text-events-yellow transition-colors"} />
      );
    }
    if (!val) return null;
    return (
      <a href={val} target="_blank" rel="noopener noreferrer" className="text-events-cream/50 hover:text-events-yellow transition-colors" title={label}>
        <Icon className="w-4 h-4" />
      </a>
    );
  };

  const getCardPosition = (abbr: string) => {
    const centroid = stateCentroids[abbr];
    if (!centroid || !svgRef.current || !containerRef.current) return { top: 0, left: 0 };
    const svgRect = svgRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const scaleX = svgRect.width / 960;
    const scaleY = svgRect.height / 600;
    return {
      top: centroid[1] * scaleY + svgRect.top - containerRect.top,
      left: centroid[0] * scaleX + svgRect.left - containerRect.left,
    };
  };

  const selected = selectedState;
  const cardPos = selected ? getCardPosition(selected.abbr) : null;

  return (
    <div ref={containerRef} className="relative w-full">
      <svg ref={svgRef} viewBox="0 0 960 600" className="w-full h-auto">
        <defs>
          {Object.entries(statePathData).map(([abbr, path]) => {
            if (!memberAbbrs.has(abbr)) return null;
            return (
              <clipPath key={`clip-${abbr}`} id={`clip-${abbr}`}>
                <path d={path} />
              </clipPath>
            );
          })}
        </defs>

        {Object.entries(statePathData).map(([abbr, path]) => {
          const isMember = memberAbbrs.has(abbr);
          const isHovered = hoveredAbbr === abbr;
          const isSelected = selected?.abbr === abbr;

          return (
            <g key={abbr}>
              {/* Non-member: muted fill */}
              {!isMember && (
                <path d={path} fill="rgba(245, 230, 211, 0.08)" stroke="rgba(245, 230, 211, 0.15)" strokeWidth={0.5} />
              )}

              {/* Member: illustrated image clipped to state shape */}
              {isMember && (
                <>
                  {/* Base color fallback */}
                  <path d={path}
                    fill={`${stateColors[abbr] || "#4ECDC4"}88`}
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth={isSelected || isHovered ? 2.5 : 1.5}
                    className="transition-all duration-200 cursor-pointer"
                    style={isSelected || isHovered ? { filter: "brightness(1.15) saturate(1.2)" } : undefined}
                    onMouseEnter={() => setHoveredAbbr(abbr)}
                    onMouseLeave={() => setHoveredAbbr(null)}
                    onClick={() => handleStateClick(abbr)}
                  />
                  {/* Illustrated image clipped to state */}
                  {stateImages[abbr] && (() => {
                    const bounds = getBounds(abbr);
                    return (
                      <image
                        href={stateImages[abbr]}
                        x={bounds.x}
                        y={bounds.y}
                        width={bounds.w}
                        height={bounds.h}
                        preserveAspectRatio="xMidYMid slice"
                        clipPath={`url(#clip-${abbr})`}
                        className="cursor-pointer transition-all duration-200"
                        style={{
                          pointerEvents: "all",
                          opacity: isSelected ? 1 : isHovered ? 0.95 : 0.85,
                          filter: isSelected || isHovered ? "brightness(1.1) saturate(1.15)" : undefined,
                        }}
                        onMouseEnter={() => setHoveredAbbr(abbr)}
                        onMouseLeave={() => setHoveredAbbr(null)}
                        onClick={() => handleStateClick(abbr)}
                      />
                    );
                  })()}
                  {/* White border on top */}
                  <path d={path}
                    fill="none"
                    stroke={isSelected || isHovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)"}
                    strokeWidth={isSelected || isHovered ? 2.5 : 1.2}
                    pointerEvents="none"
                  />
                  {/* State abbreviation label */}
                  {stateCentroids[abbr] && (
                    <text
                      x={stateCentroids[abbr][0]}
                      y={stateCentroids[abbr][1] + 4}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={isMobile ? 14 : 18}
                      fontWeight={900}
                      fill="white"
                      pointerEvents="none"
                      className="font-display"
                      style={{
                        textShadow: "0 1px 3px rgba(0,0,0,0.7), 0 0 8px rgba(0,0,0,0.4)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {abbr}
                    </text>
                  )}
                </>
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
              left: Math.min(Math.max(cardPos.left, 170), containerRef.current ? containerRef.current.offsetWidth - 190 : 600),
              transform: "translate(-50%, -110%)",
            }}
          >
            <div className="bg-events-card border border-events-cream/20 rounded-2xl p-5 shadow-2xl min-w-[300px] max-w-[360px] relative">
              <button onClick={() => setSelectedState(null)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-events-cream/10 flex items-center justify-center hover:bg-events-cream/20 transition-colors">
                <XIcon className="w-3.5 h-3.5 text-events-cream/60" />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  {isAdmin ? (
                    <div className="cursor-pointer group" onClick={() => {
                      const url = prompt("Enter director photo URL:", getVal(selected.abbr, "directorPhoto", selected.directorPhoto));
                      if (url !== null) setVal(selected.abbr, "directorPhoto", url);
                    }}>
                      <Avatar className="w-14 h-14 border-2 border-events-yellow/50">
                        <AvatarImage src={getVal(selected.abbr, "directorPhoto", selected.directorPhoto)} />
                        <AvatarFallback className="bg-events-teal text-events-cream text-sm"><User className="w-6 h-6" /></AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] text-white font-bold">Edit</span>
                      </div>
                    </div>
                  ) : (
                    <Avatar className="w-14 h-14 border-2 border-events-yellow/50">
                      <AvatarImage src={getVal(selected.abbr, "directorPhoto", selected.directorPhoto)} />
                      <AvatarFallback className="bg-events-teal text-events-cream text-sm"><User className="w-6 h-6" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-display font-bold px-2 py-0.5 rounded-full text-events-cream"
                      style={{ backgroundColor: stateColors[selected.abbr] || "#ED7660" }}>{selected.abbr}</span>
                    <h4 className="font-headline font-bold text-events-cream text-base truncate">{selected.name}</h4>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <EditableField abbr={selected.abbr} field="director" fallback={selected.director} className="text-events-cream/80 text-xs font-body" label="Director name" />
                    <SocialIcon abbr={selected.abbr} field="directorLinkedin" fallback={selected.directorLinkedin} icon={Linkedin} label="Director LinkedIn" />
                  </div>
                </div>
              </div>

              <div className="text-events-cream/60 text-xs mb-3 leading-relaxed font-body">
                <EditableField abbr={selected.abbr} field="officeName" fallback={selected.officeName} label="Office name" />
              </div>

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
                  {(() => {
                    const partnerName = getVal(selected.abbr, "nonprofitPartner", selected.nonprofitPartner);
                    const partnerUrl = getVal(selected.abbr, "nonprofitPartnerUrl", selected.nonprofitPartnerUrl);
                    const partnerLogo = getVal(selected.abbr, "nonprofitPartnerLogo", selected.nonprofitPartnerLogo);
                    if (isAdmin) {
                      return (
                        <div className="flex items-center gap-1 w-full">
                          {partnerLogo ? (
                            <img src={partnerLogo} alt="" className="w-4 h-4 rounded-full object-cover cursor-pointer" onClick={() => {
                              const url = prompt("Nonprofit logo URL:", partnerLogo);
                              if (url !== null) setVal(selected.abbr, "nonprofitPartnerLogo", url);
                            }} />
                          ) : (
                            <Globe className="w-3 h-3 text-events-yellow shrink-0 cursor-pointer" onClick={() => {
                              const url = prompt("Nonprofit logo URL:");
                              if (url) setVal(selected.abbr, "nonprofitPartnerLogo", url);
                            }} />
                          )}
                          <EditableField abbr={selected.abbr} field="nonprofitPartner" fallback={selected.nonprofitPartner} label="Partner org" className="text-xs" />
                          <span className="text-events-cream/30 text-[10px] cursor-pointer" onClick={() => {
                            const url = prompt("Partner website URL:", partnerUrl);
                            if (url !== null) setVal(selected.abbr, "nonprofitPartnerUrl", url);
                          }} title="Edit partner URL">🔗</span>
                        </div>
                      );
                    }
                    if (!partnerName) return null;
                    return (
                      <div className="flex items-center gap-1.5">
                        {partnerLogo && <img src={partnerLogo} alt="" className="w-4 h-4 rounded-full object-cover" />}
                        {partnerUrl ? (
                          <a href={partnerUrl} target="_blank" rel="noopener noreferrer" className="text-events-yellow hover:text-events-coral transition-colors text-xs">{partnerName}</a>
                        ) : (<span className="text-xs">{partnerName}</span>)}
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-events-cream/10">
                <EditableLink abbr={selected.abbr} field="website" fallback={selected.website} label="Office website"
                  className="inline-flex items-center gap-1 text-xs text-events-yellow hover:text-events-coral transition-colors font-display font-bold">
                  Visit Office <ExternalLink className="w-3 h-3" />
                </EditableLink>
                <div className="flex items-center gap-2 ml-auto">
                  <SocialIcon abbr={selected.abbr} field="linkedin" fallback={selected.linkedin} icon={Linkedin} label="Office LinkedIn" />
                  <SocialIcon abbr={selected.abbr} field="instagram" fallback={selected.instagram} icon={Instagram} label="Office Instagram" />
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
