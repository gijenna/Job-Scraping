// Single-select CTA chips for a candidate-to-rep note. Captures what the
// candidate wants the brand to do with the note. Optional.

import { cn } from "@/lib/utils";

export type NoteCTA = "follow_up" | "look_out_for_application" | "grab_coffee" | "memorable_only";

export const NOTE_CTA_OPTIONS: { value: NoteCTA; label: string }[] = [
  { value: "follow_up", label: "Follow up with me" },
  { value: "look_out_for_application", label: "Look out for my application" },
  { value: "grab_coffee", label: "Let's grab coffee" },
  { value: "memorable_only", label: "No CTA, just memorable" },
];

export const NOTE_CTA_CHIP_LABEL: Record<NoteCTA, string> = {
  follow_up: "📩 Wants follow-up",
  look_out_for_application: "👀 Applying to a role",
  grab_coffee: "☕ Wants coffee",
  memorable_only: "",
};

interface Props {
  value: NoteCTA | null;
  onChange: (v: NoteCTA | null) => void;
}

const NoteCTAChips = ({ value, onChange }: Props) => (
  <div>
    <div className="text-[11px] uppercase tracking-wider font-display text-events-cream/60 mb-2">
      What's your CTA for them? (optional)
    </div>
    <div className="flex flex-wrap gap-1.5">
      {NOTE_CTA_OPTIONS.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(active ? null : o.value)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-body border transition-colors",
              active
                ? "bg-events-coral text-events-cream border-events-coral"
                : "bg-events-cream/5 text-events-cream/80 border-events-cream/15 hover:border-events-cream/40",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  </div>
);

export default NoteCTAChips;
