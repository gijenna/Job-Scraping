import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Expert } from "@/lib/expert-types";
import { getCompanyLogoUrl } from "@/lib/expert-types";
import ExpertCardMinimal from "@/components/experts/ExpertCardMinimal";
import ExpertCard from "@/components/experts/ExpertCard";
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
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

const BrandUmbrellaSection = ({ experts, accentColor = "#FEE123", eventSlug = "pnw26" }: BrandUmbrellaSectionProps) => {
  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set());
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const { isAdmin, settings } = useEditableTextContext();

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

  const toggleBrand = (company: string) => {
    setExpandedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(company)) next.delete(company);
      else next.add(company);
      return next;
    });
  };

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
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

        return (
          <div key={group.company} className="rounded-xl border border-white/10 overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
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
                  {careersUrl && !isAdmin && (
                    <a href={careersUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-xs flex items-center gap-1 hover:underline" style={{ color: accentColor }}>
                      Careers <ExternalLink className="w-3 h-3" />
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
                    {group.experts.map((expert) => {
                      const isCardExpanded = expandedCards.has(expert.id);
                      return (
                        <div key={expert.id}>
                          {isCardExpanded ? (
                            <div className="relative">
                              <button
                                onClick={() => toggleCard(expert.id)}
                                className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center text-xs hover:bg-black/70"
                              >
                                ✕
                              </button>
                              <ExpertCard expert={expert} expanded />
                            </div>
                          ) : (
                            <div className="cursor-pointer" onClick={() => toggleCard(expert.id)}>
                              <ExpertCardMinimal expert={expert} />
                            </div>
                          )}
                        </div>
                      );
                    })}
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
