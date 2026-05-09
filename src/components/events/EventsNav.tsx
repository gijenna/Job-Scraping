import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, Shield, ChevronDown, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { isAdminUser } from "@/lib/admin-auth";
import basecampOutdoorLogo from "@/assets/basecamp-outdoor-logo.png";
import basecampMatchLogo from "@/assets/basecamp-match-logo.svg";

interface EventsNavProps {
  onFilterSelect?: (filter: string) => void;
  onScrollToPartner?: () => void;
}

const OFFICE_HOURS_BRANDS = [
  { name: "Cotopaxi", url: "https://www.wearetheoutdoorindustry.com/cotopaxi" },
  { name: "Backbone", url: "https://www.wearetheoutdoorindustry.com/backbonemedia" },
  { name: "Arc'teryx", url: "https://www.wearetheoutdoorindustry.com/arcteryx" },
  { name: "Outward Bound", url: "https://www.wearetheoutdoorindustry.com/outwardbound" },
  { name: "Outside PR", url: "https://www.wearetheoutdoorindustry.com/outsidepr" },
  { name: "CU Boulder", url: "https://www.wearetheoutdoorindustry.com/cuboulder" },
  { name: "Vail Resorts", url: "https://www.wearetheoutdoorindustry.com/vailresorts" },
  { name: "Autocamp", url: "https://www.wearetheoutdoorindustry.com/autocamp" },
  { name: "Title Nine", url: "https://www.wearetheoutdoorindustry.com/titlenine" },
];

const EventsNav = ({ onFilterSelect, onScrollToPartner }: EventsNavProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [officeHoursOpen, setOfficeHoursOpen] = useState(false);
  const navigate = useNavigate();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAdmin(isAdminUser(data.session?.user));
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(isAdminUser(session?.user));
    });
    return () => subscription.unsubscribe();
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
  };

  const handleHappeningsClick = (filter: string) => {
    setMenuOpen(false);
    onFilterSelect?.(filter);
  };

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-black">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-events-cream hover:text-events-coral transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Center: Basecamp Outdoor Logo */}
        <a
          href="https://wearetheoutdoorindustry.com"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute left-1/2 -translate-x-1/2"
        >
          <img src={basecampOutdoorLogo} alt="Basecamp Outdoor" className="h-10 md:h-14" />
        </a>

        {/* Right: Basecamp Match Logo */}
        <a
          href="https://basecampmatch.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={basecampMatchLogo} alt="Basecamp Match" className="h-8 md:h-10" />
        </a>
      </div>

      {/* Slide-out menu */}
      {menuOpen && (
        <div className="bg-black/95 backdrop-blur-sm border-t border-events-teal/30 animate-in slide-in-from-top">
          <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
            {/* About */}
            <div>
              <h3 className="text-events-yellow font-display text-sm uppercase tracking-widest mb-2">About</h3>
              <div className="space-y-1 pl-2">
                <a href="https://wearetheoutdoorindustry.com" target="_blank" rel="noopener noreferrer" className="block text-events-cream hover:text-events-coral transition-colors">
                  Basecamp Outdoor
                </a>
                <a href="https://basecampmatch.com" target="_blank" rel="noopener noreferrer" className="block text-events-cream hover:text-events-coral transition-colors">
                  Basecamp Match
                </a>
              </div>
            </div>

            {/* Happenings */}
            <div>
              <h3 className="text-events-yellow font-display text-sm uppercase tracking-widest mb-2">Happenings</h3>
              <div className="space-y-1 pl-2">
                <button onClick={() => handleHappeningsClick("in-person")} className="block text-events-cream hover:text-events-coral transition-colors">
                  In-Person Events
                </button>
                <button onClick={() => handleHappeningsClick("workshop")} className="block text-events-cream hover:text-events-coral transition-colors">
                  Workshops
                </button>
                <button onClick={() => handleHappeningsClick("digital")} className="block text-events-cream hover:text-events-coral transition-colors">
                  Digital Events
                </button>
                
                {/* Office Hours with expandable brand list */}
                <div>
                  <button
                    onClick={() => setOfficeHoursOpen(!officeHoursOpen)}
                    className="flex items-center gap-1 text-events-cream hover:text-events-coral transition-colors"
                  >
                    Office Hours
                    {officeHoursOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  {officeHoursOpen && (
                    <div className="pl-4 mt-1 space-y-1 border-l border-events-cream/10 ml-1">
                      <a
                        href="https://www.wearetheoutdoorindustry.com/officehours"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-events-cream/70 hover:text-events-coral transition-colors text-sm"
                      >
                        All Office Hours →
                      </a>
                      {OFFICE_HOURS_BRANDS.map((brand) => (
                        <a
                          key={brand.name}
                          href={brand.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-events-cream/60 hover:text-events-coral transition-colors text-sm"
                        >
                          {brand.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Connect */}
            <div>
              <h3 className="text-events-yellow font-display text-sm uppercase tracking-widest mb-2">Connect</h3>
              <div className="space-y-1 pl-2">
                <a
                  href="https://basecampoutdoor.typeform.com/Basecamp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-events-cream hover:text-events-coral transition-colors"
                >
                  Sign up for events
                </a>
                <a
                  href="https://basecampjobs.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-events-cream hover:text-events-coral transition-colors"
                >
                  Newsletter signup
                </a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-events-yellow font-display text-sm uppercase tracking-widest mb-2">Contact</h3>
              <a href="mailto:hello@wearetheoutdoorindustry.com" className="pl-2 text-events-cream hover:text-events-coral transition-colors">
                hello@wearetheoutdoorindustry.com
              </a>
            </div>

            {/* Partner */}
            <div>
              <h3 className="text-events-yellow font-display text-sm uppercase tracking-widest mb-2">Partner</h3>
              <button
                onClick={() => { setMenuOpen(false); onScrollToPartner?.(); }}
                className="pl-2 text-events-cream hover:text-events-coral transition-colors"
              >
                Partner with us
              </button>
            </div>

            {/* Admin */}
            <div>
              <h3 className="text-events-yellow font-display text-sm uppercase tracking-widest mb-2">Admin</h3>
              <div className="space-y-1 pl-2">
                {isAdmin ? (
                  <button onClick={handleLogout} className="flex items-center gap-2 text-events-cream hover:text-events-coral transition-colors">
                    <LogOut size={14} /> Sign Out
                  </button>
                ) : (
                  <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-events-cream hover:text-events-coral transition-colors">
                    <Shield size={14} /> Admin Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default EventsNav;
