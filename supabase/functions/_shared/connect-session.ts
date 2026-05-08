import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Credentials": "true",
  "Vary": "Origin",
};

export function corsHeadersFor(req: Request) {
  const origin = req.headers.get("Origin") || "*";
  return { ...corsHeaders, "Access-Control-Allow-Origin": origin };
}

export const SESSION_COOKIE = "od_sid";
export const SESSION_DAYS = 30;

export function admin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
}

export function readCookie(req: Request, name: string): string | null {
  const cookie = req.headers.get("cookie") || "";
  for (const part of cookie.split(/;\s*/)) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    if (part.slice(0, eq) === name) return decodeURIComponent(part.slice(eq + 1));
  }
  return null;
}

export function setSessionCookieHeader(token: string): Record<string, string> {
  const maxAge = 60 * 60 * 24 * SESSION_DAYS;
  // SameSite=None+Secure required because the SPA origin and the function origin differ.
  return {
    "Set-Cookie": `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=None`,
  };
}

export function clearSessionCookieHeader(): Record<string, string> {
  return { "Set-Cookie": `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=None` };
}

export function newToken(): string {
  const b = new Uint8Array(32);
  crypto.getRandomValues(b);
  return Array.from(b).map((x) => x.toString(16).padStart(2, "0")).join("");
}

export function lastFour(phone: string): string {
  return (phone || "").replace(/[^0-9]/g, "").slice(-4);
}

export function json(body: any, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { ...corsHeaders, "Content-Type": "application/json", ...(init.headers || {}) },
  });
}

export async function readSession(req: Request) {
  const token = readCookie(req, SESSION_COOKIE);
  if (!token) return null;
  const sb = admin();
  const { data } = await sb
    .from("user_sessions")
    .select("*")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (!data) return null;
  await sb.from("user_sessions").update({ last_seen_at: new Date().toISOString() }).eq("id", data.id);
  return data;
}

export async function createSession(subject_type: "candidate" | "brand_rep", subject_id: string) {
  const sb = admin();
  const token = newToken();
  const expires = new Date(Date.now() + SESSION_DAYS * 86400 * 1000).toISOString();
  await sb.from("user_sessions").insert({ token, subject_type, subject_id, expires_at: expires });
  return token;
}
