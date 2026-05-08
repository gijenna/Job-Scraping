import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Expert } from "@/lib/expert-types";

export function useDenverExperts() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("expert_city_assignments")
        .select("expert_id, industry_experts(id, full_name, photo_url, current_company, job_title, linkedin_url, slug, field_of_work, ask_me_about, years_in_industry, years_in_city, niche_interests, previous_companies, favorite_media, email, company_domains, status, created_by, created_at, updated_at)")
        .eq("city_slug", "denver")
        .eq("published", true);
      const mapped = (data || [])
        .map((d: any) => d.industry_experts as Expert)
        .filter(Boolean);
      setExperts(mapped);
      setLoading(false);
    })();
  }, []);

  return { experts, loading };
}
