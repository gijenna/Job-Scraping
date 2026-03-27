import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Expert } from "@/lib/expert-types";
import { getCompanyLogoUrl } from "@/lib/expert-types";
import ExpertCardMinimal from "@/components/experts/ExpertCardMinimal";
import EditableText from "@/components/EditableText";
import { useEditableTextContext } from "@/components/EditableTextProvider";

interface BrandGroup {
  company: string;
  experts: Expert[];
}

interface BrandUmbrellaSectionProps {
  experts: Expert[];
  accentColor?: string;
  eventSlug?: string;
  highlightBrandRep?: string;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function normalizeUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

const BrandUmbrellaSection = ({ experts, accentColor = "#FEE123", eventSlug = "pnw26", highlightBrandRep }: BrandUmbrellaSectionProps) => {
  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set());
  const { isAdmin, settings } = useEditableTextContext();
  const highlightRef = useRef<HTMLDivElement>(null);

  // Group by company
  const groups: BrandGroup[] = [];
  const companyMap = new Map<string, Expert[]>();
  experts.forEach((e) => {
    const co = e.current_company || "Independent";
    if (!companyMap.has(co)) companyMap.set(co, []);
    companyMap.get(co)!.push(e);
  });
  companyMap.forEach((members, company) => groups.push({ company, experts: members }));
  groups.sort((a, b) => b.experts.length - a.experts.length);

  // Auto-expand the group containing the highlighted brand rep
  useEffect(() => {
    if (!highlightBrandRep) return;
    const matchingGroup = groups.find(g => g.experts.some(e => e.slug === highlightBrandRep));
    if (matchingGroup) {
      setExpandedBrands(prev => new Set(prev).add(matchingGroup.company));
      setTimeout(() => {
        highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 600);
    }
  }, [highlightBrandRep, experts]);

  const toggleBrand = (company: string) => {
    setExpandedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(company)) next.delete(company);
      else next.add(company);
      return next;
    });
  };

  const gridCols = groups.length <= 2 ? "md:grid-cols-2" : groups.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4";

  return (
    <div className={`grid grid-cols-1 ${gridCols} gap-4`}>
      {groups.map((group) => {
        const slug = slugify(group.company);
        const isExpanded = expandedBrands.has(group.company);
        const logoUrl = getCompanyLogoUrl(group.company, group.experts[0]?.company_domains);
        const careersKey = `brand_${slug}_careers_url`;
        const hiringKey = `brand_${slug}_hiring_blurb`;
        const careersUrl = settings[careersKey] || "";
        const hiringBlurb = settings[hiringKey] || "";
        const normalizedCareersUrl = normalizeUrl(careersUrl);
        const hasHighlightedExpert = highlightBrandRep && group.experts.some(e => e.slug === highlightBrandRep);

        return (
          <div key={group.company} ref={hasHighlightedExpert ? highlightRef : undefined} className="rounded-xl border border-white/10 overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
            {/* Brand header */}
            <button
              onClick={() => toggleBrand(group.company)}
              className="w-full flex items-center gap-4 p-4 md:p-5 hover:bg-white/5 transition-colors text-left"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-events-cream flex items-center justify-center shrink-0 overflow-hidden">
                {logoUrl ? (
                  <img src={logoUrl} alt={group.company} className="w-8 h-8 md:w-10 md:h-10 object-contain" />
                ) : (
                  <span className="font-display font-bold text-events-teal text-lg">
                    {group.company.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-bold text-lg text-events-cream">{group.company}</h4>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-events-cream/40 text-xs">{group.experts.length} {group.experts.length === 1 ? 'rep' : 'reps'}</span>
                  {normalizedCareersUrl && !isAdmin && (
                    <a href={normalizedCareersUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-xs flex items-center gap-1 hover:underline" style={{ color: accentColor }}>
                      Visit our site <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                {hiringBlurb && !isAdmin && (
                  <p className="text-events-cream/50 text-xs mt-1 line-clamp-1">{hiringBlurb}</p>
                )}
                {isAdmin && (
                  <div className="flex flex-col gap-0.5 mt-1" onClick={(e) => e.stopPropagation()}>
                    <EditableText settingKey={careersKey} defaultText="(click to set careers URL)" as="span" className="text-xs text-events-coral/60" />
                    <EditableText settingKey={hiringKey} defaultText="(click to set hiring blurb)" as="span" className="text-xs text-events-yellow/60" multiline />
                  </div>
                )}
              </div>
              <div className="shrink-0 text-events-cream/40">
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            {/* Expanded cards */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {group.experts.map((expert) => (
                      <ExpertCardMinimal
                        key={expert.id}
                        expert={expert}
                        autoExpand={highlightBrandRep === expert.slug}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default BrandUmbrellaSection;
