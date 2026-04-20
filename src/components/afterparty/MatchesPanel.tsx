import { AfterPartyAttendee, MatchResult } from "@/lib/afterparty-matching";
import { Sparkles } from "lucide-react";

interface Props {
  matches: { match: MatchResult; attendee: AfterPartyAttendee }[];
  locked: boolean;
}

const MatchesPanel = ({ matches, locked }: Props) => {
  if (!matches.length) {
    return (
      <div className="text-center py-12 text-events-cream/60">
        <Sparkles className="w-8 h-8 mx-auto mb-3 text-events-coral/60" />
        <p>No matches yet. Check back as more people sign up!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {locked && (
        <p className="text-xs uppercase tracking-wider text-events-yellow/80">Final matches — locked by host</p>
      )}
      {matches.map(({ match, attendee }) => (
        <div key={attendee.id} className="flex items-start gap-4 p-4 rounded-xl bg-events-cream/5 border border-events-cream/10 hover:border-events-coral/40 transition-colors">
          <div className="shrink-0 flex flex-col items-center">
            {attendee.photo_url ? (
              <img src={attendee.photo_url} alt={attendee.full_name} className="w-14 h-14 rounded-full object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-events-coral/30 flex items-center justify-center text-events-cream font-bold">
                {attendee.full_name.charAt(0)}
              </div>
            )}
            <span className="mt-1 text-xs font-mono text-events-yellow">#{attendee.attendee_number}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h4 className="font-display text-lg font-bold text-events-cream">{attendee.full_name}</h4>
              <span className="text-xs uppercase tracking-wider text-events-cream/50">{attendee.role}</span>
              {attendee.role === "brand" && attendee.company && (
                <span className="text-sm text-events-cream/70">· {attendee.company}</span>
              )}
            </div>
            {match.reasons.length > 0 && (
              <p className="text-sm text-events-cream/70 mt-1">{match.reasons[0]}</p>
            )}
            {match.reasons.length > 1 && (
              <p className="text-xs text-events-cream/50 mt-0.5">+ {match.reasons.slice(1).join(" · ")}</p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <div className="text-events-coral font-bold text-xl">{match.score}</div>
            <div className="text-[10px] uppercase tracking-wider text-events-cream/50">match</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchesPanel;
