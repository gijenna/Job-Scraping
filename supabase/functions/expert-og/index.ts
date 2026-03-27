import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

function buildSvgCard(
  expert: any,
  eventTitle: string,
  cityName: string,
  citySlug: string,
  expertType: string,
  photoBase64: string | null
): string {
  const eventLabel = EVENT_LABEL[citySlug] || eventTitle;
  const ctaText = expertType === "brand_rep"
    ? `Connect with me @ ${eventLabel}`
    : `Network with me @ ${eventLabel}`;

  const name = esc(expert.full_name || "");
  const title = esc(expert.job_title || "");
  const company = expert.current_company ? esc(`at ${expert.current_company}`) : "";
  const yearsText = expert.years_in_industry ? esc(`${expert.years_in_industry} years in the outdoor industry`) : "";
  const askAbout = expert.ask_me_about ? esc(`Ask me about: ${expert.ask_me_about}`) : "";
  const prevBrands = expert.previous_companies ? esc(`Previous: ${expert.previous_companies}`) : "";

  const photoClip = photoBase64
    ? `<clipPath id="circleClip"><circle cx="180" cy="240" r="110"/></clipPath>
       <circle cx="180" cy="240" r="114" fill="#19363B" />
       <image href="${photoBase64}" x="70" y="130" width="220" height="220" clip-path="url(#circleClip)" preserveAspectRatio="xMidYMid slice" />`
    : `<circle cx="180" cy="240" r="114" fill="#19363B" />
       <circle cx="180" cy="240" r="110" fill="#E8D5C4" />
       <text x="180" y="255" text-anchor="middle" font-size="60" font-weight="bold" fill="#19363B" font-family="Georgia,serif">${name.split(" ").map(w => w[0]).join("").slice(0, 2)}</text>`;

  // Build right-side text lines
  let rightY = 160;
  const rightLines: string[] = [];

  rightLines.push(`<text x="420" y="${rightY}" font-size="18" font-style="italic" fill="#19363B" font-family="Georgia,serif">${esc(ctaText)}</text>`);
  rightY += 50;

  rightLines.push(`<text x="420" y="${rightY}" font-size="42" font-weight="bold" fill="#ED7660" font-family="Georgia,serif">${name}</text>`);
  rightY += 40;

  if (title || company) {
    rightLines.push(`<text x="420" y="${rightY}" font-size="20" fill="#19363B" font-family="Arial,sans-serif">${title}${title && company ? " " : ""}${company}</text>`);
    rightY += 32;
  }

  if (yearsText) {
    rightLines.push(`<text x="420" y="${rightY}" font-size="16" fill="#666" font-family="Arial,sans-serif">${yearsText}</text>`);
    rightY += 28;
  }

  if (prevBrands) {
    // Truncate to fit
    const truncated = prevBrands.length > 70 ? prevBrands.slice(0, 67) + "..." : prevBrands;
    rightLines.push(`<text x="420" y="${rightY}" font-size="14" fill="#888" font-family="Arial,sans-serif">${truncated}</text>`);
    rightY += 28;
  }

  if (askAbout) {
    // Truncate and wrap
    const truncated = askAbout.length > 80 ? askAbout.slice(0, 77) + "..." : askAbout;
    rightLines.push(`<text x="420" y="${rightY}" font-size="16" font-style="italic" fill="#19363B" font-family="Georgia,serif">${truncated}</text>`);
    rightY += 28;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>${photoBase64 ? '<clipPath id="circleClip"><circle cx="180" cy="240" r="110"/></clipPath>' : ''}</defs>
  <!-- Cream background -->
  <rect width="1200" height="630" fill="#F5E6D3" rx="0"/>
  
  <!-- Photo area -->
  ${photoBase64
    ? `<circle cx="180" cy="240" r="114" fill="#19363B"/>
       <image href="${photoBase64}" x="70" y="130" width="220" height="220" clip-path="url(#circleClip)" preserveAspectRatio="xMidYMid slice"/>`
    : `<circle cx="180" cy="240" r="114" fill="#19363B"/>
       <circle cx="180" cy="240" r="110" fill="#E8D5C4"/>
       <text x="180" y="255" text-anchor="middle" font-size="60" font-weight="bold" fill="#19363B" font-family="Georgia,serif">${name.split(" ").map(w => w[0]).join("").slice(0, 2)}</text>`}

  <!-- Right side text -->
  ${rightLines.join("\n  ")}

  <!-- Bottom bar -->
  <rect x="0" y="530" width="1200" height="100" fill="#19363B"/>
  <text x="40" y="575" font-size="16" font-weight="bold" fill="#F5E6D3" font-family="Arial,sans-serif">BASECAMP OUTDOOR</text>
  <text x="600" y="575" text-anchor="middle" font-size="16" fill="#FEE123" font-family="Arial,sans-serif">${esc(eventTitle)} · ${esc(cityName)}</text>
  <text x="1160" y="575" text-anchor="end" font-size="14" fill="#F5E6D3" font-family="Arial,sans-serif">Register: www.basecampoutdoorevents.com</text>
</svg>`;
}

async function fetchPhotoAsBase64(photoUrl: string): Promise<string | null> {
  try {
    const resp = await fetch(photoUrl);
    if (!resp.ok) return null;
    const buf = await resp.arrayBuffer();
    const contentType = resp.headers.get("content-type") || "image/jpeg";
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
    return `data:${contentType};base64,${base64}`;
  } catch {
    return null;
  }
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
  const cardPath = `og-cards/${slug}-${citySlug}-og-card.svg`;

  // Check cache
  const { data: existingFiles } = await supabase.storage
    .from("event-photos")
    .list("og-cards", { search: `${slug}-${citySlug}-og-card` });

  if (existingFiles && existingFiles.length > 0) {
    const file = existingFiles[0];
    const filePath = `og-cards/${file.name}`;
    const { data: publicUrl } = supabase.storage
      .from("event-photos")
      .getPublicUrl(filePath);
    if (publicUrl?.publicUrl) {
      console.log(`Cache hit for ${slug}-${citySlug}`);
      return publicUrl.publicUrl;
    }
  }

  // Generate SVG
  const photoBase64 = expert.photo_url ? await fetchPhotoAsBase64(expert.photo_url) : null;
  const svg = buildSvgCard(expert, eventTitle, cityName, citySlug, expertType, photoBase64);
  const svgBytes = new TextEncoder().encode(svg);

  const { error: uploadError } = await supabase.storage
    .from("event-photos")
    .upload(cardPath, svgBytes, {
      contentType: "image/svg+xml",
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
  const slugFromPath = fnIndex >= 0 ? decodeURIComponent(parts[fnIndex + 1] || "") : "";
  const cityFromPath = fnIndex >= 0 ? decodeURIComponent(parts[fnIndex + 2] || "") : "";

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
    .select("id, full_name, job_title, current_company, photo_url, field_of_work, ask_me_about, previous_companies, years_in_industry, slug")
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

  // Use ?brand= for brand reps, ?expert= for industry experts
  const paramName = expertType === "brand_rep" ? "brand" : "expert";
  const redirectUrl = `${siteBase}${eventPath}?${paramName}=${encodeURIComponent(slug)}&utm_source=expert_share&utm_medium=social&utm_campaign=${encodeURIComponent(city)}`;

  const shareOrigin = url.origin.replace("http://", "https://");
  const shareUrl = `${shareOrigin}/functions/v1/expert-og/${encodeURIComponent(slug)}/${encodeURIComponent(city)}`;

  // If ?generate=1, force regenerate and return the image URL
  if (forceGenerate) {
    // Delete cached file first
    await supabase.storage.from("event-photos").remove([`og-cards/${slug}-${city}-og-card.svg`]);
    // Also remove old png/jpg/webp files
    const { data: oldFiles } = await supabase.storage.from("event-photos").list("og-cards", { search: `${slug}-${city}-og-card` });
    if (oldFiles && oldFiles.length > 0) {
      await supabase.storage.from("event-photos").remove(oldFiles.map(f => `og-cards/${f.name}`));
    }

    const ogImage = await getOrGenerateOgCard(supabase, expert, eventTitle, cityName, city, slug, siteBase, expertType);
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

  const title = `${expert.full_name} — ${expertType === "brand_rep" ? "Brand Rep" : "Industry Expert"} at ${eventTitle}`;
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
  <meta property="og:image:type" content="image/svg+xml" />
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

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
