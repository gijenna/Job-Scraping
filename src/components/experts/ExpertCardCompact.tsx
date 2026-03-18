import { Linkedin } from "lucide-react";
import { Expert, getCompanyLogoUrl } from "@/lib/expert-types";

interface ExpertCardCompactProps {
  expert: Expert;
  className?: string;
}

const ExpertCardCompact = ({ expert, className = "" }: ExpertCardCompactProps) => {
  return (
    <div className={`flex items-center gap-4 bg-events-teal rounded-lg p-4 shadow-card ${className}`}>
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
            <img src={getCompanyLogoUrl(expert.current_company, expert.company_domains)} alt="" className="w-4 h-4 object-contain" />
            <span className="font-body text-xs text-events-cream/50 truncate">{expert.current_company}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertCardCompact;
