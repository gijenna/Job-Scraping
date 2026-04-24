import { useRef } from "react";
import { MapBrand } from "@/hooks/useEventMapBrands";
import { MapLayout } from "@/hooks/useEventMapLayouts";
import { MapExpert } from "./MapExpertZone";
import { getShapeCells, getShapeBounds } from "./MapBrandGroup";
import { RotateCw } from "lucide-react";
import basecampMatchLogo from "@/assets/basecamp-match-logo.svg";

const TABLE_W = 80;
const TABLE_H = 30;
const GRID = 10;

interface MapExpertZoneGroupProps {
  brand: MapBrand;
  layout: MapLayout;
  experts: MapExpert[];
  interactive?: boolean;
  onMove?: (brandId: string, x: number, y: number) => void;
  onShapeChange?: (brandId: string, shape: string) => void;
  onRotate?: (brandId: string, rotation: number) => void;
  onClick?: (brand: MapBrand) => void;
  sponsorBrand?: MapBrand | null;
}

const MapExpertZoneGroup = ({
  brand,
  layout,
  experts,
  interactive = false,
  onMove,
  onShapeChange,
  onRotate,
  onClick,
  sponsorBrand,
}: MapExpertZoneGroupProps) => {
  const cells = getShapeCells(layout.shape, brand.table_count);
  const bounds = getShapeBounds(cells);

  const isDragging = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive || !onMove) return;
    if ((e.target as HTMLElement).closest("button")) return;
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = layout.x;
    const origY = layout.y;
    isDragging.current = false;
    const handleMouseMove = (ev: MouseEvent) => {
      isDragging.current = true;
      const dx = Math.round((ev.clientX - startX) / GRID) * GRID;
      const dy = Math.round((ev.clientY - startY) / GRID) * GRID;
      onMove(brand.id, origX + dx, origY + dy);
    };
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const shapes = ["line", "square", "tshape", "xshape"];
  const cycleShape = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onShapeChange) return;
    const idx = shapes.indexOf(layout.shape);
    onShapeChange(brand.id, shapes[(idx + 1) % shapes.length]);
  };

  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onRotate) return;
    const step = e.shiftKey ? 45 : 15;
    onRotate(brand.id, (layout.rotation + step) % 360);
  };

  return (
    <div
      className={`absolute group ${interactive ? "cursor-move" : "cursor-pointer"}`}
      style={{ left: layout.x, top: layout.y }}
      onMouseDown={interactive ? handleMouseDown : undefined}
      onClick={() => onClick?.(brand)}
    >
      {/* Tables grid, rotated */}
      <div
        className="relative"
        style={{
          width: bounds.width,
          height: bounds.height,
          transform: `rotate(${layout.rotation}deg)`,
          transformOrigin: "center center",
        }}
      >
        {cells.map((cell, i) => (
          <div
            key={i}
            className="absolute border border-white/30 rounded-sm"
            style={{
              left: cell.col * TABLE_W,
              top: cell.row * TABLE_H,
              width: TABLE_W,
              height: TABLE_H,
              backgroundColor: "rgba(225, 182, 36, 0.3)",
            }}
          />
        ))}
        {/* Expert photo bubbles inside the tables area */}
        <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-0.5 p-1 pointer-events-none">
          {experts.slice(0, 12).map((expert) => (
            <div key={expert.id} className="w-5 h-5 rounded-full bg-white overflow-hidden flex items-center justify-center border border-white/50">
              {expert.photo_url ? (
                <img src={expert.photo_url} alt={expert.full_name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[5px] font-bold text-events-teal">{expert.full_name.split(" ").map(w => w[0]).join("").slice(0, 2)}</span>
              )}
            </div>
          ))}
          {experts.length > 12 && (
            <div className="w-5 h-5 rounded-full bg-events-gold/60 flex items-center justify-center">
              <span className="text-[6px] font-bold text-white">+{experts.length - 12}</span>
            </div>
          )}
        </div>
      </div>

      {/* Logo + name, always upright */}
      <div className="flex flex-col items-center -mt-2" style={{ width: bounds.width }}>
        <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden border-2 border-events-gold">
          <img src={basecampMatchLogo} alt="Expert Zone" className="w-7 h-7 object-contain" />
        </div>
        <span className="text-[9px] font-display font-bold text-white text-center leading-tight mt-0.5 drop-shadow">
          Expert Zone
        </span>
      </div>

      {/* Shape cycle button */}
      {interactive && brand.table_count > 1 && (
        <button
          onClick={cycleShape}
          className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-events-coral text-white text-[8px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
          title={`Shape: ${layout.shape}`}
        >
          ⟳
        </button>
      )}

      {/* Rotation button */}
      {interactive && (
        <button
          onClick={handleRotate}
          className="absolute -top-3 -left-3 w-5 h-5 rounded-full bg-events-yellow text-events-teal flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
          title={`Rotation: ${layout.rotation}° (shift+click for 45°)`}
        >
          <RotateCw className="w-3 h-3" />
        </button>
      )}

      {/* Sponsor label */}
      {sponsorBrand && (
        <div className="absolute -bottom-5 left-0 right-0 flex items-center justify-center gap-1">
          <span className="text-[7px] text-white/70 font-body">Free thanks to</span>
          <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center overflow-hidden">
            {sponsorBrand.logo_url ? (
              <img src={sponsorBrand.logo_url} alt={sponsorBrand.name} className="w-3 h-3 object-contain" />
            ) : (
              <span className="text-[5px] font-bold text-events-teal">{sponsorBrand.name[0]}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapExpertZoneGroup;
