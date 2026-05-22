import { useEffect, useImperativeHandle, useState, forwardRef } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import DashboardFilters, { type Filters } from "./DashboardFilters";
import VirtualCandidateList from "./VirtualCandidateList";
import CandidateProfileDrawer from "./CandidateProfileDrawer";
import LeadsPanel from "./LeadsPanel";
import RepEditModal from "./RepEditModal";
import BrandCardEditModal from "./BrandCardEditModal";
import BrandCardPreview from "./BrandCardPreview";
import BrandTeamSection, { InviteLinkPill } from "./BrandTeamSection";
import ExpertCardCompact from "@/components/experts/ExpertCardCompact";
import { Pencil, Copy, Check, PartyPopper } from "lucide-react";
import { dashboardSummary } from "@/lib/connect-session";
import { useEventSettings } from "@/hooks/useEventSettings";

function AfterpartyInviteLink() {
  const { settings } = useEventSettings("outsidedays26-brand-dashboard");
  const text = settings.dashboard_afterparty_invite_text || "Come to the afterparty";
  const url = settings.dashboard_afterparty_invite_url || "https://basecampoutdoorevents.com/afterparty";
  const faqUrl = settings.dashboard_parking_info_url || "https://docs.google.com/document/d/1TSBxwK0rEYrD8Tk198aWHt_XkZhVAoP37RQEg7hnJRE/edit";
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-xs font-display uppercase tracking-wider bg-events-yellow/15 hover:bg-events-yellow/25 text-events-yellow border border-events-yellow/40 px-4 py-2 rounded-full transition-colors"
      >
        <PartyPopper className="w-3.5 h-3.5" />
        {text}
      </a>
      <a
        href={faqUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-xs font-display uppercase tracking-wider bg-events-coral hover:bg-events-coral/90 text-events-cream px-4 py-2 rounded-full transition-colors shadow-sm"
      >
        Parking & set-up info
      </a>
    </div>
  );
}

function ShareMyCardPill({ rep }: { rep: any }) {
  const [copied, setCopied] = useState(false);
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const slug = rep?.slug;
  const url = slug ? `https://${projectId}.supabase.co/functions/v1/expert-og/${encodeURIComponent(slug)}/denver` : "";
  const onCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  if (!slug) return null;
  return (
    <div className="flex flex-col items-start gap-2" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex items-center gap-2 text-xs font-display uppercase tracking-wider bg-events-cream/10 hover:bg-events-cream/20 text-events-cream border border-events-cream/25 px-4 py-2 rounded-full transition-colors"
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? "Link copied" : "Share my card"}
      </button>
      <p className="text-[12px] text-events-cream/75 font-body leading-relaxed">
        We encourage you to let your networks know you'll be at the event! This link goes directly to your card, and anyone who visits will be able to check you out, and register to attend.
      </p>
      <p className="text-[11px] text-events-cream/50 font-body italic">Personal brand win, as a bonus!</p>
    </div>
  );
}

type Tab = "candidates" | "leads";

function MetricPill({ label, value, onClick, active }: { label: string; value: number; onClick?: () => void; active?: boolean }) {
  const Comp: any = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className={`text-left bg-events-cream/5 border rounded-xl px-3 py-2 transition-colors ${
        onClick ? "hover:border-events-coral/60 cursor-pointer" : ""
      } ${active ? "border-events-coral bg-events-coral/10" : "border-events-cream/10"}`}
    >
      <div className="text-events-cream font-display text-xl">{value}</div>
      <div className="text-events-cream/50 text-[10px] uppercase tracking-wider font-body">{label}</div>
    </Comp>
  );
}

export default function DashboardWorkspace({ rep, onEditCardUrl, openEditSignal }: { rep: any; onEditCardUrl?: (url: string) => void; openEditSignal?: number }) {
  const [summary, setSummary] = useState<any>(null);
  const [filters, setFilters] = useState<Filters>({});
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [openId, setOpenId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("candidates");
  const [repEditOpen, setRepEditOpen] = useState(false);
  const [brandEditOpen, setBrandEditOpen] = useState(false);
  const [currentRep, setCurrentRep] = useState<any>(rep);
  const [editCardUrl, setEditCardUrl] = useState<string | null>(null);

  // Industry experts edit their card on the public ExpertInvite page, not in the
  // brand modal. Detect by URL pattern: /Denverexperts/ (or any */experts/ path).
  const isExpertEditUrl = (u?: string | null) => !!u && /\/[A-Za-z]+experts\//i.test(u);
  const openEditCard = () => {
    if (isExpertEditUrl(editCardUrl)) {
      window.open(editCardUrl as string, "_blank", "noopener");
    } else {
      setRepEditOpen(true);
    }
  };

  useEffect(() => { dashboardSummary().then((s) => {
    setSummary(s);
    if (s?.edit_card_url) { setEditCardUrl(s.edit_card_url); onEditCardUrl?.(s.edit_card_url); }
  }).catch(() => {}); }, []);
  useEffect(() => {
    if (openEditSignal && openEditSignal > 0) openEditCard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openEditSignal]);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const brand = summary?.brand;
  const totals = summary?.totals || { registered: 0, visited: 0, sent_note: 0, starred: 0, flagged: 0 };

  const filterPanel = (
    <DashboardFilters
      filters={filters} onChange={setFilters}
      search={search} onSearch={setSearch}
      hasVisited={totals.visited > 0}
    />
  );

  return (
    <div className="-mx-4 md:mx-0">
      {/* Header strip */}
      <div className="bg-events-cream/5 border border-events-cream/10 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          {brand?.logo_url && (
            <div className="w-12 h-12 bg-events-cream rounded-full p-1.5 shrink-0">
              <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-xl text-events-cream truncate">
              {brand?.name || rep?.current_company || "Your brand"}
            </h2>
            <p className="text-events-cream/60 text-xs font-body">
              Signed in as {rep?.full_name}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
          <MetricPill
            label="Registered" value={totals.registered}
            onClick={() => setFilters({})}
            active={Object.keys(filters).length === 0}
          />
          <MetricPill
            label="Visited table" value={totals.visited}
            onClick={() => setFilters({ visited: true })}
            active={!!filters.visited}
          />
          <MetricPill
            label="Sent a note" value={totals.sent_note}
            onClick={() => setFilters({ pre_event_note: true, during_event_note: true, post_event_note: true })}
            active={!!(filters.pre_event_note || filters.during_event_note || filters.post_event_note)}
          />
          <MetricPill
            label="Starred you" value={totals.starred}
            onClick={() => setFilters({ starred_brand: true })}
            active={!!filters.starred_brand}
          />
        </div>
      </div>

      {/* Two-up preview row: rep card (always) + brand card (if linked) */}
      <div className={`grid gap-4 mb-4 ${brand ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
        <div className="flex flex-col">
          <div
            onClick={openEditCard}
            className="cursor-pointer group relative bg-events-cream/5 border border-events-cream/10 hover:border-events-coral/60 rounded-2xl p-4 transition-colors"
          >
            <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-display bg-events-coral/90 text-events-cream px-2.5 py-1 rounded-full opacity-90 group-hover:opacity-100">
              <Pencil className="w-2.5 h-2.5" /> Edit my card
            </span>
            <div className="pt-7 flex flex-col sm:flex-row gap-4 items-start">
              <div className="shrink-0 w-full sm:w-auto sm:max-w-[260px]">
                <ExpertCardCompact expert={(currentRep || rep) as any} />
              </div>
              <div className="flex-1 min-w-0 sm:pt-2">
                <ShareMyCardPill rep={currentRep || rep} />
              </div>
            </div>
          </div>
          <AfterpartyInviteLink />
        </div>

        {brand && (
          <div className="flex flex-col">
            <BrandCardPreview
              brand={brand}
              onClick={() => setBrandEditOpen(true)}
              footerSlot={<InviteLinkPill brand={brand} />}
              flushBottom
            />
            <BrandTeamSection brand={brand} />
          </div>
        )}
      </div>

      <RepEditModal
        open={repEditOpen}
        onClose={() => setRepEditOpen(false)}
        rep={currentRep || rep}
        onSaved={(newRep) => { if (newRep) setCurrentRep(newRep); }}
      />
      {brand && (
        <BrandCardEditModal
          open={brandEditOpen}
          onClose={() => setBrandEditOpen(false)}
          brand={brand}
          onSaved={(newBrand) => { if (newBrand) setSummary((s: any) => ({ ...s, brand: newBrand })); }}
        />
      )}

      {/* Tabs */}
      {(() => {
        const leadsActive = !!brand?.lead_question_active;
        const leadsVisible = brand?.lead_capture_visible_to_brand !== false;
        const showLeadsTab = !leadsActive || leadsVisible; // hide only when active && !visible
        return (
          <>
            <div className="border-t border-events-cream/10 mt-8 pt-6 mb-4">
              <h2 className="font-afterparty text-2xl md:text-3xl text-events-cream">Candidate Zone</h2>
            </div>
            <div className="flex items-center gap-1.5 mb-4">
              {([
                { v: "candidates", label: "Candidates" },

              ...(showLeadsTab ? [{ v: "leads", label: "Leads" } as const] : []),
            ] as { v: Tab; label: string }[]).map((t) => (
              <button
                key={t.v}
                onClick={() => setTab(t.v)}
                className={`px-4 py-2 rounded-full text-xs font-display uppercase tracking-wider border transition-colors ${
                  tab === t.v
                    ? "bg-events-coral text-events-cream border-events-coral"
                    : "bg-events-cream/5 text-events-cream/70 border-events-cream/15 hover:border-events-cream/40"
                }`}
              >
                {t.label}
              </button>
            ))}
            </div>
          </>
        );
      })()}

      {tab === "candidates" ? (
        <div className="flex flex-col md:flex-row gap-4 md:items-start">
          {/* Mobile filter trigger */}
          <div className="md:hidden flex items-center justify-between gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="bg-events-cream/5 border-events-cream/20 text-events-cream">
                  <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters & search
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[88vw] sm:w-[400px] bg-events-teal border-events-cream/10 overflow-y-auto">
                <div className="pt-4">{filterPanel}</div>
              </SheetContent>
            </Sheet>
            <SortSelect sort={sort} setSort={setSort} />
          </div>

          {/* Desktop sidebar */}
          <aside className="hidden md:block w-[320px] shrink-0 max-h-[calc(100vh-220px)] overflow-y-auto pr-2 sticky top-4">
            {filterPanel}
          </aside>

          <main className="flex-1 min-w-0 md:max-h-[calc(100vh-220px)] md:overflow-y-auto md:pr-2">
            <div className="hidden md:flex justify-end mb-2">
              <SortSelect sort={sort} setSort={setSort} />
            </div>
            <VirtualCandidateList
              filters={filters} search={debouncedSearch} sort={sort}
              onOpen={setOpenId}
            />
          </main>
        </div>
      ) : brand ? (
        <LeadsPanel brand={brand} />
      ) : (
        <div className="py-12 text-center text-events-cream/60 font-body text-sm">
          Leads will show up here once your brand is linked.
        </div>
      )}

      <CandidateProfileDrawer id={openId} open={!!openId} onClose={() => setOpenId(null)} />
    </div>
  );
}

function SortSelect({ sort, setSort }: { sort: string; setSort: (s: string) => void }) {
  const labels: Record<string, string> = {
    newest: "Newest",
    most_complete: "Most complete profiles",
  };
  return (
    <Select value={sort} onValueChange={setSort}>
      <SelectTrigger className="w-[240px] max-w-[70vw] bg-events-cream/5 border-events-cream/20 text-events-cream">
        <span className="truncate">Sort by: {labels[sort] || "Newest"}</span>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="most_complete">Most complete profiles</SelectItem>
      </SelectContent>
    </Select>
  );
}
