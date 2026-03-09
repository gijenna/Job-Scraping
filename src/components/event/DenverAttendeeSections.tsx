import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ExpertCard from "@/components/experts/ExpertCard";
import { Expert } from "@/lib/expert-types";

interface DenverAttendeeSectionsProps {
  accentColor?: string;
  bgColor?: string;
}

const DenverAttendeeSections = ({
  accentColor = "#E1B624",
  bgColor = "#0d1f22",
}: DenverAttendeeSectionsProps) => {
  const [brandReps, setBrandReps] = useState<Expert[]>([]);
  const [industryExperts, setIndustryExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendees = async () => {
      const { data } = await supabase
        .from("expert_city_assignments")
        .select(`
          expert_type,
          industry_experts (
            id, full_name, slug, photo_url, job_title, current_company,
            previous_companies, field_of_work, ask_me_about, niche_interests,
            years_in_industry, years_in_city, linkedin_url, favorite_media
          )
        `)
        .eq("city_slug", "denver")
        .eq("published", true);

      if (data) {
        const reps: Expert[] = [];
        const experts: Expert[] = [];

        data.forEach((d: any) => {
          if (d.industry_experts) {
            const expert = d.industry_experts as Expert;
            if (d.expert_type === "brand_rep") {
              reps.push(expert);
            } else {
              experts.push(expert);
            }
          }
        });

        setBrandReps(reps);
        setIndustryExperts(experts);
      }
      setLoading(false);
    };

    fetchAttendees();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-6" style={{ backgroundColor: bgColor }}>
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-events-cream/50 font-body">Loading attendees...</p>
        </div>
      </section>
    );
  }

  const hasContent = brandReps.length > 0 || industryExperts.length > 0;

  if (!hasContent) return null;

  return (
    <>
      {/* Brand Reps Section */}
      {brandReps.length > 0 && (
        <section className="py-16 md:py-24 px-6" style={{ backgroundColor: bgColor }}>
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <p
                className="text-xs tracking-[0.3em] uppercase mb-4 font-body"
                style={{ color: accentColor }}
              >
                Brand Representatives
              </p>
              <h2 className="font-headline font-bold text-2xl md:text-4xl text-events-cream">
                Meet the hiring teams
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {brandReps.map((expert, i) => (
                <motion.div
                  key={expert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ExpertCard expert={expert} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Industry Experts Section */}
      {industryExperts.length > 0 && (
        <section className="py-16 md:py-24 px-6 bg-events-teal">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <p
                className="text-xs tracking-[0.3em] uppercase mb-4 font-body"
                style={{ color: accentColor }}
              >
                Industry Experts
              </p>
              <h2 className="font-headline font-bold text-2xl md:text-4xl text-events-cream">
                Veterans ready to share their stories
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {industryExperts.map((expert, i) => (
                <motion.div
                  key={expert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ExpertCard expert={expert} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default DenverAttendeeSections;
