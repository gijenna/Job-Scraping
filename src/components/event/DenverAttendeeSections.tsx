import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import ExpertCard from "@/components/experts/ExpertCard";
import ExpertCardCompact from "@/components/experts/ExpertCardCompact";
import ExpertCardMinimal from "@/components/experts/ExpertCardMinimal";
import CardStylePicker from "@/components/event/CardStylePicker";
import CascadingLogoBubbles from "@/components/event/CascadingLogoBubbles";
import BrandUmbrellaSection from "@/components/event/BrandUmbrellaSection";
import { Expert } from "@/lib/expert-types";
import { useEventSettings } from "@/hooks/useEventSettings";
import { useEditableTextContext } from "@/components/EditableTextProvider";
import EditableText from "@/components/EditableText";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useEventLogos } from "@/hooks/useEventLogos";

interface DenverAttendeeSectionsProps {
  accentColor?: string;
  bgColor?: string;
  eventSlug?: string;
  bubbleLogos?: { name: string; domain: string; logo_url: string | null }[];
}

const SortableCard = ({ expert, renderCard, isAdmin }: { expert: Expert; renderCard: (e: Expert) => React.ReactNode; isAdmin: boolean }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: expert.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <motion.div ref={setNodeRef} style={style} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative">
      {isAdmin && (
        <button {...attributes} {...listeners} className="absolute -top-1 -left-1 z-10 w-6 h-6 rounded bg-events-coral/80 text-white flex items-center justify-center cursor-grab active:cursor-grabbing">
          <GripVertical className="w-3.5 h-3.5" />
        </button>
      )}
      {renderCard(expert)}
    </motion.div>
  );
};

const DenverAttendeeSections = ({
  accentColor = "#E1B624",
  bgColor = "#0d1f22",
  eventSlug = "denver26",
}: DenverAttendeeSectionsProps) => {
  const [brandReps, setBrandReps] = useState<Expert[]>([]);
  const [industryExperts, setIndustryExperts] = useState<Expert[]>([]);
  const [assignmentMap, setAssignmentMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { settings } = useEventSettings(eventSlug);
  const { isAdmin } = useEditableTextContext();
  const [brandRepStyle, setBrandRepStyle] = useState("polaroid");
  const [expertStyle, setExpertStyle] = useState("polaroid");
  const { logos: tickerLogos } = useEventLogos("denver26");
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    if (settings["card_style_brand_reps"]) setBrandRepStyle(settings["card_style_brand_reps"]);
    if (settings["card_style_experts"]) setExpertStyle(settings["card_style_experts"]);
  }, [settings]);

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
        .eq("city_slug", "denver")
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
  }, []);

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
    // Persist order
    await Promise.all(newList.map((e, i) => {
      const assignId = assignmentMap[e.id];
      if (assignId) return supabase.from("expert_city_assignments").update({ display_order: i } as any).eq("id", assignId);
    }));
  }, [assignmentMap]);

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

  const bubbleLogos = tickerLogos.map(l => ({ name: l.name, domain: l.domain || "", logo_url: l.logo_url }));

  return (
    <>
      {brandReps.length > 0 && (
        <section className="py-16 md:py-24 px-6" style={{ backgroundColor: bgColor }}>
          <div className="container mx-auto max-w-6xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6">
              <p className="text-xs tracking-[0.3em] uppercase mb-4 font-body" style={{ color: accentColor }}>
                <EditableText settingKey="denver_brand_reps_eyebrow" defaultText="Featured Brands" as="span" />
              </p>
              <h2 className="font-headline font-bold text-2xl md:text-4xl text-events-cream">
                <EditableText settingKey="denver_brand_reps_headline" defaultText="Meet the Teams" as="span" />
              </h2>
            </motion.div>

            <CascadingLogoBubbles logos={bubbleLogos} bubbleColor="#F5E6D3" editKeyPrefix="denver_bubbles" />

            <BrandUmbrellaSection experts={brandReps} accentColor={accentColor} eventSlug={eventSlug} />

            <div className="flex justify-center mb-8 mt-8">
              <CardStylePicker eventSlug={eventSlug} settingKey="card_style_brand_reps" label="Brand Reps" onStyleChange={setBrandRepStyle} />
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, brandReps, setBrandReps)}>
              <SortableContext items={brandReps.map(e => e.id)} strategy={rectSortingStrategy}>
                <div className={getGridClass(brandRepStyle)}>
                  {brandReps.map((expert) => (
                    <SortableCard key={expert.id} expert={expert} renderCard={(e) => renderCard(e, brandRepStyle)} isAdmin={isAdmin} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </section>
      )}

      {industryExperts.length > 0 && (
        <section className="py-16 md:py-24 px-6 bg-events-teal">
          <div className="container mx-auto max-w-6xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6">
              <p className="text-xs tracking-[0.3em] uppercase mb-4 font-body" style={{ color: accentColor }}>
                <EditableText settingKey="denver_experts_eyebrow" defaultText="Industry Experts" as="span" />
              </p>
              <h2 className="font-headline font-bold text-2xl md:text-4xl text-events-cream">
                <EditableText settingKey="denver_experts_headline" defaultText="Veterans ready to share their stories" as="span" />
              </h2>
            </motion.div>

            <div className="flex justify-center mb-8">
              <CardStylePicker eventSlug={eventSlug} settingKey="card_style_experts" label="Experts" onStyleChange={setExpertStyle} />
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, industryExperts, setIndustryExperts)}>
              <SortableContext items={industryExperts.map(e => e.id)} strategy={rectSortingStrategy}>
                <div className={getGridClass(expertStyle)}>
                  {industryExperts.map((expert) => (
                    <SortableCard key={expert.id} expert={expert} renderCard={(e) => renderCard(e, expertStyle)} isAdmin={isAdmin} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </section>
      )}
    </>
  );
};

export default DenverAttendeeSections;
