import { MapBrand } from "@/hooks/useEventMapBrands";
import { MapLayout } from "@/hooks/useEventMapLayouts";

interface MapSidebarProps {
  brands: MapBrand[];
  layouts: MapLayout[];
}

const MapSidebar = ({ brands, layouts }: MapSidebarProps) => {
  const placedIds = new Set(layouts.map((l) => l.brand_id));
  const unplaced = brands.filter((b) => !placedIds.has(b.id));

  if (unplaced.length === 0) {
    return (
      <div className="text-sm text-white/40 font-body text-center py-4">
        All brands placed on map
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-white/50 font-body uppercase tracking-wider mb-3">
        Drag onto map ({unplaced.length})
      </p>
      {unplaced.map((brand) => {
        const logoSrc = brand.logo_url || (brand.website_url ? `https://logo.clearbit.com/${new URL(brand.website_url).hostname}` : null);

        return (
          <div
            key={brand.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("brandId", brand.id);
            }}
            className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10 cursor-grab active:cursor-grabbing hover:bg-white/10 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
              {logoSrc ? (
                <img src={logoSrc} alt={brand.name} className="w-6 h-6 object-contain" />
              ) : (
                <span className="font-display font-bold text-[9px] text-events-teal">
                  {brand.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-display font-bold text-white truncate">{brand.name}</p>
              <p className="text-[10px] text-white/50 font-body">
                {brand.table_count} table{brand.table_count > 1 ? "s" : ""}
                {brand.is_activation ? " · Activation" : ""}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MapSidebar;
