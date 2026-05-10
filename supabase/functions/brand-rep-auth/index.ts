import {
  admin, corsHeadersFor, jsonFor, readSession, createSession, setSessionCookieHeader,
  clearSessionCookieHeader, lastFour,
} from "../_shared/connect-session.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeadersFor(req) });

  let body: any;
  try { body = await req.json(); } catch { return jsonFor(req, { error: "Invalid JSON" }, { status: 400 }); }
  const { action } = body || {};
  const sb = admin();

  try {
    // Find brand reps by full name (case insensitive). Brand reps are
    // industry_experts where expert_type='brand_rep' on at least one assignment.
    async function findReps(first_name: string, last_name: string) {
      const fullName = `${first_name.trim()} ${last_name.trim()}`;
      const { data: experts } = await sb
        .from("industry_experts")
        .select("id, full_name, phone, phone_last_four, photo_url, current_company, job_title")
        .ilike("full_name", fullName);
      if (!experts || experts.length === 0) return [];
      const ids = experts.map((e: any) => e.id);
      const { data: assigns } = await sb
        .from("expert_city_assignments")
        .select("expert_id, expert_type")
        .in("expert_id", ids)
        .eq("expert_type", "brand_rep");
      const repIds = new Set((assigns || []).map((a: any) => a.expert_id));
      return experts.filter((e: any) => repIds.has(e.id));
    }

    const isMissing = (r: any) => !r.phone || !r.phone_last_four || String(r.phone_last_four).trim() === "";

    if (action === "lookup") {
      const { first_name, last_name } = body;
      if (!first_name || !last_name) return jsonFor(req, { error: "first_name and last_name required" }, { status: 400 });
      const reps = await findReps(first_name, last_name);
      if (reps.length === 0) return jsonFor(req, { found: false });
      if (reps.length === 1) {
        const rep = reps[0];
        if (isMissing(rep)) return jsonFor(req, { found: true, needs_phone: true, rep_id: rep.id });
        return jsonFor(req, { found: true, needs_phone: false, rep_id: rep.id });
      }
      // Multiple reps with same name: still ok if all have phones + last4
      const anyMissing = reps.some(isMissing);
      if (anyMissing) return jsonFor(req, { found: true, needs_phone: true, ambiguous: true, rep_id: reps.find(isMissing)!.id });
      return jsonFor(req, { found: true, needs_phone: false, ambiguous: true });
    }

    if (action === "add_phone") {
      const { rep_id, phone } = body;
      if (!rep_id || !phone) return jsonFor(req, { error: "rep_id and phone required" }, { status: 400 });
      const cleaned = phone.replace(/[^0-9+]/g, "");
      const digits = cleaned.replace(/[^0-9]/g, "");
      if (digits.length < 10) return jsonFor(req, { error: "Phone number too short" }, { status: 400 });
      const { data: rep, error } = await sb
        .from("industry_experts")
        .update({ phone: cleaned, phone_last_four: lastFour(digits) })
        .eq("id", rep_id)
        .select("*")
        .single();
      if (error) return jsonFor(req, { error: error.message }, { status: 400 });
      const token = await createSession("brand_rep", rep.id);
      return jsonFor(req, { session: { subject_type: "brand_rep", subject: rep }, token }, { headers: setSessionCookieHeader(token) });
    }

    if (action === "login") {
      const { first_name, last_name, phone_last_four } = body;
      if (!first_name || !last_name || !phone_last_four) {
        return jsonFor(req, { error: "first_name, last_name, phone_last_four required" }, { status: 400 });
      }
      const reps = await findReps(first_name, last_name);
      const wanted = lastFour(phone_last_four);
      const matches = reps.filter((r: any) => lastFour(String(r.phone_last_four ?? "")) === wanted);
      if (matches.length === 0) return jsonFor(req, { session: null });
      if (matches.length > 1) return jsonFor(req, { ambiguous: true });
      const rep = matches[0];
      const token = await createSession("brand_rep", rep.id);
      return jsonFor(req, { session: { subject_type: "brand_rep", subject: rep }, token }, { headers: setSessionCookieHeader(token) });
    }

    if (action === "me") {
      const sess = await readSession(req);
      if (!sess || sess.subject_type !== "brand_rep") return jsonFor(req, { session: null });
      const { data } = await sb.from("industry_experts").select("*").eq("id", sess.subject_id).maybeSingle();
      if (!data) return jsonFor(req, { session: null });
      return jsonFor(req, { session: { subject_type: "brand_rep", subject: data } });
    }

    if (action === "logout") {
      const sess = await readSession(req);
      if (sess) await sb.from("user_sessions").delete().eq("id", sess.id);
      return jsonFor(req, { ok: true }, { headers: clearSessionCookieHeader() });
    }

    return jsonFor(req, { error: "Unknown action" }, { status: 400 });
  } catch (e) {
    return jsonFor(req, { error: (e as Error).message }, { status: 500 });
  }
});
