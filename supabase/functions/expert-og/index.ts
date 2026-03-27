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
  minneapolis: "/events",
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
  const eventLabel = EVENT_LABEL[citySlug] || eventTitle;
  const ctaLine1 = expertType === "brand_rep" ? "CONNECT WITH ME AT" : "NETWORK WITH ME AT";
  const ctaLine2 = eventLabel.toUpperCase();

  const name = expert.full_name || "";
  const title = expert.job_title || "";
  const company = expert.current_company || "";
  const yearsText = expert.years_in_industry
    ? `${expert.years_in_industry} yrs in outdoor`
    : "";
  const askAbout = expert.ask_me_about || "";
  const initials = name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2);

  // === PHOTO SECTION (left panel) ===
  const photoX = 50;
  const photoY = 50;
  const photoW = 380;
  const photoH = 440;
  const photoR = 16;

  const photoArea = photoBase64
    ? `<defs>
        <clipPath id="photoClip">
          <rect x="${photoX}" y="${photoY}" width="${photoW}" height="${photoH}" rx="${photoR}"/>
        </clipPath>
      </defs>
      <image href="${photoBase64}" x="${photoX}" y="${photoY}" width="${photoW}" height="${photoH}" 
             clip-path="url(#photoClip)" preserveAspectRatio="xMidYMid slice"/>`
    : `<rect x="${photoX}" y="${photoY}" width="${photoW}" height="${photoH}" rx="${photoR}" fill="#2A4F56"/>
       <circle cx="${photoX + photoW / 2}" cy="${photoY + photoH / 2 - 20}" r="100" fill="#E8D5C4"/>
       <text x="${photoX + photoW / 2}" y="${photoY + photoH / 2}" text-anchor="middle" 
             font-size="80" font-weight="900" fill="#19363B" font-family="'Helvetica Neue',Helvetica,Arial,sans-serif">${esc(initials)}</text>`;

  // === RIGHT CONTENT ===
  const rX = 490; // right column start
  let rY = 72;
  const rightContent: string[] = [];

  // CTA line 1 - smaller, yellow, tracking
  rightContent.push(
    `<text x="${rX}" y="${rY}" font-size="18" font-weight="700" fill="#FEE123" 
           font-family="'Helvetica Neue',Helvetica,Arial,sans-serif" letter-spacing="4">${esc(ctaLine1)}</text>`
  );
  rY += 42;

  // CTA line 2 - event name, large, yellow, bold
  rightContent.push(
    `<text x="${rX}" y="${rY}" font-size="36" font-weight="900" fill="#FEE123" 
           font-family="'Helvetica Neue',Helvetica,Arial,sans-serif" letter-spacing="1">${esc(ctaLine2)}</text>`
  );
  rY += 18;

  // Divider line
  rightContent.push(
    `<rect x="${rX}" y="${rY}" width="120" height="3" rx="1.5" fill="#ED7660"/>`
  );
  rY += 36;

  // Expert name - large coral, bold
  const nameLines = wrapText(name, 20);
  for (const line of nameLines) {
    rightContent.push(
      `<text x="${rX}" y="${rY}" font-size="48" font-weight="900" fill="#ED7660" 
             font-family="'Helvetica Neue',Helvetica,Arial,sans-serif">${esc(line)}</text>`
    );
    rY += 54;
  }
  rY -= 10;

  // Job title
  if (title) {
    const titleLines = wrapText(title, 32);
    for (const tl of titleLines) {
      rightContent.push(
        `<text x="${rX}" y="${rY}" font-size="22" font-weight="400" fill="#F5E6D3" 
               font-family="'Helvetica Neue',Helvetica,Arial,sans-serif">${esc(tl)}</text>`
      );
      rY += 28;
    }
  }

  // Company - bold cream
  if (company) {
    rightContent.push(
      `<text x="${rX}" y="${rY}" font-size="22" font-weight="700" fill="#F5E6D3" 
             font-family="'Helvetica Neue',Helvetica,Arial,sans-serif">${esc(company)}</text>`
    );
    rY += 34;
  }

  // Years badge
  if (yearsText) {
    const badgeW = yearsText.length * 9 + 24;
    rightContent.push(
      `<rect x="${rX}" y="${rY - 16}" width="${badgeW}" height="26" rx="13" fill="#ED7660" opacity="0.2"/>
       <text x="${rX + 12}" y="${rY + 3}" font-size="14" font-weight="600" fill="#ED7660" 
             font-family="'Helvetica Neue',Helvetica,Arial,sans-serif">${esc(yearsText)}</text>`
    );
    rY += 32;
  }

  // Ask me about
  if (askAbout) {
    const truncated = askAbout.length > 55 ? askAbout.slice(0, 52) + "…" : askAbout;
    rightContent.push(
      `<text x="${rX}" y="${rY}" font-size="17" font-style="italic" fill="#F5E6D3" opacity="0.75"
             font-family="Georgia,'Times New Roman',serif">"${esc(truncated)}"</text>`
    );
    rY += 28;
  }

  // === BRAND LOGOS (bottom-left, below photo) ===
  const logoSection: string[] = [];
  if (logos.length > 0) {
    const logoStartX = 50;
    const logoY = 510;
    const logoSize = 36;
    const logoGap = 48;

    // Label
    logoSection.push(
      `<text x="${logoStartX}" y="${logoY - 8}" font-size="11" font-weight="600" fill="#F5E6D3" opacity="0.5"
             font-family="'Helvetica Neue',Helvetica,Arial,sans-serif" letter-spacing="2">PREVIOUS BRANDS</text>`
    );

    for (let i = 0; i < Math.min(logos.length, 6); i++) {
      const lx = logoStartX + i * logoGap;
      // White circle background
      logoSection.push(
        `<circle cx="${lx + logoSize / 2}" cy="${logoY + logoSize / 2 + 6}" r="${logoSize / 2 + 4}" fill="#F5E6D3"/>`
      );
      logoSection.push(
        `<image href="${logos[i].base64}" x="${lx}" y="${logoY + 6}" width="${logoSize}" height="${logoSize}" />`
      );
    }
  }

  // === BOTTOM BAR ===
  const barY = 560;
  const barH = 70;

  const basecampLogoEl = basecampLogoBase64
    ? `<image href="${basecampLogoBase64}" x="50" y="${barY + 15}" height="40" width="180" preserveAspectRatio="xMinYMid meet"/>`
    : `<text x="50" y="${barY + 42}" font-size="20" font-weight="900" fill="#F5E6D3" 
           font-family="'Helvetica Neue',Helvetica,Arial,sans-serif" letter-spacing="2">BASECAMP OUTDOOR</text>`;

  const bottomBar = `
    <rect x="0" y="${barY}" width="1200" height="${barH}" fill="#122A2E"/>
    ${basecampLogoEl}
    <text x="1150" y="${barY + 36}" text-anchor="end" font-size="16" font-weight="600" fill="#FEE123" 
          font-family="'Helvetica Neue',Helvetica,Arial,sans-serif">Register → basecampoutdoorevents.com</text>
    <text x="1150" y="${barY + 54}" text-anchor="end" font-size="12" fill="#F5E6D3" opacity="0.5"
          font-family="'Helvetica Neue',Helvetica,Arial,sans-serif">${esc(eventTitle)} · ${esc(cityName)}</text>
  `;

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
  <!-- Dark teal background -->
  <rect width="1200" height="630" fill="#19363B"/>
  
  <!-- Subtle gradient overlay for depth -->
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1E4147" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#19363B" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bgGrad)"/>

  <!-- Photo -->
  ${photoArea}

  <!-- Right content -->
  ${rightContent.join("\n  ")}

  <!-- Brand logos -->
  ${logoSection.join("\n  ")}

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
      "id, full_name, job_title, current_company, photo_url, field_of_work, ask_me_about, previous_companies, years_in_industry, slug, company_domains"
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

  const paramName = expertType === "brand_rep" ? "brand" : "expert";
  const redirectUrl = `${siteBase}${eventPath}?${paramName}=${encodeURIComponent(
    slug
  )}&utm_source=expert_share&utm_medium=social&utm_campaign=${encodeURIComponent(
    city
  )}`;

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

  const title = `${expert.full_name} — ${
    expertType === "brand_rep" ? "Brand Rep" : "Industry Expert"
  } at ${eventTitle}`;
  const description = [
    expert.job_title,
    expert.current_company ? `at ${expert.current_company}` : null,
    `· Meet me at ${eventTitle} in ${cityName}`,
  ]
    .filter(Boolean)
    .join(" ");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${esc(title)}</title>
  <link rel="canonical" href="${esc(shareUrl)}" />
  <meta property="og:type" content="profile" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image" content="${esc(ogImage)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:url" content="${esc(shareUrl)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${esc(ogImage)}" />
  <meta http-equiv="refresh" content="0;url=${esc(redirectUrl)}" />
</head>
<body>
  <p>Redirecting to <a href="${esc(redirectUrl)}">${esc(eventTitle)}</a>...</p>
</body>
</html>`;

  const headers = new Headers(corsHeaders);
  headers.set("Content-Type", "text/html; charset=utf-8");
  headers.set("Cache-Control", "public, max-age=3600");
  return new Response(html, { headers });
});
