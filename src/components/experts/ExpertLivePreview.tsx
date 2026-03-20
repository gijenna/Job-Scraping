import { Expert, NICHE_OPTIONS } from "@/lib/expert-types";
import { Badge } from "@/components/ui/badge";
import { Linkedin } from "lucide-react";
import CompanyLogoWithFallback from "./CompanyLogoWithFallback";

interface ExpertLivePreviewProps {
  data: Partial<Expert> & { company_domains?: Record<string, string> };
}

const ExpertLivePreview = ({ data }: ExpertLivePreviewProps) => {
  const previousCompanies = data.previous_companies
    ? data.previous_companies.split(',').map(c => c.trim()).filter(Boolean)
    : [];

  return (
    <div className="sticky top-8">
      <p className="text-events-cream/40 text-xs uppercase tracking-wider mb-2 font-semibold">Live Preview</p>
      <div className="bg-events-teal rounded-lg overflow-hidden shadow-card max-w-xs">
        {/* Polaroid photo */}
        <div className="relative bg-events-cream p-3 pb-4 m-3 rounded-sm shadow-md" style={{ transform: 'rotate(-1deg)' }}>
          <div className="aspect-[3/4] bg-gray-300 overflow-hidden relative">
            {data.photo_url ? (
              <img src={data.photo_url} alt="" className="w-full h-full object-cover grayscale" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-events-teal/10 text-events-teal/30 p-4">
                <span className="text-4xl font-display font-bold mb-2">
                  {data.full_name ? data.full_name.split(' ').map(n => n[0]).join('') : '?'}
                </span>
                <span className="text-xs text-center">Upload a photo to complete your card</span>
              </div>
            )}
            {data.linkedin_url && (
              <div className="absolute bottom-2 right-2 bg-white/90 rounded-full p-1.5">
                <Linkedin className="w-4 h-4 text-[#0077B5]" />
              </div>
            )}
          </div>
        </div>

        <div className="px-4 pb-4">
          <h3 className="font-display text-xl font-bold text-events-coral leading-tight">
            {data.full_name || 'Your Name'}
          </h3>

          {(data.job_title || data.current_company) && (
            <div className="flex items-center gap-2 mt-1">
              <p className="text-events-yellow text-sm font-medium">
                {data.job_title}{data.job_title && data.current_company ? ' · ' : ''}{data.current_company}
              </p>
              {data.current_company && (
                <CompanyLogoWithFallback company={data.current_company} domainOverrides={data.company_domains} className="w-5 h-5 bg-white" />
              )}
            </div>
          )}

          {previousCompanies.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="text-events-cream/50 text-xs">Previously:</span>
              {previousCompanies.map((company) => (
                <span key={company} className="inline-flex items-center gap-1">
                  <img
                    src={getCompanyLogoUrl(company, data.company_domains)}
                    alt={company}
                    title={company}
                    className="w-5 h-5 rounded-sm bg-white/90 object-contain p-0.5"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <span className="text-events-cream/60 text-xs">{company}</span>
                </span>
              ))}
            </div>
          )}

          {data.field_of_work && (
            <Badge className="mt-2 bg-events-coral/20 text-events-coral border-events-coral/30 text-xs">
              {data.field_of_work}
            </Badge>
          )}

          {data.ask_me_about && (
            <div className="mt-2">
              <span className="text-events-yellow text-xs font-semibold uppercase tracking-wider">Ask me about</span>
              <p className="text-events-cream/80 text-sm mt-0.5">{data.ask_me_about}</p>
            </div>
          )}

          {data.niche_interests && data.niche_interests.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {data.niche_interests.map((tag) => (
                <Badge key={tag} variant="outline" className="text-events-cream/70 border-events-cream/20 text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {(data.years_in_industry || data.years_in_city) && (
            <p className="text-events-cream/50 text-xs mt-2">
              {data.years_in_industry ? `${data.years_in_industry} yrs in industry` : ''}
              {data.years_in_industry && data.years_in_city ? ' · ' : ''}
              {data.years_in_city ? `${data.years_in_city} yrs in the area` : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertLivePreview;
