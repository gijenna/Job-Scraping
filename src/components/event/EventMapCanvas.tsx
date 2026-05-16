import { useRef, useState, useEffect } from "react";
import { MapBrand } from "@/hooks/useEventMapBrands";
import { MapLayout } from "@/hooks/useEventMapLayouts";
import MapBrandGroup, { COURT_W, COURT_H, COURTS as MAX_COURTS } from "./MapBrandGroup";
import MapExpertZoneGroup from "./MapExpertZoneGroup";
import { MapExpert } from "./MapExpertZone";
import { useEventSettings } from "@/hooks/useEventSettings";
import basecampMatchLogo from "@/assets/basecamp-match-logo.svg";

interface EventMapCanvasProps {
  brands: MapBrand[];
  layouts: MapLayout[];
  interactive?: boolean;
  onMove?: (brandId: string, x: number, y: number) => void;
  onShapeChange?: (brandId: string, shape: string) => void;
  onRotate?: (brandId: string, rotation: number) => void;
  onDropFromSidebar?: (brandId: string, x: number, y: number) => void;
  onRemoveFromCanvas?: (brandId: string) => void;
  onClick?: (brand: MapBrand) => void;
  printMode?: boolean;
  /** Expert zone brand name convention */
  expertZoneBrandName?: string;
  /** Experts selected for the zone */
  expertZoneExperts?: MapExpert[];
}

// Courts join side-by-side horizontally
const TOTAL_H = COURT_H;
const PADDING = 40;

const EventMapCanvas = ({
  brands,
  layouts,
  interactive = false,
  onMove,
  onShapeChange,
  onRotate,
  onDropFromSidebar,
  onRemoveFromCanvas,
  onClick,
  printMode = false,
  expertZoneBrandName = "Industry Expert Zone",
  expertZoneExperts = [],
}: EventMapCanvasProps) => {
  const { settings } = useEventSettings("outsidedays26");
  // Admin can re-show Court 3; default hidden in print/admin we still show all.
  const COURTS = printMode || interactive
    ? MAX_COURTS
    : (settings.show_court_3 === "true" ? MAX_COURTS : 2);
  const TOTAL_W = COURT_W * COURTS;
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    if (!interactive) return;
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!interactive || !onDropFromSidebar) return;
    e.preventDefault();
    const brandId = e.dataTransfer.getData("brandId");
    if (!brandId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) / 10) * 10;
    const y = Math.round((e.clientY - rect.top) / 10) * 10;
    onDropFromSidebar(brandId, x, y);
  };

  const handleDoubleClick = (brandId: string) => {
    if (interactive && onRemoveFromCanvas) {
      onRemoveFromCanvas(brandId);
    }
  };

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [fitAll, setFitAll] = useState(false);
  const [scale, setScale] = useState(1);

  const fullW = TOTAL_W + PADDING * 2;
  const fullH = TOTAL_H + PADDING * 2;

  useEffect(() => {
    if (!fitAll || !wrapperRef.current) { setScale(1); return; }
    const rect = wrapperRef.current.getBoundingClientRect();
    const s = Math.min(rect.width / fullW, rect.height / fullH, 1);
    setScale(s);
  }, [fitAll, fullW, fullH]);

  const effectiveScale = scale;

  return (
    <div ref={wrapperRef} className={`relative ${printMode ? "" : "overflow-auto"} border border-white/20 rounded-lg ${printMode ? "border-none" : ""}`}>
      {/* Fit-all toggle */}
      {!printMode && (
        <button
          onClick={() => { setFitAll((v) => !v); setUserZoom(1); }}
          className="absolute top-2 right-2 z-20 px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-body transition-colors"
        >
          {fitAll ? "1:1 View" : "Fit All Courts"}
        </button>
      )}
      <div
        style={{
          transform: `scale(${effectiveScale})`,
          transformOrigin: "top left",
          width: fullW,
          height: fullH,
          ...(fitAll ? { marginBottom: -(fullH * (1 - effectiveScale)) } : {}),
        }}
      >
        <div
          ref={canvasRef}
          className="relative bg-events-teal/80"
          style={{ width: fullW, height: fullH }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Court outlines, side by side horizontally */}
          {Array.from({ length: COURTS }).map((_, i) => (
            <div
              key={i}
              className="absolute border-2 border-dashed border-white/20 rounded"
              style={{
                left: PADDING + i * COURT_W,
                top: PADDING,
                width: COURT_W,
                height: COURT_H,
              }}
            >
              <span className="absolute top-2 left-2 text-[10px] text-white/30 font-body">
                Court {i + 1} (50' × 94')
              </span>
              {/* Center circle */}
              <div
                className="absolute border border-white/10 rounded-full"
                style={{
                  left: COURT_W / 2 - 60,
                  top: COURT_H / 2 - 60,
                  width: 120,
                  height: 120,
                }}
              />
              {/* Half court line, vertical since courts are rotated */}
              <div className="absolute top-0 bottom-0 border-l border-white/10" style={{ left: COURT_W / 2 }} />
            </div>
          ))}

          {/* Placed brands */}
          {layouts.map((layout) => {
            const brand = brands.find((b) => b.id === layout.brand_id);
            if (!brand) return null;
            const sponsorBrand = brand.sponsor_brand_id
              ? brands.find((b) => b.id === brand.sponsor_brand_id) || null
              : null;
            const isExpertZone = brand.name === expertZoneBrandName;

            return (
              <div key={layout.id} onDoubleClick={() => handleDoubleClick(brand.id)}>
                {isExpertZone ? (
                  <MapExpertZoneGroup
                    brand={brand}
                    layout={{ ...layout, x: layout.x + PADDING, y: layout.y + PADDING }}
                    experts={expertZoneExperts}
                    interactive={interactive}
                    onMove={(id, x, y) => onMove?.(id, x - PADDING, y - PADDING)}
                    onShapeChange={onShapeChange}
                    onRotate={onRotate}
                    onClick={onClick}
                    sponsorBrand={sponsorBrand}
                  />
                ) : (
                  <MapBrandGroup
                    brand={brand}
                    layout={{ ...layout, x: layout.x + PADDING, y: layout.y + PADDING }}
                    interactive={interactive}
                    onMove={(id, x, y) => onMove?.(id, x - PADDING, y - PADDING)}
                    onShapeChange={onShapeChange}
                    onRotate={onRotate}
                    onClick={onClick}
                    sponsorBrand={sponsorBrand}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventMapCanvas;
