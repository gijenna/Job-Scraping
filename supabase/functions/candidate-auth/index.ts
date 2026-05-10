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
    if (action === "signup_lookup") {
      const { email } = body;
      if (!email) return jsonFor(req, { error: "email required" }, { status: 400 });
      const { data } = await sb.from("candidates").select("id").ilike("email", email).maybeSingle();
      return jsonFor(req, { exists: !!data });
    }

    if (action === "signup_create_basics") {
      // Lightweight signup. Only the four basics. Lets candidate save and
      // upload a photo before completing the full required profile.
      const required = ["first_name", "last_name", "email", "phone"];
      for (const k of required) {
        if (!body[k] || String(body[k]).trim() === "") {
          return jsonFor(req, { error: `Missing required field: ${k}` }, { status: 400 });
        }
      }
      const { data: existing } = await sb.from("candidates").select("id").ilike("email", body.email).maybeSingle();
      if (existing) return jsonFor(req, { error: "Email already registered. Try signing in." }, { status: 409 });

      const insertable: any = {
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        phone: body.phone,
        phone_last_four: lastFour(body.phone),
        signup_mode: "basics",
      };
      const { data, error } = await sb.from("candidates").insert(insertable).select("*").single();
      if (error) return jsonFor(req, { error: error.message }, { status: 400 });

      const token = await createSession("candidate", data.id);
      return jsonFor(req, { session: { subject_type: "candidate", subject: data }, token }, { headers: setSessionCookieHeader(token) });
    }

    if (action === "signup_create") {
      const required = ["first_name","last_name","email","phone","poachable_status","career_stage","field","focus","years_in_current_field","the_hook"];
      for (const k of required) {
        if (body[k] === undefined || body[k] === null || body[k] === "") {
          return jsonFor(req, { error: `Missing required field: ${k}` }, { status: 400 });
        }
      }
      if ((body.the_hook as string).length > 100) return jsonFor(req, { error: "The Hook must be 100 chars or less" }, { status: 400 });

      // Reject if email already taken
      const { data: existing } = await sb.from("candidates").select("id").ilike("email", body.email).maybeSingle();
      if (existing) return jsonFor(req, { error: "Email already registered. Try signing in." }, { status: 409 });

      const insertable: any = {};
      for (const k of [
        "first_name","last_name","email","phone","photo_url","poachable_status","career_stage",
        "field","focus","years_in_current_field","the_hook","current_title","current_company",
        "linkedin_url","dream_role_title","job_types_seeking","current_location","open_to_relocation",
        "relocation_locations","remote_preference","areas_of_expertise","dream_companies",
        "niche_experience","the_pitch","resume_url","prior_careers","total_years_professional",
        "outdoor_industry_experience","outdoor_industry_years","management_experience",
        "management_years","min_pay_rate","portfolio_url","workplace_type_preference",
        "signup_mode","field_other",
      ]) if (body[k] !== undefined) insertable[k] = body[k];

      const { data, error } = await sb.from("candidates").insert(insertable).select("*").single();
      if (error) return jsonFor(req, { error: error.message }, { status: 400 });

      const token = await createSession("candidate", data.id);
      return jsonFor(req, { session: { subject_type: "candidate", subject: data }, token }, { headers: setSessionCookieHeader(token) });
    }

    if (action === "login") {
      const { first_name, last_name, phone_last_four } = body;
      if (!first_name || !last_name || !phone_last_four) {
        return jsonFor(req, { error: "first_name, last_name, phone_last_four required" }, { status: 400 });
      }
      const last4 = lastFour(phone_last_four);
      const { data, error } = await sb
        .from("candidates")
        .select("*")
        .ilike("first_name", first_name.trim())
        .ilike("last_name", last_name.trim())
        .eq("phone_last_four", last4);
      if (error) return jsonFor(req, { error: error.message }, { status: 500 });
      if (!data || data.length === 0) return jsonFor(req, { session: null });
      if (data.length > 1) return jsonFor(req, { ambiguous: true });

      const candidate = data[0];
      const token = await createSession("candidate", candidate.id);
      return jsonFor(req, { session: { subject_type: "candidate", subject: candidate }, token }, { headers: setSessionCookieHeader(token) });
    }

    if (action === "me") {
      const sess = await readSession(req);
      if (!sess || sess.subject_type !== "candidate") return jsonFor(req, { session: null });
      const { data } = await sb.from("candidates").select("*").eq("id", sess.subject_id).maybeSingle();
      if (!data) return jsonFor(req, { session: null });
      return jsonFor(req, { session: { subject_type: "candidate", subject: data } });
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
