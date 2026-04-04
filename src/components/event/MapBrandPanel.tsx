import { X, ExternalLink } from "lucide-react";
import { MapBrand } from "@/hooks/useEventMapBrands";

interface MapBrandPanelProps {
  brand: MapBrand | null;
  onClose: () => void;
}

const MapBrandPanel = ({ brand, onClose }: MapBrandPanelProps) => {
  if (!brand) return null;

  const logoSrc = brand.logo_url || (brand.website_url ? `https://logo.clearbit.com/${new URL(brand.website_url).hostname}` : null);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 w-80 max-h-[80vh] bg-events-cream rounded-xl shadow-2xl overflow-y-auto animate-in slide-in-from-right-4 duration-200">
        <div className="p-5">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/10 text-events-teal flex items-center justify-center hover:bg-black/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md border-2 border-white">
              {logoSrc ? (
                <img src={logoSrc} alt={brand.name} className="w-10 h-10 object-contain" />
              ) : (
                <span className="font-display font-bold text-lg text-events-teal">
                  {brand.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-headline font-bold text-lg text-events-teal">{brand.name}</h3>
              {brand.is_activation && (
                <span className="text-[10px] uppercase tracking-wider text-events-coral font-body">Activation</span>
              )}
            </div>
          </div>

          {brand.description && (
            <p className="text-sm text-events-teal/70 font-body mb-4">{brand.description}</p>
          )}

          {brand.website_url && (
            <a
              href={brand.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-events-coral font-display font-bold hover:underline"
            >
              Visit Website <ExternalLink className="w-3 h-3" />
            </a>
          )}

          <div className="mt-4 pt-4 border-t border-events-teal/10">
            <p className="text-xs text-events-teal/50 font-body">
              {brand.table_count} table{brand.table_count > 1 ? "s" : ""} · {brand.is_activation ? "Activation" : "Brand"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MapBrandPanel;
