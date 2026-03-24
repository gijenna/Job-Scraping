import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Expert } from "@/lib/expert-types";
import { DragEndEvent } from "@dnd-kit/core";

export function useEventAttendees(citySlug: string) {
  const [brandReps, setBrandReps] = useState<Expert[]>([]);
  const [industryExperts, setIndustryExperts] = useState<Expert[]>([]);
  const [assignmentMap, setAssignmentMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendees = async () => {
      const { data } = await supabase
        .from("expert_city_assignments")
        .select(`
          id, expert_type, display_order,
          industry_experts (
            id, full_name, slug, photo_url, job_title, current_company,
            previous_companies, field_of_work, ask_me_about, niche_interests,
            years_in_industry, years_in_city, linkedin_url, favorite_media, company_domains
          )
        `)
        .eq("city_slug", citySlug)
        .eq("published", true)
        .order("display_order", { ascending: true });

      if (data) {
        const reps: Expert[] = [];
        const experts: Expert[] = [];
        const aMap: Record<string, string> = {};
        data.forEach((d: any) => {
          if (d.industry_experts) {
            const expert = d.industry_experts as Expert;
            aMap[expert.id] = d.id;
            if (d.expert_type === "brand_rep") reps.push(expert);
            else experts.push(expert);
          }
        });
        setBrandReps(reps);
        setIndustryExperts(experts);
        setAssignmentMap(aMap);
      }
      setLoading(false);
    };
    fetchAttendees();
  }, [citySlug]);

  const handleDragEnd = useCallback(async (event: DragEndEvent, list: Expert[], setList: React.Dispatch<React.SetStateAction<Expert[]>>) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = list.findIndex(e => e.id === active.id);
    const newIndex = list.findIndex(e => e.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const newList = [...list];
    const [moved] = newList.splice(oldIndex, 1);
    newList.splice(newIndex, 0, moved);
    setList(newList);
    await Promise.all(newList.map((e, i) => {
      const assignId = assignmentMap[e.id];
      if (assignId) return supabase.from("expert_city_assignments").update({ display_order: i } as any).eq("id", assignId);
    }));
  }, [assignmentMap]);

  return { brandReps, setBrandReps, industryExperts, setIndustryExperts, assignmentMap, loading, handleDragEnd };
}
