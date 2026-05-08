// Custom session helper for /outsidedays26/connect and /outsidedays26/dashboard.
// Sessions live as a Secure cookie (`od_sid`) set by edge functions; we mirror
// the value in a non-storage in-memory map so SPA navigations can read it
// without bouncing through the network. Per project rules: NO localStorage / sessionStorage.

import { supabase } from "@/integrations/supabase/client";

const FN_BASE = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1`;

export type SubjectType = "candidate" | "brand_rep";

export interface SessionInfo {
  subject_type: SubjectType;
  subject: any; // candidate or industry_experts row
  impersonated?: boolean;
}

async function call<T = any>(fn: string, body: any): Promise<T> {
  const res = await fetch(`${FN_BASE}/${fn}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      apikey: (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) || "",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
  if (!res.ok) {
    const msg = data?.error || data?.message || `HTTP ${res.status}`;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  return data as T;
}

// ---- Candidate auth ----
export async function candidateSignupLookup(input: { first_name: string; last_name: string; email: string }) {
  return call<{ exists: boolean }>("candidate-auth", { action: "signup_lookup", ...input });
}
export async function candidateSignupCreate(input: any) {
  return call<{ session: SessionInfo }>("candidate-auth", { action: "signup_create", ...input });
}
export async function candidateLogin(input: { first_name: string; last_name: string; phone_last_four: string }) {
  return call<{ session: SessionInfo } | { ambiguous: true }>("candidate-auth", { action: "login", ...input });
}
export async function candidateMe() {
  return call<{ session: SessionInfo | null }>("candidate-auth", { action: "me" });
}
export async function candidateLogout() {
  return call("candidate-auth", { action: "logout" });
}
export async function candidateUpdateProfile(patch: Record<string, any>) {
  return call<{ candidate: any }>("candidate-profile", { action: "update", patch });
}
export async function candidateUploadSignedUrl(kind: "photo" | "resume", filename: string, content_type: string) {
  return call<{ upload_url: string; storage_path: string }>("candidate-profile", {
    action: "upload_signed_url", kind, filename, content_type,
  });
}
export async function candidateAttachUpload(kind: "photo" | "resume", storage_path: string) {
  return call<{ candidate: any; signed_url: string | null }>("candidate-profile", {
    action: "attach_upload", kind, storage_path,
  });
}

// ---- Brand rep auth ----
export async function brandRepLookup(input: { first_name: string; last_name: string }) {
  return call<{ found: boolean; needs_phone?: boolean; rep_id?: string; ambiguous?: boolean }>(
    "brand-rep-auth", { action: "lookup", ...input },
  );
}
export async function brandRepAddPhoneAndLogin(input: { rep_id: string; phone: string }) {
  return call<{ session: SessionInfo }>("brand-rep-auth", { action: "add_phone", ...input });
}
export async function brandRepLogin(input: { first_name: string; last_name: string; phone_last_four: string }) {
  return call<{ session: SessionInfo } | { ambiguous: true }>("brand-rep-auth", { action: "login", ...input });
}
export async function brandRepMe() {
  return call<{ session: SessionInfo | null }>("brand-rep-auth", { action: "me" });
}
export async function brandRepLogout() {
  return call("brand-rep-auth", { action: "logout" });
}

// ---- Admin impersonation ----
// Called by admin tools. Returns a one-time URL that includes ?as=<token>.
export async function adminMintImpersonation(input: { subject_type: SubjectType; lookup: string }) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Admin not signed in");
  const res = await fetch(`${FN_BASE}/admin-impersonate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) || "",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ url: string; token: string }>;
}

// On any /outsidedays26/connect or /dashboard load, if `?as=<token>` is in the URL,
// hand it to the auth function which will set the cookie and clear the param.
export async function consumeImpersonationToken(): Promise<boolean> {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("as");
  if (!token) return false;
  await fetch(`${FN_BASE}/admin-impersonate?action=consume`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      apikey: (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) || "",
    },
    body: JSON.stringify({ token }),
  });
  params.delete("as");
  const newUrl = window.location.pathname + (params.toString() ? `?${params}` : "") + window.location.hash;
  window.history.replaceState({}, "", newUrl);
  return true;
}
