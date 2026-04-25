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

const AfterPartySpotlights = () => {
  const [items, setItems] = useState<Spotlight[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("afterparty_spotlights")
        .select("*")
        .order("display_order");
      setItems((data as Spotlight[]) || []);
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
    <section className="mt-12">
      <h2
        className="font-afterparty text-[20px] mb-1 text-center"
        style={{ fontWeight: 500, color: CREAM }}
      >
        Who else to check out
      </h2>
      <p className="text-center text-[12px] mb-6" style={{ color: CREAM_FAINT }}>
        Folks contributing to make this night happen
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
            <div className="space-y-2">
              {list.map((s) => {
                const card = (
                  <div
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}
                  >
                    <div
                      className="flex items-center justify-center rounded-md overflow-hidden flex-shrink-0"
                      style={{
                        width: 44,
                        height: 44,
                        backgroundColor: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      {s.logo_url ? (
                        <img src={s.logo_url} alt={s.name} className="w-full h-full object-cover" />
                      ) : (
                        <span style={{ color: CREAM, fontSize: 12 }}>{s.name.slice(0, 2)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px]" style={{ color: CREAM, fontWeight: 500 }}>
                        {s.name}
                      </div>
                      {s.description ? (
                        <div className="text-[12px] leading-snug mt-0.5" style={{ color: CREAM_MUTED }}>
                          {s.description}
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
                return s.website_url ? (
                  <a
                    key={s.id}
                    href={s.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:opacity-90 transition-opacity"
                  >
                    {card}
                  </a>
                ) : (
                  <div key={s.id}>{card}</div>
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
