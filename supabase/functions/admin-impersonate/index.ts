import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  admin, corsHeadersFor, jsonFor, createSession, setSessionCookieHeader,
} from "../_shared/connect-session.ts";

const ADMIN_DOMAIN = "@wearetheoutdoorindustry.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeadersFor(req) });

  let body: any;
  try { body = await req.json(); } catch { return jsonFor(req, { error: "Invalid JSON" }, { status: 400 }); }

  const url = new URL(req.url);
  const isConsume = url.searchParams.get("action") === "consume";

  // ---- consume: take the ?as token, set the session cookie ----
  if (isConsume) {
    const sb = admin();
    const { token } = body;
    if (!token) return jsonFor(req, { error: "token required" }, { status: 400 });
    const { data, error } = await sb
      .from("user_sessions")
      .select("*")
      .eq("token", token)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();
    if (error || !data) return jsonFor(req, { error: "Invalid or expired token" }, { status: 400 });
    return jsonFor(req, { ok: true, subject_type: data.subject_type }, { headers: setSessionCookieHeader(token) });
  }

  // ---- mint: requires admin JWT ----
  const authHeader = req.headers.get("authorization") || "";
  const jwt = authHeader.replace(/^Bearer\s+/i, "");
  if (!jwt) return jsonFor(req, { error: "Admin auth required" }, { status: 401 });
  const userClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
    auth: { persistSession: false },
  });
  const { data: { user } } = await userClient.auth.getUser();
  if (!user || !user.email || !user.email.toLowerCase().endsWith(ADMIN_DOMAIN)) {
    return jsonFor(req, { error: "Admin auth required" }, { status: 403 });
  }

  const sb = admin();
  const { subject_type, lookup } = body;
  if (subject_type !== "candidate" && subject_type !== "brand_rep") {
    return jsonFor(req, { error: "subject_type must be 'candidate' or 'brand_rep'" }, { status: 400 });
  }
  if (!lookup) return jsonFor(req, { error: "lookup required (email or full name)" }, { status: 400 });

  let subjectId: string | null = null;
  if (subject_type === "candidate") {
    const { data } = await sb.from("candidates").select("id").ilike("email", lookup).maybeSingle();
    subjectId = data?.id || null;
  } else {
    const { data } = await sb.from("industry_experts").select("id").ilike("full_name", lookup).maybeSingle();
    subjectId = data?.id || null;
  }
  if (!subjectId) return jsonFor(req, { error: "Subject not found" }, { status: 404 });

  const token = await createSession(subject_type, subjectId);
  await sb.from("admin_action_log").insert({
    action: "impersonate",
    actor_email: user.email,
    payload: { subject_type, subject_id: subjectId },
  });

  const targetPath = subject_type === "candidate" ? "/outsidedays26/connect" : "/outsidedays26/dashboard";
  const url2 = new URL(req.headers.get("origin") || "https://basecampoutdoorevents.com");
  url2.pathname = targetPath;
  url2.searchParams.set("as", token);
  return jsonFor(req, { url: url2.toString(), token });
});
