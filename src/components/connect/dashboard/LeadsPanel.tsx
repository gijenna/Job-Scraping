// Brand-rep facing leads list. Reads brand_lead_responses scoped to the
// signed-in rep's brand. Filter chips, sort selector, CSV export.
import { useEffect, useMemo, useState } from "react";
import { Mail, Linkedin, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { brandLeadList, type BrandLeadResponse } from "@/lib/connect-session";
import CandidateProfileDrawer from "./CandidateProfileDrawer";

type Filter = "all" | "soon" | "eventually";
type Sort = "newest" | "by_response";

interface Props {
  brandId: string;
  brandName: string;
}

type Lead = BrandLeadResponse & { candidate: any | null };

function ResponseChip({ value }: { value: "soon" | "eventually" }) {
  const cls = value === "soon"
    ? "bg-events-coral/20 text-events-coral border-events-coral/40"
    : "bg-events-yellow/20 text-events-yellow border-events-yellow/40";
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-display uppercase tracking-wider border ${cls}`}>
      {value === "soon" ? "Soon" : "Eventually"}
    </span>
  );
}

function csvEscape(s: any) {
  if (s == null) return "";
  const v = String(s).replace(/"/g, '""');
  return /[",\n]/.test(v) ? `"${v}"` : v;
}

function downloadCsv(brandSlug: string, rows: Lead[]) {
  const header = [
    "First name", "Last name", "Email", "LinkedIn", "Current title",
    "Current company", "Response", "Date answered",
  ].join(",");
  const lines = rows.map((l) => [
    l.candidate?.first_name, l.candidate?.last_name, l.candidate?.email,
    l.candidate?.linkedin_url, l.candidate?.current_title, l.candidate?.current_company,
    l.response_value === "soon" ? "Soon" : "Eventually",
    new Date(l.updated_at).toISOString().slice(0, 10),
  ].map(csvEscape).join(","));
  const today = new Date().toISOString().slice(0, 10);
  const blob = new Blob([header + "\n" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${brandSlug}-leads-${today}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function LeadsPanel({ brandId, brandName }: Props) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("newest");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    brandLeadList(brandId)
      .then((r) => { if (!cancelled) setLeads(r.leads || []); })
      .catch((e) => { if (!cancelled) setError(e.message || "Failed to load"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [brandId]);

  const total = leads.length;
  const soonCount = leads.filter((l) => l.response_value === "soon").length;
  const eventuallyCount = leads.filter((l) => l.response_value === "eventually").length;

  const visible = useMemo(() => {
    let list = filter === "all" ? leads : leads.filter((l) => l.response_value === filter);
    if (sort === "by_response") {
      list = [...list].sort((a, b) => {
        if (a.response_value === b.response_value) {
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        }
        return a.response_value === "soon" ? -1 : 1;
      });
    } else {
      list = [...list].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    }
    return list;
  }, [leads, filter, sort]);

  const brandSlug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "brand";

  return (
    <div className="space-y-4">
      <div className="bg-events-cream/5 border border-events-cream/10 rounded-2xl p-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <h2 className="font-display text-xl text-events-cream">Leads from candidates</h2>
            <p className="text-events-cream/60 text-xs font-body mt-0.5">
              Candidates who said they'd remember Kelly for future web work.
            </p>
          </div>
          <Button
            onClick={() => downloadCsv(brandSlug, leads)}
            disabled={!leads.length}
            className="bg-events-coral hover:bg-events-coral/90 text-events-cream"
          >
            <Download className="w-4 h-4 mr-2" /> Export to CSV
          </Button>
        </div>
        <p className="mt-3 font-body text-sm text-events-cream/80">
          <span className="font-display text-events-cream">{total}</span> leads total.{" "}
          <span className="text-events-coral font-display">{soonCount}</span> said "soon,"{" "}
          <span className="text-events-yellow font-display">{eventuallyCount}</span> said "eventually."
        </p>
      </div>

      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {(["all", "soon", "eventually"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-display uppercase tracking-wider border transition-colors ${
                filter === f
                  ? "bg-events-coral text-events-cream border-events-coral"
                  : "bg-events-cream/5 text-events-cream/70 border-events-cream/15 hover:border-events-cream/40"
              }`}
            >
              {f === "all" ? "All leads" : f === "soon" ? "Soon" : "Eventually"}
            </button>
          ))}
        </div>
        <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
          <SelectTrigger className="w-[200px] max-w-[55vw] bg-events-cream/5 border-events-cream/20 text-events-cream">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="by_response">Soon first, then eventually</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading && (
        <div className="py-12 flex items-center justify-center text-events-cream/60">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      )}
      {error && (
        <div className="py-6 text-center text-events-coral font-body text-sm">{error}</div>
      )}
      {!loading && !error && visible.length === 0 && (
        <div className="py-12 text-center text-events-cream/60 font-body text-sm">
          No leads {filter === "all" ? "yet" : `marked "${filter}"`}.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visible.map((l) => {
          const c = l.candidate;
          if (!c) return null;
          return (
            <div
              key={l.id}
              className="bg-events-cream/5 border border-events-cream/10 rounded-2xl p-4 hover:border-events-cream/30 transition-colors"
            >
              <div className="flex gap-3">
                {c.photo_url ? (
                  <img src={c.photo_url} alt={c.first_name} className="w-14 h-16 object-cover rounded-sm shadow -rotate-2 shrink-0" />
                ) : (
                  <div className="w-14 h-16 rounded-sm bg-events-cream/10 flex items-center justify-center text-events-cream/40 -rotate-2 font-display text-xl shrink-0">
                    {c.first_name?.[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-display text-events-cream text-base leading-tight">
                    {c.first_name} {c.last_name}
                  </p>
                  <p className="text-events-cream/60 text-xs font-body mt-0.5 truncate">
                    {[c.current_title, c.current_company].filter(Boolean).join(" @ ")}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <ResponseChip value={l.response_value} />
                    <span className="text-events-cream/40 text-[11px] font-body">
                      {new Date(l.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {c.email && (
                  <Button variant="ghost" size="sm"
                    onClick={() => { window.location.href = `mailto:${c.email}`; }}
                    className="text-events-coral hover:text-events-cream h-7 px-2"
                  >
                    <Mail className="w-3.5 h-3.5 mr-1.5" /> Email
                  </Button>
                )}
                {c.linkedin_url && (
                  <Button variant="ghost" size="sm"
                    onClick={() => window.open(c.linkedin_url, "_blank", "noopener")}
                    className="text-events-coral hover:text-events-cream h-7 px-2"
                  >
                    <Linkedin className="w-3.5 h-3.5 mr-1.5" /> LinkedIn
                  </Button>
                )}
                <Button variant="ghost" size="sm"
                  onClick={() => setOpenId(c.id)}
                  className="text-events-cream/70 hover:text-events-cream h-7 px-2 ml-auto"
                >
                  View full profile
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <CandidateProfileDrawer id={openId} open={!!openId} onClose={() => setOpenId(null)} />
    </div>
  );
}
