import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { render } from "https://deno.land/x/resvg_wasm@0.2.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const CRAWLER_UA =
  /facebookexternalhit|Facebot|meta-externalagent|meta-externalfetcher|Twitterbot|LinkedInBot|Slackbot|WhatsApp|Discordbot|TelegramBot|Googlebot|bingbot|Baiduspider/i;

const EVENT_PAGE: Record<string, string> = {
  portland: "/PNW26",
  denver: "/OutsideDays26",
  minneapolis: "/minneapolis26",
};

const EVENT_LABEL: Record<string, string> = {
  portland: "Gather PNW",
  denver: "Outside Days",
  minneapolis: "Basecamp Outdoor",
};

const COMPANY_DOMAINS: Record<string, string> = {
  rei: "rei.com",
  patagonia: "patagonia.com",
  "the north face": "thenorthface.com",
  nike: "nike.com",
  adidas: "adidas.com",
  columbia: "columbia.com",
  cotopaxi: "cotopaxi.com",
  "black diamond": "blackdiamondequipment.com",
  "vail resorts": "vailresorts.com",
  smartwool: "smartwool.com",
  lululemon: "lululemon.com",
  "on running": "on-running.com",
  garmin: "garmin.com",
  keen: "keenfootwear.com",
  "basecamp outdoor": "basecampoutdoor.com",
  "backbone media": "backbonemedia.com",
  "outside inc": "outsideinc.com",
  deloitte: "deloitte.com",
  arcteryx: "arcteryx.com",
  marriott: "marriott.com",
  kpmg: "kpmg.com",
  google: "google.com",
  apple: "apple.com",
  amazon: "amazon.com",
  microsoft: "microsoft.com",
  "peak design": "peakdesign.com",
  superfeet: "superfeet.com",
  osprey: "ospreyeurope.com",
  "trout unlimited": "tu.org",
  "stitch fix": "stitchfix.com",
  "blue bottle coffee": "bluebottlecoffee.com",
  ruggable: "ruggable.com",
  allbirds: "allbirds.com",
  hoka: "hoka.com",
  brooks: "brooksrunning.com",
  salomon: "salomon.com",
  merrell: "merrell.com",
  yeti: "yeti.com",
};

function getDomain(company: string, domainOverrides?: Record<string, string> | null): string | null {
  const key = company.toLowerCase().trim();
  if (domainOverrides) {
    const k = Object.keys(domainOverrides).find((k) => k.toLowerCase().trim() === key);
    if (k && domainOverrides[k]) return domainOverrides[k].replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  }
  return COMPANY_DOMAINS[key] || null;
}

async function fetchAsBase64(url: string): Promise<string | null> {
  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!resp.ok) return null;
    const buf = await resp.arrayBuffer();
    if (buf.byteLength < 100) return null;
    const ct = resp.headers.get("content-type") || "image/jpeg";
    const bytes = new Uint8Array(buf);
    let b64 = "";
    for (let i = 0; i < bytes.length; i += 8192) {
      b64 += String.fromCharCode(...bytes.subarray(i, i + 8192));
    }
    return `data:${ct};base64,${btoa(b64)}`;
  } catch {
    return null;
  }
}

async function fetchLogoBase64(domain: string): Promise<string | null> {
  return await fetchAsBase64(`https://www.google.com/s2/favicons?domain=${domain}&sz=64`);
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

interface LogoData {
  company: string;
  base64: string;
}

// Split long text into lines that fit within maxChars
function wrapText(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) return [text];
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (current && (current + " " + word).length > maxChars) {
      lines.push(current);
      current = word;
    } else {
      current = current ? current + " " + word : word;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 2); // max 2 lines
}

async function buildSvgCard(
  expert: any,
  eventTitle: string,
  cityName: string,
  citySlug: string,
  expertType: string,
  photoBase64: string | null,
  logos: LogoData[],
  basecampLogoBase64: string | null
): Promise<string> {
  const ctaLine1 = expertType === "brand_rep" ? "CONNECT WITH ME IN" : "NETWORK WITH ME IN";
  const ctaLine2 = cityName.toUpperCase();

  const name = expert.full_name || "";
  const title = expert.job_title || "";
  const company = expert.current_company || "";
  const yearsText = expert.years_in_industry
    ? `${expert.years_in_industry} years in the outdoor industry`
    : "";
  const askAbout = expert.ask_me_about || "";
  const initials = name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2);

  // === PHOTO (polaroid frame, slight tilt, B&W) ===
  const frameX = 40;
  const frameY = 40;
  const frameW = 360;
  const frameH = 420;
  const border = 14;
  const photoClipW = frameW - border * 2;
  const photoClipH = frameH - border * 2;

  const photoArea = photoBase64
    ? `<defs>
        <clipPath id="photoClip">
          <rect x="${frameX + border}" y="${frameY + border}" width="${photoClipW}" height="${photoClipH}" rx="6"/>
        </clipPath>
        <filter id="bw">
          <feColorMatrix type="saturate" values="0"/>
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.1" intercept="0.05"/>
            <feFuncG type="linear" slope="1.1" intercept="0.05"/>
            <feFuncB type="linear" slope="1.1" intercept="0.05"/>
          </feComponentTransfer>
        </filter>
      </defs>
      <g transform="rotate(-3, ${frameX + frameW / 2}, ${frameY + frameH / 2})">
        <rect x="${frameX}" y="${frameY}" width="${frameW}" height="${frameH}" rx="8" fill="white" opacity="0.95"/>
        <rect x="${frameX}" y="${frameY}" width="${frameW}" height="${frameH}" rx="8" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="1"/>
        <image href="${photoBase64}" x="${frameX + border}" y="${frameY + border}" width="${photoClipW}" height="${photoClipH}" 
               clip-path="url(#photoClip)" preserveAspectRatio="xMidYMid slice" filter="url(#bw)"/>
      </g>`
    : `<g transform="rotate(-3, ${frameX + frameW / 2}, ${frameY + frameH / 2})">
        <rect x="${frameX}" y="${frameY}" width="${frameW}" height="${frameH}" rx="8" fill="white" opacity="0.95"/>
        <rect x="${frameX + border}" y="${frameY + border}" width="${photoClipW}" height="${photoClipH}" rx="6" fill="#264653"/>
        <text x="${frameX + frameW / 2}" y="${frameY + frameH / 2 + 20}" text-anchor="middle" 
              font-size="80" font-weight="900" fill="white" opacity="0.4" font-family="'Helvetica Neue',Helvetica,Arial,sans-serif">${esc(initials)}</text>
      </g>`;

  // === CAREER JOURNEY LOGOS (below photo, mini tilted polaroids) ===
  const journeySection: string[] = [];
  if (logos.length > 0) {
    const jStartX = 60;
    const jY = 485;
    const polaroidSize = 52;
    const polaroidGap = 62;

    journeySection.push(
      `<text x="${jStartX}" y="${jY - 12}" font-size="10" font-weight="700" fill="#F5E6D3" opacity="0.6"
             font-family="'Helvetica Neue',Helvetica,Arial,sans-serif" letter-spacing="3">CAREER JOURNEY</text>`
    );

    for (let i = 0; i < Math.min(logos.length, 5); i++) {
      const lx = jStartX + i * polaroidGap;
      const tilt = (i - 2) * 4;
      journeySection.push(
        `<g transform="rotate(${tilt}, ${lx + polaroidSize / 2}, ${jY + polaroidSize / 2 + 4})">
          <rect x="${lx - 4}" y="${jY - 4}" width="${polaroidSize + 8}" height="${polaroidSize + 12}" rx="3" fill="white" opacity="0.9"/>
          <rect x="${lx - 4}" y="${jY - 4}" width="${polaroidSize + 8}" height="${polaroidSize + 12}" rx="3" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="1"/>
          <image href="${logos[i].base64}" x="${lx}" y="${jY}" width="${polaroidSize}" height="${polaroidSize}" />
        </g>`
      );
    }
  }

  // === RIGHT CONTENT ===
  const rX = 460;
  let rY = 75;
  const rightContent: string[] = [];

  // CTA line 1
  rightContent.push(
    `<text x="${rX}" y="${rY}" font-size="16" font-weight="800" fill="#FEE123" 
           font-family="'Helvetica Neue',Helvetica,Arial,sans-serif" letter-spacing="4">${esc(ctaLine1)}</text>`
  );
  rY += 48;

  // CTA line 2 - city name, big yellow
  rightContent.push(
    `<text x="${rX}" y="${rY}" font-size="44" font-weight="900" fill="#FEE123" 
           font-family="'Helvetica Neue',Helvetica,Arial,sans-serif" letter-spacing="2">${esc(ctaLine2)}</text>`
  );
  rY += 16;

  // Coral divider
  rightContent.push(
    `<rect x="${rX}" y="${rY}" width="100" height="3" rx="1.5" fill="#ED7660"/>`
  );
  rY += 36;

  // Expert name
  const nameLines = wrapText(name, 18);
  for (const line of nameLines) {
    rightContent.push(
      `<text x="${rX}" y="${rY}" font-size="46" font-weight="900" fill="#ED7660" 
             font-family="'Helvetica Neue',Helvetica,Arial,sans-serif">${esc(line)}</text>`
    );
    rY += 52;
  }
  rY -= 6;

  // Job title
  if (title) {
    const titleLines = wrapText(title, 30);
    for (const tl of titleLines) {
      rightContent.push(
        `<text x="${rX}" y="${rY}" font-size="21" font-weight="400" fill="#F5E6D3" 
               font-family="'Helvetica Neue',Helvetica,Arial,sans-serif">${esc(tl)}</text>`
      );
      rY += 26;
    }
  }

  // Company
  if (company) {
    rightContent.push(
      `<text x="${rX}" y="${rY}" font-size="21" font-weight="700" fill="#F5E6D3" 
             font-family="'Helvetica Neue',Helvetica,Arial,sans-serif">${esc(company)}</text>`
    );
    rY += 34;
  }

  // Years badge
  if (yearsText) {
    const badgeW = yearsText.length * 8.5 + 28;
    rightContent.push(
      `<rect x="${rX}" y="${rY - 17}" width="${badgeW}" height="28" rx="14" fill="#ED7660" opacity="0.2"/>
       <text x="${rX + 14}" y="${rY + 3}" font-size="13" font-weight="700" fill="#ED7660" 
             font-family="'Helvetica Neue',Helvetica,Arial,sans-serif">${esc(yearsText)}</text>`
    );
    rY += 36;
  }

  // Ask me about (italic)
  if (askAbout) {
    const truncated = askAbout.length > 60 ? askAbout.slice(0, 57) + "…" : askAbout;
    const askLines = wrapText(`"${truncated}"`, 38);
    for (const al of askLines) {
      rightContent.push(
        `<text x="${rX}" y="${rY}" font-size="16" font-style="italic" fill="#F5E6D3" opacity="0.7"
               font-family="Georgia,'Times New Roman',serif">${esc(al)}</text>`
      );
      rY += 22;
    }
  }

  // === BOTTOM BAR ===
  const barY = 560;
  const barH = 70;

  const basecampLogoEl = basecampLogoBase64
    ? `<image href="${basecampLogoBase64}" x="50" y="${barY + 15}" height="40" width="180" preserveAspectRatio="xMinYMid meet"/>`
    : `<text x="50" y="${barY + 42}" font-size="18" font-weight="900" fill="#F5E6D3" 
           font-family="'Helvetica Neue',Helvetica,Arial,sans-serif" letter-spacing="2">BASECAMP OUTDOOR</text>`;

  const bottomBar = `
    <rect x="0" y="${barY}" width="1200" height="${barH}" fill="#0F2629"/>
    ${basecampLogoEl}
    <text x="1150" y="${barY + 34}" text-anchor="end" font-size="16" font-weight="700" fill="#FEE123" 
          font-family="'Helvetica Neue',Helvetica,Arial,sans-serif">Register free · basecampoutdoorevents.com</text>
    <text x="1150" y="${barY + 54}" text-anchor="end" font-size="12" fill="#F5E6D3" opacity="0.5"
          font-family="'Helvetica Neue',Helvetica,Arial,sans-serif">${esc(eventTitle)} · ${esc(cityName)}</text>
  `;

  // === SUBTLE DOODLE OVERLAYS (mountains, trees, campfire — very low opacity on dark bg) ===
  const doodles = `
    <!-- Mountain doodle top-right -->
    <g opacity="0.06" transform="translate(850, 20)">
      <path d="M0 180 L60 40 L90 90 L130 10 L200 180 Z" fill="none" stroke="#F5E6D3" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M30 180 L80 80 L100 110 L140 50 L180 180" fill="none" stroke="#F5E6D3" stroke-width="2" stroke-dasharray="6,4"/>
    </g>
    <!-- Pine trees right side -->
    <g opacity="0.05" transform="translate(1080, 280)">
      <path d="M30 0 L0 80 L15 70 L-10 130 L70 130 L45 70 L60 80 Z" fill="#F5E6D3"/>
      <path d="M70 30 L45 100 L58 92 L40 140 L100 140 L82 92 L95 100 Z" fill="#F5E6D3"/>
    </g>
    <!-- Campfire doodle bottom-right -->
    <g opacity="0.06" transform="translate(1020, 440)">
      <path d="M30 60 Q35 30 25 10 Q20 30 15 5 Q10 25 20 60" fill="none" stroke="#ED7660" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M40 60 Q45 35 38 15 Q32 35 35 60" fill="none" stroke="#F4A261" stroke-width="2" stroke-linecap="round"/>
      <line x1="10" y1="62" x2="50" y2="62" stroke="#F5E6D3" stroke-width="2" stroke-linecap="round"/>
      <line x1="5" y1="65" x2="15" y2="58" stroke="#F5E6D3" stroke-width="2" stroke-linecap="round"/>
      <line x1="45" y1="58" x2="55" y2="65" stroke="#F5E6D3" stroke-width="2" stroke-linecap="round"/>
    </g>
    <!-- Sun rays top-right corner -->
    <g opacity="0.05" transform="translate(1100, 30)">
      <circle cx="40" cy="40" r="20" fill="none" stroke="#F4A261" stroke-width="2"/>
      <line x1="40" y1="10" x2="40" y2="0" stroke="#F4A261" stroke-width="2" stroke-linecap="round"/>
      <line x1="40" y1="70" x2="40" y2="80" stroke="#F4A261" stroke-width="2" stroke-linecap="round"/>
      <line x1="10" y1="40" x2="0" y2="40" stroke="#F4A261" stroke-width="2" stroke-linecap="round"/>
      <line x1="70" y1="40" x2="80" y2="40" stroke="#F4A261" stroke-width="2" stroke-linecap="round"/>
    </g>
  `;

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
  <!-- Dark teal background (Card V3 01) -->
  <rect width="1200" height="630" fill="#19363B"/>

  <!-- Doodle overlays -->
  ${doodles}

  <!-- Photo -->
  ${photoArea}

  <!-- Right content -->
  ${rightContent.join("\n  ")}

  <!-- Career journey logos -->
  ${journeySection.join("\n  ")}

  <!-- Bottom bar -->
  ${bottomBar}
</svg>`;
}

async function getOrGenerateOgCard(
  supabase: any,
  expert: any,
  eventTitle: string,
  cityName: string,
  citySlug: string,
  slug: string,
  siteBase: string,
  expertType: string
): Promise<string> {
  const cardPath = `og-cards/${slug}-${citySlug}-og-card.png`;

  // Check cache for PNG
  const { data: existingFiles } = await supabase.storage
    .from("event-photos")
    .list("og-cards", { search: `${slug}-${citySlug}-og-card.png` });

  if (existingFiles && existingFiles.length > 0) {
    const { data: publicUrl } = supabase.storage
      .from("event-photos")
      .getPublicUrl(`og-cards/${existingFiles[0].name}`);
    if (publicUrl?.publicUrl) {
      console.log(`Cache hit for ${slug}-${citySlug}`);
      return publicUrl.publicUrl;
    }
  }

  // Fetch photo as base64
  const photoBase64 = expert.photo_url
    ? await fetchAsBase64(expert.photo_url)
    : null;
  console.log(`Photo fetch for ${slug}: ${photoBase64 ? "OK" : "NONE"} (url: ${expert.photo_url || "null"})`);

  // Fetch previous company logos
  const logos: LogoData[] = [];
  if (expert.previous_companies) {
    const companies = expert.previous_companies
      .split(",")
      .map((c: string) => c.trim())
      .filter(Boolean);
    const domainOverrides = expert.company_domains || null;
    for (const comp of companies.slice(0, 6)) {
      const domain = getDomain(comp, domainOverrides);
      if (domain) {
        const b64 = await fetchLogoBase64(domain);
        if (b64) logos.push({ company: comp, base64: b64 });
      }
    }
  }

  // Fetch Basecamp logo
  const basecampLogoBase64 = await fetchAsBase64("https://sponsor-attract-hub.lovable.app/og-basecamp.png");

  // Build SVG
  const svg = await buildSvgCard(
    expert,
    eventTitle,
    cityName,
    citySlug,
    expertType,
    photoBase64,
    logos,
    basecampLogoBase64
  );

  // Convert SVG to PNG using resvg-wasm
  let pngBytes: Uint8Array;
  try {
    pngBytes = await render(svg);
    console.log(`PNG rendered: ${pngBytes.length} bytes`);
  } catch (err) {
    console.error("resvg render error:", err);
    // Fall back to SVG upload
    const svgBytes = new TextEncoder().encode(svg);
    const { error: uploadError } = await supabase.storage
      .from("event-photos")
      .upload(`og-cards/${slug}-${citySlug}-og-card.svg`, svgBytes, {
        contentType: "image/svg+xml",
        upsert: true,
      });
    if (!uploadError) {
      const { data: publicUrl } = supabase.storage
        .from("event-photos")
        .getPublicUrl(`og-cards/${slug}-${citySlug}-og-card.svg`);
      return publicUrl?.publicUrl || expert.photo_url || `${siteBase}/og-basecamp.png`;
    }
    return expert.photo_url || `${siteBase}/og-basecamp.png`;
  }

  // Upload PNG
  const { error: uploadError } = await supabase.storage
    .from("event-photos")
    .upload(cardPath, pngBytes, {
      contentType: "image/png",
      upsert: true,
    });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return expert.photo_url || `${siteBase}/og-basecamp.png`;
  }

  const { data: publicUrl } = supabase.storage
    .from("event-photos")
    .getPublicUrl(cardPath);

  return publicUrl?.publicUrl || expert.photo_url || `${siteBase}/og-basecamp.png`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const parts = url.pathname.split("/").filter(Boolean);
  const fnIndex = parts.lastIndexOf("expert-og");
  const slugFromPath =
    fnIndex >= 0 ? decodeURIComponent(parts[fnIndex + 1] || "") : "";
  const cityFromPath =
    fnIndex >= 0 ? decodeURIComponent(parts[fnIndex + 2] || "") : "";

  const slug = url.searchParams.get("slug") || slugFromPath;
  const city = url.searchParams.get("city") || cityFromPath || "portland";
  const forceGenerate = url.searchParams.get("generate") === "1";

  if (!slug) {
    return new Response("Missing slug", { status: 400, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: expert } = await supabase
    .from("industry_experts")
    .select(
      "id, full_name, job_title, current_company, photo_url, field_of_work, ask_me_about, previous_companies, years_in_industry, slug, company_domains, updated_at"
    )
    .eq("slug", slug)
    .single();

  if (!expert) {
    return new Response("Expert not found", {
      status: 404,
      headers: corsHeaders,
    });
  }

  // Get expert type from assignment
  const { data: assignment } = await supabase
    .from("expert_city_assignments")
    .select("expert_type")
    .eq("city_slug", city)
    .eq("expert_id", expert.id)
    .single();

  const expertType = assignment?.expert_type || "industry_expert";

  const { data: cityData } = await supabase
    .from("expert_cities")
    .select("event_title, name")
    .eq("slug", city)
    .single();

  const eventTitle = cityData?.event_title || "Basecamp Outdoor Event";
  const cityName = cityData?.name || city;

  const siteBase = "https://sponsor-attract-hub.lovable.app";
  const eventPath = EVENT_PAGE[city] || "/events";

  // Build redirect that auto-opens the brand modal + rep card on the event map.
  const slugifyName = (s: string) =>
    (s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const isBrandRep = expertType === "brand_rep";
  const companySlug = expert.current_company ? slugifyName(expert.current_company) : "";
  const params = new URLSearchParams();
  if (isBrandRep && companySlug) {
    params.set("map_brand", companySlug);
    params.set("map_rep", slug);
  } else {
    params.set("map_expert", slug);
  }
  params.set("utm_source", "expert_share");
  params.set("utm_medium", "social");
  params.set("utm_campaign", city);
  const redirectUrl = `${siteBase}${eventPath}?${params.toString()}`;

  // Pull main event-page OG metadata so share previews match the event page.
  const EVENT_SETTINGS_SLUG: Record<string, string> = {
    portland: "pnw26",
    denver: "outsidedays26",
  };
  const eventSettingsSlug = EVENT_SETTINGS_SLUG[city];
  let pageOgImage = `${siteBase}/og-basecamp.png`;
  let pageOgTitle = eventTitle;
  let pageOgDescription = `Join us at ${eventTitle} in ${cityName}.`;
  if (eventSettingsSlug) {
    const { data: pageSettings } = await supabase
      .from("event_settings")
      .select("setting_key, setting_value")
      .eq("event_slug", eventSettingsSlug)
      .in("setting_key", ["page_og_title", "page_og_description", "page_og_image"]);
    const m: Record<string, string> = {};
    pageSettings?.forEach((r: any) => { m[r.setting_key] = r.setting_value; });
    if (m.page_og_image) pageOgImage = m.page_og_image;
    if (m.page_og_title) pageOgTitle = m.page_og_title;
    if (m.page_og_description) pageOgDescription = m.page_og_description;
  }

  // Minneapolis: override with rendered expert card + spec copy.
  if (city === "minneapolis") {
    const epoch = expert.updated_at ? Math.floor(new Date(expert.updated_at).getTime() / 1000) : Date.now();
    const shareOriginMn = url.origin.replace("http://", "https://");
    pageOgImage = `${shareOriginMn}/functions/v1/expert-card-image/${encodeURIComponent(slug)}/minneapolis?format=og&v=${epoch}`;
    pageOgTitle = `${expert.full_name} · Industry Expert at the Basecamp Outdoor Lounge`;
    pageOgDescription = "OR Gatherings × Basecamp Outdoor Lounge. Thursday, Aug 20, 10:30am–12:30pm at OR Minneapolis. Free entry. No badge needed. Just show up.";
  }

  const shareOrigin = url.origin.replace("http://", "https://");
  const shareUrl = `${shareOrigin}/functions/v1/expert-og/${encodeURIComponent(
    slug
  )}/${encodeURIComponent(city)}`;

  // Force generate mode
  if (forceGenerate) {
    // Clear all cached versions
    const { data: oldFiles } = await supabase.storage
      .from("event-photos")
      .list("og-cards", { search: `${slug}-${city}-og-card` });
    if (oldFiles && oldFiles.length > 0) {
      await supabase.storage
        .from("event-photos")
        .remove(oldFiles.map((f: any) => `og-cards/${f.name}`));
    }

    const ogImage = await getOrGenerateOgCard(
      supabase,
      expert,
      eventTitle,
      cityName,
      city,
      slug,
      siteBase,
      expertType
    );
    return new Response(JSON.stringify({ image_url: ogImage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const ua = req.headers.get("user-agent") || "";
  const isCrawler = CRAWLER_UA.test(ua);

  if (!isCrawler) {
    console.log(`Non-crawler UA, redirecting: ${ua.slice(0, 120)}`);
    return new Response(null, {
      status: 302,
      headers: { ...corsHeaders, Location: redirectUrl },
    });
  }

  console.log(`Crawler UA detected: ${ua.slice(0, 120)}`);

  // Reuse the main event-page OG image/title/description so previews match.
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${esc(pageOgTitle)}</title>
  <link rel="canonical" href="${esc(redirectUrl)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(pageOgTitle)}" />
  <meta property="og:description" content="${esc(pageOgDescription)}" />
  <meta property="og:image" content="${esc(pageOgImage)}" />
  <meta property="og:url" content="${esc(redirectUrl)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(pageOgTitle)}" />
  <meta name="twitter:description" content="${esc(pageOgDescription)}" />
  <meta name="twitter:image" content="${esc(pageOgImage)}" />
  <meta http-equiv="refresh" content="0;url=${esc(redirectUrl)}" />
</head>
<body>
  <p>Redirecting to <a href="${esc(redirectUrl)}">${esc(pageOgTitle)}</a>...</p>
</body>
</html>`;

  const headers = new Headers(corsHeaders);
  headers.set("Content-Type", "text/html; charset=utf-8");
  headers.set("Cache-Control", "public, max-age=3600");
  return new Response(html, { headers });
});
