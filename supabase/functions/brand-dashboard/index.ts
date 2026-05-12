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
    .select("*")
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
  // Note: expert_cities slug for Denver is "denver" (not "denver26").
  let eventStartMs = 0;
  {
    const { data: city } = await sb.from("expert_cities")
      .select("event_date").eq("slug", "denver").maybeSingle();
    if (city?.event_date) eventStartMs = new Date(city.event_date).getTime();
  }
  const eventStarted = eventStartMs > 0 && Date.now() >= eventStartMs;
  const visitedAt = (createdAt: string) => {
    if (!eventStartMs) return true; // no date set: treat all logged connections as visited
    return new Date(createdAt).getTime() >= eventStartMs;
  };

  // Parse min_pay_rate text like "75", "75K", "75,000", "150k", "$90,000".
  // Heuristic: strip non-numeric, parse number; if original had "k" or value < 1000, multiply by 1000.
  const parsePay = (raw: string | null | undefined): number | null => {
    if (!raw) return null;
    const s = String(raw).trim();
    const hasK = /k/i.test(s);
    const n = Number(s.replace(/[^0-9.]/g, ""));
    if (!Number.isFinite(n) || n <= 0) return null;
    if (hasK) return n * 1000;
    if (n < 1000) return n * 1000; // user typed "75" meaning 75K
    return n;
  };

  try {
    if (body.action === "summary") {
      const totals = { registered: 0, visited: 0, sent_note: 0, starred: 0, flagged: 0 };
      const { count: regCount } = await sb.from("candidates").select("id", { count: "exact", head: true });
      totals.registered = regCount || 0;
      if (brand) {
        const { data: conns } = await sb.from("connections")
          .select("id, candidate_id, role_flagged, created_at").eq("brand_id", brand.id);
        // "Visited" = unique candidates with a connection logged at/after event start.
        const visitedSet = new Set<string>();
        for (const c of conns || []) {
          if (visitedAt(c.created_at)) visitedSet.add(c.candidate_id);
        }
        totals.visited = visitedSet.size;
        totals.flagged = (conns || []).filter((c: any) => c.role_flagged).length;
        // "Sent a note" = unique candidates with an active connect_note to this brand
        // (matches the pre/during/post-event note filter chips).
        const { data: noteRows } = await sb.from("connect_notes")
          .select("candidate_id").eq("brand_id", brand.id).eq("is_active", true);
        totals.sent_note = new Set((noteRows || []).map((n: any) => n.candidate_id)).size;
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

      // Poachable status (hierarchical): "Always open" also includes "Ready to jump".
      if (filters.poachable_status?.length) {
        const set = new Set<string>();
        for (const v of filters.poachable_status) {
          set.add(v);
          if (v === "Always open to the right opportunity") set.add("Ready to jump");
        }
        q = q.in("poachable_status", Array.from(set));
      }

      if (filters.field) q = q.eq("field", filters.field);
      if (filters.focus) q = q.eq("focus", filters.focus);
      if (filters.years_min != null) q = q.gte("years_in_current_field", filters.years_min);
      if (filters.years_max != null) q = q.lte("years_in_current_field", filters.years_max);

      // Job types (text[] @> ANY chip). Use OR of cs (containment) per chip so
      // values containing parens like "Startup (early-stage, scrappy)" serialize correctly.
      const arrayContainsAnyOr = (col: string, vals: string[]) => {
        const parts = vals.map((v) => {
          const safe = String(v).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
          return `${col}.cs.{"${safe}"}`;
        });
        return parts.join(",");
      };

      if (filters.job_types?.length) q = q.or(arrayContainsAnyOr("job_types_seeking", filters.job_types));
      if (filters.workplace?.length) q = q.or(arrayContainsAnyOr("workplace_type_preference", filters.workplace));

      // Remote preference (hierarchical).
      if (filters.remote?.length) {
        const set = new Set<string>();
        for (const v of filters.remote) {
          if (v === "Open to hybrid") { set.add(v); set.add("Anything goes"); }
          else if (v === "Open to in-office") { set.add(v); set.add("Open to hybrid"); set.add("Anything goes"); }
          else set.add(v);
        }
        q = q.in("remote_preference", Array.from(set));
      }

      if (filters.relocation === "yes") q = q.eq("open_to_relocation", true);
      if (filters.relocation === "no") q = q.eq("open_to_relocation", false);
      if (filters.open_to_retail === true) q = q.eq("open_to_retail", true);
      if (filters.outdoor === "yes") q = q.eq("outdoor_industry_experience", true);
      if (filters.outdoor === "no") q = q.eq("outdoor_industry_experience", false);
      if (filters.outdoor_min_years != null) q = q.gte("outdoor_industry_years", filters.outdoor_min_years);
      if (filters.management === "yes") q = q.eq("management_experience", true);
      if (filters.management === "no") q = q.eq("management_experience", false);
      if (filters.management_min_years != null) q = q.gte("management_years", filters.management_min_years);
      if (filters.areas?.length) q = q.or(arrayContainsAnyOr("areas_of_expertise", filters.areas));

      // Niche filter: niche_experience is jsonb array of {niche, years}.
      // Match if any selected niche appears as {niche: X}. Tolerate either {"niche":...} or {"name":...}.
      if (filters.niches?.length) {
        const ors: string[] = [];
        for (const n of filters.niches) {
          const safe = String(n).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
          ors.push(`niche_experience.cs.[{"niche":"${safe}"}]`);
          ors.push(`niche_experience.cs.[{"name":"${safe}"}]`);
        }
        q = q.or(ors.join(","));
      }

      // Location filter: state(s) + city free text. Considers current location,
      // relocation_states, relocation_cities, and open_to_anywhere.
      // Major-city → state lookup for cross-matches (e.g. "Denver" -> "Colorado").
      const CITY_TO_STATE: Record<string, string> = {
        "denver": "Colorado","boulder": "Colorado","fort collins": "Colorado","colorado springs": "Colorado",
        "portland": "Oregon","eugene": "Oregon","bend": "Oregon",
        "seattle": "Washington","tacoma": "Washington","spokane": "Washington","bellingham": "Washington",
        "san francisco": "California","oakland": "California","los angeles": "California",
        "san diego": "California","sacramento": "California","san jose": "California",
        "new york": "New York","brooklyn": "New York","nyc": "New York",
        "boston": "Massachusetts","cambridge": "Massachusetts",
        "austin": "Texas","dallas": "Texas","houston": "Texas","san antonio": "Texas",
        "chicago": "Illinois","phoenix": "Arizona","tucson": "Arizona","flagstaff": "Arizona",
        "salt lake city": "Utah","park city": "Utah","moab": "Utah",
        "atlanta": "Georgia","miami": "Florida","tampa": "Florida","orlando": "Florida",
        "minneapolis": "Minnesota","saint paul": "Minnesota",
        "detroit": "Michigan","ann arbor": "Michigan",
        "philadelphia": "Pennsylvania","pittsburgh": "Pennsylvania",
        "nashville": "Tennessee","memphis": "Tennessee","knoxville": "Tennessee",
        "charlotte": "North Carolina","raleigh": "North Carolina","asheville": "North Carolina",
        "burlington": "Vermont","jackson": "Wyoming","jackson hole": "Wyoming",
        "missoula": "Montana","bozeman": "Montana","boise": "Idaho","ketchum": "Idaho",
        "santa fe": "New Mexico","albuquerque": "New Mexico","taos": "New Mexico",
        "las vegas": "Nevada","reno": "Nevada","washington dc": "District of Columbia","dc": "District of Columbia",
      };
      const escapeLike = (s: string) => s.replace(/[%_]/g, "");
      if (filters.states?.length) {
        const ors: string[] = [];
        for (const st of filters.states) {
          const safe = String(st).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
          ors.push(`current_state.eq.${st}`);
          ors.push(`relocation_states.cs.{"${safe}"}`);
        }
        ors.push(`open_to_anywhere.eq.true`);
        q = q.or(ors.join(","));
      }
      if (filters.city && String(filters.city).trim()) {
        const city = escapeLike(String(filters.city).trim());
        const lookupState = CITY_TO_STATE[city.toLowerCase()];
        const ors: string[] = [
          `current_city.ilike.%${city}%`,
          `relocation_cities.ilike.%${city}%`,
          `open_to_anywhere.eq.true`,
        ];
        if (lookupState) {
          const safe = lookupState.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
          ors.push(`relocation_states.cs.{"${safe}"}`);
          ors.push(`current_state.eq.${lookupState}`);
        }
        q = q.or(ors.join(","));
      }

      if (search) {
        const s = search.replace(/[%_]/g, "");
        q = q.or(
          `first_name.ilike.%${s}%,last_name.ilike.%${s}%,the_hook.ilike.%${s}%,the_pitch.ilike.%${s}%,dream_role_title.ilike.%${s}%,current_company.ilike.%${s}%,current_title.ilike.%${s}%`,
        );
      }

      // Sort: only "newest" (created_at desc) and "most_complete".
      if (sort === "most_complete") {
        q = q.order("profile_completeness_score", { ascending: false, nullsFirst: false });
      } else {
        q = q.order("created_at", { ascending: false });
      }

      q = q.range(page * pageSize, page * pageSize + pageSize - 1);

      let { data: rows, count, error } = await q;
      if (error) return jsonFor(req, { error: error.message }, { status: 400 });
      let list = rows || [];

      // Engagement-only filters (post-filter)
      if (filters.visited) list = list.filter((c: any) => engagement[c.id]?.visited);
      if (filters.role_flagged) list = list.filter((c: any) => engagement[c.id]?.role_flagged);
      if (filters.starred_brand) list = list.filter((c: any) => starred.has(c.id));
      // Note timing chips use OR within the category.
      if (filters.pre_event_note || filters.during_event_note || filters.post_event_note) {
        const allowed = new Set<string>();
        if (filters.pre_event_note) allowed.add("pre_event");
        if (filters.during_event_note) allowed.add("during_event");
        if (filters.post_event_note) allowed.add("post_event");
        list = list.filter((c: any) => {
          const t = connectNotes[c.id]?.note_timing;
          return t && allowed.has(t);
        });
      }

      // Min pay (text field, robust numeric parse: handles "75K", "$90,000", "75").
      // Brand-side filter represents what the brand can afford. Include candidates whose
      // stated min_pay_rate is at or below the brand's value. NULL min_pay_rate is treated
      // as "open to negotiation" and always included.
      if (filters.min_pay != null) {
        const target = Number(filters.min_pay);
        list = list.filter((c: any) => {
          const n = parsePay(c.min_pay_rate);
          if (n == null) return true;
          return n <= target;
        });
      }

      const result = list.map((c: any) => ({
        ...c,
        engagement: engagement[c.id] || null,
        starred_brand: starred.has(c.id),
        connect_note: connectNotes[c.id] || null,
      }));

      // Sort options reduced to "newest" (DB-level, above) and "most_complete" (DB-level, above).

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

    if (body.action === "save_card") {
      const rep_patch = body.rep_patch || {};
      const brand_patch = body.brand_patch || {};

      // Whitelist personal rep fields the rep can edit
      const repAllowed = [
        "photo_url", "job_title", "ask_me_about", "niche_interests",
        "linkedin_url", "previous_companies", "favorite_media",
        "field_of_work", "years_in_industry",
      ];
      const repClean: Record<string, any> = {};
      for (const k of repAllowed) if (k in rep_patch) repClean[k] = rep_patch[k];
      if (Object.keys(repClean).length > 0) {
        repClean.updated_at = new Date().toISOString();
        const { error: repErr } = await sb.from("industry_experts").update(repClean).eq("id", repId);
        if (repErr) return jsonFor(req, { error: repErr.message }, { status: 400 });
      }

      // Brand-level fields, only if rep has a linked brand and is a brand_rep
      if (brand && Object.keys(brand_patch).length > 0) {
        const { data: assigns } = await sb.from("expert_city_assignments")
          .select("expert_type").eq("expert_id", repId).eq("city_slug", "denver");
        const isBrandRep = (assigns || []).some((a: any) => a.expert_type === "brand_rep");
        if (isBrandRep) {
          const brandAllowed = [
            "website_url", "offers_remote", "currently_hiring", "why_visit_text",
            "lead_question_intro", "lead_question_text",
            "lead_question_option_1", "lead_question_option_2", "lead_question_option_3",
            "lead_question_active",
          ];
          const brandClean: Record<string, any> = {};
          for (const k of brandAllowed) if (k in brand_patch) brandClean[k] = brand_patch[k];
          if (Object.keys(brandClean).length > 0) {
            const { error: bErr } = await sb.from("event_map_brands").update(brandClean).eq("id", brand.id);
            if (bErr) return jsonFor(req, { error: bErr.message }, { status: 400 });
          }
        }
      }

      // Return refreshed rep + brand
      const { data: freshRep } = await sb.from("industry_experts")
        .select("*").eq("id", repId).maybeSingle();
      let freshBrand: any = null;
      if (brand) {
        const { data } = await sb.from("event_map_brands").select("*").eq("id", brand.id).maybeSingle();
        freshBrand = data;
      }
      return jsonFor(req, { ok: true, rep: freshRep, brand: freshBrand });
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
