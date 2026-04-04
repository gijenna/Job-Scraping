import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import basecampMatchLogo from "@/assets/basecamp-match-logo.svg";
import { Users, Check, X } from "lucide-react";

interface ExpertRow {
  id: string;
  full_name: string;
  photo_url: string | null;
  current_company: string | null;
  job_title: string | null;
  expert_type: string;
}

export interface MapExpert {
  id: string;
  full_name: string;
  photo_url: string | null;
  current_company: string | null;
  job_title: string | null;
}

interface MapExpertZoneProps {
  citySlug?: string;
  /** IDs of experts currently toggled onto the map */
  selectedExpertIds: string[];
  onToggleExpert: (expertId: string) => void;
}

const MapExpertZone = ({ citySlug = "denver", selectedExpertIds, onToggleExpert }: MapExpertZoneProps) => {
  const [experts, setExperts] = useState<ExpertRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperts = async () => {
      const { data, error } = await supabase
        .from("expert_city_assignments")
        .select("expert_id, expert_type, industry_experts(id, full_name, photo_url, current_company, job_title)")
        .eq("city_slug", citySlug)
        .eq("published", true);

      if (!error && data) {
        const mapped = data
          .filter((d: any) => d.industry_experts)
          .map((d: any) => ({
            id: d.industry_experts.id,
            full_name: d.industry_experts.full_name,
            photo_url: d.industry_experts.photo_url,
            current_company: d.industry_experts.current_company,
            job_title: d.industry_experts.job_title,
            expert_type: d.expert_type,
          }));
        setExperts(mapped);
      }
      setLoading(false);
    };
    fetchExperts();
  }, [citySlug]);

  const industryExperts = experts.filter((e) => e.expert_type === "industry_expert");
  const brandReps = experts.filter((e) => e.expert_type === "brand_rep");

  const renderExpertRow = (expert: ExpertRow) => {
    const isSelected = selectedExpertIds.includes(expert.id);
    return (
      <div key={expert.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
        <div className="w-6 h-6 rounded-full bg-white overflow-hidden flex items-center justify-center shrink-0">
          {expert.photo_url ? (
            <img src={expert.photo_url} alt={expert.full_name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[8px] font-bold text-events-teal">{expert.full_name.split(" ").map(w => w[0]).join("").slice(0, 2)}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-display font-bold text-white truncate">{expert.full_name}</p>
          {expert.current_company && (
            <p className="text-[8px] text-white/50 font-body truncate">{expert.current_company}</p>
          )}
        </div>
        <button
          onClick={() => onToggleExpert(expert.id)}
          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
            isSelected
              ? "bg-red-500/20 text-red-400 hover:bg-red-500/40"
              : "bg-green-500/20 text-green-400 hover:bg-green-500/40"
          }`}
          title={isSelected ? "Remove from map" : "Add to map"}
        >
          {isSelected ? <X className="w-3 h-3" /> : <Check className="w-3 h-3" />}
        </button>
      </div>
    );
  };

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
      <div className="flex items-center gap-3 mb-4">
        <img src={basecampMatchLogo} alt="Basecamp" className="h-6 w-auto" />
        <div>
          <h3 className="font-display font-bold text-white text-sm">Industry Expert Zone</h3>
          <p className="text-[10px] text-white/40 font-body">Toggle experts on/off the map · {selectedExpertIds.length} selected</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-white/50">
          <Users className="w-4 h-4" />
          <span className="text-xs font-body">{experts.length} total</span>
        </div>
      </div>

      {loading ? (
        <p className="text-xs text-white/30 font-body">Loading experts...</p>
      ) : experts.length === 0 ? (
        <p className="text-xs text-white/30 font-body">No published experts assigned yet.</p>
      ) : (
        <div className="space-y-4">
          {industryExperts.length > 0 && (
            <div>
              <p className="text-[10px] text-white/50 font-body uppercase tracking-wider mb-2">Industry Experts ({industryExperts.length})</p>
              <div className="flex flex-wrap gap-2">
                {industryExperts.map(renderExpertRow)}
              </div>
            </div>
          )}
          {brandReps.length > 0 && (
            <div>
              <p className="text-[10px] text-white/50 font-body uppercase tracking-wider mb-2">Brand Reps ({brandReps.length})</p>
              <div className="flex flex-wrap gap-2">
                {brandReps.map(renderExpertRow)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapExpertZone;
