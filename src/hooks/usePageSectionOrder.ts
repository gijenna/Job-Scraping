import { useCallback } from "react";
import { useEditableTextContext } from "@/components/EditableTextProvider";

export const usePageSectionOrder = (defaultOrder: string[]) => {
  const { settings, setSetting, isAdmin, pageSlug } = useEditableTextContext();
  const orderKey = `section_order`;
  const raw = settings[orderKey];

  let orderedKeys: string[];
  try {
    const parsed = raw ? JSON.parse(raw) as string[] : null;
    // Merge: use saved order but append any new sections not yet in saved order
    if (parsed && Array.isArray(parsed)) {
      const savedSet = new Set(parsed);
      const missing = defaultOrder.filter((k) => !savedSet.has(k));
      // Also remove keys that no longer exist in default
      const defaultSet = new Set(defaultOrder);
      const valid = parsed.filter((k) => defaultSet.has(k));
      orderedKeys = [...valid, ...missing];
    } else {
      orderedKeys = defaultOrder;
    }
  } catch {
    orderedKeys = defaultOrder;
  }

  const moveSection = useCallback(
    async (sectionKey: string, direction: "up" | "down") => {
      const idx = orderedKeys.indexOf(sectionKey);
      if (idx === -1) return;
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= orderedKeys.length) return;
      const newOrder = [...orderedKeys];
      [newOrder[idx], newOrder[newIdx]] = [newOrder[newIdx], newOrder[idx]];
      await setSetting(orderKey, JSON.stringify(newOrder));
    },
    [orderedKeys, setSetting, orderKey]
  );

  return { orderedKeys, moveSection, isAdmin };
};
