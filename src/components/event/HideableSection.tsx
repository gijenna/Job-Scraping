import { useEditableTextContext } from "@/components/EditableTextProvider";
import { useEventSettings } from "@/hooks/useEventSettings";
import { Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react";
import AnchorCopyButton from "@/components/event/AnchorCopyButton";

interface HideableSectionProps {
  sectionKey: string;
  children: React.ReactNode;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const HideableSection = ({ sectionKey, children, onMoveUp, onMoveDown, isFirst, isLast }: HideableSectionProps) => {
  const { isAdmin, pageSlug } = useEditableTextContext();
  const { settings, setSetting } = useEventSettings(pageSlug);
  const settingKey = `hide_${sectionKey}`;
  const hidden = settings[settingKey] === "true";

  if (hidden && !isAdmin) return null;

  return (
    <div id={sectionKey} className={`relative ${hidden ? 'opacity-30' : ''}`}>
      {isAdmin && (
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1">
          {onMoveUp && !isFirst && (
            <button
              onClick={onMoveUp}
              className="flex items-center justify-center w-6 h-6 rounded-lg bg-events-teal/80 text-white hover:bg-events-teal transition-colors shadow-lg"
              title="Move section up"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
          {onMoveDown && !isLast && (
            <button
              onClick={onMoveDown}
              className="flex items-center justify-center w-6 h-6 rounded-lg bg-events-teal/80 text-white hover:bg-events-teal transition-colors shadow-lg"
              title="Move section down"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
          <AnchorCopyButton anchor={sectionKey} label={sectionKey} />
          <button
            onClick={() => setSetting(settingKey, hidden ? "false" : "true")}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-events-coral/80 text-white text-[10px] font-bold hover:bg-events-coral transition-colors shadow-lg"
          >
            {hidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            {hidden ? 'Show' : 'Hide'}
          </button>
        </div>
      )}
      {children}
    </div>
  );
};

export default HideableSection;
