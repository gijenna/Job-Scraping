import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveLogoSrc, faviconFromUrl } from "@/lib/url-logo";
import StarSparkle from "@/components/afterparty/StarSparkle";

interface Spotlight {
  id: string;
  category: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  display_order: number;
}

const CREAM = "#F5E6D3";
const CORAL = "#ED7660";

const CATEGORY_ORDER = ["Brands", "Beverages", "Food", "Giveaways & Swag"];

const CREAM_BUBBLE_NAMES = new Set([
  "4 noses",
  "westbound & down",
  "westbound and down",
  "rod and hammer",
  "rod & hammer",
  "dod outdoors",
  "dod",
]);
const needsCreamBubble = (name: string) =>
  CREAM_BUBBLE_NAMES.has(name.trim().toLowerCase());

interface Props {
  ratio: "square" | "story";
  visible: boolean;
}

/**
 * Compact "Thanks to our sponsors" thank-you panel designed to fit cleanly
 * inside the afterparty-clip recording frames (1080×1080 or 1080×1920).
 *
 * Pulls from the same `afterparty_partners` table as AfterPartySpotlights,
 * grouped by category, but renders smaller chips with no interactive controls.
 */
const SponsorsThankYouPanel = ({ ratio, visible }: Props) => {
  const [items, setItems] = useState<Spotlight[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("afterparty_partners")
        .select("id, name, logo_url, website_url, display_order, category")
        .not("category", "is", null)
        .order("display_order");
      setItems((data as Spotlight[]) || []);
      (window as { __SPONSORS_LOADED__?: boolean }).__SPONSORS_LOADED__ = true;
    })();
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, Spotlight[]>();
    for (const s of items) {
      if (!map.has(s.category)) map.set(s.category, []);
      map.get(s.category)!.push(s);
    }
    const known = CATEGORY_ORDER.filter((c) => map.has(c));
    const extras = Array.from(map.keys())
      .filter((c) => !CATEGORY_ORDER.includes(c))
      .sort();
    return [...known, ...extras].map((c) => ({ category: c, list: map.get(c)! }));
  }, [items]);

  // Compact sizing tuned to fit the recording frame without scrolling.
  const isStory = ratio === "story";
  const headerSize = isStory ? 44 : 32;
  const sublabelSize = isStory ? 16 : 13;
  const categorySize = isStory ? 13 : 11;
  const chipPad = isStory ? "6px 12px" : "5px 10px";
  const chipFont = isStory ? 15 : 12;
  const logoSize = isStory ? 28 : 22;
  const gap = isStory ? 8 : 6;
  const sectionGap = isStory ? 18 : 12;
  const maxWidth = isStory ? 920 : 980;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isStory ? "80px 60px" : "48px 40px",
        opacity: visible ? 1 : 0,
        transition: "opacity 900ms ease-in-out",
        pointerEvents: "none",
      }}
    >
      <div style={{ width: "100%", maxWidth, color: CREAM, textAlign: "center" }}>
        {/* Header card */}
        <div
          style={{
            backgroundColor: "rgba(8,8,8,0.72)",
            border: `1px solid rgba(237,118,96,0.4)`,
            borderRadius: 18,
            padding: isStory ? "20px 26px" : "14px 20px",
            marginBottom: isStory ? 28 : 18,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              fontSize: sublabelSize - 2,
              letterSpacing: "0.18em",
              color: CORAL,
              fontWeight: 700,
              textTransform: "uppercase",
              textShadow: "0 0 10px rgba(237,118,96,0.55)",
              marginBottom: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <StarSparkle tone="coral" size={isStory ? 14 : 11} />
            <span>Community Partners</span>
            <StarSparkle tone="coral" size={isStory ? 14 : 11} />
          </div>
          <div
            className="font-afterparty"
            style={{
              fontSize: headerSize,
              fontWeight: 700,
              color: CORAL,
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              textShadow: "0 0 14px rgba(237,118,96,0.55)",
              marginBottom: 6,
            }}
          >
            Thanks to our sponsors
          </div>
          <div style={{ fontSize: sublabelSize, color: "rgba(237,118,96,0.85)" }}>
            The folks who made the night happen.
          </div>
        </div>

        {/* Category sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: sectionGap }}>
          {grouped.map(({ category, list }) => (
            <div key={category}>
              <div
                style={{
                  display: "inline-block",
                  fontSize: categorySize,
                  letterSpacing: "0.14em",
                  color: CORAL,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  padding: "4px 10px",
                  borderRadius: 8,
                  backgroundColor: "rgba(8,8,8,0.6)",
                  border: "1px solid rgba(237,118,96,0.3)",
                  marginBottom: isStory ? 10 : 7,
                  textShadow: "0 0 8px rgba(237,118,96,0.5)",
                }}
              >
                {category}
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap,
                }}
              >
                {list.map((s) => {
                  const src = resolveLogoSrc(s.logo_url, s.website_url);
                  const cream = needsCreamBubble(s.name);
                  return (
                    <div
                      key={s.id}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: chipPad,
                        borderRadius: 999,
                        backgroundColor: "#111",
                        border: "1px solid rgba(255,255,255,0.09)",
                      }}
                    >
                      <div
                        style={{
                          width: logoSize,
                          height: logoSize,
                          borderRadius: "50%",
                          overflow: "hidden",
                          flexShrink: 0,
                          backgroundColor: cream ? CREAM : "rgba(255,255,255,0.06)",
                          border: cream
                            ? "1px solid rgba(245,230,211,0.6)"
                            : "1px solid rgba(255,255,255,0.1)",
                          padding: cream ? 2 : 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {src ? (
                          <img
                            src={src}
                            alt={s.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: cream ? "contain" : "cover",
                            }}
                            onError={(e) => {
                              const fav = faviconFromUrl(s.website_url);
                              const el = e.currentTarget as HTMLImageElement;
                              if (fav && el.src !== fav) el.src = fav;
                            }}
                          />
                        ) : (
                          <span
                            style={{
                              color: cream ? "#19363B" : CREAM,
                              fontSize: 10,
                            }}
                          >
                            {s.name.slice(0, 2)}
                          </span>
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: chipFont,
                          color: CREAM,
                          fontWeight: 500,
                          lineHeight: 1,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {s.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorsThankYouPanel;
