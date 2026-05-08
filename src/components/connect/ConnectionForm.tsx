// Multi-step connection form. Mobile-first bottom sheet, used from the brand
// modal and expert cards. Reuses Sheet/Progress/Button from the design system.

import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { connectionsCreate, connectionsUpdate } from "@/lib/connect-session";

export type ConnectionMode = "brand" | "brand_rep" | "expert";

interface Subject {
  brand?: { id: string; name: string; logo_url?: string | null; website_url?: string | null } | null;
  rep?: { id: string; full_name: string; photo_url?: string | null } | null;
  expert?: { id: string; full_name: string; photo_url?: string | null } | null;
}

interface Props extends Subject {
  open: boolean;
  mode: ConnectionMode;
  // Edit mode: prefill from an existing connection row
  editingId?: string | null;
  initial?: Partial<FormState> | null;
  onClose: () => void;
  onSaved?: () => void;
}

interface FormState {
  also_talked_to: string;
  private_notes: string;
  follow_up_direction: string;
  contact_info_received: string;
  role_flagged: string;
  message_to_brand: string;
  would_want_as_mentor: boolean | null;
  mentor_topics: string;
}

const empty: FormState = {
  also_talked_to: "",
  private_notes: "",
  follow_up_direction: "",
  contact_info_received: "",
  role_flagged: "",
  message_to_brand: "",
  would_want_as_mentor: null,
  mentor_topics: "",
};

const ConnectionForm = ({ open, mode, brand, rep, expert, editingId, initial, onClose, onSaved }: Props) => {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>({ ...empty, ...(initial || {}) });

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const subjectName =
    mode === "expert" ? expert?.full_name :
    mode === "brand_rep" ? `${rep?.full_name}${brand ? ` (${brand.name})` : ""}` :
    brand?.name;

  const subjectAvatar = (mode === "brand"
    ? (brand?.logo_url || (brand?.website_url ? `https://logo.clearbit.com/${brand.website_url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0]}` : null))
    : (mode === "brand_rep" ? rep?.photo_url : expert?.photo_url));

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const save = async (sendNow = false) => {
    setSaving(true);
    try {
      const payload = {
        also_talked_to: form.also_talked_to || undefined,
        private_notes: form.private_notes || undefined,
        follow_up_direction: form.follow_up_direction || undefined,
        contact_info_received: form.contact_info_received || undefined,
        role_flagged: form.role_flagged || undefined,
        message_to_brand: form.message_to_brand || undefined,
        send_now: sendNow,
        would_want_as_mentor: form.would_want_as_mentor,
        mentor_topics: form.mentor_topics || undefined,
      };
      if (editingId) {
        await connectionsUpdate(editingId, payload, sendNow);
      } else {
        await connectionsCreate({
          ...payload,
          brand_id: brand?.id || null,
          brand_rep_id: mode === "brand_rep" ? rep?.id || null : null,
          expert_id: mode === "expert" ? expert?.id || null : null,
        });
      }
      toast({ title: editingId ? "Connection updated" : "Connection logged" });
      onSaved?.();
      onClose();
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="bottom"
        className="bg-events-teal border-events-cream/10 text-events-cream p-0 h-[92vh] sm:h-[90vh] sm:max-w-lg sm:mx-auto sm:rounded-t-2xl flex flex-col"
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center gap-3 mb-3">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="text-events-cream/70 -ml-2 p-1">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <span className="text-[10px] uppercase tracking-widest font-display text-events-cream/50">
              Step {step} of {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-1 bg-events-cream/10" />
          {/* Subject chip */}
          <div className="mt-4 flex items-center gap-3 bg-events-cream/5 border border-events-cream/10 rounded-xl px-3 py-2">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-events-cream/20 flex items-center justify-center shrink-0">
              {subjectAvatar ? (
                <img src={subjectAvatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="font-display text-events-teal text-xs">{subjectName?.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
              )}
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-events-cream/50 font-display">
                {mode === "brand" ? "Brand connection" : mode === "brand_rep" ? "Brand rep" : "Industry expert"}
              </div>
              <div className="font-display font-bold truncate">{subjectName}</div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-5">
          {step === 1 && (
            <>
              <Field label="Who else did you talk to here?" hint="Optional. Helps you remember the room.">
                <Input value={form.also_talked_to} maxLength={280}
                  onChange={(e) => set("also_talked_to", e.target.value)}
                  placeholder="e.g. their teammate Jordan, or a recruiter from another booth"
                  className="bg-events-cream/10 border-events-cream/20 text-events-cream placeholder:text-events-cream/40" />
              </Field>
              <Field
                label="What did you talk about? (For your eyes only)"
                hint="This is your private memory aid. Brand will never see this."
              >
                <Textarea value={form.private_notes} maxLength={500} rows={5}
                  onChange={(e) => set("private_notes", e.target.value)}
                  placeholder="What stuck out, what you connected on, vibe."
                  className="bg-events-cream/10 border-events-cream/20 text-events-cream placeholder:text-events-cream/40" />
                <Counter v={form.private_notes} max={500} />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <Field label="How should you follow up?" hint="Email next week? Apply to a specific role? DM on LinkedIn?">
                <Textarea value={form.follow_up_direction} maxLength={280} rows={3}
                  onChange={(e) => set("follow_up_direction", e.target.value)}
                  className="bg-events-cream/10 border-events-cream/20 text-events-cream placeholder:text-events-cream/40" />
                <Counter v={form.follow_up_direction} max={280} />
              </Field>
              <Field label="Did they give you contact info?" hint="Phone number, email, LinkedIn, business card details, anything you got.">
                <Textarea value={form.contact_info_received} maxLength={280} rows={3}
                  onChange={(e) => set("contact_info_received", e.target.value)}
                  className="bg-events-cream/10 border-events-cream/20 text-events-cream placeholder:text-events-cream/40" />
                <Counter v={form.contact_info_received} max={280} />
              </Field>
              <Field label="Are you applying to a specific role?" hint="Type the role title here so they can look out for your application.">
                <Input value={form.role_flagged} maxLength={280}
                  onChange={(e) => set("role_flagged", e.target.value)}
                  className="bg-events-cream/10 border-events-cream/20 text-events-cream placeholder:text-events-cream/40" />
              </Field>
            </>
          )}

          {step === 3 && (mode === "brand" || mode === "brand_rep") && (
            <>
              <h3 className="font-afterparty text-2xl text-events-cream leading-tight">
                Leave a trail for {brand?.name}
              </h3>
              <p className="font-body text-sm text-events-cream/70">
                They're gonna meet a hundred people today. Help them find their way back to you.
              </p>
              <p className="font-body text-sm text-events-cream/70">
                Don't waste this on "great chatting!" Get specific: "I'm the freelance writer who pitched you on the trail conservation series" or "You said to email about the seasonal guide role, here I am."
              </p>
              <Textarea value={form.message_to_brand} maxLength={500} rows={6}
                onChange={(e) => set("message_to_brand", e.target.value)}
                placeholder="Your trail."
                className="bg-events-cream/10 border-events-cream/20 text-events-cream placeholder:text-events-cream/40" />
              <Counter v={form.message_to_brand} max={500} />
            </>
          )}

          {step === 3 && mode === "expert" && (
            <>
              <h3 className="font-afterparty text-2xl text-events-cream leading-tight">Mentor potential?</h3>
              <p className="font-body text-sm text-events-cream/70">Would you want them as a mentor?</p>
              <div className="flex gap-3">
                {([true, false] as const).map((v) => (
                  <button
                    key={String(v)}
                    onClick={() => set("would_want_as_mentor", v)}
                    className={`flex-1 py-3 rounded-xl border font-display uppercase text-xs tracking-wider transition-colors ${
                      form.would_want_as_mentor === v
                        ? "bg-events-coral border-events-coral text-events-cream"
                        : "bg-events-cream/5 border-events-cream/15 text-events-cream/70"
                    }`}
                  >
                    {v ? "Yes" : "No"}
                  </button>
                ))}
              </div>
              {form.would_want_as_mentor === true && (
                <Field label="What could they mentor you on?" hint="Specific skills, career advice, niche expertise, anything.">
                  <Textarea value={form.mentor_topics} maxLength={280} rows={3}
                    onChange={(e) => set("mentor_topics", e.target.value)}
                    className="bg-events-cream/10 border-events-cream/20 text-events-cream placeholder:text-events-cream/40" />
                  <Counter v={form.mentor_topics} max={280} />
                </Field>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-events-cream/10 px-5 py-4 bg-events-teal">
          {step < 3 && (
            <Button
              onClick={() => setStep(step + 1)}
              className="w-full bg-events-coral hover:bg-events-coral/90 text-events-cream font-display uppercase tracking-wider"
            >
              Continue
            </Button>
          )}
          {step === 3 && (mode === "brand" || mode === "brand_rep") && (
            <div className="space-y-2">
              <Button
                onClick={() => save(true)}
                disabled={saving || !form.message_to_brand.trim()}
                className="w-full bg-events-coral hover:bg-events-coral/90 text-events-cream font-display uppercase tracking-wider"
              >
                Send now
              </Button>
              <Button
                onClick={() => save(false)}
                disabled={saving}
                variant="ghost"
                className="w-full text-events-cream/80 hover:text-events-cream"
              >
                I'll write this later
              </Button>
            </div>
          )}
          {step === 3 && mode === "expert" && (
            <Button
              onClick={() => save(false)}
              disabled={saving}
              className="w-full bg-events-coral hover:bg-events-coral/90 text-events-cream font-display uppercase tracking-wider"
            >
              Save connection
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-display text-events-cream">{label}</label>
    {hint && <p className="text-[11px] text-events-cream/50 font-body">{hint}</p>}
    {children}
  </div>
);

const Counter = ({ v, max }: { v: string; max: number }) => (
  <div className="text-right text-[10px] text-events-cream/40 font-body">{v.length}/{max}</div>
);

export default ConnectionForm;
