// Reusable opt-in checkbox for "Allow brands and industry experts at this
// event to contact me directly". Used in both candidate signup forms and the
// candidate profile edit view. Styled small and calm to mirror the existing
// data portability checkbox.
import { useState } from "react";
import { Info } from "lucide-react";

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
      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={!!checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-events-cream/30 bg-transparent accent-events-cream/60"
        />
        <span className="text-xs text-events-cream/75 font-body leading-relaxed flex-1">
          {LABEL}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setShowTip((s) => !s); }}
            aria-label="More info"
            className="inline-flex items-center justify-center align-middle ml-1 text-events-cream/50 hover:text-events-cream"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </span>
      </label>
      {showTip && (
        <p className="ml-6 mt-1.5 text-[11px] text-events-cream/60 font-body leading-relaxed">
          {TOOLTIP}
        </p>
      )}
    </div>
  );
}
