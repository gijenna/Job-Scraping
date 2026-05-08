import { admin, corsHeadersFor, jsonFor, readSession } from "../_shared/connect-session.ts";

const ALLOWED_FIELDS = new Set([
  "first_name","last_name","email","phone","photo_url","poachable_status","career_stage",
  "field","focus","years_in_current_field","the_hook","current_title","current_company",
  "linkedin_url","dream_role_title","job_types_seeking","current_location","open_to_relocation",
  "relocation_locations","remote_preference","areas_of_expertise","dream_companies",
  "niche_experience","the_pitch","resume_url","prior_careers","total_years_professional",
  "outdoor_industry_experience","outdoor_industry_years","management_experience",
  "management_years","min_pay_rate","portfolio_url","workplace_type_preference",
]);

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
      return jsonFor(req, { candidate: data });
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
      const { data, error } = await sb
        .from("candidates").update(patch).eq("id", candidateId).select("*").single();
      if (error) return jsonFor(req, { error: error.message }, { status: 400 });
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
      return jsonFor(req, { candidate: updated, signed_url: signed.signedUrl });
    }

    return jsonFor(req, { error: "Unknown action" }, { status: 400 });
  } catch (e) {
    return jsonFor(req, { error: (e as Error).message }, { status: 500 });
  }
});
