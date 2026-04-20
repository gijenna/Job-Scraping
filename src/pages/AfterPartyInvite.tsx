import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { EditableTextProvider } from "@/components/EditableTextProvider";
import EditableText from "@/components/EditableText";
import AfterPartyIntakeForm from "@/components/afterparty/AfterPartyIntakeForm";
import MatchesPanel from "@/components/afterparty/MatchesPanel";
import {
  AfterPartyAttendee,
  computeMatchesFor,
  MatchResult,
} from "@/lib/afterparty-matching";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, PartyPopper, Search } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const AfterPartyInvite = () => {
  const { name } = useParams();
  const [attendees, setAttendees] = useState<AfterPartyAttendee[]>([]);
  const [me, setMe] = useState<AfterPartyAttendee | null>(null);
  const [lookupName, setLookupName] = useState("");
  const [loading, setLoading] = useState(true);
  const [lockedMatches, setLockedMatches] = useState<MatchResult[] | null>(null);

  const fetchAll = async () => {
    const { data } = await (supabase as any)
      .from("afterparty_attendees")
      .select("*")
      .order("attendee_number");
    setAttendees((data as AfterPartyAttendee[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Auto-load by URL :name
  useEffect(() => {
    if (!name || !attendees.length || me) return;
    const found = attendees.find(
      (a) => slugify(a.full_name) === slugify(name) || a.slug === name,
    );
    if (found) setMe(found);
  }, [name, attendees, me]);

  // Load locked matches when "me" changes
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
    setTimeout(() => {
      document.getElementById("matches")?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  return (
    <EditableTextProvider pageSlug="afterparty">
      <div className="min-h-screen bg-gradient-to-b from-[#1a0d2e] via-[#2d1b3d] to-[#19363B] text-events-cream">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-events-coral rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-events-yellow/40 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-events-coral/20 border border-events-coral/40 text-sm mb-6">
              <PartyPopper className="w-4 h-4" />
              <EditableText settingKey="hero.kicker" defaultText="INVITE ONLY" />
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-4">
              {name ? (
                <>
                  Hey {decodeURIComponent(name).replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())},
                  <br />
                </>
              ) : null}
              <EditableText
                settingKey="hero.title"
                defaultText="You're invited to the Creator After Party"
                className="text-events-coral"
              />
            </h1>
            <p className="text-lg md:text-xl text-events-cream/80 max-w-2xl mx-auto mb-8">
              <EditableText
                settingKey="hero.subtitle"
                defaultText="200 creators + outdoor brands. One night. Real connections — matched by what you're actually looking for."
                multiline
              />
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-events-cream/70 text-sm">
              <div><EditableText settingKey="hero.date" defaultText="Date TBA" /></div>
              <div>·</div>
              <div><EditableText settingKey="hero.venue" defaultText="Venue TBA" /></div>
            </div>
          </div>
        </section>

        {/* What this is */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: "Tell us about you", body: "60-second intake — niche, what you make, who you want to meet." },
              { icon: Users, title: "Get your top 5", body: "Algorithm matches you to creators & brands based on real fit." },
              { icon: PartyPopper, title: "Find them at the party", body: "Each guest has a number. We hand you the 5 you need to find." },
            ].map((s, i) => (
              <div key={i} className="p-6 rounded-2xl bg-events-cream/5 border border-events-cream/10">
                <s.icon className="w-6 h-6 text-events-coral mb-3" />
                <h3 className="font-display text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-events-cream/70 text-sm">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Find existing card */}
        {!me && !loading && (
          <section className="max-w-2xl mx-auto px-6 py-6">
            <div className="p-6 rounded-2xl bg-events-cream/5 border border-events-cream/10">
              <p className="text-sm text-events-cream/70 mb-3">Already filled this out? Type your name to load your card:</p>
              <form onSubmit={handleLookup} className="flex gap-2">
                <Input
                  value={lookupName}
                  onChange={(e) => setLookupName(e.target.value)}
                  placeholder="Your full name"
                  className="bg-black/20 border-events-cream/20 text-events-cream"
                />
                <Button type="submit" variant="outline" className="border-events-cream/30 text-events-cream hover:bg-events-cream/10">
                  <Search className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </section>
        )}

        {/* My number badge */}
        {me && (
          <section className="max-w-4xl mx-auto px-6 py-6 text-center">
            <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-events-coral/30 to-events-yellow/20 border border-events-coral/40">
              <div>
                <div className="text-xs uppercase tracking-wider text-events-cream/70">You are attendee</div>
                <div className="font-display text-4xl font-bold text-events-yellow">#{me.attendee_number}</div>
              </div>
              <div className="text-left">
                <div className="font-display text-xl font-bold">{me.full_name}</div>
                <div className="text-xs text-events-cream/70">Tell people your number — that's how matches will find you.</div>
              </div>
            </div>
          </section>
        )}

        {/* Intake form */}
        <section className="max-w-2xl mx-auto px-6 py-12">
          <h2 className="font-display text-3xl font-bold mb-6">
            {me ? "Edit your card" : "Create your card"}
          </h2>
          <AfterPartyIntakeForm attendeeId={me?.id || null} initial={me} onSaved={handleSaved} />
        </section>

        {/* Matches */}
        {me && (
          <section id="matches" className="max-w-2xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-3xl font-bold">Your top 5 matches</h2>
              <span className="text-xs text-events-cream/50">
                {lockedMatches ? "Final" : "Live · updates as people sign up"}
              </span>
            </div>
            <MatchesPanel matches={matchesWithAttendee} locked={!!lockedMatches} />
          </section>
        )}

        <SiteFooter />
      </div>
    </EditableTextProvider>
  );
};

export default AfterPartyInvite;
