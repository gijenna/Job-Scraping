// Brand lead-capture block. Reads question + options from the brand row
// (event_map_brands.lead_question_*) and stores response_value (slug) +
// response_label (the chosen text) per (candidate_id, brand_id).
// Renders nothing if the brand has no active lead question.
import { useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import {
  brandLeadGetMine, brandLeadUpsert, brandLeadClear,
  candidateMe,
} from "@/lib/connect-session";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  brandId: string;
}

type BrandConfig = {
  id: string;
  name: string;
  lead_question_intro: string | null;
  lead_question_text: string | null;
  lead_question_option_1: string | null;
  lead_question_option_2: string | null;
  lead_question_option_3: string | null;
  lead_question_active: boolean;
};

type Choice = "option_1" | "option_2" | "option_3" | "soon" | "eventually";

const SECTION_HEADING = "A quick question";

const BrandLeadCapture = ({ brandId }: Props) => {
  const [brand, setBrand] = useState<BrandConfig | null>(null);
  const [choice, setChoice] = useState<Choice | null>(null);
  const [shareContact, setShareContact] = useState<boolean>(false);
  const [busy, setBusy] = useState(true);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setBusy(true);
      try {
        const { data: b } = await (supabase as any).from("event_map_brands")
          .select("id, name, lead_question_intro, lead_question_text, lead_question_option_1, lead_question_option_2, lead_question_option_3, lead_question_active")
          .eq("id", brandId).maybeSingle();
        if (cancelled) return;
        if (!b || !b.lead_question_active || !b.lead_question_text) {
          setBrand(null);
          setBusy(false);
          return;
        }
        setBrand(b as BrandConfig);

        const me = await candidateMe();
        const isCand = me?.session?.subject_type === "candidate";
        if (cancelled) return;
        setSignedIn(isCand);
        if (!isCand) { setBusy(false); return; }

        const r = await brandLeadGetMine(brandId);
        if (cancelled) return;
        if (r.response) {
          setChoice(r.response.response_value as Choice);
          setShareContact(!!r.response.share_contact_info);
        } else {
          // Default per-question share toggle to candidate's global consent
          setShareContact(!!me.session?.subject?.brand_contact_consent);
        }
      } catch {
        if (!cancelled) setSignedIn(false);
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => { cancelled = true; };
  }, [brandId]);

  const select = async (value: Choice, label: string) => {
    if (busy || !brand) return;
    setBusy(true);
    const prev = choice;
    setChoice(value);
    try {
      await brandLeadUpsert(brandId, value, brand.lead_question_text || "", label, shareContact);
      setSavedAt(Date.now());
    } catch {
      setChoice(prev);
    } finally {
      setBusy(false);
    }
  };

  const toggleShare = async (next: boolean) => {
    if (busy || !brand || !choice) return;
    setShareContact(next);
    try {
      const opt = opts.find((o) => o.value === choice);
      await brandLeadUpsert(brandId, choice, brand.lead_question_text || "", opt?.label, next);
      setSavedAt(Date.now());
    } catch {
      setShareContact(!next);
    }
  };

  const clearAnswer = async () => {
    if (busy || !brand) return;
    setBusy(true);
    try {
      await brandLeadClear(brandId);
      setChoice(null);
      setSavedAt(null);
    } finally {
      setBusy(false);
    }
  };

  if (!brand) return null;
  if (signedIn === false) return null;

  // Build option list. Edges First (legacy) keeps "soon"/"eventually" slugs so
  // existing dashboards stay readable; everything else uses option_1/2/3.
  const isEdgesFirst = (brand.name || "").toLowerCase().includes("edges first");
  const opts: { value: Choice; label: string }[] = [];
  if (brand.lead_question_option_1) {
    opts.push({ value: isEdgesFirst ? "soon" : "option_1", label: brand.lead_question_option_1 });
  }
  if (brand.lead_question_option_2) {
    opts.push({ value: isEdgesFirst ? "eventually" : "option_2", label: brand.lead_question_option_2 });
  }
  if (brand.lead_question_option_3) {
    opts.push({ value: "option_3", label: brand.lead_question_option_3 });
  }

  return (
    <section className="mt-6 mx-1 rounded-2xl border border-events-coral/40 bg-events-cream/5 p-4 space-y-3">
      <div>
        <h3 className="font-display text-events-cream text-sm">{SECTION_HEADING}</h3>
        {brand.lead_question_intro && (
          <p className="font-body text-[12px] text-events-cream/70 leading-snug mt-1">{brand.lead_question_intro}</p>
        )}
      </div>
      <div>
        <p className="font-body text-events-cream text-sm mb-2">{brand.lead_question_text}</p>
        <div className="space-y-2">
          {opts.map((opt) => {
            const active = choice === opt.value;
            return (
              <button
                key={opt.value + opt.label}
                type="button"
                disabled={busy}
                onClick={() => select(opt.value, opt.label)}
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
      {choice && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-events-coral font-body text-[12px]">
            {busy && savedAt === null ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            <span>Got it. {brand.name} will see your response.</span>
          </div>
          <button
            type="button"
            onClick={clearAnswer}
            disabled={busy}
            className="text-[11px] font-body text-events-cream/70 hover:text-events-coral underline-offset-2 hover:underline shrink-0"
          >
            Clear my answer
          </button>
        </div>
      )}
    </section>
  );
};

export default BrandLeadCapture;
