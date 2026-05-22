import { useRef } from "react";
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

interface ChildLogo {
  name: string;
  logo_url: string | null;
  website_url: string | null;
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
  childLogos?: ChildLogo[];
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
  childLogos = [],
}: MapBrandGroupProps) => {
  // map_size scales the table footprint AND the bubble. 'xl' is reserved for
  // parent-company activations like VF Corp — bigger than normal brands but
  // still smaller than the hero (Outside / Basecamp) tables.
  const sizeMul =
    brand.map_size === "xl" ? 1.6 : brand.map_size === "large" ? 1.25 : 1;
  const T_W = TABLE_W * sizeMul;
  const T_H = TABLE_H * sizeMul;

  const cells = getShapeCells(layout.shape, brand.table_count);
  const maxCol = Math.max(...cells.map((c) => c.col));
  const maxRow = Math.max(...cells.map((c) => c.row));
  const bounds = { width: (maxCol + 1) * T_W, height: (maxRow + 1) * T_H };

  const logoSrc = brand.logo_url || (brand.website_url ? `https://www.google.com/s2/favicons?domain=${new URL(brand.website_url.startsWith("http") ? brand.website_url : `https://${brand.website_url}`).hostname}&sz=128` : null);

  const isDragging = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive || !onMove) return;
    // Don't start drag from buttons
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
              left: cell.col * T_W,
              top: cell.row * T_H,
              width: T_W,
              height: T_H,
              backgroundColor: brand.is_activation || brand.map_size === "xl"
                ? "rgba(225, 182, 36, 0.35)"
                : "rgba(237, 118, 96, 0.3)",
            }}
          />
        ))}

        {/* Child-logo strip rendered over the parent table.
            Counter-rotate so logos stay upright regardless of table rotation. */}
        {childLogos.length > 0 && (
          <div
            className="absolute inset-0 flex flex-wrap items-center justify-center gap-1 p-1 pointer-events-none"
            style={{
              transform: `rotate(${-layout.rotation}deg)`,
              transformOrigin: "center center",
            }}
          >
            {childLogos.slice(0, 12).map((c, i) => {
              const src = c.logo_url || (c.website_url ? (() => {
                try {
                  const d = new URL(c.website_url!.startsWith("http") ? c.website_url! : `https://${c.website_url}`).hostname;
                  return `https://www.google.com/s2/favicons?domain=${d}&sz=64`;
                } catch { return null; }
              })() : null);
              return (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full bg-white/95 overflow-hidden flex items-center justify-center shadow-sm border border-white"
                  title={c.name}
                >
                  {src ? (
                    <img src={src} alt={c.name} className="w-4 h-4 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <span className="text-[6px] font-bold text-events-teal">{(c.name || "?")[0]}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Logo bubble + name, always upright (no rotation) */}
      {(() => {
        const isHero = /^(outside inc|basecamp)$/i.test(brand.name.trim());
        const isXl = brand.map_size === "xl";
        const bubble = isHero
          ? "w-20 h-20 border-4"
          : isXl
          ? "w-14 h-14 border-[3px]"
          : "w-10 h-10 border-2";
        const inner = isHero ? "w-16 h-16" : isXl ? "w-11 h-11" : "w-8 h-8";
        const initialsSize = isHero ? "text-base" : isXl ? "text-sm" : "text-[10px]";
        const nameSize = isHero ? "text-[12px]" : isXl ? "text-[11px]" : "text-[9px]";
        return (
      <div className="flex flex-col items-center -mt-2" style={{ width: bounds.width }}>
        <div className={`relative ${bubble} rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden border-white ${brand.is_featured ? "featured-bubble-glow" : ""}`}>
          {logoSrc ? (
            <img src={logoSrc} alt={brand.name} className={`${inner} object-contain`} />
          ) : (
            <span className={`font-display font-bold ${initialsSize} text-events-teal`}>
              {brand.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </span>
          )}
        </div>
        <span className={`${nameSize} font-display font-bold text-white text-center leading-tight mt-0.5 drop-shadow`}>
          {brand.name}
        </span>
      </div>
        );
      })()}

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
