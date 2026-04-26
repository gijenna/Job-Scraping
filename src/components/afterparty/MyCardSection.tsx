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
  const [verifiedAttendeeId, setVerifiedAttendeeId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [lockedMatches, setLockedMatches] = useState<MatchResult[] | null>(null);

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
    onCardSaved?.();
    // Refresh me from DB
    const { data } = await (supabase as any)
      .from("afterparty_attendees_public")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (data) setMe(data as AfterPartyAttendee);
  };

  if (!me) return null;

  return (
    <section
      className="mb-10 rounded-2xl p-5 sm:p-6"
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
            Hey {me.full_name?.split(" ")[0] || "there"} — you're all set
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
            initial={me}
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

      {/* Matches */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-afterparty text-[16px] flex items-center gap-2" style={{ fontWeight: 500, color: CREAM }}>
            <StarSparkle tone="coral" variant="single" size={16} />
            Your matches — look out for these numbers
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
