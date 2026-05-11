// Brand-rep facing leads list. Reads brand_lead_responses scoped to the
// signed-in rep's brand. Branches into a CTA when no question is active.
import { useEffect, useMemo, useState } from "react";
import { Mail, Linkedin, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { brandLeadList, type BrandLeadResponse } from "@/lib/connect-session";
import CandidateProfileDrawer from "./CandidateProfileDrawer";

type Sort = "newest" | "by_response";

interface BrandConfig {
  id: string;
  name: string;
  lead_question_active?: boolean;
  lead_capture_visible_to_brand?: boolean;
  lead_question_text?: string | null;
}

interface Props {
  brand: BrandConfig;
}

type Lead = BrandLeadResponse & { candidate: any | null };

function csvEscape(s: any) {
  if (s == null) return "";
  const v = String(s).replace(/"/g, '""');
  return /[",\n]/.test(v) ? `"${v}"` : v;
}

function downloadCsv(brandSlug: string, rows: Lead[]) {
  const header = [
    "First name", "Last name", "Contact shared", "Email", "LinkedIn", "Current title",
    "Current company", "Response", "Date answered",
  ].join(",");
  const lines = rows.map((l) => {
    const shared = !!l.share_contact_info;
    return [
      l.candidate?.first_name, l.candidate?.last_name,
      shared ? "Yes" : "No",
      shared ? l.candidate?.email : "",
      shared ? l.candidate?.linkedin_url : "",
      l.candidate?.current_title, l.candidate?.current_company,
      l.response_label || l.response_value,
      new Date(l.updated_at).toISOString().slice(0, 10),
    ].map(csvEscape).join(",");
  });
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

function PromoCta({ brandName }: { brandName: string }) {
  const subject = encodeURIComponent(`Lead gen beta — ${brandName}`);
  return (
    <div className="bg-events-cream/5 border border-events-cream/10 rounded-2xl p-6 space-y-4">
      <h2 className="font-display text-xl text-events-cream">Want qualified leads from this event?</h2>
      <p className="font-body text-sm text-events-cream/80 leading-relaxed">
        You can add a custom question to your brand card that lets candidates flag themselves as
        interested in something specific. Think: "Interested in our new retail store?" "Want to be
        considered for ambassador roles?" "Excited about a new product launching soon?"
      </p>
      <p className="font-body text-sm text-events-cream/70">
        It's free during the beta. Reply to Jenna with your question and we'll set it up.
      </p>
      <Button
        asChild
        className="bg-events-coral hover:bg-events-coral/90 text-events-cream"
      >
        <a href={`mailto:jenna@wearetheoutdoorindustry.com?subject=${subject}`}>
          Email Jenna →
        </a>
      </Button>
    </div>
  );
}

export default function LeadsPanel({ brand }: Props) {
  const active = !!brand.lead_question_active;
  const visible = brand.lead_capture_visible_to_brand !== false;

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("newest");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!active || !visible) { setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    brandLeadList(brand.id)
      .then((r) => { if (!cancelled) setLeads(r.leads || []); })
      .catch((e) => { if (!cancelled) setError(e.message || "Failed to load"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [brand.id, active, visible]);

  const visibleList = useMemo(() => {
    let list = [...leads];
    if (sort === "by_response") {
      list.sort((a, b) => {
        const av = a.response_value || "";
        const bv = b.response_value || "";
        if (av === bv) return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        return av.localeCompare(bv);
      });
    } else {
      list.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    }
    return list;
  }, [leads, sort]);

  const brandSlug = brand.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "brand";

  // Branch: not active → CTA. Active but not visible → also CTA-style (rare,
  // tab is hidden upstream for that case anyway).
  if (!active || !visible) {
    return <PromoCta brandName={brand.name} />;
  }

  const subtitle = brand.lead_question_text
    ? `Candidates who answered: ${brand.lead_question_text}`
    : "Candidates who responded to your question.";

  return (
    <div className="space-y-4">
      <div className="bg-events-cream/5 border border-events-cream/10 rounded-2xl p-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <h2 className="font-display text-xl text-events-cream">Leads from candidates</h2>
            <p className="text-events-cream/60 text-xs font-body mt-0.5">{subtitle}</p>
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
          <span className="font-display text-events-cream">{leads.length}</span> leads total.
        </p>
      </div>

      <div className="flex justify-end">
        <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
          <SelectTrigger className="w-[200px] max-w-[55vw] bg-events-cream/5 border-events-cream/20 text-events-cream">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="by_response">Group by response</SelectItem>
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
      {!loading && !error && visibleList.length === 0 && (
        <div className="py-12 text-center text-events-cream/60 font-body text-sm">
          No leads yet.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visibleList.map((l) => {
          const c = l.candidate;
          if (!c) return null;
          const responseText = l.response_label
            || (l.response_value === "soon" ? "Soon"
                : l.response_value === "eventually" ? "Eventually"
                : l.response_value);
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
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-display uppercase tracking-wider border bg-events-coral/20 text-events-coral border-events-coral/40">
                      {responseText}
                    </span>
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
