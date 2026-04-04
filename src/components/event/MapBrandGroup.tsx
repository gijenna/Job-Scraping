import { MapBrand } from "@/hooks/useEventMapBrands";
import { MapLayout } from "@/hooks/useEventMapLayouts";
import { RotateCw } from "lucide-react";

// Court: 94' × 50' → rotated 90° right so 50' wide × 94' tall
const COURT_W = 500;
const COURT_H = 940;
const COURTS = 3;
const TABLE_W = 80; // 8ft
const TABLE_H = 30; // 3ft
const GRID = 10;

interface ShapeCell { col: number; row: number }

export const SHAPE_PATTERNS: Record<string, ShapeCell[]> = {
  line: [], // dynamic based on table_count: all in a row
  square: [
    { col: 0, row: 0 }, { col: 1, row: 0 },
    { col: 0, row: 1 }, { col: 1, row: 1 },
  ],
  tshape: [
    { col: 0, row: 0 }, { col: 1, row: 0 }, { col: 2, row: 0 },
    { col: 1, row: 1 },
  ],
  xshape: [
    { col: 1, row: 0 },
    { col: 0, row: 1 }, { col: 1, row: 1 }, { col: 2, row: 1 },
    { col: 1, row: 2 },
  ],
};

export function getLineCells(count: number): ShapeCell[] {
  return Array.from({ length: count }, (_, i) => ({ col: i, row: 0 }));
}

export function getShapeCells(shape: string, tableCount: number): ShapeCell[] {
  if (shape === "line" || !SHAPE_PATTERNS[shape]) return getLineCells(tableCount);
  const pattern = SHAPE_PATTERNS[shape];
  return pattern.slice(0, tableCount);
}

export function getShapeBounds(cells: ShapeCell[]) {
  const maxCol = Math.max(...cells.map((c) => c.col));
  const maxRow = Math.max(...cells.map((c) => c.row));
  return { width: (maxCol + 1) * TABLE_W, height: (maxRow + 1) * TABLE_H };
}

interface MapBrandGroupProps {
  brand: MapBrand;
  layout: MapLayout;
  interactive?: boolean;
  onMove?: (brandId: string, x: number, y: number) => void;
  onShapeChange?: (brandId: string, shape: string) => void;
  onRotate?: (brandId: string, rotation: number) => void;
  onClick?: (brand: MapBrand) => void;
  sponsorBrand?: MapBrand | null;
}

const MapBrandGroup = ({
  brand,
  layout,
  interactive = false,
  onMove,
  onShapeChange,
  onRotate,
  onClick,
  sponsorBrand,
}: MapBrandGroupProps) => {
  const cells = getShapeCells(layout.shape, brand.table_count);
  const bounds = getShapeBounds(cells);

  const logoSrc = brand.logo_url || (brand.website_url ? `https://www.google.com/s2/favicons?domain=${new URL(brand.website_url.startsWith("http") ? brand.website_url : `https://${brand.website_url}`).hostname}&sz=128` : null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive || !onMove) return;
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = layout.x;
    const origY = layout.y;

    const handleMouseMove = (ev: MouseEvent) => {
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
      {/* Tables grid — rotated */}
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
              backgroundColor: brand.is_activation ? "rgba(225, 182, 36, 0.3)" : "rgba(237, 118, 96, 0.3)",
            }}
          />
        ))}
      </div>

      {/* Logo bubble + name — always upright (no rotation) */}
      <div className="flex flex-col items-center -mt-2" style={{ width: bounds.width }}>
        <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden border-2 border-white">
          {logoSrc ? (
            <img src={logoSrc} alt={brand.name} className="w-8 h-8 object-contain" />
          ) : (
            <span className="font-display font-bold text-[10px] text-events-teal">
              {brand.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </span>
          )}
        </div>
        <span className="text-[9px] font-display font-bold text-white text-center leading-tight mt-0.5 drop-shadow">
          {brand.name}
        </span>
      </div>

      {/* Shape cycle button (admin) */}
      {interactive && brand.table_count > 1 && (
        <button
          onClick={cycleShape}
          className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-events-coral text-white text-[8px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
          title={`Shape: ${layout.shape}`}
        >
          ⟳
        </button>
      )}

      {/* Rotation button (admin) */}
      {interactive && (
        <button
          onClick={handleRotate}
          className="absolute -top-3 -left-3 w-5 h-5 rounded-full bg-events-yellow text-events-teal flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
          title={`Rotation: ${layout.rotation}° (shift+click for 45°)`}
        >
          <RotateCw className="w-3 h-3" />
        </button>
      )}

      {/* Sponsor label for activations */}
      {brand.is_activation && sponsorBrand && (
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

export { COURT_W, COURT_H, COURTS, TABLE_W, TABLE_H, GRID };
export default MapBrandGroup;
