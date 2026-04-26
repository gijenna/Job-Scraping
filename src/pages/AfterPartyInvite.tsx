import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { EditableTextProvider } from "@/components/EditableTextProvider";
import EditableText from "@/components/EditableText";
import AfterPartyIntakeForm from "@/components/afterparty/AfterPartyIntakeForm";
import MatchesPanel from "@/components/afterparty/MatchesPanel";
import NumberBadge from "@/components/afterparty/NumberBadge";
import PinSheet from "@/components/afterparty/PinSheet";
import SkeletonMatches from "@/components/afterparty/SkeletonMatches";
import {
  AfterPartyAttendee,
  computeMatchesFor,
  MatchResult,
} from "@/lib/afterparty-matching";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Search } from "lucide-react";
import BasecampMatchPopflyLogo from "@/components/afterparty/BasecampMatchPopflyLogo";
import StarSparkle from "@/components/afterparty/StarSparkle";
import { getSession } from "@/services/auth";
import BrandActivateButton from "@/components/afterparty/BrandActivateButton";
import AfterPartyPartners from "@/components/afterparty/AfterPartyPartners";
import AfterPartySpotlights from "@/components/afterparty/AfterPartySpotlights";
import AfterPartyAdminInline from "@/components/afterparty/AfterPartyAdminInline";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const ROLE_PILL: Record<string, { bg: string; border: string; text: string; label: string }> = {
  creator: { bg: "#4A1B0C", border: "#D85A30", text: "#F5C4B3", label: "Creator" },
  brand: { bg: "#1a1830", border: "#7F77DD", text: "#CECBF6", label: "Brand rep" },
  industry_expert: { bg: "#04342C", border: "#1D9E75", text: "#9FE1CB", label: "Industry expert" },
};

const BG = "#080808";
const CARD = "#111111";
const BORDER = "rgba(255,255,255,0.09)";
const CREAM = "#F5E6D3";
const CREAM_MUTED = "rgba(245,230,211,0.7)";
const CREAM_DIM = "rgba(245,230,211,0.55)";
const CREAM_FAINT = "rgba(245,230,211,0.45)";

interface AfterPartyInviteProps {
  presenter?: { label: string; logoUrl: string; logoAlt: string; href?: string };
}

const AfterPartyInvite = ({ presenter }: AfterPartyInviteProps = {}) => {
  const { name } = useParams();
  const [attendees, setAttendees] = useState<AfterPartyAttendee[]>([]);
  const [me, setMe] = useState<AfterPartyAttendee | null>(null);
  const [lookupName, setLookupName] = useState("");
  const [loading, setLoading] = useState(true);
  const [lockedMatches, setLockedMatches] = useState<MatchResult[] | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [verifiedAttendeeId, setVerifiedAttendeeId] = useState<string | null>(null);
  const [publicListing, setPublicListing] = useState<boolean>(true);
  const [updatingListing, setUpdatingListing] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [meFull, setMeFull] = useState<any>(null);
  const [splashDone, setSplashDone] = useState(false);
  const [justRsvped, setJustRsvped] = useState(false);
  const [showPersonalGreeting, setShowPersonalGreeting] = useState(false);
  const [greetingQueued, setGreetingQueued] = useState(false);

  const fetchAll = async () => {
    // Public read goes through the safe view (no email/pin fields exposed)
    const { data } = await (supabase as any)
      .from("afterparty_attendees_public")
      .select("*")
      .order("attendee_number");
    setAttendees((data as AfterPartyAttendee[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  // Restore session on mount
  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (session?.attendeeId) setVerifiedAttendeeId(session.attendeeId);
    })();
  }, []);

  // Auto-load by URL :name
  useEffect(() => {
    if (!name || !attendees.length || me) return;
    const found = attendees.find(
      (a) => slugify(a.full_name) === slugify(name) || a.slug === name,
    );
    if (found) {
      setMe(found);
      // First-time personalized greeting: only the very first time someone
      // opens THEIR personalized link in this browser. Not on edit/back/etc.
      // Wait for the splash animation to finish before showing it.
      try {
        const key = `afterparty:greeted:${found.id}`;
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, "1");
          // Show greeting alongside the splash (Popfly+Basecamp solo monogram phase),
          // physically above it. Hide it as the splash transitions out.
          setShowPersonalGreeting(true);
          setTimeout(() => setShowPersonalGreeting(false), 4200);
        }
      } catch {}
    }
  }, [name, attendees, me]);

  // Reveal invite content after splash finishes (original behavior).
  useEffect(() => {
    if (splashDone) setRevealed(true);
  }, [splashDone]);

  // Locked matches
  useEffect(() => {
    if (!me) { setLockedMatches(null); return; }
    (async () => {
      const { data } = await (supabase as any)
        .from("afterparty_matches")
        .select("*")
        .eq("attendee_id", me.id)
        .eq("locked", true)
        .order("rank");
      setLockedMatches(data && data.length ? (data as MatchResult[]) : null);
    })();
  }, [me?.id]);

  const liveMatches = useMemo(() => {
    if (!me) return [];
    return computeMatchesFor(me, attendees, 5);
  }, [me, attendees]);

  const matchesToShow = lockedMatches ?? liveMatches;
  const matchesWithAttendee = matchesToShow
    .map((m) => {
      const att = attendees.find((a) => a.id === m.match_attendee_id);
      return att ? { match: m, attendee: att } : null;
    })
    .filter(Boolean) as { match: MatchResult; attendee: AfterPartyAttendee }[];

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const found = attendees.find(
      (a) => slugify(a.full_name) === slugify(lookupName),
    );
    if (found) setMe(found);
    else alert("No card found for that name. Reach out to the organizer for an invite link.");
  };

  const handleSaved = async (id: string) => {
    await fetchAll();
    const { data } = await (supabase as any)
      .from("afterparty_attendees_public")
      .select("*")
      .eq("id", id)
      .single();
    if (data) setMe(data as AfterPartyAttendee);
    // Refresh full row too so the editor stays accurate on next open
    const { data: full } = await (supabase as any)
      .from("afterparty_attendees")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (full) setMeFull(full);
    setEditMode(false);
    setJustRsvped(true);
    setTimeout(() => {
      document.getElementById("matches")?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  // ?activate=1 from the invite email → show brand CTA immediately
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("activate") === "1") {
      setJustRsvped(true);
      params.delete("activate");
      const qs = params.toString();
      const newUrl =
        window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash;
      window.history.replaceState({}, "", newUrl);
    }
  }, []);

  // ?edit=1 (e.g. coming back from /guests) → jump straight into edit mode
  useEffect(() => {
    if (!me) return;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("edit") !== "1") return;
    // Only auto-edit if this is the user's own card (already verified)
    if (verifiedAttendeeId === me.id) {
      setEditMode(true);
    } else {
      // Trigger PIN flow / shell shortcut
      requestEdit();
    }
    params.delete("edit");
    const qs = params.toString();
    const newUrl =
      window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash;
    window.history.replaceState({}, "", newUrl);
  }, [me?.id, verifiedAttendeeId]);

  const requestEdit = () => {
    if (!me) return;
    // Pre-RSVP shells (no email on file) skip PIN — there's nowhere to send a code.
    if (verifiedAttendeeId === me.id || (!me.photo_url && !me.cartoon_url
      && !(me.niches?.length) && !(me.looking_for?.length)
      && !(me.creator_types?.length) && !(me.platforms?.length)
      && !(me as any).mind_blowing_fact && !(me as any).company)) {
      setEditMode(true);
      return;
    }
    setPinOpen(true);
  };

  const handleVerified = (attendeeId: string) => {
    setVerifiedAttendeeId(attendeeId);
    setPinOpen(false);
    setEditMode(true);
  };

  const submitted = !!me;
  const myPill = me ? (ROLE_PILL[me.role] || ROLE_PILL.brand) : null;
  // A "pre-RSVP shell" is an attendee row created by the bulk link builder
  // before the person has actually filled anything out — no photo, no
  // niches, no looking_for, etc. We treat these as fresh RSVPs so the user
  // lands on the intake form (not a view-mode "card" that asks for a PIN).
  const isPreRsvpShell = !!me && !me.photo_url && !me.cartoon_url
    && !(me.niches?.length) && !(me.looking_for?.length)
    && !(me.creator_types?.length) && !(me.platforms?.length)
    && !me.mind_blowing_fact && !me.company;
  const isOwner = !!me && (verifiedAttendeeId === me.id || isPreRsvpShell);

  // Load public_listing for owner (not exposed via public view)
  useEffect(() => {
    if (!isOwner || !me) return;
    (async () => {
      const { data } = await (supabase as any)
        .from("afterparty_attendees")
        .select("public_listing")
        .eq("id", me.id)
        .maybeSingle();
      if (data && typeof data.public_listing === "boolean") {
        setPublicListing(data.public_listing);
      }
    })();
  }, [isOwner, me?.id]);

  // Load the full attendee row (with phone/email) when the viewer is the
  // verified owner — the public view doesn't expose those fields, and we
  // need them in the editor so saves don't blank them out.
  useEffect(() => {
    if (!me || verifiedAttendeeId !== me.id) { setMeFull(null); return; }
    (async () => {
      const { data } = await (supabase as any)
        .from("afterparty_attendees")
        .select("*")
        .eq("id", me.id)
        .maybeSingle();
      if (data) setMeFull(data);
    })();
  }, [me?.id, verifiedAttendeeId]);

  const togglePublicListing = async (next: boolean) => {
    if (!me) return;
    setUpdatingListing(true);
    setPublicListing(next);
    const { error } = await (supabase as any)
      .from("afterparty_attendees")
      .update({ public_listing: next })
      .eq("id", me.id);
    if (error) setPublicListing(!next);
    setUpdatingListing(false);
  };

  return (
    <EditableTextProvider pageSlug="afterparty">
      <div
        className="min-h-screen relative"
        style={{
          backgroundColor: BG,
          backgroundImage: `linear-gradient(rgba(8,8,8,0.25), rgba(8,8,8,0.35)), url(/afterparty-bg.jpg)`,
          backgroundSize: "100% 100vh",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          color: CREAM,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontWeight: 400,
        }}
      >
        <div className="mx-auto px-5 pt-10 pb-16 relative z-10" style={{ maxWidth: 480 }}>
          {/* Logo lockup (controls splash + reveal) */}
          <BasecampMatchPopflyLogo onRevealed={() => setSplashDone(true)} />

          {/* Personalized greeting — sits ABOVE the splash monogram so the two
              never overlap. Appears in sync with the splash and fades out as
              the splash transitions. First visit per browser only. */}
          {showPersonalGreeting && me?.full_name && (
            <div
              className="fixed inset-x-0 top-0 z-[70] flex items-start justify-center px-6 pt-[6vh] pointer-events-none"
              aria-hidden="true"
            >
              <style>{`
                @keyframes apGreetInOut {
                  0%   { opacity: 0; transform: translateY(-12px); }
                  12%  { opacity: 1; transform: translateY(0); }
                  82%  { opacity: 1; transform: translateY(0); }
                  100% { opacity: 0; transform: translateY(-10px); }
                }
              `}</style>
              <h2
                className="font-afterparty text-3xl sm:text-4xl md:text-5xl font-bold text-center"
                style={{
                  color: "#F5E6D3",
                  animation: "apGreetInOut 4200ms ease-in-out forwards",
                  textShadow:
                    "0 0 18px rgba(8,8,8,0.95), 0 0 36px rgba(8,8,8,0.8), 0 0 54px rgba(237,118,96,0.4)",
                }}
              >
                Hey {me.full_name.split(" ")[0]},<br />you're invited to...
              </h2>
            </div>
          )}


          <div>
          {/* Hero copy */}
          <div className="mt-2 text-center" style={{ transitionDelay: "60ms" }}>
            {presenter && (
              <a
                href={presenter.href || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center mb-4 mt-1"
              >
                <span
                  className="font-afterparty text-[12px] sm:text-[13px] tracking-wide mb-1.5"
                  style={{ color: CREAM_MUTED, fontWeight: 500 }}
                >
                  {presenter.label}
                </span>
                <img
                  src={presenter.logoUrl}
                  alt={presenter.logoAlt}
                  className="h-16 sm:h-20 w-auto"
                />
              </a>
            )}
            <div className="flex items-center justify-center gap-3 mb-3 mt-1" aria-hidden="true">
              <StarSparkle tone="coral" size={18} />
              <StarSparkle tone="cream" size={26} />
              <StarSparkle tone="green" size={20} />
              <StarSparkle tone="cream" size={14} />
              <StarSparkle tone="coral" size={22} />
            </div>
            <div
              className="font-afterparty font-bold flex items-center justify-center gap-1.5 sm:gap-2 mb-3 whitespace-nowrap text-[13px] sm:text-base"
              style={{ color: CREAM }}
            >
              <span>DJ</span>
              <StarSparkle tone="green" size={10} />
              <span>Drinks</span>
              <StarSparkle tone="coral" size={10} />
              <span>Swag</span>
              <StarSparkle tone="cream" size={10} />
              <span>Food</span>
              <StarSparkle tone="green" size={10} />
              <span>Friends</span>
            </div>
            <div className="mt-1 text-[13px] flex items-center justify-center gap-2 flex-wrap" style={{ color: CREAM_DIM }}>
              <EditableText settingKey="hero.date" defaultText="Date TBA" />
              
              <EditableText settingKey="hero.venue" defaultText="Location revealed on RSVP" />
            </div>
            <div className="mt-4">
              <Link
                to={me?.slug ? `/guests?slug=${me.slug}` : "/guests"}
                onClick={() => {
                  if (me?.slug) {
                    try { sessionStorage.setItem("afterparty:return_slug", me.slug); } catch {}
                  }
                }}
                className="text-[13px] underline"
                style={{ color: CREAM_MUTED }}
              >
                See who's coming →
              </Link>
            </div>
          </div>

          {/* About the event — shown when no card loaded OR when this is a
              personalized pre-RSVP shell (so invitees see event info first) */}
          {(!me || (me && isPreRsvpShell && !editMode)) && (
            <section className="mt-16">
              <div className="px-1">
                <h2 className="font-afterparty text-[22px] mb-3" style={{ fontWeight: 500, color: CREAM }}>
                  <EditableText settingKey="about.title" defaultText="A lil party for outdoor industry creators, brands & festival sponsors" />
                </h2>
                {me?.invited_by ? (
                  <div
                    className="mb-5 inline-flex px-3 py-1.5 rounded-lg text-center text-[14px] font-afterparty"
                    style={{
                      backgroundColor: "rgba(216,90,48,0.12)",
                      border: "1px solid rgba(216,90,48,0.4)",
                      color: CREAM,
                      fontWeight: 500,
                    }}
                  >
                    Invite-only · Luckily, you're on&nbsp;<span style={{ fontWeight: 700 }}>{me.invited_by}</span>'s list
                  </div>
                ) : (
                  <p className="text-[14px] leading-[1.55] mb-5" style={{ color: CREAM_MUTED }}>
                    <EditableText
                      settingKey="about.body"
                      defaultText="Invite-only"
                      multiline
                    />
                  </p>
                )}

                <div className="space-y-2 mb-6 text-[13px]" style={{ color: CREAM_MUTED }}>
                  <div className="flex items-start gap-2">
                    <span style={{ color: CREAM_FAINT }}>·</span>
                    <EditableText settingKey="about.detail1" defaultText="Thursday evening · 7–9pm" />
                  </div>
                  <div className="flex items-start gap-2">
                    <span style={{ color: CREAM_FAINT }}>·</span>
                    <EditableText settingKey="about.detail2" defaultText="Auraria Campus, Denver" />
                  </div>
                  <div className="flex items-start gap-2">
                    <span style={{ color: CREAM_FAINT }}>·</span>
                    <EditableText settingKey="about.detail3" defaultText="Come as you are, outdoor industry casual" />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => {
                    setEditMode(true);
                    setTimeout(() => {
                      document.getElementById("intake-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 100);
                  }}
                  className="w-full font-afterparty text-[14px] h-11"
                  style={{ backgroundColor: CREAM, color: BG, fontWeight: 500 }}
                >
                  {me?.full_name
                    ? `RSVP here, ${me.full_name.split(" ")[0]}`
                    : <EditableText settingKey="cta.primary" defaultText="RSVP" />}
                </Button>
              </div>
            </section>
          )}

          {/* Find existing card */}
          {!me && !loading && !name && (
            <div id="opt-in" className="mt-8 px-1">
              <p className="text-[13px] mb-2" style={{ color: CREAM_MUTED }}>
                <EditableText
                  settingKey="cta.secondary"
                  defaultText="Already RSVP'd? Type your name to load your card."
                />
              </p>
              <form onSubmit={handleLookup} className="flex gap-2">
                <Input
                  id="lookup-input"
                  value={lookupName}
                  onChange={(e) => setLookupName(e.target.value)}
                  placeholder="Your full name"
                  style={{ backgroundColor: "rgba(0,0,0,0.25)", border: `1px solid ${BORDER}`, color: CREAM }}
                />
                <Button type="submit" style={{ backgroundColor: CREAM, color: BG }}>
                  <Search className="w-4 h-4" />
                </Button>
              </form>
            </div>
          )}

          {/* My card (view mode) */}
          {me && !editMode && (
            <section className="mt-8">
              <div className="relative p-5 rounded-xl overflow-hidden" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
                <div className="absolute -top-3 -right-3 opacity-70 rotate-12 pointer-events-none">
                  <StarSparkle tone="green" variant="set" size={56} />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <NumberBadge number={me.attendee_number} role={me.role} size={46} />
                  <div className="flex -space-x-2">
                    {me.photo_url ? (
                      <img src={me.photo_url} alt="" className="w-[42px] h-[42px] rounded-full object-cover" style={{ border: `1px solid ${BORDER}` }} />
                    ) : null}
                    {me.cartoon_url ? (
                      <img src={me.cartoon_url} alt="" className="w-[42px] h-[42px] rounded-full object-cover" style={{ border: `1px solid ${BORDER}` }} />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[16px]" style={{ fontWeight: 500 }}>{me.full_name}</div>
                    {myPill && (
                      <span
                        className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: myPill.bg,
                          color: myPill.text,
                          border: `1px solid ${myPill.border}`,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {myPill.label}
                      </span>
                    )}
                  </div>
                </div>

                {(me.niches?.length || me.creator_types?.length) && (
                  <div className="grid grid-cols-2 gap-4 mb-4 text-[13px]">
                    {me.niches?.length ? (
                      <div>
                        <div className="text-[10px] uppercase mb-1" style={{ letterSpacing: "0.08em", color: CREAM_FAINT }}>Niche</div>
                        <div style={{ color: CREAM }}>{me.niches.join(", ")}</div>
                      </div>
                    ) : null}
                    {me.creator_types?.length || me.brand_seeking?.length ? (
                      <div>
                        <div className="text-[10px] uppercase mb-1" style={{ letterSpacing: "0.08em", color: CREAM_FAINT }}>{me.role === "brand" ? "Offers" : "Creates"}</div>
                        <div style={{ color: CREAM }}>{(me.creator_types?.length ? me.creator_types : me.brand_seeking || []).join(", ")}</div>
                      </div>
                    ) : null}
                  </div>
                )}

                {me.looking_for?.length ? (
                  <div className="mb-4 text-[13px]">
                    <div className="text-[10px] uppercase mb-1" style={{ letterSpacing: "0.08em", color: CREAM_FAINT }}>Here to</div>
                    <div style={{ color: CREAM }}>{me.looking_for.join(", ")}</div>
                  </div>
                ) : null}

                {me.mind_blowing_fact ? (
                  <div className="pl-3 mb-4" style={{ borderLeft: `2px solid ${myPill?.border || "#7F77DD"}` }}>
                    <div className="text-[10px] uppercase mb-1" style={{ letterSpacing: "0.08em", color: myPill?.text || "#CECBF6" }}>Why it worked</div>
                    <p className="text-[13px] italic" style={{ color: CREAM_MUTED }}>{me.mind_blowing_fact}</p>
                  </div>
                ) : null}

                {isOwner && (
                  <div
                    className="flex items-center justify-between gap-3 mb-4 p-3 rounded-lg"
                    style={{ backgroundColor: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}` }}
                  >
                    <div className="text-[12px]">
                      <div style={{ color: CREAM }}>Show me in the guest list</div>
                      <div className="text-[11px]" style={{ color: CREAM_DIM }}>
                        Public roster at /guests · first name + last initial only
                      </div>
                    </div>
                    <Switch
                      checked={publicListing}
                      onCheckedChange={togglePublicListing}
                      disabled={updatingListing}
                    />
                  </div>
                )}

                {(isOwner || justRsvped) && me.role === "brand" && (
                  <div className="mb-4">
                    <BrandActivateButton
                      attendeeId={me.id}
                      fullName={me.full_name}
                      company={me.company}
                      email={(me as any).email}
                      variant="compact"
                      hideIfAlreadySent
                      afterPartyUrl={`${window.location.origin}/guests?slug=${me.slug}`}
                    />
                  </div>
                )}

                <div className="text-right">
                  <Link
                    to={`/guests?slug=${me.slug}&edit=1`}
                    onClick={() => {
                      try { sessionStorage.setItem("afterparty:return_slug", me.slug); } catch {}
                    }}
                    className="text-[13px] underline"
                    style={{ color: CREAM_MUTED }}
                  >
                    Edit my card →
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Intake form, new RSVP or owner editing existing card */}
          {editMode && (!me || isOwner) && (
            <section id="intake-form" className="mt-8">
              {me?.invited_by && (
                <div
                  className="mb-4 px-3 py-2 rounded-lg text-center text-[13px]"
                  style={{
                    backgroundColor: "rgba(216,90,48,0.12)",
                    border: "1px solid rgba(216,90,48,0.4)",
                    color: CREAM,
                  }}
                >
                  Lucky you — <span style={{ fontWeight: 600 }}>{me.invited_by}</span> wants you there
                </div>
              )}
              <h2 className="font-afterparty text-[20px] mb-4" style={{ fontWeight: 500, color: CREAM }}>
                {me ? (me.invited_by ? `RSVP here, ${me.full_name?.split(" ")[0] || ""}!` : "Edit your card") : "RSVP & build your card"}
              </h2>
              <AfterPartyIntakeForm attendeeId={me?.id ?? null} initial={meFull || me} onSaved={handleSaved} />
            </section>
          )}

          {/* Matches, only shown once a card is loaded */}
          {me && (
            <section id="matches" className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-afterparty text-[17px] flex items-center gap-2" style={{ fontWeight: 500, color: CREAM }}>
                  <StarSparkle tone="coral" variant="single" size={18} />
                  Look out for these numbers tonight
                </h2>
                <span className="text-[12px]" style={{ color: CREAM_DIM }}>
                  {lockedMatches ? "Final" : "Sent to your email too"}
                </span>
              </div>
              <MatchesPanel matches={matchesWithAttendee} locked={!!lockedMatches} />
            </section>
          )}

          {/* Brand spotlights — global to event, shown after matches/see-who's-coming */}
          <AfterPartySpotlights />

          {/* Partners — global, bottom of page */}
          <AfterPartyPartners />

          {/* Admin-only inline editor for partners + spotlights */}
          <AfterPartyAdminInline />
          </div>
        </div>

        {me && (
          <PinSheet
            open={pinOpen}
            slug={me.slug}
            onSuccess={handleVerified}
            onClose={() => setPinOpen(false)}
          />
        )}
      </div>
    </EditableTextProvider>
  );
};

export default AfterPartyInvite;
