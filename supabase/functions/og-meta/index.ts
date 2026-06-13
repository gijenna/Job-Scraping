import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Maps URL paths to event_settings page slugs
const SLUG_MAP: Record<string, string> = {
  "/PNW26": "pnw26",
  "/pnw26": "pnw26",
  "/OutsideDays26": "outsidedays26",
  "/outsidedays26": "outsidedays26",
  "/OutsideDaysCOS": "outsidedays26-cos",
  "/minneapolis26": "minneapolis26",
  "/events": "events",
  "/gather-pnw": "gather-pnw",
  "/gather-denver": "gather-denver",
  "/afterparty": "afterparty",
  "/afterpartyoakley": "afterparty",
  "/guests": "afterparty",
  "/guestsoakley": "afterparty",
  "/denverreps": "denverreps",
  "/pnwreps": "pnwreps",
};

// Path patterns (regex) that resolve to a slug
const SLUG_PATTERNS: Array<{ pattern: RegExp; slug: string }> = [
  { pattern: /^\/afterparty(oakley)?\/[^/]+$/i, slug: "afterparty" },
  { pattern: /^\/denverreps\/[^/]+$/i, slug: "denverreps" },
  { pattern: /^\/pnwreps\/[^/]+$/i, slug: "pnwreps" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.searchParams.get("path") || "/";

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const ua = (req.headers.get("user-agent") || "").toLowerCase();
  const isBot =
    /facebookexternalhit|linkedinbot|twitterbot|slackbot|whatsapp|telegrambot|discordbot|googlebot|bingbot|pinterest|redditbot|embedly|quora|outbrain|vkshare|w3c_validator|skypeuripreview/i.test(
      ua
    );

  const origin = url.origin.replace(/\/functions\/v1.*/, "");

  // Per-event share URLs: /e/:eventId
  const eventMatch = path.match(/^\/e\/([0-9a-f-]{36})$/i);
  if (eventMatch) {
    const eventId = eventMatch[1];
    const { data: event } = await supabase
      .from("events")
      .select("title, photo_url, registration_link, location, date")
      .eq("id", eventId)
      .maybeSingle();

    if (!event) {
      return new Response("Event not found", { status: 404, headers: corsHeaders });
    }

    // Humans → go straight to registration link
    if (!isBot) {
      return new Response(null, {
        status: 302,
        headers: { ...corsHeaders, Location: event.registration_link },
      });
    }

    const eventDate = event.date ? new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";
    const description = [eventDate, event.location].filter(Boolean).join(" · ");
    const image = event.photo_url || "";
    const favicon = "https://qpnzjcbdtybwazceggmv.supabase.co/storage/v1/object/public/page-meta/basecamp-favicon.png";

    return new Response(buildHtml(event.title, description, image, favicon, event.registration_link), {
      headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const slug = SLUG_MAP[path] || SLUG_PATTERNS.find((p) => p.pattern.test(path))?.slug;
  if (!slug) {
    return new Response("Unknown path", { status: 404, headers: corsHeaders });
  }

  const { data } = await supabase
    .from("event_settings")
    .select("setting_key, setting_value")
    .eq("event_slug", slug)
    .in("setting_key", [
      "page_og_title",
      "page_og_description",
      "page_og_image",
      "page_favicon",
    ]);

  const settings: Record<string, string> = {};
  data?.forEach((r: any) => {
    settings[r.setting_key] = r.setting_value;
  });

  const title = settings["page_og_title"] || "Basecamp Outdoor";
  const description = settings["page_og_description"] || "";
  const image = settings["page_og_image"] || "";
  const favicon = settings["page_favicon"] || "https://qpnzjcbdtybwazceggmv.supabase.co/storage/v1/object/public/page-meta/basecamp-favicon.png";

  if (!isBot) {
    const spaUrl = `${origin}${path}`;
    return new Response(null, {
      status: 302,
      headers: { ...corsHeaders, Location: spaUrl },
    });
  }

  return new Response(buildHtml(title, description, image, favicon), {
    headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
  });
});

function buildHtml(title: string, description: string, image: string, favicon: string, canonical?: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <link rel="icon" href="${escapeHtml(favicon)}" />
  ${canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}" />` : ""}
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  ${image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : ""}
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  ${image ? `<meta name="twitter:image" content="${escapeHtml(image)}" />` : ""}
</head>
<body></body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
