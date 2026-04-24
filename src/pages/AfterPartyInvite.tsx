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

const AfterPartyInvite = () => {
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
  const [justRsvped, setJustRsvped] = useState(false);

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
    if (found) setMe(found);
  }, [name, attendees, me]);

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

  const requestEdit = () => {
    if (!me) return;
    if (verifiedAttendeeId === me.id) {
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
  const isOwner = !!me && verifiedAttendeeId === me.id;

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
          <BasecampMatchPopflyLogo onRevealed={() => setRevealed(true)} />

          <div
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 600ms ease-out, transform 600ms ease-out",
              pointerEvents: revealed ? "auto" : "none",
            }}
          >
          {/* Hero copy */}
          <div className="mt-6 text-center" style={{ transitionDelay: "60ms" }}>
            <div className="text-[11px] uppercase mb-3" style={{ letterSpacing: "0.12em", color: CREAM_DIM }}>
              <EditableText settingKey="hero.kicker" defaultText="" />
            </div>
            <h1 className="font-afterparty text-[32px] sm:text-[36px] leading-[1.1] mb-3" style={{ fontWeight: 500, color: CREAM }}>
              <EditableText settingKey="hero.title" defaultText="Creator after party" />
            </h1>
            <p className="text-[15px] mb-4" style={{ color: CREAM_MUTED }}>
              <EditableText
                settingKey="hero.subtitle"
                defaultText="An evening for the outdoor industry's next wave."
                multiline
              />
            </p>
            <div className="text-[13px] flex items-center justify-center gap-2 flex-wrap" style={{ color: CREAM_DIM }}>
              <EditableText settingKey="hero.date" defaultText="Date TBA" />
              <span>·</span>
              <EditableText settingKey="hero.venue" defaultText="Location revealed on RSVP" />
            </div>
            <div className="mt-4">
              <Link
                to="/guests"
                className="text-[13px] underline"
                style={{ color: CREAM_MUTED }}
              >
                See who's coming →
              </Link>
            </div>
          </div>

          {/* About the event */}
          {!me && (
            <section className="mt-10">
              <div className="px-1">
                <h2 className="font-afterparty text-[22px] mb-3" style={{ fontWeight: 500, color: CREAM }}>
                  <EditableText settingKey="about.title" defaultText="An invite-only night in RiNo" />
                </h2>
                <p className="text-[14px] leading-[1.55] mb-5" style={{ color: CREAM_MUTED }}>
                  <EditableText
                    settingKey="about.body"
                    defaultText="A curated evening for brands, creators, and Outside Days festival sponsors, hosted in one of RiNo's newest, coolest spots. Address shared after RSVP."
                    multiline
                  />
                </p>

                <div className="space-y-2 mb-6 text-[13px]" style={{ color: CREAM_MUTED }}>
                  <div className="flex items-start gap-2">
                    <span style={{ color: CREAM_FAINT }}>·</span>
                    <EditableText settingKey="about.detail1" defaultText="Thursday evening · doors at 7pm" />
                  </div>
                  <div className="flex items-start gap-2">
                    <span style={{ color: CREAM_FAINT }}>·</span>
                    <EditableText settingKey="about.detail2" defaultText="RiNo Art District, Denver" />
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
                  <EditableText settingKey="cta.primary" defaultText="RSVP" />
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
                    />
                  </div>
                )}

                <div className="text-right">
                  <button
                    type="button"
                    onClick={requestEdit}
                    className="text-[13px] underline"
                    style={{ color: CREAM_MUTED }}
                  >
                    {isOwner ? "Edit my card →" : "Edit my card →"}
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Intake form, new RSVP or owner editing existing card */}
          {editMode && (!me || isOwner) && (
            <section id="intake-form" className="mt-8">
              <h2 className="font-afterparty text-[20px] mb-4" style={{ fontWeight: 500, color: CREAM }}>
                {me ? "Edit your card" : "RSVP & build your card"}
              </h2>
              <AfterPartyIntakeForm attendeeId={me?.id ?? null} initial={me} onSaved={handleSaved} />
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
