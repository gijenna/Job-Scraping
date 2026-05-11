// Brand lead capture endpoints. Candidate session writes/reads their own
// response per (candidate_id, brand_id). Brand-rep session lists leads for
// their own brand only.
import { admin, corsHeadersFor, jsonFor, readSession } from "../_shared/connect-session.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeadersFor(req) });

  let body: any;
  try { body = await req.json(); } catch { return jsonFor(req, { error: "Invalid JSON" }, { status: 400 }); }

  const sess = await readSession(req);
  if (!sess) return jsonFor(req, { error: "Not signed in" }, { status: 401 });

  const sb = admin();

  try {
    const action = body.action as string;

    if (action === "me") {
      if (sess.subject_type !== "candidate") return jsonFor(req, { response: null });
      const brand_id = String(body.brand_id || "");
      if (!brand_id) return jsonFor(req, { error: "brand_id required" }, { status: 400 });
      const { data } = await sb.from("brand_lead_responses")
        .select("*").eq("candidate_id", sess.subject_id).eq("brand_id", brand_id).maybeSingle();
      return jsonFor(req, { response: data || null });
    }

    if (action === "upsert") {
      if (sess.subject_type !== "candidate") return jsonFor(req, { error: "Candidates only" }, { status: 403 });
      const brand_id = String(body.brand_id || "");
      const response_value = String(body.response_value || "");
      const response_label = body.response_label != null ? String(body.response_label) : null;
      const question_text = String(body.question_text || "");
      if (!brand_id || !response_value || !question_text) {
        return jsonFor(req, { error: "Invalid input" }, { status: 400 });
      }
      // Determine share_contact_info default: explicit body value wins, else
      // fall back to candidate's global brand_contact_consent.
      let share_contact_info: boolean;
      if (typeof body.share_contact_info === "boolean") {
        share_contact_info = body.share_contact_info;
      } else {
        const { data: cand } = await sb.from("candidates")
          .select("brand_contact_consent").eq("id", sess.subject_id).maybeSingle();
        share_contact_info = !!cand?.brand_contact_consent;
      }
      const { data, error } = await sb.from("brand_lead_responses")
        .upsert(
          { candidate_id: sess.subject_id, brand_id, response_value, response_label, question_text, share_contact_info, updated_at: new Date().toISOString() },
          { onConflict: "candidate_id,brand_id" },
        )
        .select().maybeSingle();
      if (error) return jsonFor(req, { error: error.message }, { status: 400 });
      return jsonFor(req, { response: data });
    }

    if (action === "clear") {
      if (sess.subject_type !== "candidate") return jsonFor(req, { error: "Candidates only" }, { status: 403 });
      const brand_id = String(body.brand_id || "");
      if (!brand_id) return jsonFor(req, { error: "brand_id required" }, { status: 400 });
      await sb.from("brand_lead_responses").delete()
        .eq("candidate_id", sess.subject_id).eq("brand_id", brand_id);
      return jsonFor(req, { ok: true });
    }

    if (action === "list") {
      if (sess.subject_type !== "brand_rep") return jsonFor(req, { error: "Brand rep only" }, { status: 403 });
      const { data: rep } = await sb.from("industry_experts")
        .select("id, current_company").eq("id", sess.subject_id).maybeSingle();
      if (!rep) return jsonFor(req, { error: "Rep not found" }, { status: 404 });

      const brand_id = String(body.brand_id || "");
      if (!brand_id) return jsonFor(req, { error: "brand_id required" }, { status: 400 });

      const { data: brand } = await sb.from("event_map_brands")
        .select("id, name, lead_capture_visible_to_brand").eq("id", brand_id).maybeSingle();
      if (!brand) return jsonFor(req, { error: "Brand not found" }, { status: 404 });
      if (brand.lead_capture_visible_to_brand === false) {
        return jsonFor(req, { error: "Leads not visible for this brand" }, { status: 403 });
      }

      const repCo = (rep.current_company || "").toLowerCase();
      const brandName = (brand.name || "").toLowerCase();
      if (!repCo || (!repCo.includes(brandName) && !brandName.includes(repCo))) {
        return jsonFor(req, { error: "Not authorized for this brand" }, { status: 403 });
      }

      const { data: leads } = await sb.from("brand_lead_responses")
        .select("id, candidate_id, response_value, response_label, question_text, created_at, updated_at")
        .eq("brand_id", brand_id)
        .order("updated_at", { ascending: false });

      const ids = (leads || []).map((l: any) => l.candidate_id);
      let candMap: Record<string, any> = {};
      if (ids.length) {
        const { data: cands } = await sb.from("candidates")
          .select("id, first_name, last_name, email, linkedin_url, current_title, current_company, photo_url")
          .in("id", ids);
        for (const c of cands || []) candMap[c.id] = c;
      }
      const result = (leads || []).map((l: any) => ({ ...l, candidate: candMap[l.candidate_id] || null }));
      return jsonFor(req, { leads: result });
    }

    return jsonFor(req, { error: "Unknown action" }, { status: 400 });
  } catch (e) {
    return jsonFor(req, { error: (e as Error).message }, { status: 500 });
  }
});
