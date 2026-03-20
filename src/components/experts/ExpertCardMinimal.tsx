import { Linkedin } from "lucide-react";
import { Expert } from "@/lib/expert-types";
import CompanyLogoWithFallback from "./CompanyLogoWithFallback";

interface ExpertCardMinimalProps {
  expert: Expert;
  className?: string;
}

const ExpertCardMinimal = ({ expert, className = "" }: ExpertCardMinimalProps) => {
  return (
    <div className={`flex flex-col items-center text-center gap-2 ${className}`}>
      <div className="relative w-20 h-20 rounded-full overflow-hidden bg-events-cream/10 shadow-md">
        {expert.photo_url ? (
          <img src={expert.photo_url} alt={expert.full_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-events-cream/40 font-display font-bold text-2xl">
            {expert.full_name.split(' ').map(n => n[0]).join('')}
          </div>
        )}
        {expert.current_company && (
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-events-cream flex items-center justify-center shadow-sm">
            <img src={getCompanyLogoUrl(expert.current_company, expert.company_domains)} alt="" className="w-4 h-4 object-contain" />
          </div>
        )}
        {expert.linkedin_url && (
          <a href={expert.linkedin_url} target="_blank" rel="noopener noreferrer" className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
            <Linkedin className="w-3 h-3 text-[#0077B5]" />
          </a>
        )}
      </div>
      <p className="font-display font-bold text-xs text-events-cream leading-tight">{expert.full_name}</p>
      {expert.current_company && (
        <p className="font-body text-[10px] text-events-cream/50">{expert.current_company}</p>
      )}
    </div>
  );
};

export default ExpertCardMinimal;
