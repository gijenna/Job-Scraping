// Brand dashboard edge function. Gated by brand_rep session cookie.
import { admin, corsHeadersFor, jsonFor, readSession } from "../_shared/connect-session.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeadersFor(req) });

  let body: any;
  try { body = await req.json(); } catch { return jsonFor(req, { error: "Invalid JSON" }, { status: 400 }); }

  const sess = await readSession(req);
  if (!sess || sess.subject_type !== "brand_rep") {
    return jsonFor(req, { error: "Not signed in" }, { status: 401 });
  }
  const sb = admin();
  const repId = sess.subject_id;

  // Resolve rep + brand.
  const { data: rep } = await sb.from("industry_experts")
    .select("id, full_name, photo_url, current_company, job_title, email, slug, linkedin_url, previous_companies, company_domains")
    .eq("id", repId).maybeSingle();
  if (!rep) return jsonFor(req, { error: "Rep not found" }, { status: 404 });

  const slugify = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const BRAND_COLS = "*";
  let brand: any = null;
  if (rep.current_company) {
    const { data } = await sb.from("event_map_brands")
      .select(BRAND_COLS).eq("event_slug", "denver26").ilike("name", rep.current_company).limit(1);
    if (data && data.length) brand = data[0];
  }
  if (!brand) {
    // fallback: any brand whose name appears in the rep's company
    const { data: all } = await sb.from("event_map_brands")
      .select(BRAND_COLS).eq("event_slug", "denver26");
    if (all && rep.current_company) {
      const lc = rep.current_company.toLowerCase();
      brand = all.find((b: any) => lc.includes(b.name.toLowerCase()) || b.name.toLowerCase().includes(lc)) || null;
    }
  }

  // Resolve event start (gates "visited my table" pre-event).
  let eventStartMs = 0;
  {
    const { data: city } = await sb.from("expert_cities")
      .select("event_date").eq("slug", "denver26").maybeSingle();
    if (city?.event_date) eventStartMs = new Date(city.event_date).getTime();
  }
  const eventStarted = eventStartMs > 0 && Date.now() >= eventStartMs;
  const visitedAt = (createdAt: string) => {
    if (!eventStartMs) return eventStarted; // no date set: allow
    return new Date(createdAt).getTime() >= eventStartMs;
  };

  try {
    if (body.action === "summary") {
      const totals = { registered: 0, visited: 0, sent_note: 0, starred: 0, flagged: 0 };
      const { count: regCount } = await sb.from("candidates").select("id", { count: "exact", head: true });
      totals.registered = regCount || 0;
      if (brand) {
        const { data: conns } = await sb.from("connections")
          .select("id, message_sent_at, role_flagged, created_at").eq("brand_id", brand.id);
        const visitedConns = (conns || []).filter((c: any) => visitedAt(c.created_at));
        totals.visited = visitedConns.length;
        totals.sent_note = (conns || []).filter((c: any) => c.message_sent_at).length;
        totals.flagged = (conns || []).filter((c: any) => c.role_flagged).length;
        const { count: starCount } = await sb.from("candidate_starred_brands")
          .select("id", { count: "exact", head: true }).eq("brand_id", brand.id);
        totals.starred = starCount || 0;
      }
      // Determine edit_card_url based on rep's assignments in denver.
      const BASE = "https://basecampoutdoorevents.com";
      let editCardUrl = `${BASE}/denverreps/`;
      try {
        const { data: assigns } = await sb.from("expert_city_assignments")
          .select("expert_type").eq("expert_id", repId).eq("city_slug", "denver");
        const types = new Set((assigns || []).map((a: any) => a.expert_type));
        if (types.has("brand_rep")) {
          const brandSlug = brand?.name ? slugify(brand.name) : "";
          editCardUrl = brandSlug ? `${BASE}/denverreps/${brandSlug}` : `${BASE}/denverreps/`;
        } else if (types.has("industry_expert")) {
          editCardUrl = `${BASE}/Denverexperts/${rep.slug || ""}`;
        }
      } catch {}
      return jsonFor(req, { rep, brand, totals, edit_card_url: editCardUrl });
    }


    if (body.action === "list") {
      const filters = body.filters || {};
      const search = (body.search || "").trim();
      const sort = body.sort || "newest";
      const page = Math.max(0, body.page | 0);
      const pageSize = Math.min(100, body.page_size || 50);

      // Engagement maps for this brand
      let engagement: Record<string, any> = {};
      let starred: Set<string> = new Set();
      let connectNotes: Record<string, any> = {};
      if (brand) {
        const { data: conns } = await sb.from("connections")
          .select("candidate_id, message_to_brand, message_sent_at, role_flagged, created_at")
          .eq("brand_id", brand.id);
        for (const c of conns || []) {
          const cur = engagement[c.candidate_id] || { visited: false, sent_note: false, role_flagged: null, note: null, last: null };
          // Only mark visited if connection was logged at/after event start
          if (visitedAt(c.created_at)) cur.visited = true;
          if (c.message_sent_at) { cur.sent_note = true; cur.note = c.message_to_brand; }
          if (c.role_flagged) cur.role_flagged = c.role_flagged;
          if (!cur.last || c.created_at > cur.last) cur.last = c.created_at;
          engagement[c.candidate_id] = cur;
        }
        const { data: stars } = await sb.from("candidate_starred_brands")
          .select("candidate_id").eq("brand_id", brand.id);
        starred = new Set((stars || []).map((s: any) => s.candidate_id));

        // Connect-notes addressed to any rep at this brand
        const { data: notes } = await sb.from("connect_notes")
          .select("candidate_id, message, note_timing, note_cta, created_at")
          .eq("brand_id", brand.id).eq("is_active", true).order("created_at", { ascending: false });
        for (const n of notes || []) {
          if (!connectNotes[n.candidate_id]) {
            connectNotes[n.candidate_id] = { message: n.message, note_timing: n.note_timing, note_cta: n.note_cta, sent_at: n.created_at };
          }
        }
      }

      // Fetch candidate page
      let q = sb.from("candidates").select("*", { count: "exact" });

      if (filters.career_stage?.length) q = q.in("career_stage", filters.career_stage);
      if (filters.poachable_status?.length) q = q.in("poachable_status", filters.poachable_status);
      if (filters.field) q = q.eq("field", filters.field);
      if (filters.focus) q = q.eq("focus", filters.focus);
      if (filters.years_min != null) q = q.gte("years_in_current_field", filters.years_min);
      if (filters.years_max != null) q = q.lte("years_in_current_field", filters.years_max);
      if (filters.job_types?.length) q = q.overlaps("job_types_seeking", filters.job_types);
      if (filters.workplace?.length) q = q.overlaps("workplace_type_preference", filters.workplace);
      if (filters.remote?.length) q = q.in("remote_preference", filters.remote);
      if (filters.relocation === "yes") q = q.eq("open_to_relocation", true);
      if (filters.relocation === "no") q = q.eq("open_to_relocation", false);
      if (filters.open_to_retail === true) q = q.eq("open_to_retail", true);
      if (filters.outdoor === "yes") q = q.eq("outdoor_industry_experience", true);
      if (filters.outdoor === "no") q = q.eq("outdoor_industry_experience", false);
      if (filters.outdoor_min_years != null) q = q.gte("outdoor_industry_years", filters.outdoor_min_years);
      if (filters.management === "yes") q = q.eq("management_experience", true);
      if (filters.management === "no") q = q.eq("management_experience", false);
      if (filters.management_min_years != null) q = q.gte("management_years", filters.management_min_years);
      if (filters.areas?.length) q = q.overlaps("areas_of_expertise", filters.areas);

      if (search) {
        const s = search.replace(/[%_]/g, "");
        q = q.or(
          `first_name.ilike.%${s}%,last_name.ilike.%${s}%,the_hook.ilike.%${s}%,the_pitch.ilike.%${s}%,dream_role_title.ilike.%${s}%,current_company.ilike.%${s}%,current_title.ilike.%${s}%`,
        );
      }

      // Sort (DB-level)
      if (sort === "most_complete") q = q.order("profile_completeness_score", { ascending: false, nullsFirst: false });
      else q = q.order("updated_at", { ascending: false });

      q = q.range(page * pageSize, page * pageSize + pageSize - 1);

      let { data: rows, count, error } = await q;
      if (error) return jsonFor(req, { error: error.message }, { status: 400 });
      let list = rows || [];

      // Engagement-only filters (post-filter)
      if (filters.visited) list = list.filter((c: any) => engagement[c.id]?.visited);
      if (filters.sent_note) list = list.filter((c: any) => engagement[c.id]?.sent_note);
      if (filters.role_flagged) list = list.filter((c: any) => engagement[c.id]?.role_flagged);
      if (filters.starred_brand) list = list.filter((c: any) => starred.has(c.id));
      if (filters.has_connect_note) list = list.filter((c: any) => !!connectNotes[c.id]);
      if (filters.pre_event_note) list = list.filter((c: any) => connectNotes[c.id]?.note_timing === "pre_event");
      if (filters.during_event_note) list = list.filter((c: any) => connectNotes[c.id]?.note_timing === "during_event");
      if (filters.post_event_note) list = list.filter((c: any) => connectNotes[c.id]?.note_timing === "post_event");

      // Min pay (text field — best-effort numeric parse)
      if (filters.min_pay != null) {
        const target = Number(filters.min_pay);
        list = list.filter((c: any) => {
          const n = Number(String(c.min_pay_rate || "").replace(/[^0-9.]/g, ""));
          return !isNaN(n) && n >= target;
        });
      }

      const result = list.map((c: any) => ({
        ...c,
        engagement: engagement[c.id] || null,
        starred_brand: starred.has(c.id),
        connect_note: connectNotes[c.id] || null,
      }));

      // Engagement-based sorts (post-fetch)
      if (sort === "visited") {
        result.sort((a: any, b: any) => {
          const av = a.engagement?.visited ? new Date(a.engagement.last || 0).getTime() : -1;
          const bv = b.engagement?.visited ? new Date(b.engagement.last || 0).getTime() : -1;
          return bv - av;
        });
      } else if (sort === "wrote_note") {
        result.sort((a: any, b: any) => {
          const an = a.connect_note ? new Date(a.connect_note.sent_at || 0).getTime() : -1;
          const bn = b.connect_note ? new Date(b.connect_note.sent_at || 0).getTime() : -1;
          return bn - an;
        });
      }

      // Log filter activity (fire and forget)
      sb.from("filter_logs").insert({
        brand_rep_id: repId,
        filters_applied: filters,
        keyword_search: search || null,
        results_count: count || result.length,
      }).then(() => {});

      return jsonFor(req, { candidates: result, total: count || result.length, page, page_size: pageSize });
    }

    if (body.action === "candidate") {
      const { id } = body;
      if (!id) return jsonFor(req, { error: "id required" }, { status: 400 });
      const { data: cand, error } = await sb.from("candidates").select("*").eq("id", id).maybeSingle();
      if (error || !cand) return jsonFor(req, { error: "Not found" }, { status: 404 });

      let conns: any[] = [];
      if (brand) {
        const { data } = await sb.from("connections")
          .select("*").eq("brand_id", brand.id).eq("candidate_id", id)
          .order("created_at", { ascending: false });
        conns = data || [];
      }

      let resume_signed_url: string | null = null;
      if (cand.resume_url) {
        try {
          const path = cand.resume_url.split("/candidate-resumes/")[1] || cand.resume_url;
          const { data } = await sb.storage.from("candidate-resumes").createSignedUrl(path, 60 * 10);
          resume_signed_url = data?.signedUrl || null;
        } catch {}
      }
      let photo_signed_url: string | null = cand.photo_url || null;
      if (cand.photo_url && cand.photo_url.includes("candidate-photos") && !cand.photo_url.startsWith("http")) {
        try {
          const path = cand.photo_url.split("/candidate-photos/")[1] || cand.photo_url;
          const { data } = await sb.storage.from("candidate-photos").createSignedUrl(path, 60 * 10);
          photo_signed_url = data?.signedUrl || null;
        } catch {}
      }
      return jsonFor(req, { candidate: cand, connections: conns, resume_signed_url, photo_signed_url });
    }

    if (body.action === "wishlist") {
      const { query } = body;
      if (!query || !String(query).trim()) return jsonFor(req, { error: "query required" }, { status: 400 });
      await sb.from("filter_logs").insert({
        brand_rep_id: repId, wishlist_query: String(query).slice(0, 1000),
      });
      return jsonFor(req, { ok: true });
    }

    return jsonFor(req, { error: "Unknown action" }, { status: 400 });
  } catch (e) {
    return jsonFor(req, { error: (e as Error).message }, { status: 500 });
  }
});
