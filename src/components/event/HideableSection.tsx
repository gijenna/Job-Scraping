import { useEditableTextContext } from "@/components/EditableTextProvider";
import { useEventSettings } from "@/hooks/useEventSettings";
import { Eye, EyeOff } from "lucide-react";

interface HideableSectionProps {
  sectionKey: string;
  children: React.ReactNode;
}

const HideableSection = ({ sectionKey, children }: HideableSectionProps) => {
  const { isAdmin, pageSlug } = useEditableTextContext();
  const { settings, setSetting } = useEventSettings(pageSlug);
  const settingKey = `hide_${sectionKey}`;
  const hidden = settings[settingKey] === "true";

  if (hidden && !isAdmin) return null;

  return (
    <div className={`relative ${hidden ? 'opacity-30' : ''}`}>
      {isAdmin && (
        <button
          onClick={() => setSetting(settingKey, hidden ? "false" : "true")}
          className="absolute top-2 right-2 z-20 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-events-coral/80 text-white text-[10px] font-bold hover:bg-events-coral transition-colors shadow-lg"
        >
          {hidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          {hidden ? 'Show' : 'Hide'}
        </button>
      )}
      {children}
    </div>
  );
};

export default HideableSection;
