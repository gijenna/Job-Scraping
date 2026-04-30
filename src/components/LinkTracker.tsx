import { useEffect, useState, useCallback, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Download } from "lucide-react";

function getSessionId() {
  let id = sessionStorage.getItem("lc_sid");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("lc_sid", id);
  }
  return id;
}

interface ClickStat {
  link_url: string;
  link_text: string;
  count: number;
}

const LinkTracker = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<ClickStat[]>([]);
  const [showTooltip, setShowTooltip] = useState<{ x: number; y: number; stat: ClickStat } | null>(null);
  const canShowAdminStats = isAdmin && location.pathname.startsWith("/admin");

  // Auth check — only allow internal admin domains
  useEffect(() => {
    const ADMIN_DOMAINS = ["@wearetheoutdoorindustry.com", "@basecampjobs.com"];
    const checkAdmin = (session: any) => {
      const email = session?.user?.email?.toLowerCase() || "";
      setIsAdmin(ADMIN_DOMAINS.some((d) => email.endsWith(d)));
    };
    supabase.auth.getSession().then(({ data: { session } }) => checkAdmin(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => checkAdmin(session));
    return () => subscription.unsubscribe();
  }, []);

  // Track clicks via delegated listener
  useEffect(() => {
    const sessionId = getSessionId();
    const handler = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;

      // Fire-and-forget insert
      supabase.from("link_clicks" as any).insert({
        page_path: location.pathname,
        link_url: href,
        link_text: (anchor.textContent || "").slice(0, 500),
        session_id: sessionId,
      } as any).then(() => {});
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [location.pathname]);

  // Fetch stats for admin
  useEffect(() => {
    if (!canShowAdminStats) { setStats([]); return; }
    const fetchStats = async () => {
      const { data } = await (supabase as any)
        .from("link_clicks")
        .select("link_url, link_text")
        .eq("page_path", location.pathname);
      if (!data) return;
      const map = new Map<string, ClickStat>();
      (data as any[]).forEach((row: any) => {
        const key = row.link_url;
        const existing = map.get(key);
        if (existing) {
          existing.count++;
        } else {
          map.set(key, { link_url: row.link_url, link_text: row.link_text || "", count: 1 });
        }
      });
      setStats(Array.from(map.values()).sort((a, b) => b.count - a.count));
    };
    fetchStats();
  }, [canShowAdminStats, location.pathname]);

  // Admin hover tooltip on links
  useEffect(() => {
    if (!canShowAdminStats || stats.length === 0) return;

    const handleMouseOver = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) { setShowTooltip(null); return; }
      const href = anchor.getAttribute("href");
      if (!href) return;
      const stat = stats.find(s => s.link_url === href);
      if (stat) {
        const rect = anchor.getBoundingClientRect();
        setShowTooltip({ x: rect.left + rect.width / 2, y: rect.top - 8, stat });
      }
    };
    const handleMouseOut = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (anchor) setShowTooltip(null);
    };
    document.addEventListener("mouseover", handleMouseOver, true);
    document.addEventListener("mouseout", handleMouseOut, true);
    return () => {
      document.removeEventListener("mouseover", handleMouseOver, true);
      document.removeEventListener("mouseout", handleMouseOut, true);
    };
  }, [canShowAdminStats, stats]);

  const downloadCSV = useCallback(async () => {
    const { data } = await (supabase as any)
      .from("link_clicks")
      .select("link_url, link_text")
      .eq("page_path", location.pathname);
    if (!data) return;
    const map = new Map<string, { text: string; url: string; count: number }>();
    (data as any[]).forEach((row: any) => {
      const key = row.link_url;
      const existing = map.get(key);
      if (existing) { existing.count++; } else {
        map.set(key, { text: row.link_text || "", url: row.link_url, count: 1 });
      }
    });
    const rows = Array.from(map.values()).sort((a, b) => b.count - a.count);
    const csv = [
      "Link Text,URL,Click Count",
      ...rows.map(r => `"${r.text.replace(/"/g, '""')}","${r.url.replace(/"/g, '""')}",${r.count}`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const pageName = location.pathname.replace(/\//g, "-").replace(/^-/, "") || "home";
    a.href = url;
    a.download = `link-clicks-${pageName}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [location.pathname]);

  return (
    <>
      {children}
      {/* Admin tooltip */}
      {showTooltip && (
        <div
          style={{
            position: "fixed",
            left: showTooltip.x,
            top: showTooltip.y,
            transform: "translate(-50%, -100%)",
            zIndex: 99999,
            pointerEvents: "none",
          }}
          className="bg-black/90 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap"
        >
          {showTooltip.stat.count} click{showTooltip.stat.count !== 1 ? "s" : ""}
        </div>
      )}
      {/* Admin CSV download button */}
      {canShowAdminStats && (
        <button
          onClick={downloadCSV}
          className="fixed top-1/2 -translate-y-1/2 right-2 z-[9999] flex items-center gap-1.5 bg-black/80 hover:bg-black text-white text-xs px-3 py-2 rounded-full shadow-lg transition-colors"
          title="Download link click stats CSV for this page"
        >
          <Download className="w-3.5 h-3.5" />
          Link Stats CSV
        </button>
      )}
    </>
  );
};

export default LinkTracker;
