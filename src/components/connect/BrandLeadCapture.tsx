// Lead-capture block rendered on Kelly's expert sheet and on the Edges First
// brand modal. Writes one row per (candidate_id, brand_id) to brand_lead_responses.
// "Not interested" / unselected = no row (deletes if previously set).
import { useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import {
  brandLeadGetMine, brandLeadUpsert, brandLeadClear,
  candidateMe,
} from "@/lib/connect-session";

interface Props {
  brandId: string;
}

const QUESTION_TEXT = "Want to remember Kelly for future web work?";
const HEADING = "Web work for outdoor or conservation orgs?";
const BODY =
  "Kelly's a women-led dev shop building beautiful sites for small orgs that help people get outside. She works with all budgets.";

type Choice = "soon" | "eventually" | "not_interested";

const OPTIONS: { value: Choice; label: string }[] = [
  { value: "soon", label: "Yes, and I'll need something soon" },
  { value: "eventually", label: "Yes, and I'll need something eventually" },
  { value: "not_interested", label: "Not interested" },
];

const BrandLeadCapture = ({ brandId }: Props) => {
  const [choice, setChoice] = useState<Choice | null>(null);
  const [busy, setBusy] = useState(true);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setBusy(true);
      try {
        const me = await candidateMe();
        const isCand = me?.session?.subject_type === "candidate";
        if (cancelled) return;
        setSignedIn(isCand);
        if (!isCand) { setBusy(false); return; }
        const r = await brandLeadGetMine(brandId);
        if (cancelled) return;
        if (r.response) setChoice(r.response.response_value as Choice);
      } catch {
        if (!cancelled) setSignedIn(false);
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => { cancelled = true; };
  }, [brandId]);

  const select = async (next: Choice) => {
    if (busy) return;
    setBusy(true);
    const prev = choice;
    setChoice(next);
    try {
      if (next === "not_interested") {
        await brandLeadClear(brandId);
        setSavedAt(null);
      } else {
        await brandLeadUpsert(brandId, next, QUESTION_TEXT);
        setSavedAt(Date.now());
      }
    } catch {
      setChoice(prev);
    } finally {
      setBusy(false);
    }
  };

  if (signedIn === false) return null;

  return (
    <section className="mt-6 mx-1 rounded-2xl border border-events-coral/40 bg-events-cream/5 p-4 space-y-3">
      <div>
        <h3 className="font-display text-events-cream text-sm">{HEADING}</h3>
        <p className="font-body text-[12px] text-events-cream/70 leading-snug mt-1">{BODY}</p>
      </div>
      <div>
        <p className="font-body text-events-cream text-sm mb-2">{QUESTION_TEXT}</p>
        <div className="space-y-2">
          {OPTIONS.map((opt) => {
            const active = choice === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                disabled={busy}
                onClick={() => select(opt.value)}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors ${
                  active
                    ? "border-events-coral bg-events-coral/15 text-events-cream"
                    : "border-events-cream/15 bg-events-cream/5 text-events-cream/80 hover:border-events-cream/40"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    active ? "border-events-coral" : "border-events-cream/40"
                  }`}
                >
                  {active && <span className="w-2 h-2 rounded-full bg-events-coral" />}
                </span>
                <span className="font-body text-sm leading-snug">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      {(choice === "soon" || choice === "eventually") && (
        <div className="flex items-center gap-2 text-events-coral font-body text-[12px]">
          {busy && savedAt === null ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5" />
          )}
          <span>Got it. Kelly will see you on her leads list.</span>
        </div>
      )}
    </section>
  );
};

export default BrandLeadCapture;
