import {
  admin, corsHeadersFor, jsonFor, readSession, createSession, setSessionCookieHeader,
  clearSessionCookieHeader, lastFour,
} from "../_shared/connect-session.ts";

const CONNECT_URL = "https://basecampoutdoorevents.com/outsidedays26/connect";

async function fireWelcomeEmail(candidate: { id: string; first_name: string; email: string | null }) {
  if (!candidate?.email) return;
  try {
    const url = `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-db-template-email`;
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
      body: JSON.stringify({
        template_key: "candidate_welcome",
        to: candidate.email,
        variables: {
          first_name: candidate.first_name || "there",
          connect_url: CONNECT_URL,
          idempotency_key: `candidate_welcome:${candidate.id}`,
        },
      }),
    });
  } catch (e) {
    console.error("candidate welcome email failed", e);
  }
}

async function fireSheetSync(candidateId: string) {
  try {
    const url = `${Deno.env.get("SUPABASE_URL")}/functions/v1/sync-candidate`;
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
      body: JSON.stringify({ id: candidateId }),
    });
  } catch (e) {
    console.error("candidate sheet sync failed", e);
  }
}

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
        signup_mode: "basics",
        data_portability_consent: !!body.data_portability_consent,
      };
      if (body.open_to_retail === true || body.open_to_retail === false) {
        insertable.open_to_retail = body.open_to_retail;
      }
      if (body.brand_contact_consent === true || body.brand_contact_consent === false) {
        insertable.brand_contact_consent = body.brand_contact_consent;
      }
      const { data, error } = await sb.from("candidates").insert(insertable).select("*").single();
      if (error) return jsonFor(req, { error: error.message }, { status: 400 });

      // Fire welcome email asynchronously, never block signup.
      // @ts-ignore EdgeRuntime is available in Supabase edge runtime
      const wait = (globalThis as any).EdgeRuntime?.waitUntil;
      const p = fireWelcomeEmail({ id: data.id, first_name: data.first_name, email: data.email });
      if (wait) wait(p); else p.catch(() => {});
      const ps = fireSheetSync(data.id);
      if (wait) wait(ps); else ps.catch(() => {});

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
        "signup_mode","field_other","data_portability_consent","open_to_retail","brand_contact_consent",
      ]) if (body[k] !== undefined) insertable[k] = body[k];


      const { data, error } = await sb.from("candidates").insert(insertable).select("*").single();
      if (error) return jsonFor(req, { error: error.message }, { status: 400 });

      // Fire welcome email asynchronously, never block signup.
      // @ts-ignore EdgeRuntime is available in Supabase edge runtime
      const wait = (globalThis as any).EdgeRuntime?.waitUntil;
      const p = fireWelcomeEmail({ id: data.id, first_name: data.first_name, email: data.email });
      if (wait) wait(p); else p.catch(() => {});

      const token = await createSession("candidate", data.id);
      return jsonFor(req, { session: { subject_type: "candidate", subject: data }, token }, { headers: setSessionCookieHeader(token) });
    }

    if (action === "login") {
      const { first_name, last_name, phone_last_four } = body;
      if (!first_name || !last_name || !phone_last_four) {
        return jsonFor(req, { error: "first_name, last_name, phone_last_four required" }, { status: 400 });
      }
      const last4 = lastFour(phone_last_four);
      const { data: rows, error } = await sb
        .from("candidates")
        .select("*")
        .ilike("first_name", first_name.trim())
        .ilike("last_name", last_name.trim());
      if (error) return jsonFor(req, { error: error.message }, { status: 500 });
      // Normalize stored value with lastFour as well so legacy rows missing
      // a leading zero (e.g. "217") still match against "0217".
      const data = (rows || []).filter((c: any) => lastFour(String(c.phone_last_four ?? c.phone ?? "")) === last4);
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
