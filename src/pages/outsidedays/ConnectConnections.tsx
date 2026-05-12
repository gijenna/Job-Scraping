// "My Connections" view for Outside Days candidates.

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import ImpersonationGate from "@/components/connect/ImpersonationGate";
import { connectionsList } from "@/lib/connect-session";
import ConnectionSummary from "@/components/connect/ConnectionSummary";
import ConnectBottomNav, { ConnectTopNav } from "@/components/connect/ConnectBottomNav";

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

// May 28, 2026 7:00 PM Mountain Time = 2026-05-29T01:00:00Z
const EVENT_END = new Date("2026-05-29T01:00:00Z");

const EmptyConnectionsState = () => {
  const isPreEvent = Date.now() < EVENT_END.getTime();
  if (!isPreEvent) {
    return (
      <div className="py-12 px-2 text-center space-y-5">
        <h2 className="font-afterparty text-2xl text-events-cream">No connections logged.</h2>
        <p className="font-body text-events-cream/75 max-w-md mx-auto">
          You didn't log any connections at the event. If you remember anyone you talked to, you can still add them here.
        </p>
        <Link
          to="/outsidedays26/connect/home"
          className="inline-block bg-events-coral text-events-cream px-5 py-2.5 rounded-full font-display uppercase tracking-wider text-xs"
        >
          Add a connection
        </Link>
      </div>
    );
  }
  const Bullet = ({ children }: { children: React.ReactNode }) => (
    <li className="flex gap-3 items-start font-body text-sm md:text-base text-events-cream/85 leading-relaxed">
      <span className="text-events-coral font-bold flex-shrink-0">✓</span>
      <span className="flex-1">{children}</span>
    </li>
  );
  return (
    <div className="py-8 px-2 space-y-7">
      <div className="space-y-3 text-center">
        <h2 className="font-afterparty text-2xl md:text-3xl text-events-cream leading-tight">
          No connections yet, and that's expected.
        </h2>
        <p className="font-body text-events-cream/80 max-w-md mx-auto">
          You'll log connections at the event itself, on May 28. This is your spot to remember everyone you talked to.
        </p>
      </div>

      <div className="bg-events-cream/5 border border-events-cream/10 rounded-2xl p-5 space-y-3">
        <h3 className="font-display uppercase tracking-wider text-xs text-events-cream/70">Right now you can:</h3>
        <ul className="space-y-2.5">
          <Bullet>Browse the map or list to research who's coming</Bullet>
          <Bullet>Send notes to specific reps and experts you want to meet</Bullet>
          <Bullet>Star the brands you want to visit so you don't forget on the day</Bullet>
          <Bullet><strong className="font-semibold text-events-cream">Keep your profile current.</strong> Brands are searching the database for talent before the event.</Bullet>
        </ul>
      </div>

      <div className="bg-events-cream/5 border border-events-cream/10 rounded-2xl p-5 space-y-3">
        <h3 className="font-display uppercase tracking-wider text-xs text-events-cream/70">At the event, this tab will hold:</h3>
        <ul className="space-y-2.5">
          <Bullet>Every brand you tap "I visited" on</Bullet>
          <Bullet>Every connection you log with reps and experts</Bullet>
          <Bullet>The notes you wrote (private and shared)</Bullet>
          <Bullet>Follow-up directions, contact info, and role flags</Bullet>
        </ul>
      </div>

      <p className="font-body text-events-cream/90 italic text-center max-w-md mx-auto pt-2">
        Lines will be long. Use your wait time to log here. Your future self will thank you.
      </p>

      <div className="text-center">
        <Link
          to="/outsidedays26/connect/home"
          className="inline-block bg-events-coral text-events-cream px-5 py-2.5 rounded-full font-display uppercase tracking-wider text-xs"
        >
          Open the map
        </Link>
      </div>
    </div>
  );
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

  const modeFor = (r: any): "brand" | "brand_rep" | "expert" =>
    r.expert_id ? "expert" : r.brand_rep_id ? "brand_rep" : "brand";

  return (
    <ImpersonationGate>
      <div className="min-h-screen bg-events-teal text-events-cream pb-24 sm:pb-0">
        <header className="px-4 py-3 border-b border-events-cream/10 flex items-center gap-3 sticky top-0 bg-events-teal/95 backdrop-blur z-30">
          <button onClick={() => nav("/outsidedays26/connect/home")} className="text-events-cream/80 -ml-1 p-1 sm:hidden">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="font-afterparty text-2xl leading-none flex-1">My Connections</h1>
          <ConnectTopNav />
        </header>

        <main className="px-4 py-5 max-w-2xl mx-auto">
          {loading ? (
            <p className="text-events-cream/50 font-body text-sm text-center py-12">Loading.</p>
          ) : rows.length === 0 ? (
            <EmptyConnectionsState />
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
          <ConnectionSummary
            connection={editing}
            mode={modeFor(editing)}
            onClose={() => setEditing(null)}
            onChanged={load}
          />
        )}
        <ConnectBottomNav />
      </div>
    </ImpersonationGate>
  );
};

export default ConnectConnections;
