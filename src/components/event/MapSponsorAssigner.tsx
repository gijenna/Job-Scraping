import { MapBrand } from "@/hooks/useEventMapBrands";
import { Link2 } from "lucide-react";

interface MapSponsorAssignerProps {
  brands: MapBrand[];
  onAssignSponsor: (activationId: string, sponsorId: string | null) => void;
}

const MapSponsorAssigner = ({ brands, onAssignSponsor }: MapSponsorAssignerProps) => {
  const activations = brands.filter((b) => b.is_activation);
  const nonActivations = brands.filter((b) => !b.is_activation);

  if (activations.length === 0) {
    return (
      <div className="rounded-xl bg-white/5 border border-white/10 p-4">
        <h3 className="font-display font-bold text-white text-sm mb-1">Activation Sponsors</h3>
        <p className="text-xs text-white/30 font-body">No activations yet. Mark a brand as "Activation" when adding to see sponsor options here.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Link2 className="w-4 h-4 text-events-gold" />
        <div>
          <h3 className="font-display font-bold text-white text-sm">Activation Sponsors</h3>
          <p className="text-[10px] text-white/40 font-body">Assign a brand sponsor to each activation for "Free Thanks to" labels</p>
        </div>
      </div>

      <div className="space-y-3">
        {activations.map((activation) => {
          const currentSponsor = activation.sponsor_brand_id
            ? brands.find((b) => b.id === activation.sponsor_brand_id)
            : null;

          const logoSrc = activation.logo_url || null;

          return (
            <div key={activation.id} className="flex items-center gap-3 p-3 rounded-lg bg-events-gold/10 border border-events-gold/20">
              {/* Activation logo */}
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0 border-2 border-events-gold/50">
                {logoSrc ? (
                  <img src={logoSrc} alt={activation.name} className="w-7 h-7 object-contain" />
                ) : (
                  <span className="font-display font-bold text-[10px] text-events-teal">{activation.name.split(" ").map(w => w[0]).join("").slice(0, 2)}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-display font-bold text-white">{activation.name}</p>
                <p className="text-[10px] text-white/50 font-body">{activation.table_count} table{activation.table_count > 1 ? "s" : ""}</p>
              </div>

              {/* Arrow */}
              <div className="text-white/30 text-xs font-body">→</div>

              {/* Sponsor selector */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-white/40 font-body whitespace-nowrap">Free thanks to</span>
                <select
                  value={activation.sponsor_brand_id || ""}
                  onChange={(e) => onAssignSponsor(activation.id, e.target.value || null)}
                  className="bg-white/10 border border-white/20 text-white text-xs rounded h-8 px-2 min-w-[140px] font-body"
                >
                  <option value="">No sponsor</option>
                  {nonActivations.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>

                {currentSponsor && (
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
                    {currentSponsor.logo_url ? (
                      <img src={currentSponsor.logo_url} alt={currentSponsor.name} className="w-5 h-5 object-contain" />
                    ) : (
                      <span className="text-[7px] font-bold text-events-teal">{currentSponsor.name[0]}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MapSponsorAssigner;
