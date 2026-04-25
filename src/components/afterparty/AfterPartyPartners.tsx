import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveLogoSrc, faviconFromUrl } from "@/lib/url-logo";

interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
}

const toAbsoluteUrl = (u: string | null): string | null => {
  if (!u) return null;
  const trimmed = u.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  return `https://${trimmed.replace(/^\/+/, "")}`;
};

const CREAM = "#F5E6D3";
const CREAM_MUTED = "rgba(245,230,211,0.7)";

const AfterPartyPartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("afterparty_partners")
        .select("*")
        .order("display_order");
      setPartners((data as Partner[]) || []);
    })();
  }, []);

  if (!partners.length) return null;

  return (
    <section className="mt-12">
      <p
        className="text-center text-[11px] uppercase mb-4"
        style={{ letterSpacing: "0.14em", color: CREAM_MUTED }}
      >
        Thanks to our partners
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {partners.map((p) => {
          const src = resolveLogoSrc(p.logo_url, p.website_url);
          const inner = (
            <div
              className="flex items-center justify-center rounded-full overflow-hidden"
              style={{
                width: 56,
                height: 56,
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
              title={p.name}
            >
              {src ? (
                <img
                  src={src}
                  alt={p.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const fav = faviconFromUrl(p.website_url);
                    const el = e.currentTarget as HTMLImageElement;
                    if (fav && el.src !== fav) el.src = fav;
                  }}
                />
              ) : (
                <span style={{ color: CREAM, fontSize: 11 }}>{p.name.slice(0, 2)}</span>
              )}
            </div>
          );
          return p.website_url ? (
            <a
              key={p.id}
              href={toAbsoluteUrl(p.website_url) || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              {inner}
            </a>
          ) : (
            <div key={p.id}>{inner}</div>
          );
        })}
      </div>
    </section>
  );
};

export default AfterPartyPartners;
