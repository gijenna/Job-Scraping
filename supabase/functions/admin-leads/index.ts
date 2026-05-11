// Admin-only: returns ALL brand_lead_responses across every brand,
// regardless of lead_capture_visible_to_brand. Used by /admin/leads.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_DOMAIN = "@wearetheoutdoorindustry.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Verify admin via Supabase auth bearer token.
  const auth = req.headers.get("Authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!token) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  const { data: { user } } = await sb.auth.getUser(token);
  if (!user || !user.email?.toLowerCase().endsWith(ADMIN_DOMAIN)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const { data: leads } = await sb.from("brand_lead_responses")
    .select("id, brand_id, candidate_id, response_value, response_label, question_text, created_at, updated_at")
    .order("updated_at", { ascending: false });

  const brandIds = Array.from(new Set((leads || []).map((l: any) => l.brand_id)));
  const candIds = Array.from(new Set((leads || []).map((l: any) => l.candidate_id)));

  const [{ data: brands }, { data: cands }] = await Promise.all([
    brandIds.length
      ? sb.from("event_map_brands").select("id, name, lead_capture_visible_to_brand").in("id", brandIds)
      : Promise.resolve({ data: [] as any[] }),
    candIds.length
      ? sb.from("candidates").select("id, first_name, last_name, email, linkedin_url, current_title, current_company, photo_url").in("id", candIds)
      : Promise.resolve({ data: [] as any[] }),
  ]);

  const brandMap: Record<string, any> = {};
  for (const b of brands || []) brandMap[b.id] = b;
  const candMap: Record<string, any> = {};
  for (const c of cands || []) candMap[c.id] = c;

  const enriched = (leads || []).map((l: any) => ({
    ...l,
    brand: brandMap[l.brand_id] || null,
    candidate: candMap[l.candidate_id] || null,
  }));

  return new Response(JSON.stringify({ leads: enriched, brands: brands || [] }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
