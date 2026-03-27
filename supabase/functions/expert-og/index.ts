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

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    console.error("LOVABLE_API_KEY not configured");
    return expert.photo_url || `${siteBase}/og-basecamp.png`;
  }

  const titleLine = expert.job_title || "";
  const companyLine = expert.current_company ? `at ${expert.current_company}` : "";
  const previousBrands = expert.previous_companies || "";
  const yearsIndustry = expert.years_in_industry ? `${expert.years_in_industry} years in the industry` : "";
  const askAbout = expert.ask_me_about || "";
  const eventLabel = EVENT_LABEL[citySlug] || eventTitle;
  const ctaText = expertType === "brand_rep"
    ? `Connect with me @ ${eventLabel}`
    : `Network with me @ ${eventLabel}`;

  const prompt = `Create a professional social media preview card image at exactly 1200x630 pixels with this layout:

BACKGROUND: Warm cream/off-white (#F5E6D3) filling the entire card.

LEFT SIDE (35% of width):
- A circular photo (about 200px diameter) with the person's provided photo
- Photo should have a thin dark teal (#19363B) border ring
- Below the photo circle, small gray text showing previous brands: "${previousBrands}"

RIGHT SIDE (65% of width), vertically centered:
- Top: "${ctaText}" in medium dark teal (#19363B) italic text
- Name "${expert.full_name}" in large bold coral/salmon (#ED7660) font, prominent
- Below: "${titleLine} ${companyLine}" in dark teal (#19363B) medium font
${yearsIndustry ? `- Below: "${yearsIndustry}" in small gray text` : ""}
${askAbout ? `- Below: "Ask me about: ${askAbout}" in small dark teal italic text` : ""}

BOTTOM BAR: A dark teal (#19363B) strip across the bottom ~50px high containing:
- Left: "BASECAMP OUTDOOR" in cream text, small bold
- Center: "${eventTitle} · ${cityName}" in cream/yellow (#FEE123) text
- Right: "Register: www.basecampoutdoorevents.com" in cream text

Style: Clean, warm, editorial card. Cream background feels inviting. Text must be crisp and readable. Professional networking feel.`;

  try {
    const messages: any[] = [
      {
        role: "user",
        content: expert.photo_url
          ? [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: expert.photo_url } },
            ]
          : prompt,
      },
    ];

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3.1-flash-image-preview",
          messages,
          modalities: ["image", "text"],
        }),
      }
    );

    if (!response.ok) {
      console.error("AI gateway error:", response.status, await response.text());
      return expert.photo_url || `${siteBase}/og-basecamp.png`;
    }

    const data = await response.json();
    const firstImage = data.choices?.[0]?.message?.images?.[0];
    const imageDataUrl = firstImage?.image_url?.url;
    console.log("AI image response - has image:", !!imageDataUrl);

    if (!imageDataUrl) {
      console.error("No image in AI response");
      return expert.photo_url || `${siteBase}/og-basecamp.png`;
    }

    const mimeMatch = imageDataUrl.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch?.[1] || "image/png";
    const ext = mimeType === "image/jpeg" ? "jpg" : mimeType === "image/webp" ? "webp" : "png";
    const cardPath = `og-cards/${slug}-${citySlug}-og-card.${ext}`;

    const base64 = imageDataUrl.replace(/^data:image\/\w+;base64,/, "");
    const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

    const { error: uploadError } = await supabase.storage
      .from("event-photos")
      .upload(cardPath, binary, {
        contentType: mimeType,
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
  } catch (err) {
    console.error("OG card generation failed:", err);
    return expert.photo_url || `${siteBase}/og-basecamp.png`;
  }
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

  if (!slug) {
    return new Response("Missing slug", { status: 400, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: expert } = await supabase
    .from("industry_experts")
    .select("full_name, job_title, current_company, photo_url, field_of_work, ask_me_about, previous_companies, years_in_industry, slug")
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
    .eq("expert_id", (await supabase.from("industry_experts").select("id").eq("slug", slug).single()).data?.id)
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
  // Deep-link with UTM params
  const redirectUrl = `${siteBase}${eventPath}?expert=${encodeURIComponent(slug)}&utm_source=expert_share&utm_medium=social&utm_campaign=${encodeURIComponent(city)}`;
  const shareOrigin = url.origin.replace("http://", "https://");
  const shareUrl = `${shareOrigin}/functions/v1/expert-og/${encodeURIComponent(slug)}/${encodeURIComponent(city)}`;

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
  const ogImageType = getImageMimeType(ogImage);

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
  <meta property="og:image:type" content="${esc(ogImageType)}" />
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

function getImageMimeType(url: string): string {
  const normalized = url.split("?")[0].toLowerCase();
  if (normalized.endsWith(".jpg") || normalized.endsWith(".jpeg")) return "image/jpeg";
  if (normalized.endsWith(".webp")) return "image/webp";
  return "image/png";
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
