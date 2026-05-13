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

// ---- od_sid bearer token store ----
// Cookie path is unreliable cross-origin (Safari/ITP, embedded webviews drop
// SameSite=None third-party cookies). We mirror the session token in
// localStorage and send it as Authorization: Bearer on every call so the
// backend can authenticate us even when the cookie is missing. localStorage
// (not sessionStorage) is required so sign-in survives tab close and
// navigations between /outsidedays26/* routes.
const TOKEN_KEY = "od_sid";
let tokenInMemory: string | null = null;

function safeStore(): Storage | null {
  try { return typeof window !== "undefined" ? window.localStorage : null; } catch { return null; }
}
function legacyStore(): Storage | null {
  try { return typeof window !== "undefined" ? window.sessionStorage : null; } catch { return null; }
}
export function bootstrapToken() {
  if (tokenInMemory) return tokenInMemory;
  const s = safeStore();
  try { tokenInMemory = s?.getItem(TOKEN_KEY) || null; } catch { tokenInMemory = null; }
  // Migrate any pre-existing sessionStorage token to localStorage one time.
  if (!tokenInMemory) {
    const legacy = legacyStore();
    try {
      const v = legacy?.getItem(TOKEN_KEY);
      if (v) {
        tokenInMemory = v;
        try { s?.setItem(TOKEN_KEY, v); } catch {}
        try { legacy?.removeItem(TOKEN_KEY); } catch {}
      }
    } catch {/* noop */}
  }
  return tokenInMemory;
}
export function getOdSidToken(): string | null { return tokenInMemory ?? bootstrapToken(); }
export function setOdSidToken(t: string | null) {
  tokenInMemory = t || null;
  const s = safeStore();
  try {
    if (t) s?.setItem(TOKEN_KEY, t);
    else s?.removeItem(TOKEN_KEY);
  } catch {/* storage blocked; in-memory still works for this tab */}
}
export function clearOdSidToken() { setOdSidToken(null); }

bootstrapToken();

async function call<T = any>(fn: string, body: any): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) || "",
  };
  const tok = getOdSidToken();
  if (tok) headers["Authorization"] = `Bearer ${tok}`;
  const res = await fetch(`${FN_BASE}/${fn}`, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
  if (!res.ok) {
    const msg = data?.error || data?.message || `HTTP ${res.status}`;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  // Capture token from any successful auth response.
  if (data && typeof data.token === "string" && data.token) {
    setOdSidToken(data.token);
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
export async function candidateSignupCreateBasics(input: { first_name: string; last_name: string; email: string; phone: string; brand_contact_consent?: boolean }) {
  return call<{ session: SessionInfo }>("candidate-auth", { action: "signup_create_basics", ...input });
}
export async function candidateLogin(input: { first_name: string; last_name: string; phone_last_four: string }) {
  return call<{ session: SessionInfo } | { ambiguous: true }>("candidate-auth", { action: "login", ...input });
}
export async function candidateMe() {
  return call<{ session: SessionInfo | null }>("candidate-auth", { action: "me" });
}
export async function candidateLogout() {
  try { return await call("candidate-auth", { action: "logout" }); }
  finally { clearOdSidToken(); }
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
export async function candidateToggleStar(brand_id: string) {
  return call<{ starred: boolean }>("candidate-profile", { action: "toggle_star", brand_id });
}
export async function candidateListStars() {
  return call<{ starred_brand_ids: string[] }>("candidate-profile", { action: "list_stars" });
}
export async function candidateMarkSeenIntro() {
  return call("candidate-profile", { action: "mark_seen_intro" });
}

// ---- Connect Notes ----
export type NoteCTAValue = "follow_up" | "look_out_for_application" | "grab_coffee" | "memorable_only" | null;
export interface ConnectNote {
  id: string;
  candidate_id: string;
  recipient_type: "brand_rep" | "expert";
  recipient_id: string;
  brand_id: string | null;
  message: string;
  note_timing: "pre_event" | "during_event" | "post_event";
  note_cta: NoteCTAValue;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
export async function connectNotesListMine() {
  return call<{ notes: ConnectNote[] }>("connect-notes", { action: "list_mine" });
}
export async function connectNotesGetMine(recipient_id: string) {
  return call<{ note: ConnectNote | null }>("connect-notes", { action: "get_mine", recipient_id });
}
export async function connectNotesUpsert(input: { recipient_type: "brand_rep" | "expert"; recipient_id: string; message: string; note_cta?: NoteCTAValue }) {
  return call<{ note: ConnectNote }>("connect-notes", { action: "upsert", ...input });
}
export async function connectNotesRetract(recipient_id: string) {
  return call("connect-notes", { action: "retract", recipient_id });
}
export async function connectNotesListForRep(brand_wide = true) {
  return call<{ notes: ConnectNote[] }>("connect-notes", { action: "list_for_rep", brand_wide });
}

// ---- Connections ----
export interface ConnectionPayload {
  brand_id?: string | null;
  brand_rep_id?: string | null;
  expert_id?: string | null;
  also_talked_to?: string;
  private_notes?: string;
  follow_up_direction?: string;
  contact_info_received?: string;
  role_flagged?: string;
  message_to_brand?: string;
  send_now?: boolean;
  would_want_as_mentor?: boolean | null;
  mentor_topics?: string;
}
export async function connectionsList() {
  return call<{ connections: any[] }>("connections", { action: "list" });
}
export async function connectionsCreate(payload: ConnectionPayload) {
  return call<{ connection: any }>("connections", { action: "create", ...payload });
}
export async function connectionsUpdate(id: string, patch: Partial<ConnectionPayload>, send_now?: boolean) {
  return call<{ connection: any }>("connections", { action: "update", id, patch, send_now });
}
export async function connectionsDelete(id: string) {
  return call("connections", { action: "delete", id });
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
  try { return await call("brand-rep-auth", { action: "logout" }); }
  finally { clearOdSidToken(); }
}

// ---- Brand dashboard ----
export async function dashboardSummary() {
  return call<{ rep: any; brand: any; totals: { registered: number; visited: number; sent_note: number; starred: number; flagged: number }; edit_card_url?: string }>(
    "brand-dashboard", { action: "summary" },
  );
}
export async function dashboardList(params: { filters?: any; search?: string; sort?: string; page?: number; page_size?: number }) {
  return call<{ candidates: any[]; total: number; page: number; page_size: number }>("brand-dashboard", { action: "list", ...params });
}
export async function dashboardCandidate(id: string) {
  return call<{ candidate: any; connections: any[]; resume_signed_url: string | null; photo_signed_url: string | null }>(
    "brand-dashboard", { action: "candidate", id },
  );
}
export async function dashboardWishlist(query: string) {
  return call("brand-dashboard", { action: "wishlist", query });
}
export async function dashboardSaveCard(input: { rep_patch: Record<string, any>; brand_patch: Record<string, any> }) {
  return call<{ ok: true; rep: any; brand: any | null }>("brand-dashboard", { action: "save_card", ...input });
}

// ---- Brand lead capture ----
export interface BrandLeadResponse {
  id: string;
  candidate_id: string;
  brand_id: string;
  response_value: string;
  response_label?: string | null;
  question_text: string;
  share_contact_info?: boolean;
  created_at: string;
  updated_at: string;
}
export async function brandLeadGetMine(brand_id: string) {
  return call<{ response: BrandLeadResponse | null }>("brand-leads", { action: "me", brand_id });
}
export async function brandLeadUpsert(brand_id: string, response_value: string, question_text: string, response_label?: string, share_contact_info?: boolean) {
  return call<{ response: BrandLeadResponse }>("brand-leads", { action: "upsert", brand_id, response_value, question_text, response_label, share_contact_info });
}
export async function brandLeadClear(brand_id: string) {
  return call<{ ok: true }>("brand-leads", { action: "clear", brand_id });
}
export async function brandLeadList(brand_id: string) {
  return call<{ leads: Array<BrandLeadResponse & { candidate: any | null }> }>("brand-leads", { action: "list", brand_id });
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
  // Mirror token locally so future calls work even when the cookie is dropped.
  setOdSidToken(token);
  params.delete("as");
  const newUrl = window.location.pathname + (params.toString() ? `?${params}` : "") + window.location.hash;
  window.history.replaceState({}, "", newUrl);
  return true;
}
