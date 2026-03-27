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

async function buildSvgCard(
  expert: any,
  eventTitle: string,
  cityName: string,
  citySlug: string,
  expertType: string,
  photoBase64: string | null,
  logos: LogoData[]
): Promise<string> {
  const eventLabel = EVENT_LABEL[citySlug] || eventTitle;
  const ctaText =
    expertType === "brand_rep"
      ? `Connect with me @ ${eventLabel}`
      : `Network with me @ ${eventLabel}`;

  const name = expert.full_name || "";
  const title = expert.job_title || "";
  const company = expert.current_company || "";
  const yearsText = expert.years_in_industry
    ? `${expert.years_in_industry} years in the outdoor industry`
    : "";
  const askAbout = expert.ask_me_about
    ? `Ask me about: ${expert.ask_me_about}`
    : "";
  const initials = name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2);

  // Photo section (left side) - larger, more prominent
  const photoSection = photoBase64
    ? `<defs>
        <clipPath id="photoClip"><rect x="0" y="0" width="360" height="530" rx="0"/></clipPath>
      </defs>
      <rect x="0" y="0" width="360" height="530" fill="#19363B"/>
      <image href="${photoBase64}" x="0" y="0" width="360" height="530" clip-path="url(#photoClip)" preserveAspectRatio="xMidYMid slice"/>
      <rect x="0" y="400" width="360" height="130" fill="url(#fadeGrad)"/>`
    : `<rect x="0" y="0" width="360" height="530" fill="#19363B"/>
       <circle cx="180" cy="220" r="120" fill="#E8D5C4"/>
       <text x="180" y="240" text-anchor="middle" font-size="72" font-weight="bold" fill="#19363B" font-family="Georgia,serif">${esc(initials)}</text>`;

  // Right side content
  let rightY = 80;
  const lines: string[] = [];

  // CTA
  lines.push(
    `<text x="400" y="${rightY}" font-size="16" font-style="italic" fill="#19363B" font-family="Georgia,serif">${esc(ctaText)}</text>`
  );
  rightY += 50;

  // Name - big and bold
  lines.push(
    `<text x="400" y="${rightY}" font-size="48" font-weight="bold" fill="#ED7660" font-family="Georgia,serif">${esc(name)}</text>`
  );
  rightY += 38;

  // Title & company
  if (title) {
    lines.push(
      `<text x="400" y="${rightY}" font-size="20" fill="#19363B" font-family="Arial,sans-serif">${esc(title)}</text>`
    );
    rightY += 28;
  }
  if (company) {
    lines.push(
      `<text x="400" y="${rightY}" font-size="18" font-weight="bold" fill="#19363B" font-family="Arial,sans-serif">${esc(company)}</text>`
    );
    rightY += 36;
  }

  // Years
  if (yearsText) {
    lines.push(
      `<text x="400" y="${rightY}" font-size="15" fill="#666" font-family="Arial,sans-serif">${esc(yearsText)}</text>`
    );
    rightY += 32;
  }

  // Previous company logos
  if (logos.length > 0) {
    lines.push(
      `<text x="400" y="${rightY}" font-size="13" fill="#888" font-family="Arial,sans-serif">Previous brands:</text>`
    );
    rightY += 22;
    let logoX = 400;
    for (const logo of logos.slice(0, 6)) {
      lines.push(
        `<image href="${logo.base64}" x="${logoX}" y="${rightY - 4}" width="36" height="36" />`
      );
      logoX += 46;
    }
    rightY += 48;
  }

  // Ask me about
  if (askAbout) {
    const truncated =
      askAbout.length > 65 ? askAbout.slice(0, 62) + "..." : askAbout;
    lines.push(
      `<text x="400" y="${rightY}" font-size="15" font-style="italic" fill="#19363B" font-family="Georgia,serif">${esc(truncated)}</text>`
    );
    rightY += 28;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="fadeGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#19363B" stop-opacity="0"/>
      <stop offset="100%" stop-color="#19363B" stop-opacity="0.85"/>
    </linearGradient>
    ${photoBase64 ? '<clipPath id="photoClip"><rect x="0" y="0" width="360" height="530" rx="0"/></clipPath>' : ''}
  </defs>
  <!-- Cream background -->
  <rect width="1200" height="630" fill="#F5E6D3"/>
  
  <!-- Photo area -->
  ${photoBase64
    ? `<rect x="0" y="0" width="360" height="530" fill="#19363B"/>
       <image href="${photoBase64}" x="0" y="0" width="360" height="530" clip-path="url(#photoClip)" preserveAspectRatio="xMidYMid slice"/>
       <rect x="0" y="400" width="360" height="130" fill="url(#fadeGrad)"/>`
    : `<rect x="0" y="0" width="360" height="530" fill="#19363B"/>
       <circle cx="180" cy="220" r="120" fill="#E8D5C4"/>
       <text x="180" y="240" text-anchor="middle" font-size="72" font-weight="bold" fill="#19363B" font-family="Georgia,serif">${esc(initials)}</text>`}

  <!-- Right side content -->
  ${lines.join("\n  ")}

  <!-- Bottom bar -->
  <rect x="0" y="530" width="1200" height="100" fill="#19363B"/>
  <text x="40" y="580" font-size="18" font-weight="bold" fill="#F5E6D3" font-family="Arial,sans-serif">BASECAMP OUTDOOR</text>
  <text x="600" y="580" text-anchor="middle" font-size="16" fill="#FEE123" font-family="Arial,sans-serif">${esc(eventTitle)} · ${esc(cityName)}</text>
  <text x="1160" y="580" text-anchor="end" font-size="14" fill="#F5E6D3" font-family="Arial,sans-serif">Register: www.basecampoutdoorevents.com</text>
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

  // Build SVG
  const svg = await buildSvgCard(
    expert,
    eventTitle,
    cityName,
    citySlug,
    expertType,
    photoBase64,
    logos
  );

  // Convert SVG to PNG using resvg-wasm
  let pngBytes: Uint8Array;
  try {
    pngBytes = await render(svg);
    console.log(`PNG rendered: ${pngBytes.length} bytes`);
  } catch (err) {
    console.error("resvg render error:", err);
    // Fall back to uploading SVG
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
