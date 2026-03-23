import { usePageMeta } from "@/hooks/usePageMeta";

/** Drop this inside EditableTextProvider to auto-apply page meta from settings */
const PageMetaApplier = ({ title }: { title?: string }) => {
  usePageMeta(title);
  return null;
};

export default PageMetaApplier;
