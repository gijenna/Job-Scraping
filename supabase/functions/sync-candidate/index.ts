// Syncs candidates table rows to a Google Sheet ("Connect Candidates" tab).
// Mirrors the auth + sheet pattern of sync-expert. Reuses GOOGLE_SERVICE_ACCOUNT_KEY.
//
// Actions:
//   POST { id }                        -> upsert one candidate (lookup, fetch fresh from DB, write row)
//   POST { action: "backfill" }        -> overwrite header + all candidates ordered by created_at asc
//
// Never throws to caller (fire-and-forget); always returns 200 with results object.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SPREADSHEET_ID = "1nU5woNdcsmEIv62Doo6vboCZ7sR-mU3XXbEN1u_cFcM";
const TAB_NAME = "Connect Candidates";

const HEADERS = [
  "ID","Created At","Updated At","First Name","Last Name","Email","Phone","Phone Last Four",
  "Photo URL","Resume URL","LinkedIn URL","Portfolio URL",
  "Poachable Status","Career Stage","Field","Focus","Years In Current Field",
  "The Hook","The Pitch","Current Title","Current Company","Dream Role Title",
  "Job Types Seeking","Current Location","Current State","Current City","Open To Relocation","Relocation Locations","Relocation States","Relocation Cities","Open To Anywhere",
  "Remote Preference","Areas Of Expertise","Dream Companies","Niche Experience",
  "Total Years Professional","Outdoor Industry Experience","Outdoor Industry Years",
  "Management Experience","Management Years","Min Pay Rate","Workplace Type Preference",
  "Open To Retail",
  "Brand Contact Consent","Data Portability Consent","Welcome Email Sent At","Profile Completeness Score",
  "Connections Count","Starred Brands Count","Lead Responses Count","Notes Sent Count",
];

async function getGoogleAccessToken(serviceAccount: any): Promise<string> {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };
  const enc = (o: any) => btoa(JSON.stringify(o)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const unsigned = `${enc(header)}.${enc(claim)}`;
  const pem = serviceAccount.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\n/g, "");
  const bin = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey("pkcs8", bin, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const jwt = `${unsigned}.${sigB64}`;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Google token error: ${JSON.stringify(data)}`);
  return data.access_token;
}

function parseServiceAccount(raw: string): any {
  let s = raw.trim().replace(/^\uFEFF/, "");
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) s = s.slice(1, -1);
  const a = s.indexOf("{"); const b = s.lastIndexOf("}");
  if (a !== -1 && b !== -1) s = s.slice(a, b + 1);
  let sa: any;
  try { sa = JSON.parse(s); } catch { sa = JSON.parse(atob(raw.trim())); }
  if (sa.private_key && !sa.private_key.includes("\n")) sa.private_key = sa.private_key.replace(/\\n/g, "\n");
  return sa;
}

function flattenList(v: any): string {
  if (!v) return "";
  if (Array.isArray(v)) return v.map((x) => (typeof x === "string" ? x : (x?.name || x?.label || JSON.stringify(x)))).filter(Boolean).join(", ");
  return String(v);
}

function flattenNiche(v: any): string {
  if (!Array.isArray(v)) return "";
  return v
    .map((x: any) => {
      if (typeof x === "string") return x;
      const name = x?.name || x?.label || x?.niche || "";
      const yrs = x?.years ?? x?.years_experience ?? x?.yrs;
      return name ? (yrs ? `${name} (${yrs})` : name) : "";
    })
    .filter(Boolean)
    .join(", ");
}

function flattenDreamCompanies(v: any): string {
  if (!Array.isArray(v)) return "";
  return v.map((x: any) => (typeof x === "string" ? x : (x?.name || ""))).filter(Boolean).join(", ");
}

async function buildRow(sb: any, c: any): Promise<any[]> {
  const [conns, starred, leads, notes] = await Promise.all([
    sb.from("connections").select("id", { count: "exact", head: true }).eq("candidate_id", c.id),
    sb.from("candidate_starred_brands").select("id", { count: "exact", head: true }).eq("candidate_id", c.id),
    sb.from("brand_lead_responses").select("id", { count: "exact", head: true }).eq("candidate_id", c.id),
    sb.from("connections").select("id", { count: "exact", head: true }).eq("candidate_id", c.id).not("message_sent_at", "is", null),
  ]);
  return [
    c.id, c.created_at || "", c.updated_at || "",
    c.first_name || "", c.last_name || "", c.email || "", c.phone || "", c.phone_last_four || "",
    c.photo_url || "", c.resume_url || "", c.linkedin_url || "", c.portfolio_url || "",
    c.poachable_status || "", c.career_stage || "", c.field || "", c.focus || "",
    c.years_in_current_field ?? "",
    c.the_hook || "", c.the_pitch || "", c.current_title || "", c.current_company || "", c.dream_role_title || "",
    flattenList(c.job_types_seeking),
    c.current_location || "",
    c.current_state || "",
    c.current_city || "",
    c.open_to_relocation === true ? "Yes" : c.open_to_relocation === false ? "No" : "",
    c.relocation_locations || "",
    Array.isArray(c.relocation_states) ? c.relocation_states.join(", ") : "",
    c.relocation_cities || "",
    c.open_to_anywhere === true ? "Yes" : c.open_to_anywhere === false ? "No" : "",
    c.remote_preference || "",
    flattenList(c.areas_of_expertise),
    flattenDreamCompanies(c.dream_companies),
    flattenNiche(c.niche_experience),
    c.total_years_professional ?? "",
    c.outdoor_industry_experience === true ? "Yes" : c.outdoor_industry_experience === false ? "No" : "",
    c.outdoor_industry_years ?? "",
    c.management_experience === true ? "Yes" : c.management_experience === false ? "No" : "",
    c.management_years ?? "",
    c.min_pay_rate || "",
    flattenList(c.workplace_type_preference),
    c.open_to_retail === true ? "Yes" : c.open_to_retail === false ? "No" : "",
    c.brand_contact_consent === true ? "Yes" : "No",
    c.data_portability_consent === true ? "Yes" : "No",
    c.welcome_email_sent_at || "",
    c.profile_completeness_score ?? "",
    conns.count ?? 0,
    starred.count ?? 0,
    leads.count ?? 0,
    notes.count ?? 0,
  ];
}

async function findRowByIdColumn(token: string, id: string): Promise<number | null> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(TAB_NAME + "!A:A")}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`read A:A failed ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const rows: string[][] = data.values || [];
  for (let i = 0; i < rows.length; i++) {
    if ((rows[i]?.[0] || "") === id) return i + 1; // 1-indexed
  }
  return null;
}

async function writeHeaderIfNeeded(token: string): Promise<void> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(TAB_NAME + "!A1:1")}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return;
  const data = await res.json();
  const have: string[] = (data.values || [])[0] || [];
  if (have.length === HEADERS.length && have.every((h, i) => h === HEADERS[i])) return;
  const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(TAB_NAME + "!A1")}?valueInputOption=RAW`;
  await fetch(updateUrl, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ values: [HEADERS] }),
  });
}

async function updateRow(token: string, rowNum: number, values: any[]): Promise<void> {
  const range = `${TAB_NAME}!A${rowNum}`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ values: [values] }),
  });
  if (!res.ok) throw new Error(`update row ${rowNum} failed ${res.status}: ${await res.text()}`);
}

async function appendRow(token: string, values: any[]): Promise<void> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(TAB_NAME + "!A1")}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ values: [values] }),
  });
  if (!res.ok) throw new Error(`append failed ${res.status}: ${await res.text()}`);
}

async function clearAllExceptHeader(token: string): Promise<void> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(TAB_NAME + "!A2:ZZ")}:clear`;
  await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const result: any = {};
  try {
    const body = await req.json().catch(() => ({}));
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

    const saKey = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
    if (!saKey) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY not configured");
    const sa = parseServiceAccount(saKey);
    const token = await getGoogleAccessToken(sa);

    await writeHeaderIfNeeded(token);

    if (body.action === "backfill") {
      const { data: all, error } = await sb.from("candidates").select("*").order("created_at", { ascending: true });
      if (error) throw new Error(error.message);
      await clearAllExceptHeader(token);
      const rows: any[][] = [];
      for (const c of all || []) rows.push(await buildRow(sb, c));
      if (rows.length) {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(TAB_NAME + "!A2")}?valueInputOption=USER_ENTERED`;
        const res = await fetch(url, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ values: rows }),
        });
        if (!res.ok) throw new Error(`backfill write failed ${res.status}: ${await res.text()}`);
      }
      result.backfilled = rows.length;
      return new Response(JSON.stringify({ success: true, ...result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Single upsert by id
    const id = body.id || body.candidate_id;
    if (!id) throw new Error("Missing id");
    const { data: c, error } = await sb.from("candidates").select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    if (!c) throw new Error(`Candidate ${id} not found`);
    const row = await buildRow(sb, c);
    const existing = await findRowByIdColumn(token, id);
    if (existing) {
      await updateRow(token, existing, row);
      result.action = "updated";
      result.row = existing;
    } else {
      await appendRow(token, row);
      result.action = "appended";
    }
    return new Response(JSON.stringify({ success: true, ...result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("sync-candidate error:", err?.message || err);
    return new Response(JSON.stringify({ success: false, error: err?.message || String(err) }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
