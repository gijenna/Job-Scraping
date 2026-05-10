// Shared candidate Connect navigation. Renders as a sticky bottom bar on
// mobile and a top-right inline cluster on >= sm breakpoints.
//
// The Map/List toggle drives `?view=map|list` on /outsidedays26/connect/home
// so it remains selectable from any other Connect page.

import { useLocation, useNavigate } from "react-router-dom";
import { Map, List, Users, User, HelpCircle } from "lucide-react";

const HOME = "/outsidedays26/connect/home";
const CONNECTIONS = "/outsidedays26/connect/connections";
const PROFILE = "/outsidedays26/connect/profile";
const HOW = "/outsidedays26/connect/how-it-works";

type ItemKey = "map" | "list" | "connections" | "profile" | "how";

interface Item { key: ItemKey; label: string; href: string; icon: typeof Map }

const ITEMS: Item[] = [
  { key: "map", label: "Map", href: `${HOME}?view=map`, icon: Map },
  { key: "list", label: "List", href: `${HOME}?view=list`, icon: List },
  { key: "connections", label: "Connections", href: CONNECTIONS, icon: Users },
  { key: "profile", label: "Profile", href: PROFILE, icon: User },
  { key: "how", label: "How", href: HOW, icon: HelpCircle },
];

const useActiveKey = (): ItemKey | null => {
  const { pathname, search } = useLocation();
  if (pathname.startsWith(HOME)) {
    const v = new URLSearchParams(search).get("view");
    return v === "list" ? "list" : "map";
  }
  if (pathname.startsWith(CONNECTIONS)) return "connections";
  if (pathname.startsWith(PROFILE)) return "profile";
  if (pathname.startsWith(HOW)) return "how";
  return null;
};

const ConnectBottomNav = () => {
  const nav = useNavigate();
  const active = useActiveKey();

  return (
    <nav
      aria-label="Connect navigation"
      className="fixed inset-x-0 bottom-0 z-40 bg-events-teal/95 backdrop-blur border-t border-events-cream/10 sm:hidden"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0px)" }}
    >
      <ul className="flex items-stretch justify-between px-1">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          const isActive = active === it.key;
          return (
            <li key={it.key} className="flex-1">
              <button
                onClick={() => nav(it.href)}
                aria-current={isActive ? "page" : undefined}
                className={`w-full flex flex-col items-center gap-0.5 py-2 px-1 transition-colors ${
                  isActive
                    ? "text-events-coral"
                    : "text-events-cream/60 hover:text-events-cream"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.4]" : ""}`} />
                <span className="text-[10px] font-display uppercase tracking-wider">
                  {it.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default ConnectBottomNav;

// Desktop variant: same destinations, rendered as inline pill buttons. Use
// inside a page header to mirror the mobile bottom nav at sm+.
export const ConnectTopNav = () => {
  const nav = useNavigate();
  const active = useActiveKey();
  return (
    <div className="hidden sm:flex items-center gap-1">
      {ITEMS.map((it) => {
        const Icon = it.icon;
        const isActive = active === it.key;
        return (
          <button
            key={it.key}
            onClick={() => nav(it.href)}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-display uppercase tracking-wider transition-colors ${
              isActive
                ? "bg-events-coral text-events-cream"
                : "bg-events-cream/5 text-events-cream/70 hover:text-events-cream hover:bg-events-cream/10"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
};
