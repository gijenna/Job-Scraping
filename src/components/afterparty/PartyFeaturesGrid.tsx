import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import { resolveLogoSrc, faviconFromUrl } from "@/lib/url-logo";

/**
 * Party Features 6-icon grid + per-category modals.
 *
 * Renders six clickable graffiti-style icons. Each opens a modal listing
 * `afterparty_partners` rows whose `category` matches and which have
 * `show_in_icon_grid = true` (legacy "Giveaways & Swag" rows show in BOTH
 * Giveaways and Swag until manually re-categorised).
 *
 * "Guest List" is special — its modal renders a single descriptive card
 * (admin-editable via category="Guest List Description") and closes with a
 * smooth scroll to #guest-roster on the host page.
 */

const CREAM = "#F5E6D3";
const CORAL = "#ED7660";
const YELLOW = "#E1B624";
const DARK = "#080808";

type IconCategory = "Noms" | "DJ" | "Giveaways" | "Swag" | "Experiences" | "Guest List";

interface PartnerRow {
  id: string;
  name: string;
  category: string | null;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  title: string | null;
  expanded_description: string | null;
  photo_url: string | null;
  value: string | null;
  show_in_icon_grid: boolean | null;
  display_order: number;
}

const ICONS: { key: IconCategory; label: string; render: () => JSX.Element }[] = [
  {
    key: "Noms",
    label: "Noms",
    render: () => (
      // Pizza slice
      <svg viewBox="0 0 64 64" width="100%" height="100%">
        <path d="M32 6 L58 52 L6 52 Z" fill={CORAL} stroke={DARK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M32 14 L52 50 L12 50 Z" fill={YELLOW} stroke={DARK} strokeWidth="2" strokeLinejoin="round" />
        <circle cx="26" cy="34" r="3.5" fill={CORAL} stroke={DARK} strokeWidth="1.5" />
        <circle cx="38" cy="30" r="3.5" fill={CORAL} stroke={DARK} strokeWidth="1.5" />
        <circle cx="32" cy="44" r="3.5" fill={CORAL} stroke={DARK} strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    key: "DJ",
    label: "DJ",
    render: () => (
      // Headphones
      <svg viewBox="0 0 64 64" width="100%" height="100%">
        <path d="M10 36 Q10 12 32 12 Q54 12 54 36" fill="none" stroke={CORAL} strokeWidth="5" strokeLinecap="round" />
        <rect x="6" y="34" width="14" height="20" rx="4" fill={YELLOW} stroke={DARK} strokeWidth="2.5" />
        <rect x="44" y="34" width="14" height="20" rx="4" fill={YELLOW} stroke={DARK} strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    key: "Giveaways",
    label: "Giveaways",
    render: () => (
      // Gift box
      <svg viewBox="0 0 64 64" width="100%" height="100%">
        <rect x="8" y="24" width="48" height="32" rx="2" fill={CORAL} stroke={DARK} strokeWidth="2.5" />
        <rect x="4" y="18" width="56" height="12" rx="2" fill={YELLOW} stroke={DARK} strokeWidth="2.5" />
        <rect x="28" y="18" width="8" height="38" fill={DARK} />
        <path d="M32 18 Q22 8 18 14 Q14 20 32 20 Q50 20 46 14 Q42 8 32 18 Z" fill={CREAM} stroke={DARK} strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    key: "Swag",
    label: "Swag",
    render: () => (
      // T-shirt
      <svg viewBox="0 0 64 64" width="100%" height="100%">
        <path d="M20 8 L8 18 L14 28 L20 24 L20 56 L44 56 L44 24 L50 28 L56 18 L44 8 L38 12 Q32 18 26 12 Z"
          fill={CORAL} stroke={DARK} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M26 12 Q32 18 38 12" fill="none" stroke={DARK} strokeWidth="2" />
      </svg>
    ),
  },
  {
    key: "Experiences",
    label: "Experiences",
    render: () => (
      // Sparkle/star burst
      <svg viewBox="0 0 64 64" width="100%" height="100%">
        <path d="M32 6 L36 26 L56 30 L36 34 L32 54 L28 34 L8 30 L28 26 Z"
          fill={YELLOW} stroke={DARK} strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="32" cy="30" r="4" fill={CORAL} stroke={DARK} strokeWidth="1.5" />
        <circle cx="52" cy="14" r="3" fill={CORAL} stroke={DARK} strokeWidth="1.5" />
        <circle cx="12" cy="50" r="3" fill={CORAL} stroke={DARK} strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    key: "Guest List",
    label: "Guest List",
    render: () => (
      // Stacked people heads
      <svg viewBox="0 0 64 64" width="100%" height="100%">
        <circle cx="22" cy="20" r="9" fill={CREAM} stroke={DARK} strokeWidth="2.5" />
        <circle cx="42" cy="20" r="9" fill={YELLOW} stroke={DARK} strokeWidth="2.5" />
        <circle cx="32" cy="36" r="10" fill={CORAL} stroke={DARK} strokeWidth="2.5" />
        <path d="M10 60 Q10 46 22 46 L42 46 Q54 46 54 60"
          fill={CORAL} stroke={DARK} strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const toAbsoluteUrl = (u: string | null): string | null => {
  if (!u) return null;
  const t = u.trim();
  if (!t) return null;
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t.replace(/^\/+/, "")}`;
};

interface Props {
  /** When true, the Guest List icon's close-action scrolls to #guest-roster
   *  on the host page. When false (e.g. /afterparty-interest where there's
   *  no roster), the modal simply closes. */
  guestListScrollsToRoster?: boolean;
  /** Optional container padding override for embedding contexts. */
  className?: string;
}

const PartyFeaturesGrid = ({ guestListScrollsToRoster = true, className }: Props) => {
  const [items, setItems] = useState<PartnerRow[]>([]);
  const [openCategory, setOpenCategory] = useState<IconCategory | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("afterparty_partners")
        .select("*")
        .order("display_order");
      setItems((data as PartnerRow[]) || []);
    })();
  }, []);

  const entriesFor = useMemo(() => {
    const map: Record<IconCategory, PartnerRow[]> = {
      Noms: [],
      DJ: [],
      Giveaways: [],
      Swag: [],
      Experiences: [],
      "Guest List": [],
    };
    for (const p of items) {
      if (!p.show_in_icon_grid) continue;
      const c = (p.category || "").trim();
      if (c === "Guest List Description") {
        map["Guest List"].push(p);
        continue;
      }
      if (c === "Giveaways & Swag") {
        // Legacy bucket — show in BOTH
        map.Giveaways.push(p);
        map.Swag.push(p);
        continue;
      }
      if (c in map) {
        map[c as IconCategory].push(p);
      }
    }
    return map;
  }, [items]);

  const closeModal = () => {
    const closingGuestList = openCategory === "Guest List";
    setOpenCategory(null);
    if (closingGuestList && guestListScrollsToRoster) {
      setTimeout(() => {
        document.getElementById("guest-roster")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 80);
    }
  };

  return (
    <>
      <style>{`
        @keyframes pfgIconPop { 0%{transform:scale(.92)}100%{transform:scale(1)} }
        .pfg-icon { transition: transform 180ms ease; }
        .pfg-icon:hover { transform: scale(1.08) rotate(-2deg); filter: drop-shadow(0 0 12px rgba(237,118,96,0.7)); }
        .pfg-icon:active { transform: scale(0.96); }
        @keyframes pfgModalIn { from { opacity:0; transform: translateY(8px) } to { opacity:1; transform:none } }
      `}</style>
      <div
        className={className ?? ""}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 10,
        }}
      >
        {ICONS.map(({ key, label, render }) => {
          const entries = entriesFor[key];
          const hasEntries = entries.length > 0;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setOpenCategory(key)}
              className="pfg-icon flex flex-col items-center justify-center rounded-xl px-1 py-2"
              style={{
                backgroundColor: "rgba(8,8,8,0.6)",
                border: `1px solid ${hasEntries ? "rgba(237,118,96,0.55)" : "rgba(245,230,211,0.18)"}`,
                color: CREAM,
                cursor: "pointer",
                animation: "pfgIconPop 240ms ease-out",
              }}
              aria-label={`${label}: open details`}
            >
              <div style={{ width: 44, height: 44 }}>{render()}</div>
              <div
                className="font-afterparty"
                style={{
                  marginTop: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: CREAM,
                  textShadow: "0 1px 2px rgba(0,0,0,0.9)",
                }}
              >
                {label}
              </div>
            </button>
          );
        })}
      </div>

      {openCategory && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            backgroundColor: "rgba(0,0,0,0.78)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "5vh 16px 5vh",
            overflowY: "auto",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 560,
              backgroundColor: "#111",
              border: "1px solid rgba(237,118,96,0.45)",
              borderRadius: 18,
              padding: "20px 18px 22px",
              color: CREAM,
              animation: "pfgModalIn 220ms ease-out",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3
                className="font-afterparty"
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: CORAL,
                  textShadow: "0 0 14px rgba(237,118,96,0.5)",
                  margin: 0,
                }}
              >
                {openCategory}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="rounded-full p-1.5 hover:opacity-80"
                style={{ backgroundColor: "rgba(245,230,211,0.08)", color: CREAM }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {entriesFor[openCategory].length === 0 ? (
              <p style={{ color: "rgba(245,230,211,0.65)", fontSize: 13, padding: "12px 0" }}>
                Nothing here yet. Check back closer to the night.
              </p>
            ) : (
              <div className="space-y-3">
                {entriesFor[openCategory].map((p) => (
                  <EntryCard key={p.id} entry={p} />
                ))}
              </div>
            )}

            {openCategory === "Guest List" && guestListScrollsToRoster && (
              <div className="mt-4 pt-3 text-right" style={{ borderTop: "1px solid rgba(245,230,211,0.1)" }}>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-[13px] underline"
                  style={{ color: CORAL, fontWeight: 600 }}
                >
                  Take me to the guest list →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const EntryCard = ({ entry }: { entry: PartnerRow }) => {
  const logoSrc = resolveLogoSrc(entry.logo_url, entry.website_url);
  const link = toAbsoluteUrl(entry.website_url);
  const title = (entry.title || "").trim();
  const description = (entry.expanded_description || entry.description || "").trim();
  const value = (entry.value || "").trim();
  const photo = (entry.photo_url || "").trim();
  const name = (entry.name || "").trim();

  // If only a link exists (no description), title/photo link directly.
  const titleOrName = title || name;
  const headingEl = (
    <div className="flex items-center gap-2 mb-1">
      {logoSrc && (
        <img
          src={logoSrc}
          alt={name}
          className="w-7 h-7 rounded-full object-cover flex-shrink-0"
          style={{ border: "1px solid rgba(245,230,211,0.15)" }}
          onError={(e) => {
            const fav = faviconFromUrl(entry.website_url);
            const el = e.currentTarget as HTMLImageElement;
            if (fav && el.src !== fav) el.src = fav;
          }}
        />
      )}
      <div className="min-w-0">
        {titleOrName && (
          <div style={{ color: CREAM, fontWeight: 600, fontSize: 15, lineHeight: 1.2 }}>
            {titleOrName}
          </div>
        )}
        {title && name && title !== name && (
          <div style={{ color: "rgba(245,230,211,0.6)", fontSize: 11, marginTop: 1 }}>
            {name}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: "rgba(245,230,211,0.04)",
        border: "1px solid rgba(245,230,211,0.12)",
        padding: 12,
      }}
    >
      {headingEl}
      {photo && (
        <img
          src={photo}
          alt={titleOrName || "Photo"}
          className="w-full rounded-lg mb-2 object-cover"
          style={{ maxHeight: 220, border: "1px solid rgba(245,230,211,0.1)" }}
        />
      )}
      {value && (
        <div className="text-[12px] mb-1" style={{ color: YELLOW, fontWeight: 600 }}>
          Value: {value}
        </div>
      )}
      {description && (
        <p className="text-[13px] leading-snug" style={{ color: "rgba(245,230,211,0.78)", margin: 0 }}>
          {description}
        </p>
      )}
      {link && (
        <div className="mt-2">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] underline"
            style={{ color: CORAL, fontWeight: 600 }}
          >
            View →
          </a>
        </div>
      )}
    </div>
  );
};

export default PartyFeaturesGrid;
