import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveLogoSrc, faviconFromUrl } from "@/lib/url-logo";

interface Spotlight {
  id: string;
  category: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  display_order: number;
}

const CREAM = "#F5E6D3";
const CREAM_MUTED = "rgba(245,230,211,0.72)";
const CREAM_FAINT = "rgba(245,230,211,0.5)";
const CARD = "#111111";
const BORDER = "rgba(255,255,255,0.09)";

const CATEGORY_ORDER = ["Brands", "Beverages", "Food", "Giveaways & Swag"];

const toAbsoluteUrl = (u: string | null): string | null => {
  if (!u) return null;
  const t = u.trim();
  if (!t) return null;
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith("//")) return `https:${t}`;
  return `https://${t.replace(/^\/+/, "")}`;
};

const AfterPartySpotlights = () => {
  const [items, setItems] = useState<Spotlight[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    (async () => {
      // Source of truth: afterparty_partners rows that have a category set.
      // Falls back to legacy afterparty_spotlights table for older entries.
      const [partnersRes, legacyRes] = await Promise.all([
        (supabase as any)
          .from("afterparty_partners")
          .select("id, name, logo_url, website_url, display_order, category, description")
          .not("category", "is", null)
          .order("display_order"),
        (supabase as any)
          .from("afterparty_spotlights")
          .select("*")
          .order("display_order"),
      ]);
      const fromPartners = (partnersRes.data || []).map((p: any) => ({
        id: p.id,
        category: p.category,
        name: p.name,
        description: p.description,
        logo_url: p.logo_url,
        website_url: p.website_url,
        display_order: p.display_order,
      })) as Spotlight[];
      const legacy = (legacyRes.data || []) as Spotlight[];
      setItems([...fromPartners, ...legacy]);
    })();
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, Spotlight[]>();
    for (const s of items) {
      if (!map.has(s.category)) map.set(s.category, []);
      map.get(s.category)!.push(s);
    }
    // order categories by CATEGORY_ORDER, then any extras alphabetically
    const known = CATEGORY_ORDER.filter((c) => map.has(c));
    const extras = Array.from(map.keys())
      .filter((c) => !CATEGORY_ORDER.includes(c))
      .sort();
    return [...known, ...extras].map((c) => ({ category: c, list: map.get(c)! }));
  }, [items]);

  if (!items.length) return null;

  return (
    <section className="mt-6">
      <h2
        className="font-afterparty text-[20px] mb-1 text-center"
        style={{ fontWeight: 500, color: CREAM }}
      >
        Peak vibes assured by community partners
      </h2>
      <p className="text-center text-[12px] mb-6" style={{ color: CREAM_FAINT }}>
        Check out the folks contributing to make this night happen
      </p>
      <div className="space-y-6">
        {grouped.map(({ category, list }) => (
          <div key={category}>
            <div
              className="text-[11px] uppercase mb-2"
              style={{ letterSpacing: "0.12em", color: CREAM_FAINT }}
            >
              {category}
            </div>
            <div className="flex flex-wrap gap-2 items-start">
              {list.map((s) => {
                const src = resolveLogoSrc(s.logo_url, s.website_url);
                const hasDesc = !!(s.description && s.description.trim());
                const isOpen = expanded.has(s.id);
                const logo = (
                  <div
                    className="flex items-center justify-center rounded-full overflow-hidden flex-shrink-0"
                    style={{
                      width: 26,
                      height: 26,
                      backgroundColor: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {src ? (
                      <img
                        src={src}
                        alt={s.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const fav = faviconFromUrl(s.website_url);
                          const el = e.currentTarget as HTMLImageElement;
                          if (fav && el.src !== fav) el.src = fav;
                        }}
                      />
                    ) : (
                      <span style={{ color: CREAM, fontSize: 10 }}>{s.name.slice(0, 2)}</span>
                    )}
                  </div>
                );

                const nameEl = (
                  <span className="text-[12px] leading-none" style={{ color: CREAM, fontWeight: 500 }}>
                    {s.name}
                  </span>
                );

                const nameLinked = s.website_url ? (
                  <a
                    href={toAbsoluteUrl(s.website_url) || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                  >
                    {logo}
                    {nameEl}
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    {logo}
                    {nameEl}
                  </span>
                );

                return (
                  <div
                    key={s.id}
                    className="inline-flex flex-col rounded-2xl overflow-hidden"
                    style={{
                      backgroundColor: CARD,
                      border: `1px solid ${BORDER}`,
                      maxWidth: isOpen ? 280 : undefined,
                    }}
                  >
                    <div className="flex items-center gap-2 pl-1 pr-2 py-1">
                      {nameLinked}
                      {hasDesc && (
                        <button
                          type="button"
                          onClick={() => toggle(s.id)}
                          aria-expanded={isOpen}
                          aria-label={isOpen ? "Hide details" : "Show details"}
                          className="ml-0.5 flex items-center justify-center rounded-full transition-transform"
                          style={{
                            width: 18,
                            height: 18,
                            color: CREAM_MUTED,
                            transform: isOpen ? "rotate(180deg)" : "none",
                          }}
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {hasDesc && isOpen && (
                      <div
                        className="px-3 pb-2 pt-1 text-[12px] leading-snug"
                        style={{ color: CREAM_MUTED, borderTop: `1px solid ${BORDER}` }}
                      >
                        {s.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AfterPartySpotlights;
