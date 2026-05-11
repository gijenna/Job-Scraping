// Shared brand-record edit form used by /admin/event-map (inline) and the
// brand dashboard (in a modal). Same fields, same write surface.
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export interface BrandFormValues {
  name?: string;
  website_url?: string | null;
  description?: string | null;
  table_count?: number;
  is_activation?: boolean;
  sponsor_brand_id?: string | null;
  offers_remote?: string | null;
  currently_hiring?: string | null;
  why_visit_text?: string | null;
  lead_question_intro?: string | null;
  lead_question_text?: string | null;
  lead_question_option_1?: string | null;
  lead_question_option_2?: string | null;
  lead_question_option_3?: string | null;
  lead_question_active?: boolean;
}

interface Props {
  initial: BrandFormValues;
  onSave: (patch: BrandFormValues) => Promise<void>;
  onCancel?: () => void;
  /** Hide the basic top fields (name, url, description, etc.) for dashboard use where
   * those are managed elsewhere; defaults to false (admin shows everything). */
  showBasicFields?: boolean;
  saveLabel?: string;
}

const REMOTE_OPTIONS = [
  "Fully remote", "Hybrid", "In-office only", "Varies by role",
];
const HIRING_OPTIONS = [
  "Yes, actively hiring", "Not actively hiring", "Always open to great people",
];

export default function BrandCardForm({ initial, onSave, onCancel, showBasicFields = false, saveLabel = "Save changes" }: Props) {
  const [v, setV] = useState<BrandFormValues>(initial);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setV(initial); }, [initial]);

  const set = <K extends keyof BrandFormValues>(k: K, val: BrandFormValues[K]) =>
    setV((p) => ({ ...p, [k]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const patch: BrandFormValues = {
        ...v,
        why_visit_text: (v.why_visit_text || "").trim() || null,
        lead_question_intro: (v.lead_question_intro || "").trim() || null,
        lead_question_text: (v.lead_question_text || "").trim() || null,
        lead_question_option_1: (v.lead_question_option_1 || "").trim() || null,
        lead_question_option_2: (v.lead_question_option_2 || "").trim() || null,
        lead_question_option_3: (v.lead_question_option_3 || "").trim() || null,
      };
      // Auto-derive active state: appears on the candidate card when both
      // question text AND at least one option are populated. No manual toggle.
      patch.lead_question_active = !!(patch.lead_question_text && patch.lead_question_option_1);
      await onSave(patch);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {showBasicFields && (
        <Section title="Basic info">
          <Field label="Brand name">
            <Input value={v.name || ""} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label="Brand website">
            <Input value={v.website_url || ""} onChange={(e) => set("website_url", e.target.value)} placeholder="https://..." />
          </Field>
          <Field label="Description (admin only)">
            <Input value={v.description || ""} onChange={(e) => set("description", e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tables">
              <Input type="number" min={1} value={v.table_count ?? 1}
                onChange={(e) => set("table_count", Number(e.target.value))} />
            </Field>
            <label className="flex items-end gap-2 text-xs text-events-cream/80 font-body cursor-pointer">
              <input type="checkbox" checked={!!v.is_activation}
                onChange={(e) => set("is_activation", e.target.checked)} />
              Activation
            </label>
          </div>
        </Section>
      )}

      <Section title="Hiring &amp; remote">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Currently hiring" hint="What's your current hiring status?">
            <select
              value={v.currently_hiring || ""}
              onChange={(e) => set("currently_hiring", e.target.value || null)}
              className="bg-events-cream/10 border border-events-cream/20 text-events-cream text-sm rounded h-9 px-2 w-full"
            >
              <option value="">(no selection)</option>
              {HIRING_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Remote work policy" hint="What is your remote work policy?">
            <select
              value={v.offers_remote || ""}
              onChange={(e) => set("offers_remote", e.target.value || null)}
              className="bg-events-cream/10 border border-events-cream/20 text-events-cream text-sm rounded h-9 px-2 w-full"
            >
              <option value="">(no selection)</option>
              {REMOTE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
        </div>
      </Section>

      <Section title="Why visit our table">
        <p className="text-[11px] text-events-cream/55 font-body">
          Examples: 'Actively hiring marketers' / 'Opening a new store in Boulder soon' / 'Seeking ambassadors and IT positions'
        </p>
        <Textarea
          value={v.why_visit_text || ""}
          onChange={(e) => set("why_visit_text", e.target.value.slice(0, 280))}
          rows={3}
          maxLength={280}
        />
        <p className="text-[10px] text-events-cream/40 text-right">{(v.why_visit_text || "").length}/280</p>
      </Section>

      <Section title="Lead question (optional)">
        <p className="text-[11px] text-events-cream/60 font-body">
          Add a custom question to capture leads from candidates interested in something specific.
          Examples: 'Interested in our new retail store?' / 'Want to be considered for ambassador roles?'
        </p>
        <Field label="Intro text (optional)">
          <Textarea value={v.lead_question_intro || ""}
            onChange={(e) => set("lead_question_intro", e.target.value.slice(0, 200))}
            rows={2} maxLength={200} />
          <p className="text-[10px] text-events-cream/40 text-right">{(v.lead_question_intro || "").length}/200</p>
        </Field>
        <Field label="Question">
          <Input value={v.lead_question_text || ""}
            onChange={(e) => set("lead_question_text", e.target.value.slice(0, 150))}
            maxLength={150} placeholder="e.g. Interested in our new retail store?" />
        </Field>
        <Field label="Option 1">
          <Input value={v.lead_question_option_1 || ""}
            onChange={(e) => set("lead_question_option_1", e.target.value.slice(0, 100))}
            maxLength={100} />
        </Field>
        <Field label="Option 2 (optional)">
          <Input value={v.lead_question_option_2 || ""}
            onChange={(e) => set("lead_question_option_2", e.target.value.slice(0, 100))}
            maxLength={100} />
        </Field>
        <Field label="Option 3 (optional)">
          <Input value={v.lead_question_option_3 || ""}
            onChange={(e) => set("lead_question_option_3", e.target.value.slice(0, 100))}
            maxLength={100} />
        </Field>
        <p className="text-[11px] text-events-cream/45 font-body italic">
          The question appears on candidate cards automatically once both Question and Option 1 are filled. Clear them to remove it. Past responses are always preserved.
        </p>
      </Section>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-events-cream/10">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} className="text-events-cream/70">Cancel</Button>
        )}
        <Button onClick={handleSave} disabled={saving} className="bg-events-coral hover:bg-events-coral/90 text-events-cream">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
          {saveLabel}
        </Button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="font-display text-xs uppercase tracking-wider text-events-coral">{title}</h3>
      {children}
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-events-cream/80 text-xs font-body uppercase tracking-wider mb-1 block">{label}</Label>
      {children}
      {hint && <p className="text-[10px] text-events-cream/45 mt-1 font-body">{hint}</p>}
    </div>
  );
}
