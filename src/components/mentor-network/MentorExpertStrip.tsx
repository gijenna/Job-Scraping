import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Expert } from "@/lib/expert-types";
import ExpertCardMinimal from "@/components/experts/ExpertCardMinimal";

/**
 * Read only strip of real published Minneapolis industry experts.
 * Nothing here writes to the database.
 */
const MentorExpertStrip = ({ limit = 8 }: { limit?: number }) => {
  const [experts, setExperts] = useState<Expert[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("expert_city_assignments")
        .select(
          "expert_type, display_order, industry_experts(id, full_name, photo_url, current_company, job_title, linkedin_url, slug, field_of_work, ask_me_about, years_in_industry, years_in_city, niche_interests, previous_companies, favorite_media, email, company_domains, status, created_by, created_at, updated_at)"
        )
        .eq("city_slug", "minneapolis")
        .eq("published", true);

      const rows = ((data as any[]) || [])
        .filter((r) => r.expert_type !== "brand_rep" && r.industry_experts)
        .map((r) => r.industry_experts as Expert)
        .filter((e) => e.photo_url)
        .slice(0, limit);
      setExperts(rows);
    })();
  }, [limit]);

  if (experts.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
      {experts.map((expert) => (
        <ExpertCardMinimal key={expert.id} expert={expert} className="w-24" />
      ))}
    </div>
  );
};

export default MentorExpertStrip;
