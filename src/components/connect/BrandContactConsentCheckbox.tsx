// Reusable opt-in checkbox for "Allow brands and industry experts at this
// event to contact me directly". Custom-styled for high visibility on dark
// backgrounds: visible cream border when unchecked, filled coral with a clear
// cream checkmark when checked. 24x24 tap target.
import { useState } from "react";
import { Info, Check } from "lucide-react";

interface Props {
  checked: boolean;
  onChange: (next: boolean) => void;
  className?: string;
}

const LABEL = "Allow brands and industry experts at this event to contact me directly";
const TOOLTIP = "Brands need this to reach out about jobs, opportunities, or follow-up from your event interactions. If you skip this, brands can see your profile but won't be able to email you. You can change this anytime in your profile.";

export default function BrandContactConsentCheckbox({ checked, onChange, className }: Props) {
  const [showTip, setShowTip] = useState(false);
  return (
    <div className={className}>
      <label className="flex items-start gap-3 cursor-pointer">
        <span className="relative flex-shrink-0 mt-0.5">
          <input
            type="checkbox"
            checked={!!checked}
            onChange={(e) => onChange(e.target.checked)}
            className="peer sr-only"
          />
          <span
            aria-hidden
            className={`flex items-center justify-center h-6 w-6 rounded-md border-2 transition-colors ${
              checked
                ? "bg-events-coral border-events-coral"
                : "bg-transparent border-events-cream/70 peer-hover:border-events-cream"
            }`}
          >
            {checked && <Check className="h-4 w-4 text-events-cream" strokeWidth={3} />}
          </span>
        </span>
        <span className="text-sm text-events-cream font-body leading-snug flex-1">
          {LABEL}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setShowTip((s) => !s); }}
            aria-label="More info"
            className="inline-flex items-center justify-center align-middle ml-1 text-events-cream/70 hover:text-events-cream"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </span>
      </label>
      {showTip && (
        <p className="ml-9 mt-1.5 text-xs text-events-cream/70 font-body leading-relaxed">
          {TOOLTIP}
        </p>
      )}
    </div>
  );
}
