import { useLayoutEffect, useRef, useState } from "react";
import { AfterPartyAttendee, MatchResult } from "@/lib/afterparty-matching";
import { Sparkles } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import NumberBadge from "./NumberBadge";

interface Props {
  matches: { match: MatchResult; attendee: AfterPartyAttendee }[];
  locked: boolean;
  /** True when the viewer hasn't filled in any matching info yet
   *  (no niches, intents, or "why it worked" answer). */
  awaitingMatchingInfo?: boolean;
  /** Optional mural image. When provided, each match bar shows a horizontal
   *  slice of the same image so all bars together reproduce one mural,
   *  with the dark gaps between bars showing through to the page bg. */
  muralSrc?: string;
}

const ROLE_PILL: Record<string, { bg: string; border: string; text: string; label: string }> = {
  creator: { bg: "#4A1B0C", border: "#D85A30", text: "#F5C4B3", label: "Creator" },
  brand: { bg: "#0A2A0F", border: "#39FF14", text: "#B8FFC2", label: "Brand" },
  industry_expert: { bg: "#04342C", border: "#1D9E75", text: "#9FE1CB", label: "Industry member" },
};

const CREAM = "#F5E6D3";
const CREAM_MUTED = "rgba(245,230,211,0.7)";
const CREAM_DIM = "rgba(245,230,211,0.55)";

const MatchesPanel = ({ matches, locked, awaitingMatchingInfo, muralSrc }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const barRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [layout, setLayout] = useState<{ totalH: number; offsets: number[] }>({
    totalH: 0,
    offsets: [],
  });

  useLayoutEffect(() => {
    if (!muralSrc) return;
    const measure = () => {
      const container = containerRef.current;
      if (!container) return;
      const containerTop = container.getBoundingClientRect().top;
      const offsets = barRefs.current.map((el) => {
        if (!el) return 0;
        return el.getBoundingClientRect().top - containerTop;
      });
      setLayout({ totalH: container.offsetHeight, offsets });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    barRefs.current.forEach((el) => el && ro.observe(el));
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [muralSrc, matches.length]);

  if (!matches.length) {
    return (
      <div className="text-center py-12" style={{ color: CREAM_DIM }}>
        <Sparkles className="w-8 h-8 mx-auto mb-3" style={{ color: "rgba(216,90,48,0.6)" }} />
        {awaitingMatchingInfo ? (
          <p>Finish your card to get matches. Scroll down to see who's coming.</p>
        ) : (
          <p>No people for you yet. Check back as more sign up.</p>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-3 relative">
      {locked && (
        <p className="text-[11px] uppercase" style={{ letterSpacing: "0.08em", color: "#FAC775" }}>
          Final list, locked by host
        </p>
      )}
      {matches.map(({ match, attendee }, i) => {
        const pill = ROLE_PILL[attendee.role] || ROLE_PILL.brand;
        const avatarSrc = attendee.cartoon_url || attendee.photo_url;

        const muralStyle = muralSrc && layout.totalH > 0
          ? {
              backgroundImage: `linear-gradient(rgba(17,17,17,0.78), rgba(17,17,17,0.82)), url('${muralSrc}')`,
              backgroundSize: `100% 100%, 100% ${layout.totalH}px`,
              backgroundPosition: `0 0, 0 -${layout.offsets[i] || 0}px`,
              backgroundRepeat: "no-repeat, no-repeat",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
            }
          : {};

        return (
          <Popover key={attendee.id}>
            <PopoverTrigger asChild>
              <button
                ref={(el) => (barRefs.current[i] = el)}
                type="button"
                className="w-full text-left p-4 rounded-xl transition-colors relative overflow-hidden"
                style={{
                  backgroundColor: "#111111",
                  border: "1px solid rgba(255,255,255,0.09)",
                  ...(match.is_mutual_boost ? { borderLeft: "2px solid #BA7517" } : {}),
                  ...muralStyle,
                }}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <NumberBadge number={attendee.attendee_number} role={attendee.role} size={46} />
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                      style={{ border: "1px solid rgba(255,255,255,0.12)" }}
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[11px] font-medium"
                      style={{ backgroundColor: pill.bg, color: pill.text, border: `1px solid ${pill.border}` }}
                    >
                      {attendee.full_name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[15px] font-medium truncate" style={{ color: CREAM }}>
                        {attendee.full_name}
                      </span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: pill.bg,
                          color: pill.text,
                          border: `1px solid ${pill.border}`,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {pill.label}
                      </span>
                    </div>
                    {match.reasons.length > 0 && (
                      <p className="text-[12px] mt-0.5 truncate" style={{ color: CREAM_MUTED }}>
                        {match.reasons[0]}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-[320px] border-0 p-4"
              style={{ backgroundColor: "#111111", border: "1px solid rgba(255,255,255,0.12)", color: CREAM }}
            >
              <p className="text-[11px] uppercase mb-2" style={{ letterSpacing: "0.08em", color: pill.text }}>
                Why it worked
              </p>
              {attendee.mind_blowing_fact ? (
                <p className="text-[13px] italic leading-relaxed" style={{ color: CREAM_MUTED }}>
                  {attendee.mind_blowing_fact}
                </p>
              ) : (
                <p className="text-[13px]" style={{ color: CREAM_DIM }}>
                  No answer yet, ask them in person.
                </p>
              )}
              {match.reasons.length > 1 && (
                <p className="text-[11px] mt-3 pt-3" style={{ color: CREAM_DIM, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  {match.reasons.slice(1).join(" · ")}
                </p>
              )}
            </PopoverContent>
          </Popover>
        );
      })}
    </div>
  );
};

export default MatchesPanel;
