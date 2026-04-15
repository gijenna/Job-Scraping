import { useState, useEffect, useRef } from "react";
import { Expert } from "@/lib/expert-types";
import { supabase } from "@/integrations/supabase/client";
import CompanyLogoWithFallback from "@/components/experts/CompanyLogoWithFallback";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import basecampLogo from "@/assets/basecamp-match-logo-dark.png";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const PrintExpertCard = () => {
  const [expert, setExpert] = useState<Expert | null>(null);
  const [generating, setGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const pdf = new jsPDF("p", "in", "letter");
      const pageW = 8.5;
      const pageH = 11;
      const margin = 0.5;
      const usableW = pageW - margin * 2;
      const imgAspect = canvas.height / canvas.width;
      const imgH = usableW * imgAspect;
      const finalH = Math.min(imgH, pageH - margin * 2);
      const finalW = finalH / imgAspect;
      const xOff = (pageW - finalW) / 2;
      const yOff = (pageH - finalH) / 2;
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", xOff, yOff, finalW, finalH);
      pdf.save(`${expert?.slug || "expert"}-card.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPNG = async () => {
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `${expert?.slug || "expert"}-card.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  if (!expert) return <div className="p-8 text-center">Loading...</div>;

  const previousCompanies = expert.previous_companies
    ? expert.previous_companies.split(",").map((c) => c.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      {/* Download buttons */}
      <div className="flex gap-3 mb-6">
        <Button onClick={handleDownloadPDF} disabled={generating} className="bg-[#19363B] hover:bg-[#19363B]/90 text-white gap-2">
          <Download className="w-4 h-4" />
          {generating ? "Generating..." : "Download PDF"}
        </Button>
        <Button onClick={handleDownloadPNG} disabled={generating} variant="outline" className="gap-2 border-[#19363B] text-[#19363B]">
          <Download className="w-4 h-4" />
          Download PNG
        </Button>
      </div>

      {/* Printable card area - white background, letter proportions */}
      <div
        ref={cardRef}
        className="bg-white shadow-xl"
        style={{ width: "8.5in", minHeight: "11in", padding: "0.75in", display: "flex", flexDirection: "column" }}
      >
        {/* Card */}
        <div className="bg-[#19363B] rounded-2xl overflow-hidden flex-1 flex flex-col">
          {/* Polaroid photo */}
          <div className="bg-[#F5E6D3] p-6 pb-8 m-6 rounded-sm shadow-md" style={{ transform: "rotate(-1deg)" }}>
            <div className="aspect-[3/4] max-h-[5.5in] bg-gray-200 overflow-hidden relative mx-auto">
              {expert.photo_url ? (
                <img src={expert.photo_url} alt={expert.full_name} className="w-full h-full object-cover" crossOrigin="anonymous" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#19363B]/20 text-[#19363B]/40">
                  <span className="text-7xl font-bold">{expert.full_name.split(" ").map((n) => n[0]).join("")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-8 pb-6 flex-1">
            <h2 className="font-bold text-3xl text-[#ED7660] leading-tight">{expert.full_name}</h2>

            {(expert.job_title || expert.current_company) && (
              <div className="flex items-center gap-3 mt-2">
                <p className="text-[#E1B624] text-lg font-medium">
                  {expert.job_title}{expert.job_title && expert.current_company ? " · " : ""}{expert.current_company}
                </p>
                {expert.current_company && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span><CompanyLogoWithFallback company={expert.current_company} domainOverrides={expert.company_domains} className="w-7 h-7 bg-white" /></span>
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
                        <span><CompanyLogoWithFallback company={company} domainOverrides={expert.company_domains} className="w-7 h-7 bg-white/90 p-0.5" variant="secondary" /></span>
                      </TooltipTrigger>
                      <TooltipContent><p>{company}</p></TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
            )}

            {expert.field_of_work && (
              <Badge className="mt-3 bg-[#ED7660]/20 text-[#ED7660] border-[#ED7660]/30 text-sm px-3 py-1">{expert.field_of_work}</Badge>
            )}

            {expert.ask_me_about && (
              <div className="mt-4">
                <span className="text-[#E1B624] text-sm font-semibold uppercase tracking-wider">Ask me about</span>
                <p className="text-[#F5E6D3]/80 mt-1 text-base">{expert.ask_me_about}</p>
              </div>
            )}

            {expert.niche_interests && expert.niche_interests.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {expert.niche_interests.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[#F5E6D3]/70 border-[#F5E6D3]/20 text-sm">{tag}</Badge>
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

          {/* Bottom bar with logo */}
          <div className="px-8 pb-6 flex items-end justify-end gap-3">
            <span className="text-[#F5E6D3]/40 text-xs font-medium tracking-wide">basecampjobs.com</span>
            <img src={basecampLogo} alt="Basecamp Match" className="h-8 object-contain" crossOrigin="anonymous" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintExpertCard;
