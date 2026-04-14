import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import EditableText from "@/components/EditableText";
import CardStylePicker from "@/components/event/CardStylePicker";
import ExpertCard from "@/components/experts/ExpertCard";
import ExpertCardCompact from "@/components/experts/ExpertCardCompact";
import ExpertCardMinimal from "@/components/experts/ExpertCardMinimal";
import AnchorCopyButton from "@/components/event/AnchorCopyButton";
import { Expert } from "@/lib/expert-types";
import { useEventSettings } from "@/hooks/useEventSettings";
import { useEditableTextContext } from "@/components/EditableTextProvider";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

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

interface IndustryExpertCardsSectionProps {
  experts: Expert[];
  setExperts: React.Dispatch<React.SetStateAction<Expert[]>>;
  handleDragEnd: (event: DragEndEvent, list: Expert[], setList: React.Dispatch<React.SetStateAction<Expert[]>>) => void;
  accentColor?: string;
  bgColor?: string;
  eventSlug?: string;
  eyebrowKey?: string;
  headlineKey?: string;
  highlightExpert?: string;
  registrationUrl?: string;
}

const IndustryExpertCardsSection = ({
  experts,
  setExperts,
  handleDragEnd,
  accentColor = "#FEE123",
  bgColor = "#0d2b1f",
  eventSlug = "pnw26",
  eyebrowKey = "experts_cards_eyebrow",
  headlineKey = "experts_cards_headline",
  highlightExpert,
  registrationUrl,
}: IndustryExpertCardsSectionProps) => {
  const { settings } = useEventSettings(eventSlug);
  const { isAdmin } = useEditableTextContext();
  const [cardStyle, setCardStyle] = useState("polaroid");
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (settings["card_style_experts"]) setCardStyle(settings["card_style_experts"]);
  }, [settings]);

  useEffect(() => {
    if (highlightExpert && highlightRef.current) {
      setTimeout(() => {
        highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [highlightExpert, experts]);

  if (experts.length === 0) return null;

  const renderCard = (expert: Expert) => {
    const isHighlighted = highlightExpert === expert.slug;
    switch (cardStyle) {
      case "compact": return <ExpertCardCompact expert={expert} autoExpand={isHighlighted} />;
      case "minimal": return <ExpertCardMinimal expert={expert} autoExpand={isHighlighted} />;
      default: return <ExpertCard expert={expert} autoExpand={isHighlighted} />;
    }
  };

  const getGridClass = () =>
    cardStyle === "minimal"
      ? "grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6"
      : cardStyle === "compact"
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";

  return (
    <section className="py-16 md:py-24 px-6" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6">
          <p className="text-xs tracking-[0.3em] uppercase mb-4 font-body" style={{ color: accentColor }}>
            <EditableText settingKey={eyebrowKey} defaultText="Industry Experts" as="span" />
          </p>
          <h2 className="font-headline font-bold text-2xl md:text-4xl text-events-cream">
            <EditableText settingKey={headlineKey} defaultText="Industry pros you'll meet in person" as="span" />
          </h2>
        </motion.div>

        <div className="flex justify-center mb-8">
          <CardStylePicker eventSlug={eventSlug} settingKey="card_style_experts" label="Experts" onStyleChange={setCardStyle} />
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, experts, setExperts)}>
          <SortableContext items={experts.map(e => e.id)} strategy={rectSortingStrategy}>
            <div className={getGridClass()}>
              {experts.map((expert) => (
                <div key={expert.id} id={`expert-${expert.slug}`} ref={highlightExpert === expert.slug ? highlightRef : undefined} className="relative">
                  {isAdmin && (
                    <div className="absolute -top-1 right-0 z-10">
                      <AnchorCopyButton anchor={`expert-${expert.slug}`} label={expert.full_name} />
                    </div>
                  )}
                  <SortableCard expert={expert} renderCard={renderCard} isAdmin={isAdmin} />
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {registrationUrl && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12">
            <a
              href={registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-display font-bold text-base shadow-lg transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: accentColor, color: bgColor }}
            >
              Register to Network!
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default IndustryExpertCardsSection;
