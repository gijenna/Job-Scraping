import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { isAdminUser } from "@/lib/admin-auth";
import AfterPartyPartnersAdmin from "./AfterPartyPartnersAdmin";
import AfterPartySuggestionsAdmin from "./AfterPartySuggestionsAdmin";
import { ChevronDown, ChevronRight, Lock } from "lucide-react";

const BORDER = "rgba(255,255,255,0.12)";
const CREAM = "#F5E6D3";
const CREAM_DIM = "rgba(245,230,211,0.55)";

/**
 * Inline admin panel for editing the global partners (bubble logos) and brand
 * spotlights from inside /afterparty and /afterparty/{slug}. Only renders when
 * an admin is signed in (real @wearetheoutdoorindustry.com email, never an
 * anonymous PIN-flow guest session).
 */
const AfterPartyAdminInline = () => {
  const [authed, setAuthed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!cancelled) setAuthed(isAdminUser(data.user));
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(isAdminUser(session?.user));
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!authed) return null;

  return (
    <section
      className="mt-12 rounded-xl"
      style={{ border: `1px dashed ${BORDER}`, backgroundColor: "rgba(255,255,255,0.02)" }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-[12px] uppercase" style={{ letterSpacing: "0.12em", color: CREAM }}>
          <Lock className="w-3.5 h-3.5" />
          Admin · Partners, Spotlights & Suggestions
        </span>
        <span className="flex items-center gap-2 text-[11px]" style={{ color: CREAM_DIM }}>
          {open ? "Hide" : "Edit"}
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </span>
      </button>

      {open && (
        <div className="px-4 pb-5 space-y-6">
          <p className="text-[12px]" style={{ color: CREAM_DIM }}>
            These appear globally on /afterparty and every /afterparty/{`{name}`} page.
            For the full admin (CSV import, link builder, etc.) visit{" "}
            <Link to="/admin/experts" className="underline" style={{ color: CREAM }}>
              /admin/experts
            </Link>
            .
          </p>
          <AfterPartyPartnersAdmin />
          <div className="pt-4" style={{ borderTop: `1px dashed ${BORDER}` }}>
            <AfterPartySuggestionsAdmin />
          </div>
        </div>
      )}
    </section>
  );
};

export default AfterPartyAdminInline;
