import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import GuestCard, { GuestRow } from "@/components/afterparty/GuestCard";
import StarSparkle from "@/components/afterparty/StarSparkle";
import AfterPartySpotlights from "@/components/afterparty/AfterPartySpotlights";
import AfterPartyPartners from "@/components/afterparty/AfterPartyPartners";
import AfterPartyAdminInline from "@/components/afterparty/AfterPartyAdminInline";
import MyCardSection from "@/components/afterparty/MyCardSection";
import { AfterPartyAttendee } from "@/lib/afterparty-matching";

const BG = "#080808";
const CARD = "#111111";
const BORDER = "rgba(255,255,255,0.09)";

const ROLE_OPTIONS: { value: string; label: string }[] = [
  { value: "creator", label: "Creator" },
  { value: "brand", label: "Brand rep" },
  { value: "industry_expert", label: "Industry expert" },
];

type Sort = "newest" | "niche";

const GuestList = () => {
  const [searchParams] = useSearchParams();
  const [guests, setGuests] = useState<GuestRow[]>([]);
  const [attendees, setAttendees] = useState<AfterPartyAttendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRoles, setActiveRoles] = useState<Set<string>>(new Set());
  const [activeNiches, setActiveNiches] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("newest");

  // Resolve current viewer's slug from query param or sessionStorage
  const viewerSlug = useMemo(() => {
    const qs = searchParams.get("slug");
    if (qs) return qs;
    try {
      return sessionStorage.getItem("afterparty:return_slug");
    } catch {
      return null;
    }
  }, [searchParams]);

  // Persist slug in sessionStorage when it comes via query param
  useEffect(() => {
    const qs = searchParams.get("slug");
    if (qs) {
      try { sessionStorage.setItem("afterparty:return_slug", qs); } catch {}
    }
  }, [searchParams]);

  const fetchGuests = async () => {
    const { data } = await (supabase as any)
      .from("afterparty_guest_list")
      .select("*")
      .order("created_at", { ascending: false });
    setGuests((data as GuestRow[]) || []);
    // Also fetch full attendees (for matching) from public view
    const { data: attData } = await (supabase as any)
      .from("afterparty_attendees_public")
      .select("*")
      .order("attendee_number");
    setAttendees((attData as AfterPartyAttendee[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchGuests();
    const channel = (supabase as any)
      .channel("guest-list-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "afterparty_attendees" },
        () => fetchGuests(),
      )
      .subscribe();
    return () => {
      (supabase as any).removeChannel(channel);
    };
  }, []);

  const allNiches = useMemo(() => {
    const set = new Set<string>();
    guests.forEach((g) => (g.niches || []).forEach((n) => set.add(n)));
    return Array.from(set).sort();
  }, [guests]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = guests.filter((g) => {
      if (activeRoles.size && !activeRoles.has(g.role)) return false;
      if (activeNiches.size) {
        const has = (g.niches || []).some((n) => activeNiches.has(n));
        if (!has) return false;
      }
      if (q) {
        const hay = [
          g.display_name,
          g.mind_blowing_fact || "",
          (g.niches || []).join(" "),
          (g.creator_types || []).join(" "),
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (sort === "newest") {
      list = [...list].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    } else {
      list = [...list].sort((a, b) => {
        const an = (a.niches || [])[0] || "zzz";
        const bn = (b.niches || [])[0] || "zzz";
        return an.localeCompare(bn);
      });
    }
    return list;
  }, [guests, activeRoles, activeNiches, search, sort]);

  const toggleSet = (set: Set<string>, value: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: BG,
        color: "#fff",
        fontFamily: '"Josefin Sans", sans-serif',
        fontWeight: 300,
      }}
    >
      <div className="mx-auto px-5 pt-8 pb-16" style={{ maxWidth: 1100 }}>
        {(() => {
          try {
            const slug = sessionStorage.getItem("afterparty:return_slug");
            if (slug) return null;
          } catch {}
          return (
            <Link
              to="/afterparty"
              className="inline-flex items-center gap-1 text-[12px] mb-5"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              <ArrowLeft className="w-3 h-3" /> Back to invite
            </Link>
          );
        })()}

        <div className="relative text-left mb-10">
          <div className="text-[11px] uppercase mb-3" style={{ letterSpacing: "0.16em", color: "rgba(245,230,211,0.5)", fontWeight: 600 }}>
            Creator Kick-Off Party
          </div>
          <h1 className="font-afterparty text-[40px] sm:text-[56px] leading-[0.95] tracking-tight" style={{ fontWeight: 500, color: "#F5E6D3" }}>
            {loading ? "·" : guests.length} <span style={{ color: "rgba(245,230,211,0.45)" }}>{guests.length === 1 ? "person" : "people"} coming</span>
          </h1>
          <p className="text-[13px] mt-3" style={{ color: "rgba(245,230,211,0.5)" }}>
            Live roster — updates as folks RSVP.
          </p>
        </div>

        {/* The viewer's own card + matches at the top, when we know who they are */}
        <MyCardSection
          allAttendees={attendees}
          slug={viewerSlug}
          onCardSaved={fetchGuests}
        />

        {/* Spotlights (Peak Vibes pill logos) sit directly under the viewer's matches and above the full guest roster */}
        <div className="mt-2">
          <AfterPartySpotlights />
        </div>

        <div
          className="sticky top-2 z-20 p-3 rounded-xl mb-6 mt-8 backdrop-blur"
          style={{ backgroundColor: "rgba(17,17,17,0.92)", border: `1px solid ${BORDER}` }}
        >
          <div className="flex flex-wrap gap-2 mb-3">
            {ROLE_OPTIONS.map((r) => {
              const active = activeRoles.has(r.value);
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => toggleSet(activeRoles, r.value, setActiveRoles)}
                  className="text-[12px] px-2.5 py-1 rounded-full transition-colors"
                  style={{
                    backgroundColor: active ? "#fff" : "transparent",
                    color: active ? BG : "rgba(255,255,255,0.75)",
                    border: `1px solid ${active ? "#fff" : "rgba(255,255,255,0.18)"}`,
                  }}
                >
                  {r.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.4)" }} />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, niche, content type, or answer"
                className="pl-8 h-9 text-[13px]"
                style={{ backgroundColor: BG, border: `1px solid ${BORDER}`, color: "#fff" }}
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-9 px-2 rounded-md text-[13px]"
              style={{ backgroundColor: BG, border: `1px solid ${BORDER}`, color: "#fff" }}
            >
              <option value="newest">Newest first</option>
              <option value="niche">By niche</option>
            </select>
          </div>

          {allNiches.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {allNiches.map((n) => {
                const active = activeNiches.has(n);
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => toggleSet(activeNiches, n, setActiveNiches)}
                    className="text-[11px] px-2 py-0.5 rounded transition-colors"
                    style={{
                      backgroundColor: active ? "rgba(225,182,36,0.2)" : "rgba(255,255,255,0.04)",
                      color: active ? "#FAC775" : "rgba(255,255,255,0.65)",
                      border: `1px solid ${active ? "rgba(225,182,36,0.5)" : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Grid */}
        <div id="guest-roster" />

        {loading ? (
          <div className="text-center py-12" style={{ color: "rgba(255,255,255,0.5)" }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-16 rounded-xl text-[14px]"
            style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.6)" }}
          >
            No one matches those filters yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map((g) => <GuestCard key={g.id} guest={g} />)}
          </div>
        )}

        <AfterPartyAdminInline />
      </div>
    </div>
  );
};

export default GuestList;
