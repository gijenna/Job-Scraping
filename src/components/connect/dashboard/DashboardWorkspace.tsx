import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import DashboardFilters, { type Filters } from "./DashboardFilters";
import VirtualCandidateList from "./VirtualCandidateList";
import CandidateProfileDrawer from "./CandidateProfileDrawer";
import { dashboardSummary } from "@/lib/connect-session";

function MetricPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-events-cream/5 border border-events-cream/10 rounded-xl px-3 py-2">
      <div className="text-events-cream font-display text-xl">{value}</div>
      <div className="text-events-cream/50 text-[10px] uppercase tracking-wider font-body">{label}</div>
    </div>
  );
}

export default function DashboardWorkspace({ rep }: { rep: any }) {
  const [summary, setSummary] = useState<any>(null);
  const [filters, setFilters] = useState<Filters>({});
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => { dashboardSummary().then(setSummary).catch(() => {}); }, []);
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
          <MetricPill label="Registered" value={totals.registered} />
          <MetricPill label="Visited table" value={totals.visited} />
          <MetricPill label="Sent a note" value={totals.sent_note} />
          <MetricPill label="Starred you" value={totals.starred} />
        </div>
      </div>

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

        <main className="flex-1 min-w-0 md:max-h-[calc(100vh-220px)]">
          <div className="hidden md:flex justify-end mb-2">
            <SortSelect sort={sort} setSort={setSort} />
          </div>
          <VirtualCandidateList
            filters={filters} search={debouncedSearch} sort={sort}
            onOpen={setOpenId}
          />
        </main>
      </div>

      <CandidateProfileDrawer id={openId} open={!!openId} onClose={() => setOpenId(null)} />
    </div>
  );
}

function SortSelect({ sort, setSort }: { sort: string; setSort: (s: string) => void }) {
  return (
    <Select value={sort} onValueChange={setSort}>
      <SelectTrigger className="w-[220px] bg-events-cream/5 border-events-cream/20 text-events-cream">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="most_recent_activity">Most recent activity</SelectItem>
        <SelectItem value="most_complete">Most complete profile</SelectItem>
        <SelectItem value="connected_first">Connected with my brand first</SelectItem>
        <SelectItem value="note_first">Sent a note first</SelectItem>
        <SelectItem value="pre_event_first">Pre-event reached out first</SelectItem>
      </SelectContent>
    </Select>
  );
}
