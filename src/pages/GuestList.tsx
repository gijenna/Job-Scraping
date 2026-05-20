import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import GuestCard, { GuestRow } from "@/components/afterparty/GuestCard";
import StarSparkle from "@/components/afterparty/StarSparkle";
import AfterPartySpotlights from "@/components/afterparty/AfterPartySpotlights";
import PartyFeaturesGrid from "@/components/afterparty/PartyFeaturesGrid";
import OakleyRinoVenueShowcase from "@/components/afterparty/OakleyRinoVenueShowcase";

import AfterPartyAdminInline from "@/components/afterparty/AfterPartyAdminInline";
import DesignCredit from "@/components/afterparty/DesignCredit";
import MyCardSection from "@/components/afterparty/MyCardSection";
import { AfterPartyAttendee } from "@/lib/afterparty-matching";
import { getSession } from "@/services/auth";

const BG = "#080808";
const CARD = "#111111";
const BORDER = "rgba(255,255,255,0.09)";

const ROLE_OPTIONS: { value: string; label: string }[] = [
  { value: "creator", label: "Creator" },
  { value: "brand", label: "Brand" },
  { value: "industry_expert", label: "Industry member" },
];

type Sort = "newest" | "niche";

interface GuestListProps {
  /** When set, replaces the default event-info column with a venue showcase
   *  panel. Currently only "oakley-rino" is supported. The guest data itself
   *  is unchanged — same RSVPs flow into both views. */
  venueShowcase?: "oakley-rino";
}

const GuestList = ({ venueShowcase }: GuestListProps = {}) => {
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
    const detailScore = (g: GuestRow) => {
      const hasPhoto = !!(g.cartoon_url && g.cartoon_url.trim());
      const fields = [
        g.mind_blowing_fact,
        g.niches?.length ? "x" : "",
        g.creator_types?.length ? "x" : "",
        g.looking_for?.length ? "x" : "",
        g.company,
        g.social_links?.instagram,
        g.social_links?.linkedin,
      ];
      const detail = fields.filter((v) => !!(v && String(v).trim())).length;
      return (hasPhoto ? 100 : 0) + detail * 10;
    };
    if (sort === "newest") {
      list = [...list].sort((a, b) => {
        const d = detailScore(b) - detailScore(a);
        if (d !== 0) return d;
        return +new Date(b.created_at) - +new Date(a.created_at);
      });
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
      className={`min-h-screen bg-cover bg-center md:bg-top ${venueShowcase === "oakley-rino" ? "" : "afterparty-page-bg"}`}
      style={{
        backgroundColor: BG,
        backgroundImage:
          venueShowcase === "oakley-rino"
            ? "linear-gradient(rgba(8, 8, 8, 0.06), rgba(8, 8, 8, 0.5)), url('/oakley-rino/oakley-rino-graffiti-bg.jpg')"
            : undefined,
        backgroundSize: "cover",
        backgroundPosition: venueShowcase === "oakley-rino" ? "28% top" : undefined,
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        color: "#fff",
        fontFamily: '"Josefin Sans", sans-serif',
        fontWeight: 300,
      }}
    >
      {venueShowcase === "oakley-rino" && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 bg-cover bg-top md:hidden"
          style={{
            backgroundImage:
              "linear-gradient(rgba(8, 8, 8, 0.18), rgba(8, 8, 8, 0.62)), url('/oakley-rino/oakley-rino-graffiti-bg.jpg')",
            backgroundPosition: "left top",
          }}
        />
      )}
      <div className="relative z-10 mx-auto px-5 pt-8 pb-16" style={{ maxWidth: 1100 }}>
        {!viewerSlug && (
          <Link
            to="/afterparty"
            onClick={() => { try { sessionStorage.setItem("afterparty:skip_splash", "1"); } catch {} }}
            className="inline-flex items-center gap-1 text-[12px] mb-5"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            <ArrowLeft className="w-3 h-3" /> Back to invite & RSVP
          </Link>
        )}

        {/* Two-column top banner: LEFT = event details (auth) or RSVP prompt
            (unauth). RIGHT = 6-icon Party Features grid (always visible). */}
        <div
          className="grid grid-cols-1 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-3 sm:gap-4 mb-6 items-stretch"
        >
          <div
            className="rounded-xl p-4 sm:p-5"
            style={{
              backgroundColor: "rgba(8,8,8,0.78)",
              border: viewerSlug
                ? "1px solid rgba(245,230,211,0.18)"
                : "1px solid #ED7660",
              backdropFilter: "blur(4px)",
              boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
            }}
          >
            {viewerSlug ? (
              <>
                <div
                  className="text-[11px] uppercase mb-1.5"
                  style={{ letterSpacing: "0.16em", color: "#ED7660", fontWeight: 700 }}
                >
                  The Party
                </div>
                <div className="text-[13px] space-y-1" style={{ color: "#F5E6D3" }}>
                  <div>May 28, 2026</div>
                  <div>7:30 PM &ndash; 9:30 PM (no early birdies)</div>
                  <div>
                    <a
                      href="https://www.google.com/maps/place/2660+Walnut+St+Unit+3,+Denver,+CO+80205"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                      style={{ color: "#F5E6D3" }}
                    >
                      Oakley RiNo, 2660 Walnut Street, Unit 3, Denver, CO
                    </a>
                  </div>
                  <div style={{ color: "rgba(245,230,211,0.75)" }}>
                    No plus-ones unless they're on the list.
                  </div>
                  <div className="pt-1">
                    <Link
                      to="/afterparty-interest"
                      className="text-[12px] underline"
                      style={{ color: "#ED7660", fontWeight: 600 }}
                    >
                      Got someone in mind? Send them here →
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <Link
                to="/afterparty"
                onClick={() => { try { sessionStorage.setItem("afterparty:skip_splash", "1"); } catch {} }}
                className="block hover:opacity-95 transition-opacity"
              >
                <div
                  className="text-[11px] uppercase mb-1"
                  style={{ letterSpacing: "0.14em", color: "#ED7660", fontWeight: 700 }}
                >
                  Not on the list yet?
                </div>
                <div className="text-[15px]" style={{ color: "#F5E6D3", fontWeight: 600, letterSpacing: "-0.01em" }}>
                  RSVP to the Creator Kick-Off Party →
                </div>
                <div className="text-[12px] mt-1" style={{ color: "rgba(245,230,211,0.7)" }}>
                  Grab your spot, then come back here to see the full party details.
                </div>
              </Link>
            )}
          </div>

          <div
            className="rounded-xl p-3 sm:p-4 flex items-center justify-center"
            style={{
              backgroundColor: "rgba(8,8,8,0.55)",
              border: "1px solid rgba(245,230,211,0.14)",
              backdropFilter: "blur(4px)",
            }}
          >
            <div className="w-full">
              <div
                className="text-[10px] uppercase mb-2 text-center"
                style={{ letterSpacing: "0.18em", color: "#E1B624", fontWeight: 700 }}
              >
                Party Features
              </div>
              <PartyFeaturesGrid />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] gap-5 mb-6 items-start">
          {/* Headcount header - left */}
          <div className="relative">
            <h1
              className="font-afterparty text-[40px] sm:text-[56px] leading-[0.95] tracking-tight"
              style={{
                fontWeight: 500,
                color: "#FFF6E0",
                textShadow:
                  "0 0 6px rgba(255,235,180,0.95), 0 0 14px rgba(237,118,96,0.85), 0 0 28px rgba(237,118,96,0.7), 0 0 48px rgba(225,182,36,0.55)",
              }}
            >
              {loading ? "·" : guests.length}{" "}
              <span
                style={{
                  color: "#FFE9A8",
                  textShadow:
                    "0 0 6px rgba(255,225,140,0.9), 0 0 16px rgba(225,182,36,0.8), 0 0 32px rgba(225,182,36,0.55)",
                }}
              >
                {guests.length === 1 ? "person" : "people"} coming
              </span>
            </h1>
            <p
              className="text-[13px] mt-3"
              style={{
                color: "#FFE9A8",
                textShadow: "0 0 8px rgba(225,182,36,0.7), 0 0 18px rgba(237,118,96,0.45)",
              }}
            >
              Live roster. Updates as folks RSVP.
            </p>
            {viewerSlug && (
              <p
                className="text-[12px] mt-1.5"
                style={{ color: "rgba(245,230,211,0.7)" }}
              >
                May 28, 2026 · 7:30 PM at{" "}
                <a
                  href="https://www.google.com/maps/place/2660+Walnut+St+Unit+3,+Denver,+CO+80205"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#ED7660] transition-colors"
                  style={{ color: "#F5E6D3" }}
                >
                  Oakley RiNo
                </a>
              </p>
            )}
          </div>

          {/* Event info - right column. On the Oakley variant this is replaced
              with a venue showcase panel for the RiNo store. */}
          {venueShowcase === "oakley-rino" ? (
            <OakleyRinoVenueShowcase />
          ) : (
            <div className="md:text-right text-[13px] leading-[1.6]" style={{ color: "rgba(245,230,211,0.8)" }}>
              <div
                className="text-[10px] uppercase mb-1.5"
                style={{ letterSpacing: "0.18em", color: "#FAC775", fontWeight: 600 }}
              >
                Creator Kick-Off Party
              </div>
              <div style={{ color: "#F5E6D3" }}>
                A rooftop party for outdoor industry creators &amp; brands.
              </div>
              <div className="mt-2">Thursday, May 28 · 7:30–9:30pm MT</div>
              <div style={{ color: "rgba(245,230,211,0.6)" }}>
                Denver rooftop · full address sent closer to the date
              </div>
              <div className="mt-2 text-[12px]" style={{ color: "rgba(245,230,211,0.55)" }}>
                Questions?{" "}
                <a
                  href="mailto:jenna@wearetheoutdoorindustry.com"
                  style={{ color: "#ED7660", textDecoration: "underline" }}
                >
                  jenna@wearetheoutdoorindustry.com
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Unauthenticated: replace "Your Card" with an RSVP/login prompt */}
        {!viewerSlug && (
          <Link
            to="/afterparty"
            onClick={() => { try { sessionStorage.setItem("afterparty:skip_splash", "1"); } catch {} }}
            className="block rounded-2xl p-5 sm:p-6 mb-4 hover:opacity-95 transition-opacity"
            style={{
              backgroundColor: CARD,
              border: `1px solid ${BORDER}`,
            }}
          >
            <div
              className="text-[11px] uppercase mb-2"
              style={{ letterSpacing: "0.16em", color: "rgba(245,230,211,0.5)", fontWeight: 600 }}
            >
              Your card
            </div>
            <h2
              className="text-[20px] sm:text-[22px] leading-tight mb-2"
              style={{ fontWeight: 600, color: "#F5E6D3", letterSpacing: "-0.01em" }}
            >
              Want to be on the list?
            </h2>
            <p className="text-[13px] mb-4" style={{ color: "rgba(245,230,211,0.7)" }}>
              RSVP'ing reveals the venue details, your personal card, and the full guest list.
            </p>
            <span
              className="inline-flex items-center px-4 py-2 rounded-lg text-[14px]"
              style={{ backgroundColor: "#ED7660", color: "#19363B", fontWeight: 700 }}
            >
              RSVP / Log in →
            </span>
          </Link>
        )}


        {/* The viewer's own card + matches at the top, when we know who they are.
            On tablet/desktop, sponsor spotlights sit beside the card preview.
            On mobile, they fall back to rendering below. */}
        <MyCardSection
          allAttendees={attendees}
          slug={viewerSlug}
          onCardSaved={fetchGuests}
          sidebar={<AfterPartySpotlights />}
          rinoMural={venueShowcase === "oakley-rino"}
        />

        {/* Mobile fallback: spotlights below the matches */}
        <div className="mt-2 md:hidden">
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
        <DesignCredit />
      </div>
    </div>
  );
};

export default GuestList;
