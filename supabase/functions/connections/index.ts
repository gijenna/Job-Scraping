// Connections edge function for the Outside Days career fair.
// Gated by the candidate session cookie. Service-role writes to public.connections.

import { admin, corsHeadersFor, jsonFor, readSession } from "../_shared/connect-session.ts";

const cap = (s: any, n: number) => (typeof s === "string" ? s.slice(0, n) : null);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeadersFor(req) });

  let body: any;
  try { body = await req.json(); } catch { return jsonFor(req, { error: "Invalid JSON" }, { status: 400 }); }

  const sess = await readSession(req);
  if (!sess || sess.subject_type !== "candidate") return jsonFor(req, { error: "Not signed in" }, { status: 401 });

  const sb = admin();
  const candidateId = sess.subject_id;

  try {
    if (body.action === "list") {
      const { data: rows } = await sb
        .from("connections")
        .select("*")
        .eq("candidate_id", candidateId)
        .order("created_at", { ascending: false });

      const list = rows || [];
      const brandIds = [...new Set(list.map((r) => r.brand_id).filter(Boolean))];
      const expertIds = [
        ...new Set(list.flatMap((r) => [r.brand_rep_id, r.expert_id]).filter(Boolean)),
      ];

      const [{ data: brands }, { data: experts }, { data: notes }] = await Promise.all([
        brandIds.length
          ? sb.from("event_map_brands").select("id, name, logo_url, website_url").in("id", brandIds)
          : Promise.resolve({ data: [] }),
        expertIds.length
          ? sb.from("industry_experts").select("id, full_name, photo_url, current_company, job_title").in("id", expertIds)
          : Promise.resolve({ data: [] }),
        expertIds.length
          ? sb.from("connect_notes")
              .select("recipient_id, message, note_cta, created_at, is_active")
              .eq("candidate_id", candidateId)
              .eq("is_active", true)
              .in("recipient_id", expertIds)
          : Promise.resolve({ data: [] }),
      ]);

      const brandMap = Object.fromEntries((brands || []).map((b: any) => [b.id, b]));
      const expertMap = Object.fromEntries((experts || []).map((e: any) => [e.id, e]));
      const noteMap = Object.fromEntries((notes || []).map((n: any) => [n.recipient_id, n]));

      return jsonFor(req, {
        connections: list.map((r) => {
          const recipientId = r.expert_id || r.brand_rep_id || null;
          const sentNote = recipientId ? noteMap[recipientId] || null : null;
          return {
            ...r,
            brand: r.brand_id ? brandMap[r.brand_id] || null : null,
            rep: r.brand_rep_id ? expertMap[r.brand_rep_id] || null : null,
            expert: r.expert_id ? expertMap[r.expert_id] || null : null,
            sent_note: sentNote,
          };
        }),
      });
    }

    if (body.action === "create") {
      const {
        brand_id, brand_rep_id, expert_id,
        also_talked_to, private_notes,
        follow_up_direction, contact_info_received, role_flagged,
        message_to_brand, send_now,
        would_want_as_mentor, mentor_topics,
      } = body;

      if (!brand_id && !brand_rep_id && !expert_id) {
        return jsonFor(req, { error: "Must specify a brand, brand rep, or expert." }, { status: 400 });
      }

      // "Who else did you talk to" gets prepended into private_notes for now.
      let notes = cap(private_notes, 500) || "";
      const also = cap(also_talked_to, 280);
      if (also) notes = `Also met: ${also}\n\n${notes}`.slice(0, 800);

      const insert: Record<string, any> = {
        candidate_id: candidateId,
        brand_id: brand_id || null,
        brand_rep_id: brand_rep_id || null,
        expert_id: expert_id || null,
        private_notes: notes || null,
        follow_up_direction: cap(follow_up_direction, 280),
        contact_info_received: cap(contact_info_received, 280),
        role_flagged: cap(role_flagged, 280),
        message_to_brand: cap(message_to_brand, 500),
        message_sent_at: send_now && message_to_brand ? new Date().toISOString() : null,
        would_want_as_mentor: typeof would_want_as_mentor === "boolean" ? would_want_as_mentor : null,
        mentor_topics: cap(mentor_topics, 280),
      };

      const { data, error } = await sb.from("connections").insert(insert).select("*").single();
      if (error) return jsonFor(req, { error: error.message }, { status: 400 });
      return jsonFor(req, { connection: data });
    }

    if (body.action === "update") {
      const { id, patch = {}, send_now } = body;
      if (!id) return jsonFor(req, { error: "id required" }, { status: 400 });

      const allowed = [
        "private_notes", "follow_up_direction", "contact_info_received", "role_flagged",
        "message_to_brand", "would_want_as_mentor", "mentor_topics",
      ];
      const caps: Record<string, number> = {
        private_notes: 800, follow_up_direction: 280, contact_info_received: 280,
        role_flagged: 280, message_to_brand: 500, mentor_topics: 280,
      };
      const update: Record<string, any> = {};
      for (const k of allowed) {
        if (k in patch) {
          if (k === "would_want_as_mentor") update[k] = !!patch[k];
          else update[k] = caps[k] ? cap(patch[k], caps[k]) : patch[k];
        }
      }
      if (send_now && update.message_to_brand) {
        update.message_sent_at = new Date().toISOString();
      }
      const { data, error } = await sb.from("connections")
        .update(update).eq("id", id).eq("candidate_id", candidateId).select("*").single();
      if (error) return jsonFor(req, { error: error.message }, { status: 400 });
      return jsonFor(req, { connection: data });
    }

    if (body.action === "delete") {
      const { id } = body;
      if (!id) return jsonFor(req, { error: "id required" }, { status: 400 });
      const { error } = await sb.from("connections").delete().eq("id", id).eq("candidate_id", candidateId);
      if (error) return jsonFor(req, { error: error.message }, { status: 400 });
      return jsonFor(req, { ok: true });
    }

    return jsonFor(req, { error: "Unknown action" }, { status: 400 });
  } catch (e) {
    return jsonFor(req, { error: (e as Error).message }, { status: 500 });
  }
});
