// Pre/post-event notes from candidates to brand reps and industry experts.
// Gated by candidate session (write/own reads) or brand_rep session (their inbox reads).
import { admin, corsHeadersFor, jsonFor, readSession } from "../_shared/connect-session.ts";

const MAX_LEN = 500;
// Denver Outside Days 26 timing.
const EVENT_START = new Date("2026-05-28T15:00:00-06:00").getTime(); // 3pm MT May 28
const POST_EVENT_START = new Date("2026-05-28T19:00:00-06:00").getTime(); // 7pm MT May 28

function getMode(): "pre_event" | "during_event" | "post_event" {
  const now = Date.now();
  if (now < EVENT_START) return "pre_event";
  if (now < POST_EVENT_START) return "during_event";
  return "post_event";
}

async function resolveBrandIdForRep(sb: any, repId: string): Promise<string | null> {
  const { data: rep } = await sb.from("industry_experts").select("current_company").eq("id", repId).maybeSingle();
  if (!rep?.current_company) return null;
  const { data } = await sb.from("event_map_brands")
    .select("id, name").eq("event_slug", "denver26");
  if (!data) return null;
  const lc = rep.current_company.toLowerCase();
  const exact = data.find((b: any) => b.name.toLowerCase() === lc);
  if (exact) return exact.id;
  const fuzzy = data.find((b: any) => lc.includes(b.name.toLowerCase()) || b.name.toLowerCase().includes(lc));
  return fuzzy?.id || null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeadersFor(req) });

  let body: any;
  try { body = await req.json(); } catch { return jsonFor(req, { error: "Invalid JSON" }, { status: 400 }); }

  const sess = await readSession(req);
  if (!sess) return jsonFor(req, { error: "Not signed in" }, { status: 401 });

  const sb = admin();
  const action = body.action;

  try {
    // ---- Candidate actions ----
    if (sess.subject_type === "candidate") {
      const candidateId = sess.subject_id;

      if (action === "list_mine") {
        const { data } = await sb.from("connect_notes")
          .select("*").eq("candidate_id", candidateId).eq("is_active", true);
        return jsonFor(req, { notes: data || [] });
      }

      if (action === "get_mine") {
        const { recipient_id } = body;
        if (!recipient_id) return jsonFor(req, { error: "recipient_id required" }, { status: 400 });
        const { data } = await sb.from("connect_notes")
          .select("*").eq("candidate_id", candidateId).eq("recipient_id", recipient_id)
          .eq("is_active", true).maybeSingle();
        return jsonFor(req, { note: data || null });
      }

      if (action === "upsert") {
        const mode = getMode();
        const { recipient_type, recipient_id, message, note_cta } = body;
        if (recipient_type !== "brand_rep" && recipient_type !== "expert") {
          return jsonFor(req, { error: "recipient_type must be brand_rep or expert" }, { status: 400 });
        }
        if (!recipient_id) return jsonFor(req, { error: "recipient_id required" }, { status: 400 });
        const text = String(message || "").trim();
        if (!text) return jsonFor(req, { error: "Message can't be empty" }, { status: 400 });
        if (text.length > MAX_LEN) return jsonFor(req, { error: `Max ${MAX_LEN} characters` }, { status: 400 });

        const validCtas = ["follow_up","look_out_for_application","grab_coffee","memorable_only"];
        const cleanCta = note_cta && validCtas.includes(note_cta) ? note_cta : null;

        const brand_id = recipient_type === "brand_rep" ? await resolveBrandIdForRep(sb, recipient_id) : null;

        // Upsert via existing-active lookup
        const { data: existing } = await sb.from("connect_notes")
          .select("id, note_timing").eq("candidate_id", candidateId).eq("recipient_id", recipient_id)
          .eq("is_active", true).maybeSingle();

        let saved: any = null;
        if (existing) {
          // Preserve original timing on edit (per spec): don't shift timing on update.
          const { data, error } = await sb.from("connect_notes")
            .update({ message: text, brand_id, recipient_type, note_cta: cleanCta })
            .eq("id", existing.id).select("*").single();
          if (error) return jsonFor(req, { error: error.message }, { status: 400 });
          saved = data;
        } else {
          const { data, error } = await sb.from("connect_notes").insert({
            candidate_id: candidateId, recipient_type, recipient_id, brand_id,
            message: text, note_timing: mode, note_cta: cleanCta, is_active: true,
          }).select("*").single();
          if (error) return jsonFor(req, { error: error.message }, { status: 400 });
          saved = data;
        }

        // Send confirmation email to candidate (best-effort) — only for pre/post.
        if (saved.note_timing !== "during_event") {
          try {
            const [{ data: cand }, { data: rep }, { data: brand }] = await Promise.all([
              sb.from("candidates").select("first_name, email").eq("id", candidateId).maybeSingle(),
              sb.from("industry_experts").select("full_name, current_company").eq("id", recipient_id).maybeSingle(),
              brand_id ? sb.from("event_map_brands").select("name").eq("id", brand_id).maybeSingle() : Promise.resolve({ data: null }),
            ]);
            if (cand?.email) {
              const templateName = saved.note_timing === "pre_event" ? "candidate-note-received-pre-event" : "candidate-note-received-post-event";
              await sb.functions.invoke("send-transactional-email", {
                body: {
                  templateName,
                  recipientEmail: cand.email,
                  idempotencyKey: `connect-note-${saved.id}-${saved.note_timing}`,
                  templateData: {
                    first_name: cand.first_name,
                    rep_name: rep?.full_name || "the rep",
                    brand_name: brand?.name || rep?.current_company || "their team",
                  },
                },
              });
            }
          } catch (e) {
            console.error("Confirmation email failed:", e);
          }
        }

        return jsonFor(req, { note: saved });
      }

      if (action === "retract") {
        const { recipient_id } = body;
        if (!recipient_id) return jsonFor(req, { error: "recipient_id required" }, { status: 400 });
        const { error } = await sb.from("connect_notes")
          .update({ is_active: false })
          .eq("candidate_id", candidateId).eq("recipient_id", recipient_id).eq("is_active", true);
        if (error) return jsonFor(req, { error: error.message }, { status: 400 });
        return jsonFor(req, { ok: true });
      }
    }

    // ---- Brand rep actions ----
    if (sess.subject_type === "brand_rep") {
      const repId = sess.subject_id;
      if (action === "list_for_rep") {
        // Return notes addressed to this rep + (optionally) all reps at the same brand if requested.
        const brandWide = !!body.brand_wide;
        let recipientIds: string[] = [repId];
        if (brandWide) {
          const brandId = await resolveBrandIdForRep(sb, repId);
          if (brandId) {
            // include any reps whose current_company matches via the same lookup as map: just query notes with brand_id
            const { data } = await sb.from("connect_notes")
              .select("*").eq("brand_id", brandId).eq("is_active", true).order("created_at", { ascending: false });
            return jsonFor(req, { notes: data || [] });
          }
        }
        const { data } = await sb.from("connect_notes")
          .select("*").in("recipient_id", recipientIds).eq("is_active", true).order("created_at", { ascending: false });
        return jsonFor(req, { notes: data || [] });
      }
    }

    return jsonFor(req, { error: "Unknown action" }, { status: 400 });
  } catch (e) {
    return jsonFor(req, { error: (e as Error).message }, { status: 500 });
  }
});
