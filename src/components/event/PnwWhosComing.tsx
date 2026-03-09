import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ExpertCard from "@/components/experts/ExpertCard";
import { Expert } from "@/lib/expert-types";

interface PnwWhosComingProps {
  accentColor?: string;
  bgColor?: string;
}

const PnwWhosComing = ({
  accentColor = "#FEE123",
  bgColor = "#154733",
}: PnwWhosComingProps) => {
  const [attendees, setAttendees] = useState<Expert[]>([]);
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
        .eq("city_slug", "portland")
        .eq("published", true);

      if (data) {
        const all: Expert[] = data
          .map((d: any) => d.industry_experts)
          .filter(Boolean) as Expert[];
        setAttendees(all);
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

  if (attendees.length === 0) return null;

  return (
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
            Who's Coming
          </p>
          <h2 className="font-headline font-bold text-2xl md:text-4xl text-events-cream">
            Industry pros you'll meet in person
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {attendees.map((expert, i) => (
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
  );
};

export default PnwWhosComing;
