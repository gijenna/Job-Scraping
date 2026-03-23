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
  "/events": "events",
  "/gather-pnw": "gather-pnw",
  "/gather-denver": "gather-denver",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.searchParams.get("path") || "/";
  const slug = SLUG_MAP[path];

  if (!slug) {
    return new Response("Unknown path", { status: 404, headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

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
  const favicon = settings["page_favicon"] || "/favicon.ico";

  // Redirect real users, serve meta HTML to bots
  const ua = (req.headers.get("user-agent") || "").toLowerCase();
  const isBot =
    /facebookexternalhit|linkedinbot|twitterbot|slackbot|whatsapp|telegrambot|discordbot|googlebot|bingbot/i.test(
      ua
    );

  if (!isBot) {
    // Redirect to the actual SPA page
    const spaUrl = `${url.origin.replace(/\/functions\/v1.*/, "")}${path}`;
    return new Response(null, {
      status: 302,
      headers: { ...corsHeaders, Location: spaUrl },
    });
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <link rel="icon" href="${escapeHtml(favicon)}" />
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

  return new Response(html, {
    headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
  });
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
