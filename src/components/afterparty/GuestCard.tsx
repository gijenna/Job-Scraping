import { useState } from "react";
import { Instagram, Linkedin } from "lucide-react";
import NumberBadge from "./NumberBadge";
import StarSparkle from "./StarSparkle";
import { resolveLogoSrc } from "@/lib/url-logo";

export interface GuestRow {
  id: string;
  attendee_number: number;
  role: string;
  display_name: string;
  company: string | null;
  company_url?: string | null;
  cartoon_url: string | null;
  niches: string[] | null;
  creator_types: string[] | null;
  looking_for: string[] | null;
  mind_blowing_fact: string | null;
  social_links?: { instagram?: string | null; linkedin?: string | null } | null;
  show_instagram?: boolean | null;
  show_linkedin?: boolean | null;
  created_at: string;
}

const ROLE_PILL: Record<string, { bg: string; border: string; text: string; label: string }> = {
  creator: { bg: "#4A1B0C", border: "#D85A30", text: "#F5C4B3", label: "Creator" },
  brand: { bg: "#1a1830", border: "#7F77DD", text: "#CECBF6", label: "Brand rep" },
  industry_expert: { bg: "#04342C", border: "#1D9E75", text: "#9FE1CB", label: "Industry expert" },
};

const Chip = ({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "intent" }) => (
  <span
    className="inline-block text-[10px] px-1.5 py-0.5 rounded mr-1 mb-1"
    style={{
      backgroundColor: tone === "intent" ? "rgba(225,182,36,0.12)" : "rgba(255,255,255,0.06)",
      color: tone === "intent" ? "#FAC775" : "rgba(255,255,255,0.75)",
      border: tone === "intent" ? "1px solid rgba(225,182,36,0.35)" : "1px solid rgba(255,255,255,0.1)",
      letterSpacing: "0.02em",
    }}
  >
    {children}
  </span>
);

const GuestCard = ({ guest }: { guest: GuestRow }) => {
  const [expanded, setExpanded] = useState(false);
  const pill = ROLE_PILL[guest.role] || ROLE_PILL.brand;
  const intents = (guest.looking_for || []).filter((v) => !/just here to vibe/i.test(v));
  const initial = guest.display_name?.charAt(0)?.toUpperCase() || "?";
  const fact = guest.mind_blowing_fact || "";
  const needsTruncate = fact.length > 110;

  return (
    <div
      className="relative p-4 rounded-xl flex flex-col overflow-hidden"
      style={{ backgroundColor: "#111111", border: "1px solid rgba(255,255,255,0.09)" }}
    >
      {/* Decorative sparkle accent (top-left) */}
      <div className="absolute -top-2 -left-2 opacity-70 rotate-[-12deg] pointer-events-none">
        <StarSparkle tone="coral" variant="single" size={28} />
      </div>
      <div className="absolute top-3 right-3">
        <NumberBadge number={guest.attendee_number} role={guest.role} size={36} />
      </div>

      <div className="flex justify-center mb-3 mt-1">
        {guest.cartoon_url ? (
          <img
            src={guest.cartoon_url}
            alt=""
            className="w-20 h-20 rounded-full object-cover"
            style={{ border: `1px solid ${pill.border}` }}
          />
        ) : (
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-[28px] font-medium"
            style={{ backgroundColor: pill.bg, color: pill.text, border: `1px solid ${pill.border}` }}
          >
            {initial}
          </div>
        )}
      </div>

      <div className="text-center mb-2">
        <div className="text-[14px]" style={{ color: "#F5E6D3", fontWeight: 600, letterSpacing: "-0.01em" }}>
          {guest.display_name}
        </div>
        <span
          className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded"
          style={{
            backgroundColor: pill.bg,
            color: pill.text,
            border: `1px solid ${pill.border}`,
            letterSpacing: "0.04em",
          }}
        >
          {pill.label}
        </span>
      </div>

      {(guest.role === "brand" || guest.role === "industry_expert") && guest.company ? (
        (() => {
          const guessedDomain = guest.company
            ? `${guest.company.toLowerCase().replace(/[^a-z0-9]+/g, "")}.com`
            : null;
          const logoSrc = resolveLogoSrc(null, guest.company_url || guessedDomain);
          const href = guest.company_url
            ? (guest.company_url.startsWith("http") ? guest.company_url : `https://${guest.company_url}`)
            : null;
          const inner = (
            <div
              className="mt-2 mx-auto inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              {logoSrc && (
                <img
                  src={logoSrc}
                  alt=""
                  className="w-4 h-4 rounded-sm object-contain"
                  style={{ backgroundColor: "#fff" }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              )}
              <span className="text-[11px]" style={{ color: "rgba(245,230,211,0.85)" }}>{guest.company}</span>
            </div>
          );
          return (
            <div className="text-center">
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">{inner}</a>
              ) : inner}
            </div>
          );
        })()
      ) : null}

      {(() => {
        const ig = (guest.social_links?.instagram || "").trim().replace(/^@+/, "");
        const li = (guest.social_links?.linkedin || "").trim();
        const showIg = ig && (guest.show_instagram ?? true);
        const showLi = li && (guest.show_linkedin ?? true);
        if (!showIg && !showLi) return null;
        return (
          <div className="mt-2 flex items-center justify-center gap-2">
            {showIg && (
              <a
                href={`https://instagram.com/${ig}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity"
                style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(245,230,211,0.85)" }}
                title={`@${ig} on Instagram`}
              >
                <Instagram className="w-3 h-3" />
                <span className="text-[11px]">@{ig}</span>
              </a>
            )}
            {showLi && (
              <a
                href={`https://linkedin.com/in/${li}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity"
                style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(245,230,211,0.85)" }}
                title="LinkedIn"
              >
                <Linkedin className="w-3 h-3" />
                <span className="text-[11px]">LinkedIn</span>
              </a>
            )}
          </div>
        );
      })()}

      {(guest.niches?.length || guest.creator_types?.length) ? (
        <div className="mt-2 -mb-1 flex flex-wrap justify-center">
          {(guest.niches || []).map((n) => <Chip key={`n-${n}`}>{n}</Chip>)}
          {(guest.creator_types || []).map((c) => <Chip key={`c-${c}`}>{c}</Chip>)}
        </div>
      ) : null}

      {fact ? (
        <div className="mt-3 text-[12px]" style={{ color: "rgba(245,230,211,0.7)" }}>
          <p className={expanded ? "" : "line-clamp-2"} style={{ lineHeight: 1.5 }}>
            <span style={{ color: "rgba(245,230,211,0.5)", fontWeight: 600 }}>Proud of: </span>
            {fact}
          </p>
          {needsTruncate && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="text-[11px] underline mt-1"
              style={{ color: "rgba(245,230,211,0.5)" }}
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      ) : null}

      {intents.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center">
          {intents.map((i) => (
            <Chip key={`i-${i}`} tone="intent">{i}</Chip>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuestCard;
