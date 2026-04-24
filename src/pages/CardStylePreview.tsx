import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getCompanyLogoUrl } from "@/lib/expert-types";
import ExpertCard from "@/components/experts/ExpertCard";

interface ExpertData {
  full_name: string;
  job_title: string | null;
  current_company: string | null;
  photo_url: string | null;
  linkedin_url: string | null;
  field_of_work: string | null;
  previous_companies: string | null;
  ask_me_about: string | null;
  niche_interests: string[] | null;
  slug: string;
  id: string;
  expert_type?: string;
}

const CardStylePreview = () => {
  const [experts, setExperts] = useState<ExpertData[]>([]);

  useEffect(() => {
    const fetchExperts = async () => {
      const { data } = await supabase
        .from("expert_city_assignments")
        .select("expert_type, industry_experts(*)")
        .eq("city_slug", "denver")
        .eq("published", true)
        .limit(4);

      if (data) {
        const mapped = data.map((d: any) => ({
          ...d.industry_experts,
          expert_type: d.expert_type,
        })).filter(Boolean);
        setExperts(mapped);
      }
    };
    fetchExperts();
  }, []);

  // Use sample data if no real data
  const sampleExperts: ExpertData[] = experts.length > 0 ? experts : [
    { id: "1", full_name: "Sarah Chen", job_title: "Sr. Product Manager", current_company: "Patagonia", photo_url: null, linkedin_url: "https://linkedin.com", field_of_work: "Product", previous_companies: "Nike, REI", ask_me_about: "Sustainable product design", niche_interests: ["Trail Running"], slug: "sarah-chen", expert_type: "industry_expert" },
    { id: "2", full_name: "Jake Morrison", job_title: "Marketing Director", current_company: "Cotopaxi", photo_url: null, linkedin_url: "https://linkedin.com", field_of_work: "Marketing", previous_companies: "Columbia", ask_me_about: "Brand strategy", niche_interests: ["Climbing"], slug: "jake-morrison", expert_type: "brand_rep" },
    { id: "3", full_name: "Emily Torres", job_title: "UX Lead", current_company: "AllTrails", photo_url: null, linkedin_url: null, field_of_work: "Design", previous_companies: "Garmin, onX", ask_me_about: "UX in outdoor tech", niche_interests: ["Hiking"], slug: "emily-torres", expert_type: "industry_expert" },
  ];

  return (
    <main className="bg-events-teal min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <h1 className="font-display font-extrabold text-4xl text-events-cream mb-2 text-center">
          Card Style Preview
        </h1>
        <p className="font-body text-events-cream/50 text-center mb-16">
          Compare the three card styles for expert/brand rep display on registrant pages
        </p>

        {/* Option A: Full Polaroid Cards */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="font-display font-bold text-2xl text-events-yellow">Option A</span>
            <span className="font-display font-bold text-xl text-events-cream">Full Polaroid Cards</span>
            <span className="font-body text-xs text-events-cream/40 ml-auto">Same as /Portlandexperts</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleExperts.slice(0, 3).map((expert) => (
              <ExpertCard key={expert.id} expert={expert as any} />
            ))}
          </div>
        </section>

        {/* Option B: Current Pills */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="font-display font-bold text-2xl text-events-yellow">Option B</span>
            <span className="font-display font-bold text-xl text-events-cream">Current Pill Badges</span>
            <span className="font-body text-xs text-events-cream/40 ml-auto">Currently on /PNW26</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {sampleExperts.map((expert) => (
              <div
                key={expert.id}
                className="flex items-center gap-3 rounded-full px-4 py-2 border border-white/10"
                style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                {expert.photo_url ? (
                  <img src={expert.photo_url} alt={expert.full_name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-xs bg-events-yellow text-events-teal">
                    {expert.full_name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-body text-sm text-white font-medium leading-tight">{expert.full_name}</p>
                  {expert.current_company && (
                    <p className="font-body text-xs text-white/40">{expert.current_company}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Option C: Mini Cards */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="font-display font-bold text-2xl text-events-yellow">Option C</span>
            <span className="font-display font-bold text-xl text-events-cream">Mini Cards</span>
            <span className="font-body text-xs text-events-cream/40 ml-auto">Compact but informative</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleExperts.map((expert) => (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl overflow-hidden border border-white/10 flex"
                style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
              >
                {/* Photo */}
                <div className="w-20 h-24 shrink-0 bg-events-cream/10 relative overflow-hidden">
                  {expert.photo_url ? (
                    <img src={expert.photo_url} alt={expert.full_name} className="w-full h-full object-cover grayscale" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl font-display font-bold text-events-cream/30">
                        {expert.full_name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 p-3 flex flex-col justify-center min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-bold text-sm text-events-coral truncate">{expert.full_name}</h4>
                    {expert.linkedin_url && (
                      <a href={expert.linkedin_url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                        <Linkedin className="w-3.5 h-3.5 text-[#0077B5]" />
                      </a>
                    )}
                  </div>
                  {expert.job_title && (
                    <p className="text-events-yellow text-xs font-medium truncate">{expert.job_title}</p>
                  )}
                  {expert.current_company && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <img
                        src={getCompanyLogoUrl(expert.current_company)}
                        alt=""
                        className="w-3.5 h-3.5 object-contain"
                      />
                      <span className="text-events-cream/50 text-xs truncate">{expert.current_company}</span>
                    </div>
                  )}
                  {expert.field_of_work && (
                    <span className="inline-block mt-1.5 text-[10px] font-body px-2 py-0.5 rounded-full bg-events-cream/10 text-events-cream/40 w-fit">
                      {expert.field_of_work}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="text-center">
          <p className="font-body text-events-cream/40 text-sm">
            Tell me which style you prefer (A, B, or C), or mix and match for experts vs. brand reps!
          </p>
        </div>
      </div>
    </main>
  );
};

export default CardStylePreview;
