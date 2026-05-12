import { useEffect, useState, useCallback } from "react";
import CandidateCard from "./CandidateCard";
import { dashboardList } from "@/lib/connect-session";
import type { Filters } from "./DashboardFilters";

export default function VirtualCandidateList({
  filters, search, sort, onOpen,
}: { filters: Filters; search: string; sort: string; onOpen: (id: string) => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setItems([]); setPage(0); setHasMore(true);
    dashboardList({ filters, search, sort, page: 0, page_size: 50 }).then((r) => {
      if (cancelled) return;
      setItems(r.candidates);
      setTotal(r.total);
      setHasMore(r.candidates.length >= 50);
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [JSON.stringify(filters), search, sort]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const next = page + 1;
    const r = await dashboardList({ filters, search, sort, page: next, page_size: 50 });
    setItems((prev) => [...prev, ...r.candidates]);
    setPage(next);
    setHasMore(r.candidates.length >= 50);
    setLoading(false);
  }, [loading, hasMore, page, filters, search, sort]);

  return (
    <div className="flex flex-col">
      <div className="text-events-cream/60 text-xs font-body mb-3">
        {loading && items.length === 0 ? "Loading..." : `${total} candidate${total === 1 ? "" : "s"}`}
      </div>
      {items.length === 0 && !loading && (
        <div className="text-center py-12 text-events-cream/50 font-body">No candidates match your filters.</div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {items.map((c) => (
          <CandidateCard key={c.id} candidate={c} onClick={() => onOpen(c.id)} />
        ))}
      </div>
      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="mt-4 self-center px-4 py-2 rounded-full text-xs font-display uppercase tracking-wider bg-events-cream/5 border border-events-cream/20 text-events-cream hover:border-events-coral/60 transition-colors disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}
