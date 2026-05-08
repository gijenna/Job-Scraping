import { useState, useEffect } from "react";
import { Linkedin, X } from "lucide-react";
import { Expert } from "@/lib/expert-types";
import CompanyLogoWithFallback from "./CompanyLogoWithFallback";
import ExpertCard from "./ExpertCard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ExpertCardMinimalProps {
  expert: Expert;
  autoExpand?: boolean;
  className?: string;
  disableExpand?: boolean;
  onClick?: () => void;
}

const ExpertCardMinimal = ({ expert, autoExpand = false, className = "", disableExpand = false, onClick }: ExpertCardMinimalProps) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (autoExpand && !disableExpand) setExpanded(true);
  }, [autoExpand, disableExpand]);

  if (expanded && !disableExpand) {
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

  return (
    <div
      className={`flex flex-col items-center text-center gap-2 cursor-pointer group ${className}`}
      onClick={() => { if (onClick) onClick(); else if (!disableExpand) setExpanded(true); }}
    >
      <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 shadow-md group-hover:ring-2 group-hover:ring-events-coral/40 transition-all">
        {expert.photo_url ? (
          <img src={expert.photo_url} alt={expert.full_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-events-teal/20 text-events-teal/40 font-display font-bold text-2xl">
            {expert.full_name.split(' ').map(n => n[0]).join('')}
          </div>
        )}
        {expert.current_company && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
                  <CompanyLogoWithFallback company={expert.current_company} domainOverrides={expert.company_domains} className="w-4 h-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent><p>{expert.current_company}</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {expert.linkedin_url && (
          <a href={expert.linkedin_url} target="_blank" rel="noopener noreferrer" className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100" onClick={(e) => e.stopPropagation()}>
            <Linkedin className="w-3 h-3 text-[#0077B5]" />
          </a>
        )}
      </div>
      <p className="font-display font-bold text-xs text-events-cream leading-tight">{expert.full_name}</p>
      {expert.current_company && (
        <p className="font-body text-[10px] text-events-cream/60">{expert.current_company}</p>
      )}
    </div>
  );
};

export default ExpertCardMinimal;
