import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  AfterPartyAttendee,
  computeMatchesFor,
  MatchResult,
} from "@/lib/afterparty-matching";
import MatchesPanel from "./MatchesPanel";
import AfterPartyIntakeForm from "./AfterPartyIntakeForm";
import PinSheet from "./PinSheet";
import { Button } from "@/components/ui/button";
import { getSession } from "@/services/auth";
import { Pencil, Sparkles, Plus } from "lucide-react";
import BrandActivateButton from "./BrandActivateButton";
import GuestCard, { GuestRow } from "./GuestCard";

const CARD = "#111111";
const BORDER = "rgba(255,255,255,0.09)";
const CREAM = "#F5E6D3";
const CREAM_MUTED = "rgba(245,230,211,0.7)";
const CREAM_DIM = "rgba(245,230,211,0.55)";
const CORAL = "#ED7660";

interface Props {
  /** All attendees (for live match computation) */
  allAttendees: AfterPartyAttendee[];
  /** Slug to identify the viewer (from query param / sessionStorage) */
  slug?: string | null;
  onCardSaved?: () => void;
  /** Optional sidebar content (e.g. sponsor spotlights) shown beside the
   *  card preview on tablet/desktop, hidden here on mobile. */
  sidebar?: React.ReactNode;
  /** Adds Oakley RiNo mural artwork into empty space on the Oakley guest page. */
  rinoMural?: boolean;
}

const MyCardSection = ({ allAttendees, slug, onCardSaved, sidebar, rinoMural = false }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [me, setMe] = useState<AfterPartyAttendee | null>(null);
  const [meFull, setMeFull] = useState<any>(null);
  const [verifiedAttendeeId, setVerifiedAttendeeId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editStartStep2, setEditStartStep2] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [lockedMatches, setLockedMatches] = useState<MatchResult[] | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [brandActivated, setBrandActivated] = useState<boolean | null>(null);

  // For brands and industry members: check whether they've already submitted an activation request.
  useEffect(() => {
    const role = (me as any)?.role;
    if (!me || (role !== "brand" && role !== "industry_expert")) { setBrandActivated(null); return; }
    let cancelled = false;
    (async () => {
      const { data } = await (supabase as any)
        .from("brand_activation_requests")
        .select("id")
        .eq("attendee_id", me.id)
        .limit(1);
      if (!cancelled) setBrandActivated(!!(data && data.length));
    })();
    return () => { cancelled = true; };
  }, [me?.id, (me as any)?.role]);

  // Restore session
  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (session?.attendeeId) setVerifiedAttendeeId(session.attendeeId);
    })();
  }, []);

  // Resolve "me" from slug or verified session
  useEffect(() => {
    if (!allAttendees.length) return;
    let target: AfterPartyAttendee | undefined;
    if (slug) target = allAttendees.find((a) => a.slug === slug);
    if (!target && verifiedAttendeeId) target = allAttendees.find((a) => a.id === verifiedAttendeeId);
    if (target) setMe(target);
  }, [allAttendees, slug, verifiedAttendeeId]);

  // Load full row (with phone/email/status) once we have an attendee.
  // We need `status` to decide whether to show "Secure my spot" vs "Edit my card".
  useEffect(() => {
    if (!me) { setMeFull(null); return; }
    (async () => {
      const { data } = await (supabase as any)
        .from("afterparty_attendees")
        .select("*")
        .eq("id", me.id)
        .maybeSingle();
      if (data) setMeFull(data);
    })();
  }, [me?.id]);

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

  // Pre-RSVP shell = the attendee row exists but the user has never submitted
  // the form. We use status as the source of truth (set to 'confirmed' on
  // first save). If meFull hasn't loaded yet, fall back to assuming NOT a
  // shell (so we don't flash "Secure my spot" on a returning visitor).
  const isPreRsvpShell = !!me && meFull
    ? (meFull.status ?? "invited") === "invited"
    : false;
  const isOwner = !!me && (verifiedAttendeeId === me.id || isPreRsvpShell);

  const hasMatchingInfo = !!me && (
    (me.niches?.length || 0) > 0 ||
    (me.looking_for?.length || 0) > 0 ||
    !!me.mind_blowing_fact ||
    (me.creator_types?.length || 0) > 0
  );

  // Honor ?edit=1 deep-link from email / AfterPartyInvite
  useEffect(() => {
    if (!me) return;
    if (searchParams.get("edit") !== "1") return;
    if (verifiedAttendeeId === me.id || isPreRsvpShell) {
      setEditMode(true);
    } else {
      setPinOpen(true);
    }
    const next = new URLSearchParams(searchParams);
    next.delete("edit");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me?.id, verifiedAttendeeId, isPreRsvpShell]);

  const liveMatches = useMemo(() => {
    if (!me) return [];
    return computeMatchesFor(me, allAttendees, 5);
  }, [me, allAttendees]);

  const matchesToShow = lockedMatches ?? liveMatches;
  const matchesWithAttendee = matchesToShow
    .map((m) => {
      const att = allAttendees.find((a) => a.id === m.match_attendee_id);
      return att ? { match: m, attendee: att } : null;
    })
    .filter(Boolean) as { match: MatchResult; attendee: AfterPartyAttendee }[];

  const requestEdit = (startStep2 = false) => {
    if (!me) return;
    setEditStartStep2(startStep2);
    if (verifiedAttendeeId === me.id || isPreRsvpShell) {
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

  const handleSaved = async (id: string) => {
    setEditMode(false);
    setEditStartStep2(false);
    setJustSaved(true);
    onCardSaved?.();
    const { data } = await (supabase as any)
      .from("afterparty_attendees_public")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (data) setMe(data as AfterPartyAttendee);
    const { data: full } = await (supabase as any)
      .from("afterparty_attendees")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (full) setMeFull(full);
  };

  if (!me) return null;

  // Build a GuestRow shape for the inline preview.
  const previewGuest: GuestRow = {
    id: me.id,
    attendee_number: me.attendee_number,
    role: (me as any).role,
    display_name: me.full_name,
    company: (me as any).company || null,
    company_role: (me as any).company_role || null,
    company_url: (me as any).company_url || null,
    cartoon_url: me.cartoon_url || null,
    niches: me.niches || [],
    creator_types: me.creator_types || [],
    looking_for: me.looking_for || [],
    mind_blowing_fact: me.mind_blowing_fact || null,
    social_links: (me as any).social_links as any,
    show_instagram: (me as any).show_instagram ?? true,
    show_linkedin: (me as any).show_linkedin ?? true,
    created_at: (me as any).created_at || new Date().toISOString(),
  };

  // ---- Coral prompt: "Add more about me" (replaces "see who's coming"
  //      whenever the user hasn't filled in matching info). ----
  const matchingPrompt = (
    <button
      type="button"
      onClick={() => requestEdit(true)}
      className="w-full text-left rounded-xl p-4 sm:p-5 hover:opacity-95 transition-opacity"
      style={{
        backgroundColor: "rgba(237,118,96,0.12)",
        border: `1px solid ${CORAL}`,
      }}
    >
      <div className="text-[11px] uppercase mb-1" style={{ letterSpacing: "0.12em", color: CORAL, fontWeight: 700 }}>
        You're in ✓
      </div>
      <div className="text-[15px] mb-1" style={{ color: CREAM, fontWeight: 600, letterSpacing: "-0.01em" }}>
        {(me as any).role === "brand"
          ? "Want suggestions on creators you should meet at the party?"
          : (me as any).role === "creator"
            ? "Want suggestions on brands you should meet at the party?"
            : "Want suggestions on people you should meet at the party?"}
      </div>
      <div className="text-[12px]" style={{ color: CREAM_MUTED }}>
        Add a bit more about you and we'll match you to people in the room you might not have known to look for. Totally optional, you can always do this later.
      </div>
      <div className="mt-3 inline-flex items-center gap-1.5 text-[13px]" style={{ color: CORAL, fontWeight: 600 }}>
        <Plus className="w-4 h-4" /> Add more about me →
      </div>
    </button>
  );

  // ---- Coral prompt: "See who's coming" (only when user is fully set up). ----
  const seeWhosComingPrompt = (
    <div
      id="roster-cta"
      className="rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
      style={{
        backgroundColor: "rgba(237,118,96,0.12)",
        border: `1px solid ${CORAL}`,
      }}
    >
      <div>
        <div className="text-[15px]" style={{ color: CREAM, fontWeight: 600 }}>
          See who else is coming
        </div>
        <div className="text-[12px]" style={{ color: CREAM_MUTED }}>
          The full roster is right below. Filter by role, niche, or search.
        </div>
      </div>
      <Button
        type="button"
        onClick={() => {
          document.getElementById("guest-roster")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        className="hover:opacity-90 shrink-0"
        style={{ backgroundColor: CORAL, color: "#fff", fontWeight: 700 }}
      >
        See who's coming →
      </Button>
    </div>
  );

  // ---- Combined "next steps" for brands & industry members with outstanding actions. ----
  const role = (me as any).role;
  const isBrand = role === "brand";
  const isIndustryMember = role === "industry_expert";
  const canActivate = isBrand || isIndustryMember;
  const needsActivation = canActivate && brandActivated === false;
  const needsMatching = !hasMatchingInfo;

  const activationHeading = isIndustryMember
    ? "Get more visibility at the party"
    : "Get your brand in the room";
  const activationBlurb = isIndustryMember
    ? "200 of the industry's hottest creators in one place. Let Jenna know how you'd like to show up."
    : "200 of the industry's hottest creators in one place. At least know your options.";
  const matchingHeading = isIndustryMember
    ? "Get matched to people worth meeting"
    : "Get matched to creators worth meeting";

  const brandCombinedCard = (
    <div
      className="rounded-xl p-4 sm:p-5"
      style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}
    >
      <div className="text-[11px] uppercase mb-3" style={{ letterSpacing: "0.14em", color: CREAM_DIM, fontWeight: 700 }}>
        A couple optional next steps
      </div>
      <div className="space-y-3">
        {needsActivation && (
          <div className="rounded-lg p-3 sm:p-4" style={{ border: `1px solid ${CORAL}`, backgroundColor: "rgba(237,118,96,0.10)" }}>
            <div className="text-[14px] mb-2" style={{ color: CREAM, fontWeight: 600 }}>
              {activationHeading}
            </div>
            <div className="text-[12px] mb-3" style={{ color: CREAM_MUTED }}>
              {activationBlurb}
            </div>
            <BrandActivateButton
              attendeeId={me.id}
              fullName={me.full_name}
              company={(me as any).company}
              email={(meFull as any)?.email}
              variant="compact"
              afterPartyUrl={`${typeof window !== "undefined" ? window.location.origin : ""}/guests?slug=${me.slug}`}
              onSubmitted={() => setBrandActivated(true)}
            />
          </div>
        )}
        {needsMatching && (
          <button
            type="button"
            onClick={() => requestEdit(true)}
            className="w-full text-left rounded-lg p-3 sm:p-4 hover:opacity-95 transition-opacity"
            style={{ border: `1px dashed ${CORAL}`, backgroundColor: "rgba(237,118,96,0.04)" }}
          >
            <div className="text-[14px] mb-1" style={{ color: CREAM, fontWeight: 600 }}>
              {matchingHeading}
            </div>
            <div className="text-[12px]" style={{ color: CREAM_MUTED }}>
              Add a bit more about who you're looking for. Totally optional.
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 text-[12px]" style={{ color: CORAL, fontWeight: 600 }}>
              <Plus className="w-3.5 h-3.5" /> Add more about me →
            </div>
          </button>
        )}
      </div>
    </div>
  );

  // Decide which CTA block sits above the matches list.
  // Priority for brands & industry members: combined card if anything outstanding, else fall back.
  // For everyone else: matching prompt if no matching info, else "see who's coming".
  let ctaBlock: React.ReactNode = null;
  if (!editMode) {
    if (canActivate && (needsActivation || needsMatching) && brandActivated !== null) {
      ctaBlock = brandCombinedCard;
    } else if (needsMatching) {
      ctaBlock = matchingPrompt;
    } else {
      ctaBlock = seeWhosComingPrompt;
    }
  }

  // Header button label: "Secure my spot" only when this is a true pre-RSVP
  // shell (status === 'invited'). Every other state is "Edit my card".
  const headerButtonLabel = isPreRsvpShell ? "Secure my spot" : "Edit my card";
  const headerButtonShowPencil = !isPreRsvpShell;

  return (
    <section
      className="relative mb-4 overflow-hidden rounded-2xl p-5 sm:p-6"
      style={{ backgroundColor: rinoMural ? "rgba(17,17,17,0.86)" : CARD, border: `1px solid ${BORDER}` }}
    >
      {rinoMural && (
        <img
          aria-hidden
          src="/oakley-rino/oakley-rino-graffiti-accent.png"
          alt=""
          className="pointer-events-none absolute right-[-8%] top-[69%] z-0 h-[145px] w-auto -translate-y-1/2 sm:right-[-5%] sm:h-[190px] md:right-[-1%] md:top-[70%] md:h-[260px]"
          style={{
            opacity: 0.62,
            filter: "saturate(1.16) contrast(1.08) drop-shadow(0 18px 34px rgba(0,0,0,0.35))",
          }}
        />
      )}
      <div className="relative z-10">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <div className="text-[11px] uppercase mb-2" style={{ letterSpacing: "0.16em", color: "rgba(245,230,211,0.5)", fontWeight: 600 }}>
            Your card
          </div>
          <h2 className="text-[20px] sm:text-[22px] leading-tight" style={{ fontWeight: 600, color: CREAM, letterSpacing: "-0.01em" }}>
            {isPreRsvpShell
              ? `Hey ${me.full_name?.split(" ")[0] || "there"}, RSVP here.`
              : `Hey ${me.full_name?.split(" ")[0] || "there"}, you're all set.`}
          </h2>
          {isPreRsvpShell && (
            <p className="text-[13px] mt-1.5" style={{ color: CREAM_MUTED }}>
              Lock in your spot, then we'll match you with people in the room you should meet.
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          {!editMode && isPreRsvpShell && (
            <Button
              type="button"
              onClick={() => requestEdit(false)}
              className="hover:opacity-90"
              style={{ backgroundColor: CORAL, color: "#fff", fontWeight: 600 }}
              size="sm"
            >
              {headerButtonLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Inline editor */}
      {editMode && (isOwner || verifiedAttendeeId === me.id) && (
        <div className="mb-6 pb-6" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <AfterPartyIntakeForm
            attendeeId={me.id}
            initial={meFull || me}
            onSaved={handleSaved}
            startInStep2Hint={editStartStep2}
          />
          <div className="text-right mt-2">
            <button
              type="button"
              className="text-[12px] underline"
              style={{ color: CREAM_DIM }}
              onClick={() => { setEditMode(false); setEditStartStep2(false); }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Mini preview of how the card looks in the roster (shown only after
          the user has saved at least once, i.e. not a pre-RSVP shell).
          The whole card is clickable to enter edit mode. */}
      {!editMode && !isPreRsvpShell && (
        <div className="mb-4 grid gap-5 md:grid-cols-[280px_1fr] md:items-start">
          <div>
            <div className="flex items-baseline gap-2 mb-2 flex-wrap">
              <div className="text-[11px] uppercase" style={{ letterSpacing: "0.14em", color: CREAM_DIM, fontWeight: 600 }}>
                How others see you
              </div>
              <div className="text-[11px]" style={{ color: CORAL, fontWeight: 600 }}>
                Click anywhere on your card to edit
              </div>
            </div>
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                // Don't hijack clicks on inner links (Instagram, LinkedIn, company)
                if ((e.target as HTMLElement).closest("a")) return;
                requestEdit(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  requestEdit(false);
                }
              }}
              aria-label="Edit my card"
              className="relative block w-full max-w-[280px] text-left rounded-xl transition-transform hover:scale-[1.01] focus:outline-none focus-visible:ring-2 cursor-pointer"
              style={{ outlineColor: CORAL }}
            >
              <GuestCard guest={previewGuest} />
              <span
                className="absolute bottom-2 right-2 inline-flex items-center justify-center rounded-full pointer-events-none"
                style={{
                  width: 28,
                  height: 28,
                  backgroundColor: CORAL,
                  color: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
                }}
              >
                <Pencil className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
          {sidebar && (
            <div className="hidden md:block">{sidebar}</div>
          )}
        </div>
      )}

      {/* CTA block (combined for brands, prompt or "see who's coming" for others) */}
      {ctaBlock && <div className="mb-4">{ctaBlock}</div>}

      {/* Matches */}
      <div className="relative">
        {rinoMural && (
          <img
            aria-hidden
            src="/oakley-rino/oakley-rino-graffiti-accent.png"
            alt=""
            className="pointer-events-none absolute right-[-18px] top-[-36px] z-0 hidden h-[150px] w-auto md:block"
            style={{
              opacity: 0.94,
              filter: "saturate(1.2) contrast(1.08) drop-shadow(0 12px 26px rgba(0,0,0,0.45))",
            }}
          />
        )}
        <div className="relative z-10">
        <div className="flex items-end justify-between gap-3 mb-3 pb-2" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div>
            <div className="text-[11px] uppercase mb-1" style={{ letterSpacing: "0.16em", color: "rgba(245,230,211,0.5)", fontWeight: 600 }}>
              Your matches
            </div>
            <div className="text-[14px]" style={{ color: CREAM_MUTED }}>
              Look out for these numbers at the event
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!editMode && !isPreRsvpShell && (
              <button
                type="button"
                onClick={() => requestEdit(false)}
                className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md hover:opacity-90 transition-opacity"
                style={{
                  border: `1px solid ${CORAL}`,
                  color: CORAL,
                  backgroundColor: "rgba(237,118,96,0.08)",
                  fontWeight: 600,
                }}
              >
                <Pencil className="w-3 h-3" /> Edit your card
              </button>
            )}
            <span className="text-[10px] uppercase" style={{ color: CREAM_DIM, letterSpacing: "0.12em" }}>
              {lockedMatches ? "Final" : "Live"}
            </span>
          </div>
        </div>
        <MatchesPanel
          matches={matchesWithAttendee}
          locked={!!lockedMatches}
          awaitingMatchingInfo={!hasMatchingInfo}
        />
        </div>
      </div>

      <PinSheet
        open={pinOpen}
        slug={me.slug}
        onSuccess={handleVerified}
        onClose={() => setPinOpen(false)}
      />
      </div>
    </section>
  );
};

export default MyCardSection;
