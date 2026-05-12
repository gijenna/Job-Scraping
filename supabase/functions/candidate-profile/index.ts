import { admin, corsHeadersFor, jsonFor, readSession } from "../_shared/connect-session.ts";

const ALLOWED_FIELDS = new Set([
  "first_name","last_name","email","phone","photo_url","poachable_status","career_stage",
  "field","focus","years_in_current_field","the_hook","current_title","current_company",
  "linkedin_url","dream_role_title","job_types_seeking","current_location","open_to_relocation",
  "relocation_locations","remote_preference","areas_of_expertise","dream_companies",
  "niche_experience","the_pitch","resume_url","prior_careers","total_years_professional",
  "outdoor_industry_experience","outdoor_industry_years","management_experience",
  "management_years","min_pay_rate","portfolio_url","workplace_type_preference",
  "signup_mode","field_other","data_portability_consent","open_to_retail","brand_contact_consent",
  "current_state","current_city","relocation_states","relocation_cities","open_to_anywhere",
]);

function fireSheetSync(candidateId: string) {
  try {
    const url = `${Deno.env.get("SUPABASE_URL")}/functions/v1/sync-candidate`;
    const p = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
      body: JSON.stringify({ id: candidateId }),
    }).catch((e) => console.error("candidate sheet sync failed", e));
    // @ts-ignore EdgeRuntime is available in Supabase edge runtime
    const wait = (globalThis as any).EdgeRuntime?.waitUntil;
    if (wait) wait(p);
  } catch (e) {
    console.error("candidate sheet sync failed", e);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeadersFor(req) });

  let body: any;
  try { body = await req.json(); } catch { return jsonFor(req, { error: "Invalid JSON" }, { status: 400 }); }

  const sess = await readSession(req);
  if (!sess || sess.subject_type !== "candidate") return jsonFor(req, { error: "Not signed in" }, { status: 401 });

  const sb = admin();
  const candidateId = sess.subject_id;

  try {
    if (body.action === "get") {
      const { data } = await sb.from("candidates").select("*").eq("id", candidateId).maybeSingle();
      const { data: stars } = await sb.from("candidate_starred_brands")
        .select("brand_id").eq("candidate_id", candidateId);
      return jsonFor(req, { candidate: data, starred_brand_ids: (stars || []).map((s: any) => s.brand_id) });
    }

    if (body.action === "toggle_star") {
      const { brand_id } = body;
      if (!brand_id) return jsonFor(req, { error: "brand_id required" }, { status: 400 });
      const { data: existing } = await sb.from("candidate_starred_brands")
        .select("id").eq("candidate_id", candidateId).eq("brand_id", brand_id).maybeSingle();
      if (existing) {
        await sb.from("candidate_starred_brands").delete().eq("id", existing.id);
        return jsonFor(req, { starred: false });
      }
      await sb.from("candidate_starred_brands").insert({ candidate_id: candidateId, brand_id });
      return jsonFor(req, { starred: true });
    }

    if (body.action === "list_stars") {
      const { data } = await sb.from("candidate_starred_brands")
        .select("brand_id").eq("candidate_id", candidateId);
      return jsonFor(req, { starred_brand_ids: (data || []).map((s: any) => s.brand_id) });
    }

    if (body.action === "mark_seen_intro") {
      await sb.from("candidates").update({ has_seen_map_intro: true }).eq("id", candidateId);
      return jsonFor(req, { ok: true });
    }

    if (body.action === "update") {
      const patch: Record<string, any> = {};
      for (const [k, v] of Object.entries(body.patch || {})) {
        if (ALLOWED_FIELDS.has(k)) patch[k] = v;
      }
      if (typeof patch.the_hook === "string" && patch.the_hook.length > 100) {
        return jsonFor(req, { error: "The Hook must be 100 chars or less" }, { status: 400 });
      }
      if (typeof patch.the_pitch === "string" && patch.the_pitch.length > 500) {
        return jsonFor(req, { error: "The Pitch must be 500 chars or less" }, { status: 400 });
      }
      // Normalize jsonb array columns. The UI sometimes sends dream_companies
      // as { names: [], domains: {} }; the DB requires a JSON array (a generated
      // column calls jsonb_array_length on it).
      const normalizeCompanies = (v: any) => {
        if (Array.isArray(v)) return v;
        if (v && Array.isArray(v.names)) {
          const domains = v.domains || {};
          return v.names.map((n: string) => ({ name: n, domain: domains[n] || null }));
        }
        return [];
      };
      if ("dream_companies" in patch) patch.dream_companies = normalizeCompanies(patch.dream_companies);
      for (const k of ["niche_experience", "prior_careers"]) {
        if (k in patch && !Array.isArray(patch[k])) patch[k] = [];
      }
      const { data, error } = await sb
        .from("candidates").update(patch).eq("id", candidateId).select("*").single();
      if (error) return jsonFor(req, { error: error.message }, { status: 400 });
      fireSheetSync(candidateId);
      return jsonFor(req, { candidate: data });
    }

    if (body.action === "upload_signed_url") {
      const { kind, filename, content_type } = body;
      if (kind !== "photo" && kind !== "resume") return jsonFor(req, { error: "kind must be 'photo' or 'resume'" }, { status: 400 });
      if (kind === "resume" && content_type !== "application/pdf") {
        return jsonFor(req, { error: "Resume must be a PDF" }, { status: 400 });
      }
      const bucket = kind === "photo" ? "candidate-photos" : "candidate-resumes";
      const safe = (filename || "file").replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
      const path = `${candidateId}/${Date.now()}-${safe}`;
      const { data, error } = await sb.storage.from(bucket).createSignedUploadUrl(path);
      if (error) return jsonFor(req, { error: error.message }, { status: 400 });
      return jsonFor(req, { upload_url: data.signedUrl, storage_path: path });
    }

    if (body.action === "attach_upload") {
      const { kind, storage_path } = body;
      if (kind !== "photo" && kind !== "resume") return jsonFor(req, { error: "kind must be 'photo' or 'resume'" }, { status: 400 });
      const bucket = kind === "photo" ? "candidate-photos" : "candidate-resumes";
      const field = kind === "photo" ? "photo_url" : "resume_url";
      // Generate a long-lived signed URL (7 days) and store it. Re-signed on `get`.
      const { data: signed, error: signErr } = await sb.storage.from(bucket).createSignedUrl(storage_path, 60 * 60 * 24 * 7);
      if (signErr) return jsonFor(req, { error: signErr.message }, { status: 400 });
      const { data: updated, error } = await sb
        .from("candidates").update({ [field]: signed.signedUrl }).eq("id", candidateId).select("*").single();
      if (error) return jsonFor(req, { error: error.message }, { status: 400 });
      fireSheetSync(candidateId);
      return jsonFor(req, { candidate: updated, signed_url: signed.signedUrl });
    }

    return jsonFor(req, { error: "Unknown action" }, { status: 400 });
  } catch (e) {
    return jsonFor(req, { error: (e as Error).message }, { status: 500 });
  }
});
