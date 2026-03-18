import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useEventSettings } from "@/hooks/useEventSettings";
import { LayoutGrid, List, Circle } from "lucide-react";

interface CardStylePickerProps {
  eventSlug: string;
  settingKey?: string;
  label?: string;
  onStyleChange?: (style: string) => void;
}

const styles = [
  { key: "polaroid", label: "A", icon: LayoutGrid, description: "Polaroid" },
  { key: "compact", label: "B", icon: List, description: "Compact" },
  { key: "minimal", label: "C", icon: Circle, description: "Minimal" },
];

const CardStylePicker = ({ eventSlug, settingKey = "card_style", label, onStyleChange }: CardStylePickerProps) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { settings, setSetting } = useEventSettings(eventSlug);
  const currentStyle = settings[settingKey] || "polaroid";

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setIsAdmin(!!data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setIsAdmin(!!session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    onStyleChange?.(currentStyle);
  }, [currentStyle, onStyleChange]);

  if (!isAdmin) return null;

  const handleChange = async (style: string) => {
    await setSetting("card_style", style);
    onStyleChange?.(style);
  };

  return (
    <div className="flex items-center gap-2 bg-events-card/50 rounded-lg p-2 border border-events-cream/10">
      <span className="text-events-cream/50 text-xs font-body mr-1">Card Style:</span>
      {styles.map((s) => {
        const Icon = s.icon;
        const isActive = currentStyle === s.key;
        return (
          <button
            key={s.key}
            onClick={() => handleChange(s.key)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-display font-bold transition-all ${
              isActive
                ? "bg-events-coral text-events-teal"
                : "text-events-cream/50 hover:text-events-cream hover:bg-events-cream/10"
            }`}
            title={s.description}
          >
            <Icon className="w-3 h-3" />
            {s.label}
          </button>
        );
      })}
    </div>
  );
};

export default CardStylePicker;
