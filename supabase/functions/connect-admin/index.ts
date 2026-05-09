// Connect admin analytics dispatcher. Auth: Supabase admin user (approved email/domain).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const ADMIN_EMAILS = (Deno.env.get("ADMIN_EMAIL") || "")
  .split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
const ADMIN_DOMAINS = ["wearetheoutdoorindustry.com"];

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
    const email = userData.user.email.trim().toLowerCase();
    const domain = email.split("@").pop() || "";
    if (!(ADMIN_EMAILS.includes(email) || ADMIN_DOMAINS.includes(domain))) {
      return json({ error: "forbidden" }, 403);
    }

    const sb = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });

    // ── Notes
    const { data: notes } = await sb.from("connect_notes")
      .select("id, brand_id, recipient_id, recipient_type, candidate_id, note_timing, is_active, created_at")
      .eq("is_active", true);

    // ── Stars
    const { data: stars } = await sb.from("candidate_starred_brands")
      .select("id, brand_id, candidate_id, created_at");

    // ── Connections
    const { count: connectionsCount } = await sb.from("connections")
      .select("id", { count: "exact", head: true });

    // ── Candidates total + signup mode breakdown
    const { count: candidatesCount } = await sb.from("candidates")
      .select("id", { count: "exact", head: true });
    const { data: candidateModes } = await sb.from("candidates").select("signup_mode");

    // ── Brands lookup for top lists
    const { data: brands } = await sb.from("event_map_brands")
      .select("id, name, logo_url").eq("event_slug", "denver26");
    const brandMap = new Map((brands || []).map((b) => [b.id, b]));

    // Aggregate notes by timing
    const notesByTiming = { pre_event: 0, during_event: 0, post_event: 0 };
    const notesByBrand = new Map<string, number>();
    const candidatesWhoSentNotes = new Set<string>();
    for (const n of notes || []) {
      if (n.note_timing in notesByTiming) (notesByTiming as any)[n.note_timing]++;
      if (n.brand_id) notesByBrand.set(n.brand_id, (notesByBrand.get(n.brand_id) || 0) + 1);
      if (n.candidate_id) candidatesWhoSentNotes.add(n.candidate_id);
    }

    const starsByBrand = new Map<string, number>();
    const candidatesWhoStarred = new Set<string>();
    for (const s of stars || []) {
      if (s.brand_id) starsByBrand.set(s.brand_id, (starsByBrand.get(s.brand_id) || 0) + 1);
      if (s.candidate_id) candidatesWhoStarred.add(s.candidate_id);
    }

    const topBy = (m: Map<string, number>, n: number) =>
      [...m.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, n)
        .map(([id, count]) => ({
          brand_id: id,
          name: brandMap.get(id)?.name || "Unknown",
          logo_url: brandMap.get(id)?.logo_url || null,
          count,
        }));

    const signupModes: Record<string, number> = {};
    for (const c of candidateModes || []) {
      const k = c.signup_mode || "unknown";
      signupModes[k] = (signupModes[k] || 0) + 1;
    }

    return json({
      totals: {
        candidates: candidatesCount || 0,
        connections: connectionsCount || 0,
        notes: (notes || []).length,
        stars: (stars || []).length,
        candidates_who_sent_notes: candidatesWhoSentNotes.size,
        candidates_who_starred: candidatesWhoStarred.size,
      },
      notes_by_timing: notesByTiming,
      signup_modes: signupModes,
      top_brands_by_notes: topBy(notesByBrand, 10),
      top_brands_by_stars: topBy(starsByBrand, 10),
    });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
