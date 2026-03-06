import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import basecampOutdoorLogo from "@/assets/basecamp-outdoor-logo.png";
import basecampMatchLogo from "@/assets/basecamp-match-logo.svg";

interface EventsNavProps {
  onFilterSelect?: (filter: string) => void;
  onScrollToPartner?: () => void;
}

const EventsNav = ({ onFilterSelect, onScrollToPartner }: EventsNavProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAdmin(!!data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
  };

  const handleHappeningsClick = (filter: string) => {
    setMenuOpen(false);
    onFilterSelect?.(filter);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black">
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
              </div>
            </div>

            {/* Connect */}
            <div>
              <h3 className="text-events-yellow font-display text-sm uppercase tracking-widest mb-2">Connect</h3>
              <div className="space-y-1 pl-2">
                <p className="text-events-cream">Never miss an event</p>
                <p className="text-events-cream/70 text-sm">Free newsletter (60K subs)</p>
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
          </div>
        </div>
      )}
    </nav>
  );
};

export default EventsNav;
