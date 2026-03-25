import { useState } from "react";
import { Linkedin, Maximize2, X } from "lucide-react";
import { Expert } from "@/lib/expert-types";
import CompanyLogoWithFallback from "./CompanyLogoWithFallback";
import ExpertCard from "./ExpertCard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ExpertCardCompactProps {
  expert: Expert;
  className?: string;
}

const ExpertCardCompact = ({ expert, className = "" }: ExpertCardCompactProps) => {
  const [expanded, setExpanded] = useState(false);

  if (expanded) {
    return (
      <>
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setExpanded(false)} />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setExpanded(false)}>
          <div className="relative w-full max-w-xs animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setExpanded(false)}
              className="absolute -top-2 -right-2 z-10 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <ExpertCard expert={expert} expanded />
          </div>
        </div>
      </>
    );
  }

  const previousCompanies = expert.previous_companies
    ? expert.previous_companies.split(',').map(c => c.trim()).filter(Boolean)
    : [];

  return (
    <div className={`flex items-center gap-4 bg-events-teal rounded-lg p-4 shadow-card group relative ${className}`}>
      <div className="shrink-0 w-14 h-14 rounded-full overflow-hidden bg-events-cream/10">
        {expert.photo_url ? (
          <img src={expert.photo_url} alt={expert.full_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-events-cream/40 font-display font-bold text-lg">
            {expert.full_name.split(' ').map(n => n[0]).join('')}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-display font-bold text-sm text-events-cream truncate">{expert.full_name}</p>
          {expert.linkedin_url && (
            <a href={expert.linkedin_url} target="_blank" rel="noopener noreferrer" className="shrink-0">
              <Linkedin className="w-3.5 h-3.5 text-[#0077B5]" />
            </a>
          )}
        </div>
        {expert.job_title && <p className="font-body text-xs text-events-cream/60 truncate">{expert.job_title}</p>}
        {expert.current_company && (
          <div className="flex items-center gap-1.5 mt-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span><CompanyLogoWithFallback company={expert.current_company} domainOverrides={expert.company_domains} className="w-4 h-4" /></span>
                </TooltipTrigger>
                <TooltipContent><p>{expert.current_company}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="font-body text-xs text-events-cream/50 truncate">{expert.current_company}</span>
          </div>
        )}
        {previousCompanies.length > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <TooltipProvider>
              {previousCompanies.slice(0, 3).map((company) => (
                <Tooltip key={company}>
                  <TooltipTrigger asChild>
                    <span><CompanyLogoWithFallback company={company} domainOverrides={expert.company_domains} className="w-3.5 h-3.5" variant="secondary" /></span>
                  </TooltipTrigger>
                  <TooltipContent><p>{company}</p></TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        )}
      </div>
      <button
        onClick={() => setExpanded(true)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity text-events-cream"
        title="Expand"
      >
        <Maximize2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default ExpertCardCompact;
