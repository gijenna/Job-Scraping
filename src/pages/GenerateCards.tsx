import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, RefreshCw, Loader2 } from "lucide-react";
import { getCompanyLogoUrl } from "@/lib/expert-types";
import { useToast } from "@/hooks/use-toast";

import solidGreen2 from "@/assets/solid_green_2.png";
import solidGreen3 from "@/assets/solid_green_3.png";
import solidGreen4 from "@/assets/solid_green_4.png";
import solidGreen5 from "@/assets/solid_green_5.png";

const TEMPLATES = [solidGreen2, solidGreen3, solidGreen4, solidGreen5];

const ROTATION_DEG = -6;

interface PhotoArea {
  cx: number; cy: number; w: number; h: number;
}

interface SmallPolaroid {
  cx: number; cy: number; w: number; h: number;
}

interface TemplateLayout {
  photo: PhotoArea;
  textY: number;
  textX: number;
  logoX: number;
  logoY: number;
  smallPolaroids: SmallPolaroid[];
  networkY: number;
  networkX: number;
  yearsY: number;
  askY: number;
}

const LAYOUTS: TemplateLayout[] = [
  {
    photo: { cx: 430, cy: 390, w: 530, h: 560 },
    textY: 730, textX: 190, logoX: 680, logoY: 720,
    smallPolaroids: [
      { cx: 1220, cy: 920, w: 120, h: 100 },
      { cx: 1510, cy: 920, w: 120, h: 100 },
    ],
    networkY: 220, networkX: 900, yearsY: 380, askY: 500,
  },
  {
    photo: { cx: 435, cy: 390, w: 530, h: 560 },
    textY: 730, textX: 190, logoX: 680, logoY: 720,
    smallPolaroids: [
      { cx: 1080, cy: 920, w: 120, h: 100 },
      { cx: 1360, cy: 920, w: 120, h: 100 },
      { cx: 1660, cy: 920, w: 120, h: 100 },
    ],
    networkY: 220, networkX: 900, yearsY: 380, askY: 500,
  },
  {
    photo: { cx: 420, cy: 390, w: 510, h: 560 },
    textY: 730, textX: 185, logoX: 670, logoY: 720,
    smallPolaroids: [
      { cx: 955, cy: 920, w: 110, h: 95 },
      { cx: 1210, cy: 920, w: 110, h: 95 },
      { cx: 1495, cy: 920, w: 110, h: 95 },
      { cx: 1770, cy: 920, w: 110, h: 95 },
    ],
    networkY: 220, networkX: 900, yearsY: 380, askY: 500,
  },
  {
    photo: { cx: 410, cy: 390, w: 490, h: 560 },
    textY: 730, textX: 180, logoX: 660, logoY: 720,
    smallPolaroids: [
      { cx: 940, cy: 920, w: 105, h: 90 },
      { cx: 1125, cy: 920, w: 105, h: 90 },
      { cx: 1355, cy: 920, w: 105, h: 90 },
      { cx: 1550, cy: 920, w: 105, h: 90 },
      { cx: 1760, cy: 920, w: 105, h: 90 },
    ],
    networkY: 220, networkX: 900, yearsY: 380, askY: 500,
  },
];

interface ExpertData {
  id: string;
  full_name: string;
  job_title: string | null;
  current_company: string | null;
  photo_url: string | null;
  previous_companies: string | null;
  company_domains: Record<string, string> | null;
  years_in_industry: number | null;
  ask_me_about: string | null;
  slug: string;
  assignments: {
    city_slug: string;
    city_name: string;
    expert_type: string;
  }[];
}

function parsePreviousCompanies(prev: string | null): string[] {
  if (!prev) return [];
  return prev.split(",").map(c => c.trim()).filter(Boolean);
}

function getTemplateIndex(totalCompanies: number): number {
  if (totalCompanies <= 1) return 0;
  if (totalCompanies === 2) return 0;
  if (totalCompanies === 3) return 1;
  if (totalCompanies === 4) return 2;
  return 3;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function fetchLogoImage(company: string, domains: Record<string, string> | null): Promise<HTMLImageElement | null> {
  const url = getCompanyLogoUrl(company, domains);
  if (!url) return null;
  try {
    return await loadImage(url);
  } catch {
    return null;
  }
}

async function generateCard(
  expert: ExpertData,
  cityName: string,
): Promise<HTMLCanvasElement> {
  const previous = parsePreviousCompanies(expert.previous_companies);
  const current = expert.current_company || "";
  
  let allCompanies = [...previous];
  if (current) allCompanies.push(current);
  
  const totalCompanies = allCompanies.length;
  const templateIdx = getTemplateIndex(totalCompanies);
  const layout = LAYOUTS[templateIdx];
  
  const maxSmall = layout.smallPolaroids.length;
  if (allCompanies.length > maxSmall) {
    allCompanies = allCompanies.slice(allCompanies.length - maxSmall);
  }
  
  const useOnlyGlowing = totalCompanies <= 1;
  
  const templateImg = await loadImage(TEMPLATES[templateIdx]);
  
  const canvas = document.createElement("canvas");
  canvas.width = 1920;
  canvas.height = 1002;
  const ctx = canvas.getContext("2d")!;
  
  ctx.drawImage(templateImg, 0, 0, 1920, 1002);
  
  if (expert.photo_url) {
    try {
      const photoImg = await loadImage(expert.photo_url);
      const { cx, cy, w, h } = layout.photo;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((ROTATION_DEG * Math.PI) / 180);
      
      ctx.beginPath();
      ctx.rect(-w / 2, -h / 2, w, h);
      ctx.clip();
      
      const scale = Math.max(w / photoImg.width, h / photoImg.height);
      const dw = photoImg.width * scale;
      const dh = photoImg.height * scale;
      ctx.drawImage(photoImg, -dw / 2, -dh / 2, dw, dh);
      
      ctx.restore();
    } catch (e) {
      console.error("Failed to load expert photo:", e);
    }
  }
  
  ctx.save();
  ctx.translate(layout.photo.cx, layout.textY);
  ctx.rotate((ROTATION_DEG * Math.PI) / 180);
  
  ctx.font = "bold 32px 'Inter', sans-serif";
  ctx.fillStyle = "#1a1a1a";
  ctx.textAlign = "left";
  ctx.fillText(expert.full_name, -layout.photo.w / 2 + 10, 0);
  
  const titleLine = [expert.job_title, expert.current_company].filter(Boolean).join(", ");
  ctx.font = "22px 'Inter', sans-serif";
  ctx.fillStyle = "#444444";
  ctx.fillText(titleLine, -layout.photo.w / 2 + 10, 35);
  
  ctx.restore();
  
  if (current) {
    const logoImg = await fetchLogoImage(current, expert.company_domains as Record<string, string>);
    if (logoImg) {
      ctx.save();
      ctx.translate(layout.logoX, layout.logoY);
      ctx.rotate((ROTATION_DEG * Math.PI) / 180);
      ctx.drawImage(logoImg, -20, -20, 40, 40);
      ctx.restore();
    }
  }
  
  ctx.font = "bold 36px 'Inter', sans-serif";
  ctx.fillStyle = "#E6C742";
  ctx.textAlign = "left";
  const networkText = `NETWORK WITH ME IN ${cityName.toUpperCase()}`;
  ctx.fillText(networkText, layout.networkX, layout.networkY);
  
  if (expert.years_in_industry) {
    const yearsText = `${expert.years_in_industry} YEARS IN THE OUTDOOR INDUSTRY`;
    ctx.font = "bold 24px 'Inter', sans-serif";
    const tm = ctx.measureText(yearsText);
    const pillW = tm.width + 40;
    const pillH = 44;
    const pillX = layout.networkX;
    const pillY = layout.yearsY;
    
    ctx.fillStyle = "#ED7660";
    ctx.beginPath();
    ctx.roundRect(pillX, pillY - pillH / 2, pillW, pillH, pillH / 2);
    ctx.fill();
    
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left";
    ctx.fillText(yearsText, pillX + 20, pillY + 8);
  }
  
  if (expert.ask_me_about) {
    ctx.font = "italic 22px 'Inter', sans-serif";
    ctx.fillStyle = "#F5F0E8";
    ctx.textAlign = "left";
    
    const askPrefix = "Ask me about: ";
    const maxWidth = 800;
    const fullText = askPrefix + expert.ask_me_about;
    
    const words = fullText.split(" ");
    let line = "";
    let lineY = layout.askY;
    for (const word of words) {
      const testLine = line + (line ? " " : "") + word;
      if (ctx.measureText(testLine).width > maxWidth && line) {
        ctx.fillText(line, layout.networkX, lineY);
        line = word;
        lineY += 30;
      } else {
        line = testLine;
      }
    }
    if (line) {
      ctx.fillText(line, layout.networkX, lineY);
    }
  }
  
  const companiesToDraw = useOnlyGlowing
    ? [{ company: current, idx: layout.smallPolaroids.length - 1 }]
    : allCompanies.map((company, i) => ({ company, idx: i }));
  
  for (const { company, idx } of companiesToDraw) {
    if (!company || idx >= layout.smallPolaroids.length) continue;
    const sp = layout.smallPolaroids[idx];
    const logoImg = await fetchLogoImage(company, expert.company_domains as Record<string, string>);
    if (logoImg) {
      const logoSize = Math.min(sp.w, sp.h) * 0.6;
      ctx.drawImage(logoImg, sp.cx - logoSize / 2, sp.cy - logoSize / 2, logoSize, logoSize);
    }
  }
  
  return canvas;
}

export default function GenerateCards() {
  const [experts, setExperts] = useState<ExpertData[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<Record<string, boolean>>({});
  const [generated, setGenerated] = useState<Record<string, string>>({});
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchExperts();
  }, []);

  async function fetchExperts() {
    setLoading(true);
    const { data: expertsData } = await supabase
      .from("industry_experts")
      .select("id, full_name, job_title, current_company, photo_url, previous_companies, company_domains, years_in_industry, ask_me_about, slug")
      .in("status", ["confirmed", "started"]);

    const { data: assignments } = await supabase
      .from("expert_city_assignments")
      .select("expert_id, city_slug, expert_type");

    const { data: cities } = await supabase
      .from("expert_cities")
      .select("slug, name");

    const cityMap = new Map((cities || []).map(c => [c.slug, c.name]));

    const merged: ExpertData[] = (expertsData || []).map(e => ({
      ...e,
      company_domains: (e.company_domains as Record<string, string>) || null,
      assignments: (assignments || [])
        .filter(a => a.expert_id === e.id)
        .map(a => ({
          city_slug: a.city_slug,
          city_name: cityMap.get(a.city_slug) || a.city_slug,
          expert_type: a.expert_type,
        })),
    }));

    setExperts(merged.filter(e => e.assignments.length > 0));
    setLoading(false);
  }

  const handleGenerate = useCallback(async (expert: ExpertData, citySlug?: string) => {
    const key = `${expert.id}-${citySlug || "default"}`;
    setGenerating(prev => ({ ...prev, [key]: true }));
    
    try {
      const assignment = citySlug
        ? expert.assignments.find(a => a.city_slug === citySlug)
        : expert.assignments[0];
      
      const cityName = assignment?.city_name || "YOUR CITY";
      const canvas = await generateCard(expert, cityName);
      const dataUrl = canvas.toDataURL("image/png");
      setGenerated(prev => ({ ...prev, [key]: dataUrl }));
      toast({ title: `Generated card for ${expert.full_name}` });
    } catch (err) {
      console.error(err);
      toast({ title: "Error generating card", variant: "destructive" });
    } finally {
      setGenerating(prev => ({ ...prev, [key]: false }));
    }
  }, [toast]);

  const handleDownload = (dataUrl: string, name: string) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${name}-card.png`;
    a.click();
  };

  const allCities = [...new Set(experts.flatMap(e => e.assignments.map(a => a.city_slug)))];
  
  const filteredExperts = selectedCity === "all"
    ? experts
    : experts.filter(e => e.assignments.some(a => a.city_slug === selectedCity));

  const handleGenerateAll = async () => {
    for (const expert of filteredExperts) {
      for (const assignment of expert.assignments) {
        await handleGenerate(expert, assignment.city_slug);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#2D4A47]">
        <Loader2 className="w-8 h-8 animate-spin text-[#E6C742]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2D4A47] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#F5F0E8]">Generate Expert Cards</h1>
          <div className="flex items-center gap-3">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-[180px] bg-[#1a302e] text-[#F5F0E8] border-[#3d5a56]">
                <SelectValue placeholder="Filter by city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {allCities.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleGenerateAll} className="bg-[#ED7660] hover:bg-[#d4614d] text-white">
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate All ({filteredExperts.length})
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredExperts.map(expert => (
            <div key={expert.id} className="bg-[#1a302e] rounded-lg p-4 border border-[#3d5a56]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {expert.photo_url && (
                    <img src={expert.photo_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                  )}
                  <div>
                    <h3 className="text-[#F5F0E8] font-semibold">{expert.full_name}</h3>
                    <p className="text-[#9db5b1] text-sm">
                      {expert.job_title}{expert.current_company ? ` at ${expert.current_company}` : ""}
                      {" · "}
                      {parsePreviousCompanies(expert.previous_companies).length + (expert.current_company ? 1 : 0)} companies
                      {" · "}
                      {expert.assignments.map(a => a.city_name).join(", ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {expert.assignments.map(a => {
                    const key = `${expert.id}-${a.city_slug}`;
                    return (
                      <div key={a.city_slug} className="flex items-center gap-1">
                        <Button
                          size="sm"
                          onClick={() => handleGenerate(expert, a.city_slug)}
                          disabled={generating[key]}
                          className="bg-[#E6C742] text-[#1a302e] hover:bg-[#d4b73a]"
                        >
                          {generating[key] ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <RefreshCw className="w-3 h-3" />
                          )}
                          <span className="ml-1">{a.city_name}</span>
                        </Button>
                        {generated[key] && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(generated[key], `${expert.slug}-${a.city_slug}`)}
                            className="border-[#3d5a56] text-[#F5F0E8] hover:bg-[#2D4A47]"
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex gap-4 flex-wrap">
                {expert.assignments.map(a => {
                  const key = `${expert.id}-${a.city_slug}`;
                  const dataUrl = generated[key];
                  if (!dataUrl) return null;
                  return (
                    <div key={a.city_slug} className="relative">
                      <p className="text-xs text-[#9db5b1] mb-1">{a.city_name}</p>
                      <img
                        src={dataUrl}
                        alt={`${expert.full_name} - ${a.city_name}`}
                        className="rounded border border-[#3d5a56] max-w-[600px]"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
