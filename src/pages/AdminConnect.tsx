import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Star, Users, MessageSquare } from "lucide-react";

type Analytics = {
  totals: {
    candidates: number;
    connections: number;
    notes: number;
    stars: number;
    candidates_who_sent_notes: number;
    candidates_who_starred: number;
  };
  notes_by_timing: { pre_event: number; during_event: number; post_event: number };
  signup_modes: Record<string, number>;
  top_brands_by_notes: { brand_id: string; name: string; logo_url: string | null; count: number }[];
  top_brands_by_stars: { brand_id: string; name: string; logo_url: string | null; count: number }[];
};

export default function AdminConnect() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const isAnon = (user as any)?.is_anonymous === true || !user?.email;
      if (!user || isAnon) {
        if (user && isAnon) await supabase.auth.signOut();
        navigate("/admin");
        return;
      }
      setAuthed(true);
      try {
        const { data: res, error: e } = await supabase.functions.invoke("connect-admin", { body: {} });
        if (e) throw e;
        setData(res as Analytics);
      } catch (e: any) {
        setError(e?.message || "Failed to load analytics");
      }
    })();
  }, [navigate]);

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-events-teal">
      <div className="border-b border-events-cream/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/events")} className="text-events-cream/60 hover:text-events-cream">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <h1 className="font-display text-2xl font-bold text-events-cream">
              Connect <span className="text-events-coral">Analytics</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {error && <div className="text-events-coral text-sm">{error}</div>}
        {!data && !error && <div className="text-events-cream/60">Loading…</div>}
        {data && (
          <>
            <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <Stat icon={<Users className="w-4 h-4" />} label="Candidates" value={data.totals.candidates} />
              <Stat icon={<MessageSquare className="w-4 h-4" />} label="Notes" value={data.totals.notes} />
              <Stat icon={<Star className="w-4 h-4" />} label="Stars" value={data.totals.stars} />
              <Stat icon={<Users className="w-4 h-4" />} label="Connections" value={data.totals.connections} />
              <Stat icon={<Mail className="w-4 h-4" />} label="Sent ≥1 note" value={data.totals.candidates_who_sent_notes} />
              <Stat icon={<Star className="w-4 h-4" />} label="Starred ≥1" value={data.totals.candidates_who_starred} />
            </section>

            <section className="grid md:grid-cols-2 gap-4">
              <Card title="Notes by timing">
                <BarRow label="Pre-event" value={data.notes_by_timing.pre_event} max={Math.max(1, ...Object.values(data.notes_by_timing))} />
                <BarRow label="During event" value={data.notes_by_timing.during_event} max={Math.max(1, ...Object.values(data.notes_by_timing))} />
                <BarRow label="Post-event" value={data.notes_by_timing.post_event} max={Math.max(1, ...Object.values(data.notes_by_timing))} />
              </Card>
              <Card title="Signup mode">
                {Object.entries(data.signup_modes).map(([k, v]) => (
                  <BarRow key={k} label={k} value={v} max={Math.max(1, ...Object.values(data.signup_modes))} />
                ))}
              </Card>
            </section>

            <section className="grid md:grid-cols-2 gap-4">
              <Card title="Top brands by notes received">
                <BrandList items={data.top_brands_by_notes} />
              </Card>
              <Card title="Top brands by stars">
                <BrandList items={data.top_brands_by_stars} />
              </Card>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-events-cream/10 bg-events-cream/5 p-3">
      <div className="flex items-center gap-2 text-events-cream/60 text-xs">{icon}{label}</div>
      <div className="font-display text-2xl text-events-cream mt-1">{value}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-events-cream/10 bg-events-cream/5 p-4">
      <div className="text-events-cream font-medium mb-3">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function BarRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-sm text-events-cream/80">
        <span className="capitalize">{label.replace(/_/g, " ")}</span>
        <span className="tabular-nums">{value}</span>
      </div>
      <div className="h-2 rounded bg-events-cream/10 overflow-hidden mt-1">
        <div className="h-full bg-events-coral" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function BrandList({ items }: { items: { brand_id: string; name: string; logo_url: string | null; count: number }[] }) {
  if (!items.length) return <div className="text-events-cream/50 text-sm">No data yet.</div>;
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div className="space-y-2">
      {items.map((b) => (
        <div key={b.brand_id} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-events-cream/10 overflow-hidden flex items-center justify-center shrink-0">
            {b.logo_url ? <img src={b.logo_url} alt={b.name} className="w-full h-full object-contain" /> : <span className="text-xs text-events-cream/60">{b.name.slice(0, 1)}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-events-cream truncate">{b.name}</div>
            <div className="h-1.5 rounded bg-events-cream/10 overflow-hidden mt-1">
              <div className="h-full bg-events-yellow" style={{ width: `${(b.count / max) * 100}%` }} />
            </div>
          </div>
          <div className="text-events-cream tabular-nums text-sm">{b.count}</div>
        </div>
      ))}
    </div>
  );
}
