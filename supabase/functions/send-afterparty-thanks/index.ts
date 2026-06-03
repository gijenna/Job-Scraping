// Sends the "afterparty thank-you + giveaway" email to all checked-in attendees with an email.
// Admin-only. Two modes:
//   { mode: "test" }  -> sends only to TEST_RECIPIENT
//   { mode: "all"  }  -> sends to every distinct checked-in attendee email
// Uses send-transactional-email under the hood (queueing, suppression, unsubscribe footer all handled).

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
const TEMPLATE_CHECKEDIN = "afterparty-thanks-giveaway";
const TEMPLATE_APOLOGY = "afterparty-apology-giveaway";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

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
    const variant = body?.variant === "apology" ? "apology" : "checkedin";
    const eventPhotos = Array.isArray(body?.eventPhotos) ? body.eventPhotos : [];
    const templateName = variant === "apology" ? TEMPLATE_APOLOGY : TEMPLATE_CHECKEDIN;
    const idPrefix = variant === "apology" ? "afterparty-apology" : "afterparty-thanks";

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Build recipient list
    let recipients: { email: string; name: string; idKey: string }[] = [];

    if (mode === "test") {
      recipients = [{ email: TEST_RECIPIENT, name: "Jenna", idKey: `${idPrefix}-test-${Date.now()}` }];
    } else {
      let query = admin
        .from("afterparty_attendees")
        .select("id, full_name, email, checked_in_at")
        .not("email", "is", null);
      if (variant === "apology") {
        query = query.is("checked_in_at", null);
      } else {
        query = query.not("checked_in_at", "is", null);
      }
      const { data, error } = await query;
      if (error) return json({ error: error.message }, 500);

      const seen = new Set<string>();
      for (const a of (data as any[]) || []) {
        const email = (a.email || "").trim().toLowerCase();
        if (!email || seen.has(email)) continue;
        seen.add(email);
        recipients.push({
          email,
          name: a.full_name || "there",
          idKey: `${idPrefix}-${a.id}`,
        });
      }
    }

    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const r of recipients) {
      const { error } = await admin.functions.invoke("send-transactional-email", {
        body: {
          templateName,
          recipientEmail: r.email,
          idempotencyKey: r.idKey,
          replyTo: "jenna@wearetheoutdoorindustry.com",
          templateData: { recipientName: r.name, eventPhotos },
        },
      });
      if (error) {
        failed++;
        if (errors.length < 5) errors.push(`${r.email}: ${error.message}`);
      } else {
        sent++;
      }
    }

    return json({ ok: true, mode, variant, total: recipients.length, sent, failed, errors });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
