import { AfterPartyAttendee, MatchResult } from "@/lib/afterparty-matching";
import { Sparkles, Quote } from "lucide-react";

interface Props {
  matches: { match: MatchResult; attendee: AfterPartyAttendee }[];
  locked: boolean;
}

const roleColor = (role: string) =>
  role === "brand"
    ? "text-events-coral border-events-coral/40 bg-events-coral/10"
    : "text-events-yellow border-events-yellow/40 bg-events-yellow/10";

const MatchesPanel = ({ matches, locked }: Props) => {
  if (!matches.length) {
    return (
      <div className="text-center py-12 text-events-cream/60">
        <Sparkles className="w-8 h-8 mx-auto mb-3 text-events-coral/60" />
        <p>No people for you yet. Check back as more sign up!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {locked && (
        <p className="text-xs uppercase tracking-wider text-events-yellow/80">
          Final list — locked by host
        </p>
      )}
      {matches.map(({ match, attendee }) => (
        <div
          key={attendee.id}
          className="p-4 rounded-2xl bg-events-cream/5 border border-events-cream/10 hover:border-events-coral/40 transition-colors"
        >
          <div className="flex items-start gap-4">
            {/* Dual avatar */}
            <div className="shrink-0 flex flex-col items-center">
              <div className="flex -space-x-2">
                {attendee.photo_url ? (
                  <img
                    src={attendee.photo_url}
                    alt={attendee.full_name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-events-cream/20"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-events-coral/30 flex items-center justify-center text-events-cream font-bold ring-2 ring-events-cream/20">
                    {attendee.full_name.charAt(0)}
                  </div>
                )}
                {attendee.cartoon_url && (
                  <img
                    src={attendee.cartoon_url}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-events-yellow/40"
                  />
                )}
              </div>
              <span
                className={`mt-2 text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${roleColor(attendee.role)}`}
              >
                #{attendee.attendee_number}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <h4 className="font-display text-lg font-bold text-events-cream">
                  {attendee.full_name}
                </h4>
                <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${roleColor(attendee.role)}`}>
                  {attendee.role}
                </span>
                {attendee.role === "brand" && attendee.company && (
                  <span className="text-sm text-events-cream/70">· {attendee.company}</span>
                )}
              </div>
              {match.reasons.length > 0 && (
                <p className="text-sm text-events-cream/80 mt-1">{match.reasons[0]}</p>
              )}
              {match.reasons.length > 1 && (
                <p className="text-xs text-events-cream/50 mt-0.5">
                  + {match.reasons.slice(1).join(" · ")}
                </p>
              )}
            </div>
          </div>

          {/* Conversation starter */}
          {attendee.mind_blowing_fact && (
            <div className="mt-3 pt-3 border-t border-events-cream/10 flex gap-2">
              <Quote className="w-4 h-4 text-events-yellow/60 shrink-0 mt-0.5" />
              <p className="text-sm italic text-events-cream/75 leading-snug">
                {attendee.mind_blowing_fact}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MatchesPanel;
