import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useEditableTextContext } from "@/components/EditableTextProvider";
import type { Expert } from "@/lib/expert-types";
import ExpertCardMinimal from "@/components/experts/ExpertCardMinimal";
import { Eye, EyeOff } from "lucide-react";

const HIDDEN_KEY = "mentor_strip_hidden";

/**
 * Read only strip of real published industry experts.
 * Nothing here writes to industry_experts or expert_city_assignments.
 * Hiding is stored as a page setting only.
 */
const MentorExpertStrip = ({ limit = 24 }: { limit?: number }) => {
  const { settings, setSetting, isAdmin } = useEditableTextContext();
  const [experts, setExperts] = useState<Expert[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("expert_city_assignments")
        .select(
          "expert_type, display_order, industry_experts(id, full_name, photo_url, current_company, job_title, linkedin_url, slug, field_of_work, ask_me_about, years_in_industry, years_in_city, niche_interests, previous_companies, favorite_media, email, company_domains, status, created_by, created_at, updated_at)"
        )
        .eq("published", true);

      const seen = new Set<string>();
      const rows: Expert[] = [];
      ((data as any[]) || [])
        .filter((r) => r.expert_type !== "brand_rep" && r.industry_experts)
        .forEach((r) => {
          const e = r.industry_experts as Expert;
          if (!e.photo_url || seen.has(e.id)) return;
          seen.add(e.id);
          rows.push(e);
        });
      setExperts(rows.slice(0, limit));
    })();
  }, [limit]);

  const hidden = useMemo<string[]>(() => {
    try {
      const v = JSON.parse(settings[HIDDEN_KEY] || "[]");
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  }, [settings]);

  const visible = isAdmin ? experts : experts.filter((e) => !hidden.includes(e.id));

  const toggle = (id: string) => {
    const next = hidden.includes(id) ? hidden.filter((h) => h !== id) : [...hidden, id];
    setSetting(HIDDEN_KEY, JSON.stringify(next));
  };

  if (visible.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
      {visible.map((expert) => {
        const isHidden = hidden.includes(expert.id);
        return (
          <div key={expert.id} className="relative" style={{ opacity: isHidden ? 0.3 : 1 }}>
            <ExpertCardMinimal expert={expert} className="w-24" />
            {isAdmin && (
              <button
                type="button"
                onClick={() => toggle(expert.id)}
                aria-label={isHidden ? "Show expert" : "Hide expert"}
                className="absolute -right-1 -top-1 rounded-full bg-black/70 p-1 text-white hover:bg-black"
              >
                {isHidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MentorExpertStrip;
