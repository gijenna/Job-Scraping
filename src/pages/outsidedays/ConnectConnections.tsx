// "My Connections" view for Outside Days candidates.

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import ImpersonationGate from "@/components/connect/ImpersonationGate";
import { connectionsList } from "@/lib/connect-session";
import ConnectionForm, { ConnectionMode } from "@/components/connect/ConnectionForm";

const relativeTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};

const ConnectConnections = () => {
  const nav = useNavigate();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { connections } = await connectionsList();
      setRows(connections || []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const modeFor = (r: any): ConnectionMode =>
    r.expert_id ? "expert" : r.brand_rep_id ? "brand_rep" : "brand";

  return (
    <ImpersonationGate>
      <div className="min-h-screen bg-events-teal text-events-cream">
        <header className="px-4 py-3 border-b border-events-cream/10 flex items-center gap-3 sticky top-0 bg-events-teal/95 backdrop-blur z-30">
          <button onClick={() => nav("/outsidedays26/connect/home")} className="text-events-cream/80 -ml-1 p-1">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="font-afterparty text-2xl leading-none">My Connections</h1>
        </header>

        <main className="px-4 py-5 max-w-2xl mx-auto">
          {loading ? (
            <p className="text-events-cream/50 font-body text-sm text-center py-12">Loading.</p>
          ) : rows.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-body text-events-cream/70 mb-6">
                No connections yet. Tap a brand or expert on the map to log your first one.
              </p>
              <Link
                to="/outsidedays26/connect/home"
                className="inline-block bg-events-coral text-events-cream px-5 py-2.5 rounded-full font-display uppercase tracking-wider text-xs"
              >
                Open the map
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {rows.map((r) => {
                const mode = modeFor(r);
                const subject =
                  mode === "expert" ? r.expert?.full_name :
                  mode === "brand_rep" ? `${r.brand?.name || ""}${r.rep?.full_name ? ` · ${r.rep.full_name}` : ""}` :
                  r.brand?.name;
                const avatar =
                  mode === "expert" ? r.expert?.photo_url :
                  mode === "brand_rep" ? r.rep?.photo_url :
                  (r.brand?.logo_url || (r.brand?.website_url ? `https://logo.clearbit.com/${r.brand.website_url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0]}` : null));
                return (
                  <li key={r.id}>
                    <button
                      onClick={() => setEditing(r)}
                      className="w-full text-left bg-events-cream/5 hover:bg-events-cream/10 border border-events-cream/10 rounded-2xl p-4 flex gap-3 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-events-cream/20 overflow-hidden flex items-center justify-center shrink-0">
                        {avatar ? (
                          <img src={avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-display text-xs text-events-teal">{(subject || "?").split(" ").map((w: string) => w[0]).join("").slice(0, 2)}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <div className="font-display font-bold truncate">{subject || "Untitled"}</div>
                          <div className="text-[10px] text-events-cream/40 font-body shrink-0">{relativeTime(r.created_at)}</div>
                        </div>
                        {r.private_notes && (
                          <p className="text-xs text-events-cream/60 font-body line-clamp-2 mt-1">{r.private_notes}</p>
                        )}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {(mode === "brand" || mode === "brand_rep") && (
                            r.message_sent_at ? (
                              <span className="text-[9px] uppercase tracking-wider font-display bg-events-coral/90 text-events-cream px-2 py-0.5 rounded-full">Note sent</span>
                            ) : (
                              <span className="text-[9px] uppercase tracking-wider font-display bg-events-cream/10 text-events-cream/60 px-2 py-0.5 rounded-full">Note not yet sent</span>
                            )
                          )}
                          {mode === "expert" && r.would_want_as_mentor && (
                            <span className="text-[9px] uppercase tracking-wider font-display bg-events-yellow/90 text-events-teal px-2 py-0.5 rounded-full">Mentor flagged</span>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </main>

        {editing && (
          <ConnectionForm
            open
            mode={modeFor(editing)}
            editingId={editing.id}
            brand={editing.brand}
            rep={editing.rep}
            expert={editing.expert}
            initial={{
              private_notes: editing.private_notes || "",
              follow_up_direction: editing.follow_up_direction || "",
              contact_info_received: editing.contact_info_received || "",
              role_flagged: editing.role_flagged || "",
              message_to_brand: editing.message_to_brand || "",
              would_want_as_mentor: editing.would_want_as_mentor,
              mentor_topics: editing.mentor_topics || "",
              also_talked_to: "",
            }}
            onClose={() => setEditing(null)}
            onSaved={load}
          />
        )}
      </div>
    </ImpersonationGate>
  );
};

export default ConnectConnections;
