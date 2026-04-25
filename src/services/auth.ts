// Single source of truth for afterparty identity verification.
// Components must only call: requestPin, verifyPin, getSession, clearSession.
// The PIN delivery channel (email today, SMS tomorrow) lives entirely inside this file
// and the matching edge functions.

import { supabase } from "@/integrations/supabase/client";

export interface RequestPinResult {
  ok: boolean;
  masked_email?: string | null;
  reason?: "no_email" | "locked" | "email_failed" | "server_error" | "bad_request";
}

export interface VerifyPinResult {
  ok: boolean;
  attendee_id?: string;
  reason?: "invalid" | "locked" | "no_phone" | "session_failed" | "server_error";
}

export interface AfterPartySession {
  attendeeId: string;
  authUserId: string;
  email: string | null;
}

export async function requestPin(slug: string): Promise<RequestPinResult> {
  const { data, error } = await supabase.functions.invoke("request-pin", { body: { slug } });
  if (error) {
    // Edge function returned non-2xx, body is in error.context if present.
    const ctx = (error as any)?.context;
    if (ctx?.reason) return { ok: false, reason: ctx.reason };
    return { ok: false, reason: "server_error" };
  }
  return data as RequestPinResult;
}

export async function verifyPin(slug: string, pin: string): Promise<VerifyPinResult> {
  const { data, error } = await supabase.functions.invoke("verify-pin", { body: { slug, pin } });
  if (error || !data?.ok) {
    return { ok: false, reason: (data?.reason || "invalid") as VerifyPinResult["reason"] };
  }
  const { access_token, refresh_token, attendee_id } = data as {
    access_token: string;
    refresh_token: string;
    attendee_id: string;
  };
  const { error: setErr } = await supabase.auth.setSession({ access_token, refresh_token });
  if (setErr) {
    return { ok: false, reason: "session_failed" };
  }
  return { ok: true, attendee_id };
}

// Phone-based: identifies attendee by slug, verifies last 4 digits of phone on file.
export async function verifyPhonePin(slug: string, pin: string): Promise<VerifyPinResult> {
  const { data, error } = await supabase.functions.invoke("verify-phone-pin", { body: { slug, pin } });
  if (error || !data?.ok) {
    const ctx = (error as any)?.context;
    return { ok: false, reason: (data?.reason || ctx?.reason || "invalid") as VerifyPinResult["reason"] };
  }
  const { access_token, refresh_token, attendee_id } = data as {
    access_token: string;
    refresh_token: string;
    attendee_id: string;
  };
  const { error: setErr } = await supabase.auth.setSession({ access_token, refresh_token });
  if (setErr) return { ok: false, reason: "session_failed" };
  return { ok: true, attendee_id };
}

export async function getSession(): Promise<AfterPartySession | null> {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  if (!session?.user) return null;
  const meta = (session.user.user_metadata || {}) as Record<string, unknown>;
  const attendeeId = typeof meta.attendee_id === "string" ? meta.attendee_id : null;
  if (!attendeeId) return null;
  return {
    attendeeId,
    authUserId: session.user.id,
    email: session.user.email ?? null,
  };
}

export async function clearSession(): Promise<void> {
  await supabase.auth.signOut();
}
