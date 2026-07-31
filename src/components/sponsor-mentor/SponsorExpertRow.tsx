import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useEditableTextContext } from "@/components/EditableTextProvider";
import type { Expert } from "@/lib/expert-types";
import ExpertCard from "@/components/experts/ExpertCard";
import { Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";

const HIDDEN_KEY = "sponsor_experts_hidden";
const ORDER_KEY = "sponsor_experts_order";

/**
 * Read only row of real published industry experts.
 * Nothing here writes to industry_experts or expert_city_assignments.
 * Hiding and ordering are stored as settings on this page only.
 */
const SponsorExpertRow = () => {
  const { settings, setSetting, isAdmin } = useEditableTextContext();
  const [experts, setExperts] = useState<Expert[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("expert_city_assignments")
        .select(
          "expert_type, industry_experts(id, full_name, photo_url, current_company, job_title, linkedin_url, slug, field_of_work, ask_me_about, years_in_industry, years_in_city, niche_interests, previous_companies, favorite_media, email, company_domains, status, created_by, created_at, updated_at)"
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
      setExperts(rows);
    })();
  }, []);

  const hidden = useMemo<string[]>(() => {
    try {
      const v = JSON.parse(settings[HIDDEN_KEY] || "[]");
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  }, [settings]);

  const order = useMemo<string[]>(() => {
    try {
      const v = JSON.parse(settings[ORDER_KEY] || "[]");
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  }, [settings]);

  const sorted = useMemo(() => {
    const rank = new Map(order.map((id, i) => [id, i]));
    return [...experts].sort(
      (a, b) => (rank.get(a.id) ?? 9999) - (rank.get(b.id) ?? 9999)
    );
  }, [experts, order]);

  const visible = isAdmin ? sorted : sorted.filter((e) => !hidden.includes(e.id));

  const toggleHidden = (id: string) => {
    const next = hidden.includes(id) ? hidden.filter((h) => h !== id) : [...hidden, id];
    setSetting(HIDDEN_KEY, JSON.stringify(next));
  };

  const move = (id: string, dir: -1 | 1) => {
    const ids = sorted.map((e) => e.id);
    const i = ids.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    setSetting(ORDER_KEY, JSON.stringify(ids));
  };

  if (visible.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {visible.map((expert) => {
        const isHidden = hidden.includes(expert.id);
        return (
          <div key={expert.id} className="relative" style={{ opacity: isHidden ? 0.3 : 1 }}>
            <ExpertCard expert={expert} />
            {isAdmin && (
              <div className="absolute right-2 top-2 z-10 flex gap-1 rounded-md bg-black/70 p-1">
                <button
                  type="button"
                  onClick={() => move(expert.id, -1)}
                  className="rounded p-1 text-white hover:bg-white/20"
                  aria-label="Move earlier"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleHidden(expert.id)}
                  className="rounded p-1 text-white hover:bg-white/20"
                  aria-label={isHidden ? "Show expert" : "Hide expert"}
                >
                  {isHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => move(expert.id, 1)}
                  className="rounded p-1 text-white hover:bg-white/20"
                  aria-label="Move later"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SponsorExpertRow;
