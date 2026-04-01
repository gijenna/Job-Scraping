import { ReactNode } from "react";
import HideableSection from "@/components/event/HideableSection";
import { usePageSectionOrder } from "@/hooks/usePageSectionOrder";

export interface SectionDef {
  key: string;
  content: ReactNode;
}

interface OrderedSectionsProps {
  sections: SectionDef[];
}

const OrderedSections = ({ sections }: OrderedSectionsProps) => {
  const defaultOrder = sections.map((s) => s.key);
  const { orderedKeys, moveSection } = usePageSectionOrder(defaultOrder);

  const sectionMap = new Map(sections.map((s) => [s.key, s]));

  return (
    <>
      {orderedKeys.map((key, idx) => {
        const section = sectionMap.get(key);
        if (!section) return null;
        return (
          <HideableSection
            key={key}
            sectionKey={key}
            onMoveUp={() => moveSection(key, "up")}
            onMoveDown={() => moveSection(key, "down")}
            isFirst={idx === 0}
            isLast={idx === orderedKeys.length - 1}
          >
            {section.content}
          </HideableSection>
        );
      })}
    </>
  );
};

export default OrderedSections;
