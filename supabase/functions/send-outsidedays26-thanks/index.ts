// Sends the OutsideDays26 career-fair thank-you email.
// Admin-only. Recipients are provided by the caller (CSV upload in admin UI).
// Modes:
//   { mode: "test" }                        -> sends only to TEST_RECIPIENT
//   { mode: "all", recipients: [...] }      -> sends to each recipient (dedup + 24h same-template guard)
// Each recipient: { email: string, name?: string }
// Fetches career-fair sponsors (event_map_brands, slug=denver26) and the Edges First expert
// spotlight once, then passes them into the template via templateData.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const ADMIN_EMAILS = (Deno.env.get("ADMIN_EMAIL") || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);
const ADMIN_DOMAINS = ["wearetheoutdoorindustry.com"];

const TEST_RECIPIENT = "jenna@wearetheoutdoorindustry.com";
const TEMPLATE_NAME = "outsidedays26-thanks";
const EVENT_SLUG = "denver26";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

interface Recipient { email: string; name?: string }

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "unauthorized" }, 401);

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user?.email) return json({ error: "unauthorized" }, 401);
    const callerEmail = userData.user.email.trim().toLowerCase();
    const callerDomain = callerEmail.split("@").pop() || "";
    const isAdmin = ADMIN_EMAILS.includes(callerEmail) || ADMIN_DOMAINS.includes(callerDomain);
    if (!isAdmin) return json({ error: "forbidden" }, 403);

    const body = await req.json().catch(() => ({}));
    const mode = body?.mode === "all" ? "all" : "test";
    const inputRecipients: Recipient[] = Array.isArray(body?.recipients) ? body.recipients : [];

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // --- Fetch sponsors (career-fair brand list) ---
    const { data: brandRows } = await admin
      .from("event_map_brands")
      .select("name, website_url, logo_url")
      .eq("event_slug", EVENT_SLUG)
      .order("name");

    const SKIP_NAMES = new Set([
      "industry expert zone",
      "popfly",
      "edges first",
      "basecamp",
      "career collective",
      "sound healing",
      "best day brewing", // listed in vibes section instead
      "sap's",
    ]);
    const sponsors = ((brandRows as any[]) || [])
      .filter((b) => b?.name && !SKIP_NAMES.has(b.name.toLowerCase().trim()))
      .map((b) => ({
        name: b.name,
        website_url: b.website_url || null,
        logo_url: b.logo_url || null,
      }));

    // --- Fetch Edges First expert spotlight ---
    const { data: edgesRows } = await admin
      .from("industry_experts")
      .select("full_name, job_title, current_company, photo_url")
      .or("current_company.ilike.%edges%first%,slug.eq.kelly-bleck")
      .not("photo_url", "is", null)
      .limit(1);
    const edgesRow = (edgesRows as any[])?.[0];
    const edgesFirst = {
      full_name: edgesRow?.full_name || "Kelly Bleck",
      job_title: edgesRow?.job_title || "Owner & Fullstack Developer",
      current_company: edgesRow?.current_company || "Edges First",
      photo_url: edgesRow?.photo_url || null,
      website_url: "https://edgesfirst.co/",
    };

    // --- Build recipient list ---
    let recipients: { email: string; name: string; idKey: string }[] = [];
    if (mode === "test") {
      recipients = [{ email: TEST_RECIPIENT, name: "Jenna", idKey: `${TEMPLATE_NAME}-test-${Date.now()}` }];
    } else {
      const seen = new Set<string>();
      for (const r of inputRecipients) {
        const email = (r?.email || "").trim().toLowerCase();
        if (!email || !email.includes("@")) continue;
        if (seen.has(email)) continue;
        seen.add(email);
        recipients.push({
          email,
          name: r?.name || "there",
          idKey: `${TEMPLATE_NAME}-${email}`,
        });
      }

      // Skip recipients who already received this template in the last 24h
      if (recipients.length) {
        const { data: prior } = await admin
          .from("email_send_log")
          .select("recipient_email,status")
          .eq("template_name", TEMPLATE_NAME)
          .in("status", ["pending", "sent"])
          .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
        const already = new Set(((prior as any[]) || []).map((p) => (p.recipient_email || "").toLowerCase()));
        recipients = recipients.filter((r) => !already.has(r.email.toLowerCase()));
      }
    }

    const sendUrl = `${SUPABASE_URL}/functions/v1/send-transactional-email`;
    const total = recipients.length;

    const runSends = async () => {
      let sent = 0, failed = 0;
      for (const r of recipients) {
        try {
          const resp = await fetch(sendUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": authHeader,
              "apikey": ANON_KEY,
            },
            body: JSON.stringify({
              templateName: TEMPLATE_NAME,
              recipientEmail: r.email,
              idempotencyKey: r.idKey,
              replyTo: "jenna@wearetheoutdoorindustry.com",
              templateData: {
                recipientName: r.name,
                sponsors,
                edgesFirst,
              },
            }),
          });
          if (resp.ok) sent++; else failed++;
        } catch { failed++; }
      }
      console.log(`outsidedays26-thanks bulk sent=${sent} failed=${failed} total=${total}`);
    };

    // @ts-ignore
    if (mode === "all" && typeof EdgeRuntime !== "undefined" && EdgeRuntime.waitUntil) {
      // @ts-ignore
      EdgeRuntime.waitUntil(runSends());
      return json({ ok: true, mode, total, queued: true, sponsorCount: sponsors.length });
    }
    await runSends();
    return json({ ok: true, mode, total, sponsorCount: sponsors.length });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
