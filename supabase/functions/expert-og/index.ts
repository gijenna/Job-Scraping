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

async function getOrGenerateOgCard(
  supabase: any,
  expert: any,
  eventTitle: string,
  cityName: string,
  slug: string,
  siteBase: string
): Promise<string> {
  // Check cache - look for any existing card for this slug
  const { data: existingFiles } = await supabase.storage
    .from("event-photos")
    .list("og-cards", { search: `${slug}-og-card` });

  if (existingFiles && existingFiles.length > 0) {
    const file = existingFiles[0];
    const filePath = `og-cards/${file.name}`;
    const { data: publicUrl } = supabase.storage
      .from("event-photos")
      .getPublicUrl(filePath);
    if (publicUrl?.publicUrl) {
      console.log(`Cache hit for ${slug}`);
      return publicUrl.publicUrl;
    }
  }

  // Generate with AI
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    console.error("LOVABLE_API_KEY not configured");
    return expert.photo_url || `${siteBase}/og-basecamp.png`;
  }

  const titleLine = expert.job_title || "";
  const companyLine = expert.current_company ? `at ${expert.current_company}` : "";
  const fieldBadge = expert.field_of_work || "";
  const askAbout = expert.ask_me_about || "";

  const prompt = `Create a professional social media preview card image at exactly 1200x630 pixels with this layout:

BACKGROUND: Deep teal color (#1a3a3a) filling the entire card.

LEFT SIDE (40% of width): 
- A cream/off-white (#F5F0E8) Polaroid-style photo frame with slight rotation (-2 degrees)
- Inside the frame: the provided photo converted to black and white/grayscale
- Small shadow under the Polaroid

RIGHT SIDE (60% of width), vertically centered text:
- Name "${expert.full_name}" in large bold coral/salmon color (#ED7660) font
- Below: "${titleLine} ${companyLine}" in warm yellow (#E8C547) medium font
${fieldBadge ? `- Below: A small rounded badge with text "${fieldBadge}" in coral on a darker teal background` : ""}
${askAbout ? `- Below: "Ask me about: ${askAbout}" in small cream (#F5F0E8) italic text` : ""}

BOTTOM: A subtle horizontal line, then "${eventTitle} · ${cityName}" in small cream text, and "BASECAMP OUTDOOR" in slightly larger cream text on the right.

Style: Clean, modern, editorial. The text should be crisp and readable. No decorative elements beyond what's described. Professional networking event feel.`;

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
    console.log("AI image response - has image:", !!imageDataUrl, "prefix:", imageDataUrl?.substring(0, 40));

    if (!imageDataUrl) {
      console.error("No image in AI response. Full message keys:", JSON.stringify(Object.keys(data.choices?.[0]?.message || {})));
      return expert.photo_url || `${siteBase}/og-basecamp.png`;
    }

    // Detect MIME type from data URL
    const mimeMatch = imageDataUrl.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch?.[1] || "image/png";
    const ext = mimeType === "image/jpeg" ? "jpg" : mimeType === "image/webp" ? "webp" : "png";
    const cardPath = `og-cards/${slug}-og-card.${ext}`;
    console.log(`Detected MIME: ${mimeType}, saving as ${cardPath}`);

    // Convert base64 to binary and upload
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
  const slug = url.searchParams.get("slug");
  const city = url.searchParams.get("city") || "portland";

  if (!slug) {
    return new Response("Missing slug", { status: 400, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: expert } = await supabase
    .from("industry_experts")
    .select("full_name, job_title, current_company, photo_url, field_of_work, ask_me_about")
    .eq("slug", slug)
    .single();

  if (!expert) {
    return new Response("Expert not found", {
      status: 404,
      headers: corsHeaders,
    });
  }

  const { data: cityData } = await supabase
    .from("expert_cities")
    .select("event_title, name")
    .eq("slug", city)
    .single();

  const eventTitle = cityData?.event_title || "Basecamp Outdoor Event";
  const cityName = cityData?.name || city;

  const siteBase = "https://sponsor-attract-hub.lovable.app";
  const eventPath = EVENT_PAGE[city] || "/events";
  const redirectUrl = `${siteBase}${eventPath}`;
  const shareUrl = req.url;

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

  // Generate or retrieve cached branded card image
  const ogImage = await getOrGenerateOgCard(
    supabase,
    expert,
    eventTitle,
    cityName,
    slug,
    siteBase
  );

  const title = `${expert.full_name} — Industry Expert at ${eventTitle}`;
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

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
