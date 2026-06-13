import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Expert } from "@/lib/expert-types";
import ExpertCard from "@/components/experts/ExpertCard";

const FOREST = "#1A2520";
const CREAM = "#F2E7D5";
const SAGE = "#A8B5A0";
const APPLY = "https://basecampoutdoor.typeform.com/MNExperts";

const MNExpertGrid = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("expert_city_assignments")
        .select(
          "expert_id, expert_type, industry_experts(id, full_name, photo_url, current_company, job_title, linkedin_url, slug, field_of_work, ask_me_about, years_in_industry, years_in_city, niche_interests, previous_companies, favorite_media, email, company_domains, status, created_by, created_at, updated_at)"
        )
        .eq("city_slug", "minneapolis")
        .eq("published", true);
      const mapped = (data || [])
        .filter((d: any) => d.expert_type !== "brand_rep")
        .map((d: any) => d.industry_experts as Expert)
        .filter(Boolean);
      setExperts(mapped);
      setLoading(false);
    })();
  }, []);

  return (
    <section className="px-6 py-20 md:py-28" style={{ backgroundColor: FOREST, color: CREAM }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <h2 className="font-normal" style={{ fontSize: 36, color: CREAM }}>
            The people who got the job, holding the door open.
          </h2>
          <p className="italic" style={{ fontSize: 16, color: SAGE }}>
            Industry experts you can meet at the Lounge. Send a note ahead, or just walk up.
          </p>
        </div>

        {loading ? (
          <p className="text-center opacity-60" style={{ color: CREAM }}>Loading…</p>
        ) : experts.length === 0 ? (
          <div className="text-center py-16" style={{ color: CREAM }}>
            <p style={{ fontSize: 18 }}>
              Expert lineup announced soon.{" "}
              <a
                href={APPLY}
                target="_blank"
                rel="noopener noreferrer"
                className="underline italic"
                style={{ color: CREAM }}
              >
                Want to be one of them? Apply here →
              </a>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {experts.map((e) => (
              <ExpertCard key={e.id} expert={e} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <a
            href={APPLY}
            target="_blank"
            rel="noopener noreferrer"
            className="italic underline-offset-4 hover:underline"
            style={{ color: CREAM, fontSize: 14 }}
          >
            Want to be an industry expert at this event? Apply here →
          </a>
        </div>
      </div>
    </section>
  );
};

export default MNExpertGrid;
