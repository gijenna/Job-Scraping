// Compact preview that mimics the candidate-facing brand modal header.
// Used in the dashboard top-right slot. Greyed-out placeholders prompt reps
// to fill missing fields.
import { ExternalLink, Wifi, Briefcase, Pencil } from "lucide-react";

interface Props {
  brand: any;
  onClick?: () => void;
  footerSlot?: React.ReactNode;
}

export default function BrandCardPreview({ brand, onClick, footerSlot }: Props) {
  if (!brand) return null;
  const logoSrc = brand.logo_url || (brand.website_url ? (() => {
    try { return `https://www.google.com/s2/favicons?domain=${new URL(brand.website_url.startsWith("http") ? brand.website_url : `https://${brand.website_url}`).hostname}&sz=128`; } catch { return null; }
  })() : null);
  const hiringActive = brand.currently_hiring === "Yes, actively hiring" || brand.currently_hiring === "Always open to great people";
  const hiringText = brand.currently_hiring;
  const remote = brand.offers_remote;
  const why = brand.why_visit_text;

  return (
    <div
      onClick={onClick}
      className="group block w-full text-left bg-events-teal border border-events-cream/15 rounded-2xl p-5 hover:border-events-coral/60 transition-colors relative cursor-pointer"
    >
      <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onClick?.(); }}
          className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-display bg-events-coral/90 hover:bg-events-coral text-events-cream px-2.5 py-1 rounded-full opacity-90 group-hover:opacity-100"
        >
          <Pencil className="w-2.5 h-2.5" /> Edit my brand card
        </button>
        {footerSlot}
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 pr-28">
        <div className="w-14 h-14 rounded-full bg-events-cream flex items-center justify-center overflow-hidden shadow-md border-2 border-white shrink-0">
          {logoSrc ? (
            <img src={logoSrc} alt={brand.name} className="w-10 h-10 object-contain" />
          ) : (
            <span className="font-display font-bold text-lg text-events-teal">
              {brand.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-headline font-bold text-lg text-events-cream truncate">{brand.name}</h3>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-events-cream/40 text-xs font-body">
              {brand.table_count} table{brand.table_count > 1 ? "s" : ""}
            </span>
            {brand.website_url ? (
              <span className="inline-flex items-center gap-1 text-xs text-events-coral font-display font-bold">
                Visit Website <ExternalLink className="w-3 h-3" />
              </span>
            ) : (
              <Placeholder>Add brand website</Placeholder>
            )}
          </div>
        </div>
      </div>

      {/* Badges row */}
      <div className="flex flex-wrap gap-1.5 mt-4">
        {hiringText ? (
          <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-display px-2.5 py-1 rounded-full ${
            hiringActive ? "bg-events-coral text-events-cream" : "bg-events-cream/10 text-events-cream/70"
          }`}>
            <Briefcase className="w-3 h-3" /> {hiringText}
          </span>
        ) : (
          <Placeholder pill>Add hiring status</Placeholder>
        )}
        {remote ? (
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-display bg-events-cream/10 text-events-cream/80 px-2.5 py-1 rounded-full">
            <Wifi className="w-3 h-3" /> {remote}
          </span>
        ) : (
          <Placeholder pill>Add remote work status</Placeholder>
        )}
      </div>

      {/* Why visit our table */}
      <div className="mt-4">
        <h4 className="text-[10px] uppercase tracking-[0.18em] font-display text-events-coral/80 mb-1.5">
          Why visit our table
        </h4>
        {why ? (
          <blockquote className="border-l-2 border-events-coral/60 pl-3 text-sm text-events-cream/80 font-body">
            {why}
          </blockquote>
        ) : (
          <Placeholder block>Add 'Why visit our table' text</Placeholder>
        )}
      </div>

      {/* Lead question hint */}
      <div className="mt-3">
        {brand.lead_question_text && brand.lead_question_option_1 ? (
          <p className="text-[11px] text-events-cream/55 font-body italic">
            Lead question is live: "{brand.lead_question_text}"
          </p>
        ) : (
          <Placeholder block>Add a custom lead question (optional)</Placeholder>
        )}
      </div>
    </button>
  );
}

function Placeholder({ children, pill, block }: { children: React.ReactNode; pill?: boolean; block?: boolean }) {
  if (pill) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-display border border-dashed border-events-cream/25 text-events-cream/40 px-2.5 py-1 rounded-full">
        {children}
      </span>
    );
  }
  if (block) {
    return (
      <span className="inline-block w-full border border-dashed border-events-cream/20 rounded-md px-3 py-2 text-[12px] text-events-cream/35 font-body italic">
        {children}
      </span>
    );
  }
  return <span className="text-xs text-events-cream/35 font-body italic">{children}</span>;
}
