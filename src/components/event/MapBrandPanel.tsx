import { useState, useEffect } from "react";
import { X, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { MapBrand } from "@/hooks/useEventMapBrands";
import { supabase } from "@/integrations/supabase/client";
import { Expert } from "@/lib/expert-types";
import { getCompanyLogoUrl } from "@/lib/expert-types";
import ExpertCardMinimal from "@/components/experts/ExpertCardMinimal";
import { motion, AnimatePresence } from "framer-motion";

interface MapBrandPanelProps {
  brand: MapBrand | null;
  onClose: () => void;
}

const MapBrandPanel = ({ brand, onClose }: MapBrandPanelProps) => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (!brand) { setExperts([]); return; }
    const fetchReps = async () => {
      const { data } = await supabase
        .from("expert_city_assignments")
        .select("expert_id, expert_type, industry_experts(id, full_name, photo_url, current_company, job_title, linkedin_url, slug, field_of_work, ask_me_about, years_in_industry, years_in_city, niche_interests, previous_companies, favorite_media, email, company_domains, status)")
        .eq("city_slug", "denver")
        .eq("published", true);

      if (!data) return;
      const matched = data
        .filter((d: any) => {
          const exp = d.industry_experts;
          return exp && exp.current_company?.toLowerCase() === brand.name.toLowerCase();
        })
        .map((d: any) => d.industry_experts as Expert);
      setExperts(matched);
    };
    fetchReps();
  }, [brand]);

  if (!brand) return null;

  const logoSrc = brand.logo_url || (brand.website_url ? `https://logo.clearbit.com/${new URL(brand.website_url).hostname}` : null);

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="relative w-full max-w-lg max-h-[85vh] bg-events-teal rounded-xl shadow-2xl overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/20 text-events-cream flex items-center justify-center hover:bg-black/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Brand header */}
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-events-cream flex items-center justify-center overflow-hidden shadow-md border-2 border-white shrink-0">
                {logoSrc ? (
                  <img src={logoSrc} alt={brand.name} className="w-12 h-12 object-contain" />
                ) : (
                  <span className="font-display font-bold text-xl text-events-teal">
                    {brand.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-headline font-bold text-xl text-events-cream">{brand.name}</h3>
                {brand.is_activation && (
                  <span className="text-[10px] uppercase tracking-wider text-events-yellow font-body">Activation</span>
                )}
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-events-cream/40 text-xs font-body">
                    {brand.table_count} table{brand.table_count > 1 ? "s" : ""}
                  </span>
                  {brand.website_url && (
                    <a
                      href={brand.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-events-coral font-display font-bold hover:underline"
                    >
                      Visit Website <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {brand.description && (
              <p className="text-sm text-events-cream/70 font-body mt-4">{brand.description}</p>
            )}
          </div>

          {/* Brand Reps section */}
          {experts.length > 0 && (
            <div className="border-t border-white/10">
              <button
                onClick={() => setExpanded((v) => !v)}
                className="w-full flex items-center justify-between px-6 py-3 hover:bg-white/5 transition-colors"
              >
                <span className="font-display font-bold text-sm text-events-cream">
                  Brand Reps ({experts.length})
                </span>
                {expanded ? <ChevronUp className="w-4 h-4 text-events-cream/40" /> : <ChevronDown className="w-4 h-4 text-events-cream/40" />}
              </button>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 grid grid-cols-3 sm:grid-cols-4 gap-4">
                      {experts.map((expert) => (
                        <ExpertCardMinimal key={expert.id} expert={expert} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MapBrandPanel;
