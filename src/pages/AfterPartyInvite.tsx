import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { EditableTextProvider } from "@/components/EditableTextProvider";
import EditableText from "@/components/EditableText";
import AfterPartyIntakeForm from "@/components/afterparty/AfterPartyIntakeForm";
import MatchesPanel from "@/components/afterparty/MatchesPanel";
import NumberBadge from "@/components/afterparty/NumberBadge";
import EditNameGate from "@/components/afterparty/EditNameGate";
import SkeletonMatches from "@/components/afterparty/SkeletonMatches";
import {
  AfterPartyAttendee,
  computeMatchesFor,
  MatchResult,
} from "@/lib/afterparty-matching";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import BasecampMatchPopflyLogo from "@/components/afterparty/BasecampMatchPopflyLogo";

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

const AfterPartyInvite = () => {
  const { name } = useParams();
  const [attendees, setAttendees] = useState<AfterPartyAttendee[]>([]);
  const [me, setMe] = useState<AfterPartyAttendee | null>(null);
  const [lookupName, setLookupName] = useState("");
  const [loading, setLoading] = useState(true);
  const [lockedMatches, setLockedMatches] = useState<MatchResult[] | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showGate, setShowGate] = useState(false);

  const fetchAll = async () => {
    const { data } = await (supabase as any)
      .from("afterparty_attendees")
      .select("*")
      .order("attendee_number");
    setAttendees((data as AfterPartyAttendee[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

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
    else alert("No card found for that name. Fill out the form below to create one.");
  };

  const handleSaved = async (id: string) => {
    await fetchAll();
    const { data } = await (supabase as any)
      .from("afterparty_attendees")
      .select("*")
      .eq("id", id)
      .single();
    if (data) setMe(data as AfterPartyAttendee);
    setEditMode(false);
    setTimeout(() => {
      document.getElementById("matches")?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const submitted = !!me;
  const myPill = me ? (ROLE_PILL[me.role] || ROLE_PILL.brand) : null;
  const myAvatar = me?.cartoon_url || me?.photo_url;

  return (
    <EditableTextProvider pageSlug="afterparty">
      <div
        className="min-h-screen"
        style={{
          backgroundColor: BG,
          color: "#fff",
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontWeight: 400,
        }}
      >
        <div className="mx-auto px-5 pt-10 pb-16" style={{ maxWidth: 480 }}>
          {/* Logo lockup */}
          <BasecampMatchPopflyLogo />

          {/* Hero copy */}
          <div className="mt-6 text-center">
            <div className="text-[11px] uppercase mb-3" style={{ letterSpacing: "0.12em", color: "rgba(255,255,255,0.55)" }}>
              <EditableText settingKey="hero.kicker" defaultText="You're invited" />
            </div>
            <h1 className="text-[32px] sm:text-[36px] leading-[1.1] mb-3" style={{ fontWeight: 500, color: "#fff" }}>
              <EditableText settingKey="hero.title" defaultText="Creator after party" />
            </h1>
            <p className="text-[15px] mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>
              <EditableText
                settingKey="hero.subtitle"
                defaultText="An evening for the outdoor industry's next wave."
                multiline
              />
            </p>
            <div className="text-[13px] flex items-center justify-center gap-2 flex-wrap" style={{ color: "rgba(255,255,255,0.55)" }}>
              <EditableText settingKey="hero.date" defaultText="Date TBA" />
              <span>·</span>
              <EditableText settingKey="hero.venue" defaultText="Location revealed on RSVP" />
            </div>
          </div>

          {/* Find existing card */}
          {!me && !loading && !name && (
            <div className="mt-8 p-4 rounded-xl" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
              <p className="text-[13px] mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                Already filled this out? Type your name to load your card.
              </p>
              <form onSubmit={handleLookup} className="flex gap-2">
                <Input
                  value={lookupName}
                  onChange={(e) => setLookupName(e.target.value)}
                  placeholder="Your full name"
                  style={{ backgroundColor: BG, border: `1px solid ${BORDER}`, color: "#fff" }}
                />
                <Button type="submit" style={{ backgroundColor: "#fff", color: BG }}>
                  <Search className="w-4 h-4" />
                </Button>
              </form>
            </div>
          )}

          {/* My card (view mode) */}
          {me && !editMode && (
            <section className="mt-8">
              <div className="p-5 rounded-xl" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
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
                        <div className="text-[10px] uppercase mb-1" style={{ letterSpacing: "0.08em", color: "rgba(255,255,255,0.45)" }}>Niche</div>
                        <div style={{ color: "rgba(255,255,255,0.85)" }}>{me.niches.join(", ")}</div>
                      </div>
                    ) : null}
                    {me.creator_types?.length || me.brand_seeking?.length ? (
                      <div>
                        <div className="text-[10px] uppercase mb-1" style={{ letterSpacing: "0.08em", color: "rgba(255,255,255,0.45)" }}>{me.role === "brand" ? "Offers" : "Creates"}</div>
                        <div style={{ color: "rgba(255,255,255,0.85)" }}>{(me.creator_types?.length ? me.creator_types : me.brand_seeking || []).join(", ")}</div>
                      </div>
                    ) : null}
                  </div>
                )}

                {me.looking_for?.length ? (
                  <div className="mb-4 text-[13px]">
                    <div className="text-[10px] uppercase mb-1" style={{ letterSpacing: "0.08em", color: "rgba(255,255,255,0.45)" }}>Here to</div>
                    <div style={{ color: "rgba(255,255,255,0.85)" }}>{me.looking_for.join(", ")}</div>
                  </div>
                ) : null}

                {me.mind_blowing_fact ? (
                  <div className="pl-3 mb-4" style={{ borderLeft: `2px solid ${myPill?.border || "#7F77DD"}` }}>
                    <div className="text-[10px] uppercase mb-1" style={{ letterSpacing: "0.08em", color: myPill?.text || "#CECBF6" }}>Why it worked</div>
                    <p className="text-[13px] italic" style={{ color: "rgba(255,255,255,0.75)" }}>{me.mind_blowing_fact}</p>
                  </div>
                ) : null}

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowGate(true)}
                    className="text-[13px] underline"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    Edit my card →
                  </button>
                </div>
              </div>

              {showGate && (
                <div className="mt-4">
                  <EditNameGate
                    expectedName={me.full_name}
                    onUnlock={() => { setEditMode(true); setShowGate(false); }}
                    onCancel={() => setShowGate(false)}
                  />
                </div>
              )}
            </section>
          )}

          {/* Intake form (initial create OR edit mode) */}
          {(!me || editMode) && (
            <section className="mt-8">
              <h2 className="text-[20px] mb-4" style={{ fontWeight: 500 }}>
                {me ? "Edit your card" : "Create your card"}
              </h2>
              <AfterPartyIntakeForm attendeeId={me?.id || null} initial={me} onSaved={handleSaved} />
            </section>
          )}

          {/* Matches */}
          <section id="matches" className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px]" style={{ fontWeight: 500, color: "#fff" }}>
                Look out for these numbers tonight
              </h2>
              <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                {submitted ? (lockedMatches ? "Final" : "Sent to your email too") : ""}
              </span>
            </div>
            {submitted ? (
              <MatchesPanel matches={matchesWithAttendee} locked={!!lockedMatches} />
            ) : (
              <SkeletonMatches />
            )}
          </section>
        </div>
      </div>
    </EditableTextProvider>
  );
};

export default AfterPartyInvite;
