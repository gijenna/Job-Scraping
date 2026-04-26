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
import StarSparkle from "./StarSparkle";
import GuestCard, { GuestRow } from "./GuestCard";
import { Button } from "@/components/ui/button";
import { getSession } from "@/services/auth";
import { Pencil, ExternalLink } from "lucide-react";

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
}

const MyCardSection = ({ allAttendees, slug, onCardSaved }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [me, setMe] = useState<AfterPartyAttendee | null>(null);
  // Full row (including phone/email), only loaded once the viewer is the
  // verified owner. This is what we feed the editor form so saves don't
  // accidentally overwrite phone/email with null.
  const [meFull, setMeFull] = useState<any>(null);
  const [verifiedAttendeeId, setVerifiedAttendeeId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [lockedMatches, setLockedMatches] = useState<MatchResult[] | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  // Restore session
  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (session?.attendeeId) setVerifiedAttendeeId(session.attendeeId);
    })();
  }, []);

  // Resolve "me" from slug (query param or sessionStorage) or from verified session
  useEffect(() => {
    if (!allAttendees.length) return;
    let target: AfterPartyAttendee | undefined;
    if (slug) {
      target = allAttendees.find((a) => a.slug === slug);
    }
    if (!target && verifiedAttendeeId) {
      target = allAttendees.find((a) => a.id === verifiedAttendeeId);
    }
    if (target) setMe(target);
  }, [allAttendees, slug, verifiedAttendeeId]);

  // When the viewer is the verified owner, load the full row (with phone/email)
  // so the editor pre-populates correctly and saves don't wipe those fields.
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

  // Honor ?edit=1 deep-link from email / AfterPartyInvite
  useEffect(() => {
    if (!me) return;
    if (searchParams.get("edit") !== "1") return;
    if (verifiedAttendeeId === me.id || isPreRsvpShell) {
      setEditMode(true);
    } else {
      setPinOpen(true);
    }
    // strip the param so reloads don't re-trigger
    const next = new URLSearchParams(searchParams);
    next.delete("edit");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me?.id, verifiedAttendeeId]);

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

  const isPreRsvpShell = !!me && !me.photo_url && !me.cartoon_url
    && !(me.niches?.length) && !(me.looking_for?.length)
    && !(me.creator_types?.length) && !(me.platforms?.length)
    && !me.mind_blowing_fact && !me.company;
  const isOwner = !!me && (verifiedAttendeeId === me.id || isPreRsvpShell);

  const requestEdit = () => {
    if (!me) return;
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
    setJustSaved(true);
    onCardSaved?.();
    // Refresh me from DB (public view for greeting)
    const { data } = await (supabase as any)
      .from("afterparty_attendees_public")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (data) setMe(data as AfterPartyAttendee);
    // Refresh full row (with phone/email) for the editor
    const { data: full } = await (supabase as any)
      .from("afterparty_attendees")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (full) setMeFull(full);
    // Scroll to the roster CTA so they see "see who's coming"
    setTimeout(() => {
      document.getElementById("roster-cta")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  };

  if (!me) return null;

  return (
    <section
      className="mb-4 rounded-2xl p-5 sm:p-6"
      style={{
        backgroundColor: CARD,
        border: `1px solid ${BORDER}`,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="text-[11px] uppercase mb-1" style={{ letterSpacing: "0.12em", color: CORAL, fontWeight: 600 }}>
            Your card
          </div>
          <h2 className="font-afterparty text-[22px] sm:text-[26px]" style={{ fontWeight: 500, color: CREAM }}>
            Hey {me.full_name?.split(" ")[0] || "there"}, you're all set
          </h2>
          <p className="text-[13px] mt-1" style={{ color: CREAM_MUTED }}>
            Edit your card and check your matches below. Everything in one place.
          </p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          {!editMode && (
            <Button
              type="button"
              onClick={requestEdit}
              className="hover:opacity-90"
              style={{ backgroundColor: CORAL, color: "#fff", fontWeight: 600 }}
              size="sm"
            >
              <Pencil className="w-3.5 h-3.5 mr-1.5" />
              Edit my card
            </Button>
          )}
          <Link
            to={`/afterparty/${me.slug}`}
            className="text-[12px] inline-flex items-center gap-1 underline justify-end"
            style={{ color: CREAM_DIM }}
          >
            View public card <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Inline editor */}
      {editMode && (isOwner || verifiedAttendeeId === me.id) && (
        <div className="mb-6 pb-6" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <AfterPartyIntakeForm
            attendeeId={me.id}
            initial={meFull || me}
            onSaved={handleSaved}
          />
          <div className="text-right mt-2">
            <button
              type="button"
              className="text-[12px] underline"
              style={{ color: CREAM_DIM }}
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Live preview of public card */}
      {!editMode && !isPreRsvpShell && (() => {
        const src: any = meFull || me;
        const previewGuest: GuestRow = {
          id: me.id,
          attendee_number: me.attendee_number,
          role: me.role,
          display_name: me.full_name,
          company: me.company ?? null,
          company_url: src.company_url ?? null,
          cartoon_url: me.cartoon_url ?? null,
          niches: me.niches ?? null,
          creator_types: me.creator_types ?? null,
          looking_for: me.looking_for ?? null,
          mind_blowing_fact: me.mind_blowing_fact ?? null,
          social_links: src.social_links ?? null,
          show_instagram: src.show_instagram ?? null,
          show_linkedin: src.show_linkedin ?? null,
          created_at: src.created_at ?? new Date().toISOString(),
        };
        return (
          <div className="mb-6">
            <div className="text-[11px] uppercase mb-2" style={{ letterSpacing: "0.12em", color: CORAL, fontWeight: 600 }}>
              Card preview
            </div>
            <div className="max-w-sm">
              <GuestCard guest={previewGuest} />
            </div>
            <p className="text-[12px] mt-2" style={{ color: CREAM_DIM }}>
              This is exactly how others see you in the guest list.
            </p>
          </div>
        );
      })()}

      {justSaved && !editMode && (
        <div
          id="roster-cta"
          className="mb-4 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{
            backgroundColor: "rgba(237,118,96,0.12)",
            border: `1px solid ${CORAL}`,
          }}
        >
          <div>
            <div className="text-[11px] uppercase mb-1" style={{ letterSpacing: "0.12em", color: CORAL, fontWeight: 700 }}>
              Saved ✓
            </div>
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
      )}

      {/* Matches */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-afterparty text-[16px] flex items-center gap-2" style={{ fontWeight: 500, color: CREAM }}>
            <StarSparkle tone="coral" variant="single" size={16} />
            Your matches. Look out for these numbers
          </h3>
          <span className="text-[11px]" style={{ color: CREAM_DIM }}>
            {lockedMatches ? "Final" : "Live"}
          </span>
        </div>
        <MatchesPanel matches={matchesWithAttendee} locked={!!lockedMatches} />
      </div>

      <PinSheet
        open={pinOpen}
        slug={me.slug}
        onSuccess={handleVerified}
        onClose={() => setPinOpen(false)}
      />
    </section>
  );
};

export default MyCardSection;
