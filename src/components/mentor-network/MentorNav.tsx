import { useState } from "react";
import { Menu, X, ArrowLeft } from "lucide-react";
import basecampLogo from "@/assets/basecamp-outdoor-logo.png";
import hbcusOutsideLogo from "@/assets/mentor-network/hbcus-outside.png";

const C = {
  forestDeep: "#0c1913",
  gold: "#e8c07a",
  cream: "#f5efe3",
  creamDim: "rgba(245,239,227,0.72)",
};

const body: React.CSSProperties = { fontFamily: "'Hind', system-ui, sans-serif" };

const LINKS: { label: string; href: string; external?: boolean }[] = [
  { label: "HBCU Mentor Network", href: "/mentor-network" },
  { label: "Become a mentor", href: "/mentor-experts" },
  { label: "Sponsor the program", href: "/sponsor-a-mentor" },
  { label: "Basecamp Outdoor", href: "https://www.wearetheoutdoorindustry.com", external: true },
  { label: "Basecamp Jobs", href: "https://www.basecampjobs.com", external: true },
  { label: "HBCUs Outside", href: "https://www.hbcusoutside.com", external: true },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/T&C" },
];

/**
 * Shared top bar for the HBCU Mentor Network pages.
 * Presentation only, no data access.
 */
const MentorNav = ({ backHref, backLabel }: { backHref?: string; backLabel?: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{ background: `${C.forestDeep}f2`, borderColor: "rgba(232,192,122,0.22)", backdropFilter: "blur(8px)" }}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <div className="flex items-center gap-4">
          {backHref && (
            <a
              href={backHref}
              className="hidden items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] sm:inline-flex"
              style={{ ...body, color: C.creamDim }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {backLabel || "Back"}
            </a>
          )}
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <a href="https://www.wearetheoutdoorindustry.com" target="_blank" rel="noopener noreferrer" aria-label="Basecamp Outdoor">
            <img src={basecampLogo} alt="Basecamp Outdoor" className="h-8 w-auto sm:h-9" />
          </a>
          <span className="h-6 w-px" style={{ background: "rgba(245,239,227,0.2)" }} />
          <a href="https://www.hbcusoutside.com" target="_blank" rel="noopener noreferrer" aria-label="HBCUs Outside">
            <img src={hbcusOutsideLogo} alt="HBCUs Outside" className="h-8 w-auto sm:h-9" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="rounded-full p-2 transition-colors"
            style={{ border: `1px solid rgba(232,192,122,0.4)`, color: C.gold }}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t px-5 py-4 sm:px-8" style={{ borderColor: "rgba(232,192,122,0.18)" }}>
          <ul className="mx-auto grid max-w-6xl gap-1 sm:grid-cols-2">
            {backHref && (
              <li className="sm:hidden">
                <a href={backHref} className="block py-2 text-sm font-semibold" style={{ ...body, color: C.gold }}>
                  {backLabel || "Back"}
                </a>
              </li>
            )}
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="block py-2 text-sm transition-colors hover:opacity-80"
                  style={{ ...body, color: C.cream }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default MentorNav;
