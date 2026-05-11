import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { isAdminUser } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Linkedin, ExternalLink, Download } from "lucide-react";

type Brand = {
  id: string;
  name: string;
  lead_capture_visible_to_brand?: boolean;
  lead_question_text?: string | null;
};

type Candidate = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  linkedin_url: string | null;
  current_title: string | null;
  current_company: string | null;
  photo_url: string | null;
};

type Lead = {
  id: string;
  brand_id: string;
  candidate_id: string;
  response_value: string;
  response_label: string | null;
  question_text: string;
  created_at: string;
  updated_at: string;
  brand: Brand | null;
  candidate: Candidate | null;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const csvEscape = (v: string | null | undefined) => {
  const s = (v ?? "").toString().replace(/"/g, '""');
  return `"${s}"`;
};

const exportBrandCsv = (brandName: string, leads: Lead[]) => {
  const header = ["Name", "Email", "Title", "Company", "LinkedIn", "Response", "Answered At"].map(csvEscape).join(",");
  const rows = leads.map((l) => [
    `${l.candidate?.first_name || ""} ${l.candidate?.last_name || ""}`.trim(),
    l.candidate?.email || "",
    l.candidate?.current_title || "",
    l.candidate?.current_company || "",
    l.candidate?.linkedin_url || "",
    l.response_label || l.response_value,
    new Date(l.updated_at).toISOString(),
  ].map(csvEscape).join(","));
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${brandName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-leads.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export default function AdminLeads() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!isAdminUser(user)) {
        if (user) await supabase.auth.signOut();
        navigate("/admin");
        return;
      }
      setAuthed(true);
      try {
        const { data, error: e } = await supabase.functions.invoke("admin-leads", { body: {} });
        if (e) throw e;
        setLeads((data?.leads as Lead[]) || []);
      } catch (e: any) {
        setError(e?.message || "Failed to load leads");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // Group leads by brand_id
  const brandsWithLeads = useMemo(() => {
    const map = new Map<string, { brand: Brand; leads: Lead[] }>();
    for (const l of leads) {
      if (!l.brand) continue;
      const existing = map.get(l.brand_id);
      if (existing) existing.leads.push(l);
      else map.set(l.brand_id, { brand: l.brand, leads: [l] });
    }
    return Array.from(map.values()).sort((a, b) => a.brand.name.localeCompare(b.brand.name));
  }, [leads]);

  const visibleSections = selectedBrandId === "all"
    ? brandsWithLeads
    : brandsWithLeads.filter((s) => s.brand.id === selectedBrandId);

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-events-teal">
      <div className="border-b border-events-cream/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/connect")} className="text-events-cream/60 hover:text-events-cream">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <h1 className="font-display text-2xl font-bold text-events-cream">
              All <span className="text-events-coral">Leads</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <p className="text-events-cream/70 font-body text-sm">
          Lead responses from candidates across all brands.
        </p>

        {error && <div className="text-events-coral text-sm">{error}</div>}
        {loading && <div className="text-events-cream/60">Loading…</div>}

        {!loading && !error && brandsWithLeads.length === 0 && (
          <div className="rounded-xl border border-events-cream/10 bg-events-cream/5 p-8 text-center text-events-cream/70 font-body">
            No leads have been captured yet. Once candidates answer brand lead questions, they'll appear here.
          </div>
        )}

        {brandsWithLeads.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-events-cream/70 text-sm font-body">Filter by brand</label>
            <select
              value={selectedBrandId}
              onChange={(e) => setSelectedBrandId(e.target.value)}
              className="bg-events-cream/10 border border-events-cream/20 text-events-cream text-sm rounded-md px-3 py-1.5 font-body"
            >
              <option value="all">All brands</option>
              {brandsWithLeads.map((s) => (
                <option key={s.brand.id} value={s.brand.id}>{s.brand.name} ({s.leads.length})</option>
              ))}
            </select>
          </div>
        )}

        {visibleSections.map(({ brand, leads: brandLeads }) => (
          <section key={brand.id} className="rounded-xl border border-events-cream/10 bg-events-cream/5 p-4 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-display text-lg text-events-cream">
                  {brand.name} <span className="text-events-cream/50 text-sm">({brandLeads.length})</span>
                </h2>
                {brand.lead_question_text && (
                  <p className="text-events-cream/60 font-body text-sm mt-1">{brand.lead_question_text}</p>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => exportBrandCsv(brand.name, brandLeads)}
                className="text-events-cream/70 hover:text-events-cream shrink-0"
              >
                <Download className="w-4 h-4 mr-1" /> Export CSV
              </Button>
            </div>

            <div className="space-y-2">
              {brandLeads.map((l) => {
                const c = l.candidate;
                const fullName = `${c?.first_name || ""} ${c?.last_name || ""}`.trim() || "Unknown";
                const initials = fullName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
                return (
                  <div key={l.id} className="flex items-center gap-3 p-3 rounded-lg bg-events-teal/40 border border-events-cream/10">
                    <div className="w-10 h-10 rounded-full bg-events-cream/10 overflow-hidden flex items-center justify-center shrink-0">
                      {c?.photo_url ? (
                        <img src={c.photo_url} alt={fullName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-events-cream/70 text-xs font-display">{initials}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-events-cream font-body text-sm truncate">{fullName}</div>
                      <div className="text-events-cream/50 text-xs truncate">
                        {[c?.current_title, c?.current_company].filter(Boolean).join(" @ ")}
                      </div>
                    </div>
                    <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full bg-events-coral/15 text-events-coral text-[11px] font-display uppercase tracking-wider shrink-0">
                      {l.response_label || l.response_value}
                    </span>
                    <span className="hidden md:inline text-events-cream/40 text-xs font-body shrink-0">
                      {formatDate(l.updated_at)}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      {c?.email && (
                        <a href={`mailto:${c.email}`} aria-label="Email" className="w-8 h-8 rounded-full bg-events-cream/10 hover:bg-events-cream/20 text-events-cream flex items-center justify-center">
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {c?.linkedin_url && (
                        <a href={c.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-8 h-8 rounded-full bg-events-cream/10 hover:bg-events-cream/20 text-events-cream flex items-center justify-center">
                          <Linkedin className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
