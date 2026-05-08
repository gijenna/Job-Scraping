import { useEffect, useRef, useState, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
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
  const parentRef = useRef<HTMLDivElement>(null);
  const reqId = useRef(0);

  // Reset on filter change
  useEffect(() => {
    const id = ++reqId.current;
    setLoading(true);
    setItems([]);
    setPage(0);
    setHasMore(true);
    dashboardList({ filters, search, sort, page: 0, page_size: 50 }).then((r) => {
      if (reqId.current !== id) return;
      setItems(r.candidates);
      setTotal(r.total);
      setHasMore(r.candidates.length >= 50);
    }).finally(() => reqId.current === id && setLoading(false));
  }, [JSON.stringify(filters), search, sort]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    const id = reqId.current;
    setLoading(true);
    const next = page + 1;
    const r = await dashboardList({ filters, search, sort, page: next, page_size: 50 });
    if (reqId.current !== id) return;
    setItems((prev) => [...prev, ...r.candidates]);
    setPage(next);
    setHasMore(r.candidates.length >= 50);
    setLoading(false);
  }, [loading, hasMore, page, filters, search, sort]);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 280,
    overscan: 5,
  });

  // Trigger loadMore near the end
  useEffect(() => {
    const last = rowVirtualizer.getVirtualItems().slice(-1)[0];
    if (last && last.index >= items.length - 5 && hasMore && !loading) loadMore();
  }, [rowVirtualizer.getVirtualItems(), hasMore, loading, items.length, loadMore]);

  return (
    <div className="flex flex-col h-full">
      <div className="text-events-cream/60 text-xs font-body mb-3">
        {loading && items.length === 0 ? "Loading..." : `${total} candidate${total === 1 ? "" : "s"}`}
      </div>
      <div ref={parentRef} className="flex-1 overflow-y-auto -mx-2 px-2">
        {items.length === 0 && !loading && (
          <div className="text-center py-12 text-events-cream/50 font-body">No candidates match your filters.</div>
        )}
        <div style={{ height: rowVirtualizer.getTotalSize(), position: "relative", width: "100%" }}>
          {rowVirtualizer.getVirtualItems().map((vRow) => {
            const c = items[vRow.index];
            return (
              <div
                key={c.id}
                style={{
                  position: "absolute", top: 0, left: 0, width: "100%",
                  transform: `translateY(${vRow.start}px)`, paddingBottom: 12,
                }}
                ref={rowVirtualizer.measureElement}
                data-index={vRow.index}
              >
                <CandidateCard candidate={c} onClick={() => onOpen(c.id)} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
