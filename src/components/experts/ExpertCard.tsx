import { useState } from "react";
import { ChevronDown, ChevronUp, Linkedin } from "lucide-react";
import { Expert } from "@/lib/expert-types";
import { Badge } from "@/components/ui/badge";
import CompanyLogoWithFallback from "./CompanyLogoWithFallback";

interface ExpertCardProps {
  expert: Expert;
  expanded?: boolean;
  className?: string;
}

const ExpertCard = ({ expert, expanded: initialExpanded = false, className = "" }: ExpertCardProps) => {
  const [expanded, setExpanded] = useState(initialExpanded);

  const previousCompanies = expert.previous_companies
    ? expert.previous_companies.split(',').map(c => c.trim()).filter(Boolean)
    : [];

  return (
    <div className={`relative bg-events-teal rounded-lg overflow-hidden shadow-card transition-all duration-300 ${className}`}>
      {/* Polaroid photo area */}
      <div className="relative bg-events-cream p-3 pb-4 m-3 rounded-sm shadow-md" style={{ transform: 'rotate(-1deg)' }}>
        <div className="aspect-[3/4] bg-gray-300 overflow-hidden relative">
          {expert.photo_url ? (
            <img
              src={expert.photo_url}
              alt={expert.full_name}
              className="w-full h-full object-cover grayscale"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-events-teal/20 text-events-teal/40">
              <span className="text-5xl font-display font-bold">
                {expert.full_name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
          {expert.linkedin_url && (
            <a
              href={expert.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-2 bg-white/90 rounded-full p-1.5 hover:bg-white transition-colors"
            >
              <Linkedin className="w-4 h-4 text-[#0077B5]" />
            </a>
          )}
        </div>
      </div>

      {/* Card content */}
      <div className="px-4 pb-4">
        {/* Name */}
        <h3 className="font-display text-xl font-bold text-events-coral leading-tight">
          {expert.full_name}
        </h3>

        {/* Title + Company */}
        {(expert.job_title || expert.current_company) && (
          <div className="flex items-center gap-2 mt-1">
            <p className="text-events-yellow text-sm font-medium">
              {expert.job_title}{expert.job_title && expert.current_company ? ' · ' : ''}{expert.current_company}
            </p>
            {expert.current_company && (
              <CompanyLogoWithFallback company={expert.current_company} domainOverrides={expert.company_domains} className="w-5 h-5 bg-white" />
            )}
          </div>
        )}

        {/* Previous companies */}
        {previousCompanies.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span className="text-events-cream/50 text-xs">Previously:</span>
            {previousCompanies.map((company) => (
              <CompanyLogoWithFallback key={company} company={company} domainOverrides={expert.company_domains} className="w-5 h-5 bg-white/90 p-0.5" variant="secondary" />
            ))}
          </div>
        )}

        {/* Field of work */}
        {expert.field_of_work && (
          <Badge className="mt-2 bg-events-coral/20 text-events-coral border-events-coral/30 text-xs">
            {expert.field_of_work}
          </Badge>
        )}

        {/* Expandable section */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-events-cream/60 hover:text-events-cream text-xs transition-colors w-full"
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? 'Show less' : 'More info'}
        </button>

        {expanded && (
          <div className="mt-2 space-y-2 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
            {expert.ask_me_about && (
              <div>
                <span className="text-events-yellow text-xs font-semibold uppercase tracking-wider">Ask me about</span>
                <p className="text-events-cream/80 mt-0.5">{expert.ask_me_about}</p>
              </div>
            )}

            {expert.niche_interests && expert.niche_interests.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {expert.niche_interests.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-events-cream/70 border-events-cream/20 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {expert.years_in_industry && (
              <p className="text-events-cream/50 text-xs">
                {expert.years_in_industry} years in the industry
                {expert.years_in_city ? ` · ${expert.years_in_city} years in the area` : ''}
              </p>
            )}

            {expert.favorite_media && (
              <div>
                <span className="text-events-yellow text-xs font-semibold uppercase tracking-wider">Featured In</span>
                <p className="text-events-cream/80 mt-0.5 text-xs">{expert.favorite_media}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertCard;
