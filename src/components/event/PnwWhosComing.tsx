import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ExpertCard from "@/components/experts/ExpertCard";
import ExpertCardCompact from "@/components/experts/ExpertCardCompact";
import ExpertCardMinimal from "@/components/experts/ExpertCardMinimal";
import CardStylePicker from "@/components/event/CardStylePicker";
import { Expert } from "@/lib/expert-types";
import { useEventSettings } from "@/hooks/useEventSettings";

interface PnwWhosComingProps {
  accentColor?: string;
  bgColor?: string;
  eventSlug?: string;
}

const PnwWhosComing = ({
  accentColor = "#FEE123",
  bgColor = "#154733",
  eventSlug = "pnw26",
}: PnwWhosComingProps) => {
  const [brandReps, setBrandReps] = useState<Expert[]>([]);
  const [industryExperts, setIndustryExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useEventSettings(eventSlug);
  const [brandRepStyle, setBrandRepStyle] = useState("polaroid");
  const [expertStyle, setExpertStyle] = useState("polaroid");

  useEffect(() => {
    if (settings["card_style_brand_reps"]) setBrandRepStyle(settings["card_style_brand_reps"]);
    if (settings["card_style_experts"]) setExpertStyle(settings["card_style_experts"]);
  }, [settings]);

  useEffect(() => {
    const fetchAttendees = async () => {
      const { data } = await supabase
        .from("expert_city_assignments")
        .select(`
          expert_type,
          industry_experts (
            id, full_name, slug, photo_url, job_title, current_company,
            previous_companies, field_of_work, ask_me_about, niche_interests,
            years_in_industry, years_in_city, linkedin_url, favorite_media, company_domains
          )
        `)
        .eq("city_slug", "portland")
        .eq("published", true);

      if (data) {
        const reps: Expert[] = [];
        const experts: Expert[] = [];
        data.forEach((d: any) => {
          if (d.industry_experts) {
            const expert = d.industry_experts as Expert;
            if (d.expert_type === "brand_rep") reps.push(expert);
            else experts.push(expert);
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

  const renderCard = (expert: Expert, style: string) => {
    switch (style) {
      case "compact": return <ExpertCardCompact expert={expert} />;
      case "minimal": return <ExpertCardMinimal expert={expert} />;
      default: return <ExpertCard expert={expert} />;
    }
  };

  const getGridClass = (style: string) =>
    style === "minimal"
      ? "grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6"
      : style === "compact"
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";

  return (
    <>
      {brandReps.length > 0 && (
        <section className="py-16 md:py-24 px-6" style={{ backgroundColor: bgColor }}>
          <div className="container mx-auto max-w-6xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6">
              <p className="text-xs tracking-[0.3em] uppercase mb-4 font-body" style={{ color: accentColor }}>Brand Representatives</p>
              <h2 className="font-headline font-bold text-2xl md:text-4xl text-events-cream">Meet the hiring teams</h2>
            </motion.div>

            <div className="flex justify-center mb-8">
              <CardStylePicker eventSlug={eventSlug} settingKey="card_style_brand_reps" label="Brand Reps" onStyleChange={setBrandRepStyle} />
            </div>

            <div className={getGridClass(brandRepStyle)}>
              {brandReps.map((expert, i) => (
                <motion.div key={expert.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  {renderCard(expert, brandRepStyle)}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {industryExperts.length > 0 && (
        <section className="py-16 md:py-24 px-6 bg-events-teal">
          <div className="container mx-auto max-w-6xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6">
              <p className="text-xs tracking-[0.3em] uppercase mb-4 font-body" style={{ color: accentColor }}>Industry Experts</p>
              <h2 className="font-headline font-bold text-2xl md:text-4xl text-events-cream">Industry pros you'll meet in person</h2>
            </motion.div>

            <div className="flex justify-center mb-8">
              <CardStylePicker eventSlug={eventSlug} settingKey="card_style_experts" label="Experts" onStyleChange={setExpertStyle} />
            </div>

            <div className={getGridClass(expertStyle)}>
              {industryExperts.map((expert, i) => (
                <motion.div key={expert.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  {renderCard(expert, expertStyle)}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default PnwWhosComing;
