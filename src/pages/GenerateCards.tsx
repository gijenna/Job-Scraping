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

const ROTATION_DEG = -5;

interface PhotoArea {
  cx: number; cy: number; w: number; h: number;
}

interface SmallPolaroid {
  cx: number; cy: number; w: number; h: number;
}

interface TemplateLayout {
  photo: PhotoArea;
  nameArea: { cx: number; cy: number; w: number; };
  logoCorner: { cx: number; cy: number; };
  smallPolaroids: SmallPolaroid[];
}

// Layouts derived from pixel analysis of 1920x1002 templates
// Large polaroid photo area: inner edges at ~(156,130)-(733,680), center ~(445,400)
// Name/title in white area below photo at y~720
// Small polaroids: tilted frames at bottom, ~170px wide each
const LAYOUTS: TemplateLayout[] = [
  // solid_green_2: 2 small polaroids
  {
    photo: { cx: 445, cy: 390, w: 540, h: 560 },
    nameArea: { cx: 420, cy: 740, w: 480 },
    logoCorner: { cx: 680, cy: 720 },
    smallPolaroids: [
      { cx: 1221, cy: 816, w: 140, h: 120 },
      { cx: 1509, cy: 816, w: 140, h: 120 },
    ],
  },
  // solid_green_3: 3 small polaroids
  {
    photo: { cx: 445, cy: 390, w: 540, h: 560 },
    nameArea: { cx: 425, cy: 740, w: 480 },
    logoCorner: { cx: 685, cy: 720 },
    smallPolaroids: [
      { cx: 1081, cy: 816, w: 140, h: 120 },
      { cx: 1360, cy: 816, w: 140, h: 120 },
      { cx: 1659, cy: 816, w: 140, h: 120 },
    ],
  },
  // solid_green_4: 4 small polaroids
  {
    photo: { cx: 440, cy: 390, w: 530, h: 560 },
    nameArea: { cx: 415, cy: 740, w: 460 },
    logoCorner: { cx: 670, cy: 720 },
    smallPolaroids: [
      { cx: 957, cy: 810, w: 120, h: 110 },
      { cx: 1212, cy: 810, w: 120, h: 110 },
      { cx: 1494, cy: 810, w: 120, h: 110 },
      { cx: 1769, cy: 810, w: 120, h: 110 },
    ],
  },
  // solid_green_5: 5 small polaroids
  {
    photo: { cx: 435, cy: 390, w: 510, h: 560 },
    nameArea: { cx: 405, cy: 740, w: 440 },
    logoCorner: { cx: 660, cy: 720 },
    smallPolaroids: [
      { cx: 943, cy: 808, w: 110, h: 105 },
      { cx: 1129, cy: 808, w: 110, h: 105 },
      { cx: 1356, cy: 808, w: 110, h: 105 },
      { cx: 1548, cy: 808, w: 110, h: 105 },
      { cx: 1760, cy: 808, w: 110, h: 105 },
    ],
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
  if (totalCompanies <= 2) return 0;
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

// Fit text within a max width by reducing font size
function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, baseFontSize: number, bold: boolean): number {
  let size = baseFontSize;
  while (size > 14) {
    ctx.font = `${bold ? 'bold ' : ''}${size}px 'Inter', sans-serif`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  }
  return size;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, lineHeight: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';
  for (let i = 1; i < words.length; i++) {
    const testLine = currentLine + ' ' + words[i];
    if (ctx.measureText(testLine).width > maxWidth) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);
  return lines;
}

async function generateCard(
  expert: ExpertData,
  cityName: string,
): Promise<HTMLCanvasElement> {
  const previous = parsePreviousCompanies(expert.previous_companies);
  const current = expert.current_company || "";
  
  // Build company list: previous (oldest first) + current
  let allCompanies = [...previous];
  if (current) allCompanies.push(current);
  
  const totalCompanies = allCompanies.length;
  const templateIdx = getTemplateIndex(totalCompanies);
  const layout = LAYOUTS[templateIdx];
  
  // Cap at template capacity
  const maxSmall = layout.smallPolaroids.length;
  if (allCompanies.length > maxSmall) {
    allCompanies = allCompanies.slice(allCompanies.length - maxSmall);
  }
  
  // If only current company (no previous), use only the last (glowing) polaroid
  const useOnlyGlowing = totalCompanies <= 1;
  
  // Load template
  const templateImg = await loadImage(TEMPLATES[templateIdx]);
  
  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.width = 1920;
  canvas.height = 1002;
  const ctx = canvas.getContext("2d")!;
  
  // Draw template background
  ctx.drawImage(templateImg, 0, 0, 1920, 1002);
  
  const rotRad = (ROTATION_DEG * Math.PI) / 180;
  
  // === DETECT GREEN AREA & DRAW EXPERT PHOTO ===
  if (expert.photo_url) {
    try {
      const photoImg = await loadImage(expert.photo_url);
      
      // Scan the left half of the template to find the green rectangle
      const scanX = 80, scanY = 50, scanW = 750, scanH = 700;
      const imageData = ctx.getImageData(scanX, scanY, scanW, scanH);
      const pixels = imageData.data;
      
      let minGX = scanW, minGY = scanH, maxGX = 0, maxGY = 0;
      let found = false;
      
      for (let py = 0; py < scanH; py++) {
        for (let px = 0; px < scanW; px++) {
          const i = (py * scanW + px) * 4;
          const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
          // Detect green-ish pixels: G channel dominant, not too bright/dark
          if (g > 60 && g > r * 1.3 && g > b * 1.2 && r < 150 && b < 150) {
            if (px < minGX) minGX = px;
            if (px > maxGX) maxGX = px;
            if (py < minGY) minGY = py;
            if (py > maxGY) maxGY = py;
            found = true;
          }
        }
      }
      
      if (found) {
        // Convert back to canvas coordinates
        const gx = scanX + minGX;
        const gy = scanY + minGY;
        const gw = maxGX - minGX;
        const gh = maxGY - minGY;
        
        ctx.save();
        
        // Clip directly to the detected green bounding box (no rotation needed — 
        // the scan already captured the rotated green area's pixel footprint)
        ctx.beginPath();
        ctx.rect(gx, gy, gw, gh);
        ctx.clip();
        
        // Cover-fit the photo into this region
        const gcx = gx + gw / 2;
        const gcy = gy + gh / 2;
        const scale = Math.max(gw / photoImg.width, gh / photoImg.height);
        const dw = photoImg.width * scale;
        const dh = photoImg.height * scale;
        ctx.drawImage(photoImg, gcx - dw / 2, gcy - dh / 2, dw, dh);
        
        ctx.restore();
      } else {
        // Fallback to hardcoded layout if detection fails
        const { cx, cy, w, h } = layout.photo;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotRad);
        ctx.beginPath();
        ctx.rect(-w / 2, -h / 2, w, h);
        ctx.clip();
        const scale = Math.max(w / photoImg.width, h / photoImg.height);
        const dw = photoImg.width * scale;
        const dh = photoImg.height * scale;
        ctx.drawImage(photoImg, -dw / 2, -dh / 2, dw, dh);
        ctx.restore();
      }
    } catch (e) {
      console.error("Failed to load expert photo:", e);
    }
  }
  
  // === NAME & TITLE in the polaroid white area ===
  {
    const { cx, cy, w } = layout.nameArea;
    const maxTextW = w - 60; // leave room for logo
    
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotRad);
    
    // Cover existing template text with white
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(-w / 2, -30, w, 70);
    
    // Full Name — bold, left-aligned
    const nameSize = fitText(ctx, expert.full_name, maxTextW, 30, true);
    ctx.font = `bold ${nameSize}px 'Inter', sans-serif`;
    ctx.fillStyle = "#1a1a1a";
    ctx.textAlign = "left";
    ctx.fillText(expert.full_name, -w / 2 + 10, 0, maxTextW);
    
    // Job Title, Company — regular, left-aligned
    const titleLine = [expert.job_title, expert.current_company].filter(Boolean).join(", ");
    if (titleLine) {
      const titleSize = fitText(ctx, titleLine, maxTextW, 22, false);
      ctx.font = `${titleSize}px 'Inter', sans-serif`;
      ctx.fillStyle = "#555555";
      ctx.fillText(titleLine, -w / 2 + 10, 30, maxTextW);
    }
    
    ctx.restore();
  }
  
  // === CURRENT COMPANY LOGO in upper-right of white area ===
  if (current) {
    const logoImg = await fetchLogoImage(current, expert.company_domains as Record<string, string>);
    if (logoImg) {
      const { cx, cy } = layout.logoCorner;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotRad);
      ctx.drawImage(logoImg, -18, -18, 36, 36);
      ctx.restore();
    }
  }
  
  // === COMPANY LOGOS in small polaroids ===
  const companiesToDraw = useOnlyGlowing
    ? [{ company: current, idx: layout.smallPolaroids.length - 1 }]
    : allCompanies.map((company, i) => ({ company, idx: i }));
  
  for (const { company, idx } of companiesToDraw) {
    if (!company || idx >= layout.smallPolaroids.length) continue;
    const sp = layout.smallPolaroids[idx];
    const logoImg = await fetchLogoImage(company, expert.company_domains as Record<string, string>);
    if (logoImg) {
      ctx.save();
      ctx.translate(sp.cx, sp.cy);
      ctx.rotate(rotRad);
      const logoSize = Math.min(sp.w, sp.h) * 0.45;
      ctx.drawImage(logoImg, -logoSize / 2, -logoSize / 2, logoSize, logoSize);
      ctx.restore();
    }
  }
  
  // === RIGHT SIDE TEXT OVERLAYS (no rotation, centered on teal area) ===
  const rightCenterX = 1350; // center of the right-side teal area
  const rightMaxW = 800;
  
  // 1. "NETWORK WITH ME IN [CITY]" — yellow bold uppercase, centered
  {
    ctx.save();
    ctx.fillStyle = "#E6C742";
    ctx.textAlign = "center";
    const headSize1 = fitText(ctx, "NETWORK WITH ME", rightMaxW, 62, true);
    ctx.font = `bold ${headSize1}px 'Inter', sans-serif`;
    ctx.fillText("NETWORK WITH ME", rightCenterX, 250);
    
    const cityUpper = cityName.toUpperCase();
    const headSize2 = fitText(ctx, `IN ${cityUpper}`, rightMaxW, 62, true);
    ctx.font = `bold ${headSize2}px 'Inter', sans-serif`;
    ctx.fillText(`IN ${cityUpper}`, rightCenterX, 250 + headSize1 + 14);
    ctx.restore();
  }
  
  // 2. Orange pill: "[X] YEARS IN THE OUTDOOR INDUSTRY", centered
  if (expert.years_in_industry) {
    ctx.save();
    const pillText = `${expert.years_in_industry} YEARS IN THE OUTDOOR INDUSTRY`;
    const pillFontSize = 26;
    ctx.font = `bold ${pillFontSize}px 'Inter', sans-serif`;
    const pillTextWidth = ctx.measureText(pillText).width;
    const pillPadX = 32;
    const pillPadY = 16;
    const pillW = pillTextWidth + pillPadX * 2;
    const pillH = pillFontSize + pillPadY * 2;
    const pillY = 400;
    const pillX = rightCenterX - pillW / 2;
    
    // Draw rounded pill
    const pillRadius = pillH / 2;
    ctx.fillStyle = "#ED7660";
    ctx.beginPath();
    ctx.moveTo(pillX + pillRadius, pillY);
    ctx.lineTo(pillX + pillW - pillRadius, pillY);
    ctx.arc(pillX + pillW - pillRadius, pillY + pillRadius, pillRadius, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(pillX + pillRadius, pillY + pillH);
    ctx.arc(pillX + pillRadius, pillY + pillRadius, pillRadius, Math.PI / 2, -Math.PI / 2);
    ctx.closePath();
    ctx.fill();
    
    // Pill text centered
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `bold ${pillFontSize}px 'Inter', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(pillText, rightCenterX, pillY + pillH / 2);
    ctx.restore();
  }
  
  // 3. "Ask me about: [topics]" — cream italic, centered
  if (expert.ask_me_about) {
    ctx.save();
    ctx.fillStyle = "#F5E6D3";
    ctx.font = `italic 28px 'Inter', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const askText = `Ask me about: ${expert.ask_me_about}`;
    const lines = wrapText(ctx, askText, 600, 38);
    let askY = 480;
    for (const line of lines) {
      ctx.fillText(line, rightCenterX, askY);
      askY += 38;
    }
    ctx.restore();
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
