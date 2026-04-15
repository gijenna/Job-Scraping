import { useState, useEffect } from "react";
import { Expert } from "@/lib/expert-types";
import { supabase } from "@/integrations/supabase/client";
import CompanyLogoWithFallback from "@/components/experts/CompanyLogoWithFallback";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const PrintExpertCard = () => {
  const [expert, setExpert] = useState<Expert | null>(null);

  useEffect(() => {
    const load = async () => {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get("slug") || "kai-twanmoh";
      const { data } = await supabase
        .from("industry_experts")
        .select("*")
        .eq("slug", slug)
        .single();
      if (data) setExpert(data as unknown as Expert);
    };
    load();
  }, []);

  if (!expert) return <div className="p-8 text-center">Loading...</div>;

  const previousCompanies = expert.previous_companies
    ? expert.previous_companies.split(",").map((c) => c.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8 print:p-0">
      <style>{`
        @media print {
          @page { size: letter; margin: 0.5in; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="w-full max-w-[7.5in] mx-auto">
        {/* Card container — white-friendly palette */}
        <div className="bg-[#19363B] rounded-2xl overflow-hidden shadow-xl">
          {/* Polaroid photo area — scaled up */}
          <div className="bg-[#F5E6D3] p-6 pb-8 m-6 rounded-sm shadow-md" style={{ transform: "rotate(-1deg)" }}>
            <div className="aspect-[3/4] max-h-[5in] bg-gray-200 overflow-hidden relative mx-auto">
              {expert.photo_url ? (
                <img
                  src={expert.photo_url}
                  alt={expert.full_name}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#19363B]/20 text-[#19363B]/40">
                  <span className="text-7xl font-bold">
                    {expert.full_name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Card content — larger text for print */}
          <div className="px-8 pb-8">
            <h2 className="font-bold text-3xl text-[#ED7660] leading-tight">
              {expert.full_name}
            </h2>

            {(expert.job_title || expert.current_company) && (
              <div className="flex items-center gap-3 mt-2">
                <p className="text-[#E1B624] text-lg font-medium">
                  {expert.job_title}
                  {expert.job_title && expert.current_company ? " · " : ""}
                  {expert.current_company}
                </p>
                {expert.current_company && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <CompanyLogoWithFallback
                            company={expert.current_company}
                            domainOverrides={expert.company_domains}
                            className="w-7 h-7 bg-white"
                          />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent><p>{expert.current_company}</p></TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )}

            {previousCompanies.length > 0 && (
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="text-[#F5E6D3]/50 text-sm">Previously:</span>
                <TooltipProvider>
                  {previousCompanies.map((company) => (
                    <Tooltip key={company}>
                      <TooltipTrigger asChild>
                        <span>
                          <CompanyLogoWithFallback
                            company={company}
                            domainOverrides={expert.company_domains}
                            className="w-7 h-7 bg-white/90 p-0.5"
                            variant="secondary"
                          />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent><p>{company}</p></TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
            )}

            {expert.field_of_work && (
              <Badge className="mt-3 bg-[#ED7660]/20 text-[#ED7660] border-[#ED7660]/30 text-sm px-3 py-1">
                {expert.field_of_work}
              </Badge>
            )}

            {expert.ask_me_about && (
              <div className="mt-4">
                <span className="text-[#E1B624] text-sm font-semibold uppercase tracking-wider">
                  Ask me about
                </span>
                <p className="text-[#F5E6D3]/80 mt-1 text-base">{expert.ask_me_about}</p>
              </div>
            )}

            {expert.niche_interests && expert.niche_interests.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {expert.niche_interests.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-[#F5E6D3]/70 border-[#F5E6D3]/20 text-sm"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {expert.years_in_industry && (
              <p className="text-[#F5E6D3]/50 text-sm mt-3">
                {expert.years_in_industry} years in the industry
                {expert.years_in_city ? ` · ${expert.years_in_city} years in the area` : ""}
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-4 print:hidden">
          Ctrl+P / Cmd+P to print · 8.5 × 11 letter
        </p>
      </div>
    </div>
  );
};

export default PrintExpertCard;
