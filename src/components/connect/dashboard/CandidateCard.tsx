import { Download, Mail, Linkedin, Mailbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TIMING_LABEL: Record<string, string> = {
  pre_event: "Pre-event note",
  during_event: "Note from event",
  post_event: "Post-event note",
};

function Badge({ children, tone = "default" }: { children: any; tone?: "default" | "coral" | "yellow" }) {
  const colors = {
    default: "bg-events-cream/10 text-events-cream/80 border-events-cream/15",
    coral: "bg-events-coral/20 text-events-coral border-events-coral/40",
    yellow: "bg-events-yellow/20 text-events-yellow border-events-yellow/40",
  } as const;
  return <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-body border", colors[tone])}>{children}</span>;
}

export default function CandidateCard({ candidate, onClick }: { candidate: any; onClick: () => void }) {
  const eng = candidate.engagement;
  const niches: string[] = Array.isArray(candidate.niche_experience)
    ? candidate.niche_experience.map((n: any) => (typeof n === "string" ? n : n?.name)).filter(Boolean)
    : [];
  const areas: string[] = (candidate.areas_of_expertise || []).slice(0, 5);

  return (
    <div className="bg-events-cream/5 border border-events-cream/10 rounded-2xl p-5 hover:border-events-cream/30 transition-colors cursor-pointer" onClick={onClick}>
      <div className="flex gap-4">
        {candidate.photo_url ? (
          <div className="shrink-0 w-20 h-24 bg-events-cream rounded-sm shadow-md p-1.5 -rotate-2">
            <img src={candidate.photo_url} alt={candidate.first_name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="shrink-0 w-20 h-24 bg-events-cream/10 rounded-sm flex items-center justify-center text-events-cream/40 -rotate-2 text-2xl font-display">
            {candidate.first_name?.[0]}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {candidate.the_hook && (
            <p className="font-display text-events-cream text-lg md:text-xl leading-tight mb-1">
              {candidate.the_hook}
            </p>
          )}
          <p className="text-events-cream/90 font-body text-sm">
            {candidate.first_name} {candidate.last_name}
          </p>
          <p className="text-events-cream/50 font-body text-xs mt-0.5">
            {[candidate.career_stage, candidate.current_location, candidate.years_in_current_field ? `${candidate.years_in_current_field}y in field` : null]
              .filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>

      {candidate.the_pitch && (
        <p className="text-events-cream/80 font-body text-sm mt-4 leading-relaxed line-clamp-3">{candidate.the_pitch}</p>
      )}

      <div className="flex flex-wrap gap-1.5 mt-3">
        {eng?.visited && <Badge tone="coral">Visited my table</Badge>}
        {candidate.connect_note && (
          <Badge tone="coral">{TIMING_LABEL[candidate.connect_note.note_timing] || "Sent a note"}</Badge>
        )}
        {eng?.sent_note && !candidate.connect_note && <Badge tone="coral">Logged a note</Badge>}
        {eng?.role_flagged && <Badge tone="yellow">Flagged a role</Badge>}
        {candidate.starred_brand && <Badge tone="yellow">Starred your brand</Badge>}
        {areas.map((a) => <Badge key={a}>{a}</Badge>)}
        {niches.slice(0, 3).map((n) => <Badge key={n}>{n}</Badge>)}
      </div>

      {candidate.connect_note && (
        <div className="mt-4 rounded-xl border border-events-coral/30 bg-events-coral/5 p-3">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-display text-events-coral mb-1">
            <Mailbox className="w-3 h-3" />
            {TIMING_LABEL[candidate.connect_note.note_timing] || "Note"}
            <span className="text-events-cream/40 normal-case font-body">
              · {new Date(candidate.connect_note.sent_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-events-cream/85 font-body italic text-sm leading-relaxed">
            "{candidate.connect_note.message}"
          </p>
          {candidate.connect_note.note_cta && candidate.connect_note.note_cta !== "memorable_only" && (
            <div className="mt-2">
              <span className="inline-block text-[10px] font-display uppercase tracking-wider bg-events-coral text-events-cream px-2 py-0.5 rounded-full">
                {({
                  follow_up: "📩 Wants follow-up",
                  look_out_for_application: "👀 Applying to a role",
                  grab_coffee: "☕ Wants coffee",
                } as Record<string, string>)[candidate.connect_note.note_cta]}
              </span>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-3">
            {candidate.brand_contact_consent ? (
              <>
                {candidate.email && (
                  <Button
                    variant="ghost" size="sm"
                    onClick={(e) => { e.stopPropagation(); window.location.href = `mailto:${candidate.email}`; }}
                    className="text-events-coral hover:text-events-cream h-7 px-2"
                  >
                    <Mail className="w-3.5 h-3.5 mr-1.5" /> Email
                  </Button>
                )}
                {candidate.linkedin_url && (
                  <Button
                    variant="ghost" size="sm"
                    onClick={(e) => { e.stopPropagation(); window.open(candidate.linkedin_url, "_blank", "noopener"); }}
                    className="text-events-coral hover:text-events-cream h-7 px-2"
                  >
                    <Linkedin className="w-3.5 h-3.5 mr-1.5" /> LinkedIn
                  </Button>
                )}
              </>
            ) : (
              <span className="text-[11px] font-body text-events-cream/50 italic">
                Contact info not shared
              </span>
            )}
          </div>
        </div>
      )}

      {!candidate.connect_note && eng?.sent_note && eng.note && (
        <blockquote className="mt-4 pl-3 border-l-2 border-events-coral text-events-cream/70 font-body italic text-sm">
          "{eng.note}"
        </blockquote>
      )}

      {candidate.resume_url && (
        <div className="flex justify-end mt-3">
          <Button
            variant="ghost" size="sm"
            onClick={(e) => { e.stopPropagation(); window.open(candidate.resume_url, "_blank"); }}
            className="text-events-cream/70 hover:text-events-cream"
          >
            <Download className="w-4 h-4 mr-1.5" /> Resume
          </Button>
        </div>
      )}
    </div>
  );
}
