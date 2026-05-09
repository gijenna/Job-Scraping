// Single-screen connection form. Two variants: rep (brand_rep) and expert.
// All fields visible. Note section is collapsible and inline. Mobile-first.

import { useEffect, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, Mail, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  connectionsCreate, connectionsUpdate,
  connectNotesUpsert, type ConnectNote,
} from "@/lib/connect-session";
import NoteCTAChips, { NoteCTA } from "./NoteCTAChips";

export type ConnectionMode = "brand" | "brand_rep" | "expert";

interface Subject {
  brand?: { id: string; name: string; logo_url?: string | null; website_url?: string | null } | null;
  rep?: { id: string; full_name: string; photo_url?: string | null } | null;
  expert?: { id: string; full_name: string; photo_url?: string | null } | null;
}

interface Props extends Subject {
  open: boolean;
  mode: ConnectionMode;
  editingId?: string | null;
  initial?: Partial<FormState> | null;
  existingNote?: ConnectNote | null;
  onClose: () => void;
  onSaved?: () => void;
}

interface FormState {
  private_notes: string;
  follow_up_direction: string;
  contact_info_received: string;
  role_flagged: string;
  would_want_as_mentor: boolean | null;
  mentor_topics: string;
  note_message: string;
  note_cta: NoteCTA | null;
}

const empty: FormState = {
  private_notes: "",
  follow_up_direction: "",
  contact_info_received: "",
  role_flagged: "",
  would_want_as_mentor: null,
  mentor_topics: "",
  note_message: "",
  note_cta: null,
};

const ConnectionForm = ({
  open, mode, brand, rep, expert, editingId, initial, existingNote,
  onClose, onSaved,
}: Props) => {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>({ ...empty, ...(initial || {}) });
  const [noteOpen, setNoteOpen] = useState(!!existingNote);

  useEffect(() => {
    setForm({
      ...empty,
      ...(initial || {}),
      note_message: existingNote?.message || "",
      note_cta: ((existingNote as any)?.note_cta as NoteCTA | null) ?? null,
    });
    setNoteOpen(!!existingNote);
  }, [open, editingId, existingNote?.id]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const subjectName = mode === "expert" ? expert?.full_name : rep?.full_name;
  const subjectFirstName = (subjectName || "them").split(" ")[0];
  const subjectAvatar = mode === "expert" ? expert?.photo_url : rep?.photo_url;
  const subjectSubtitle = mode === "expert"
    ? "Industry expert"
    : (brand?.name ? brand.name : "Brand rep");

  const willSendNote = noteOpen && form.note_message.trim().length > 0;
  const saveLabel = editingId
    ? (willSendNote ? "Update connection and send note" : "Update connection")
    : (willSendNote ? "Save connection and send note" : "Save connection");

  const save = async () => {
    setSaving(true);
    try {
      const payload: any = {
        private_notes: form.private_notes || undefined,
        follow_up_direction: form.follow_up_direction || undefined,
        contact_info_received: form.contact_info_received || undefined,
        role_flagged: mode === "brand_rep" ? (form.role_flagged || undefined) : undefined,
        would_want_as_mentor: mode === "expert" ? form.would_want_as_mentor : null,
        mentor_topics: mode === "expert" && form.would_want_as_mentor ? (form.mentor_topics || undefined) : undefined,
      };

      if (editingId) {
        await connectionsUpdate(editingId, payload);
      } else {
        await connectionsCreate({
          ...payload,
          brand_id: brand?.id || null,
          brand_rep_id: mode === "brand_rep" ? rep?.id || null : null,
          expert_id: mode === "expert" ? expert?.id || null : null,
        });
      }

      if (willSendNote) {
        const recipientId = mode === "expert" ? expert?.id : rep?.id;
        if (recipientId) {
          await connectNotesUpsert({
            recipient_type: mode === "expert" ? "expert" : "brand_rep",
            recipient_id: recipientId,
            message: form.note_message.trim(),
            note_cta: form.note_cta,
          });
        }
      }

      toast({
        title: editingId ? "Connection updated" : "Connection saved",
        description: willSendNote ? `${subjectFirstName} will get your note.` : undefined,
      });
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
        <div className="px-5 pt-5 pb-3 flex items-start gap-3 border-b border-events-cream/10">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-events-cream/10 flex items-center justify-center shrink-0">
            {subjectAvatar ? (
              <img src={subjectAvatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="font-display text-events-cream/70 text-sm">
                {(subjectName || "?").split(" ").map((w) => w[0]).join("").slice(0, 2)}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-wider font-display text-events-cream/50">
              {editingId ? "Edit connection" : "Log a connection"}
            </div>
            <div className="font-display font-bold truncate">{subjectName || "Unknown"}</div>
            <div className="text-xs font-body text-events-cream/60 truncate">{subjectSubtitle}</div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-events-cream/10 hover:bg-events-cream/20 flex items-center justify-center shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          <Field
            label="What did you talk about?"
            hint="This is your private memory aid. Brand will never see this."
          >
            <Textarea value={form.private_notes} maxLength={500} rows={4}
              onChange={(e) => set("private_notes", e.target.value)}
              placeholder="What stuck out, what you connected on, the vibe."
              className="bg-events-cream/10 border-events-cream/20 text-events-cream placeholder:text-events-cream/40" />
            <Counter v={form.private_notes} max={500} />
          </Field>

          <Field label="How should you follow up?" hint="Email next week? Apply to a specific role? DM on LinkedIn?">
            <Input value={form.follow_up_direction} maxLength={280}
              onChange={(e) => set("follow_up_direction", e.target.value)}
              className="bg-events-cream/10 border-events-cream/20 text-events-cream placeholder:text-events-cream/40" />
            <Counter v={form.follow_up_direction} max={280} />
          </Field>

          <Field label="Did they give you contact info?" hint="Phone number, email, LinkedIn, business card details, anything you got.">
            <Input value={form.contact_info_received} maxLength={280}
              onChange={(e) => set("contact_info_received", e.target.value)}
              className="bg-events-cream/10 border-events-cream/20 text-events-cream placeholder:text-events-cream/40" />
            <Counter v={form.contact_info_received} max={280} />
          </Field>

          {mode === "brand_rep" && (
            <Field label="Are you applying to a specific role?" hint="Type the role title here so they can look out for your application.">
              <Input value={form.role_flagged} maxLength={280}
                onChange={(e) => set("role_flagged", e.target.value)}
                className="bg-events-cream/10 border-events-cream/20 text-events-cream placeholder:text-events-cream/40" />
            </Field>
          )}

          {mode === "expert" && (
            <>
              <div>
                <label className="block text-sm font-display text-events-cream mb-1.5">
                  Would you want them as a mentor?
                </label>
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
              </div>
              {form.would_want_as_mentor === true && (
                <Field label="What could they mentor you on?" hint="Specific skills, career advice, niche expertise, anything.">
                  <Input value={form.mentor_topics} maxLength={280}
                    onChange={(e) => set("mentor_topics", e.target.value)}
                    className="bg-events-cream/10 border-events-cream/20 text-events-cream placeholder:text-events-cream/40" />
                </Field>
              )}
            </>
          )}

          {/* Collapsible note */}
          <div className="rounded-2xl border border-events-cream/15 overflow-hidden">
            <button
              type="button"
              onClick={() => setNoteOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 bg-events-cream/5 hover:bg-events-cream/10 transition-colors text-left"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="w-4 h-4 text-events-coral shrink-0" />
                <span className="font-display text-sm text-events-cream truncate">
                  {existingNote
                    ? `Edit your note to ${subjectFirstName}`
                    : `Want to send ${subjectFirstName} a note? Tap to write one.`}
                </span>
              </div>
              {noteOpen ? <ChevronUp className="w-4 h-4 text-events-cream/60 shrink-0" /> : <ChevronDown className="w-4 h-4 text-events-cream/60 shrink-0" />}
            </button>

            {noteOpen && (
              <div className="px-4 py-4 space-y-4 bg-events-cream/[0.02]">
                <div className="text-xs font-body text-events-cream/75 leading-relaxed space-y-2">
                  <p>
                    Brands meet hundreds of people today. To be remembered, your note needs to do two things at once: remind them WHO you are, and remind them what you said you'd do.
                  </p>
                  <p className="text-events-cream/55">
                    What works: identifying detail, a clear ask or next step, one specific thing to remember.
                  </p>
                  <p className="text-events-cream/55">
                    What doesn't: "Great chatting!" or anything they could send to anyone else.
                  </p>
                </div>

                <Field label="Write your note">
                  <Textarea value={form.note_message} maxLength={500} rows={5}
                    onChange={(e) => set("note_message", e.target.value)}
                    placeholder={`Hey ${subjectFirstName}, I'm the...`}
                    className="bg-events-cream/10 border-events-cream/20 text-events-cream placeholder:text-events-cream/40" />
                  <Counter v={form.note_message} max={500} />
                </Field>

                <NoteCTAChips value={form.note_cta} onChange={(v) => set("note_cta", v)} />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-events-cream/10 px-5 py-4 bg-events-teal">
          <Button
            onClick={save}
            disabled={saving}
            className="w-full h-12 bg-events-coral hover:bg-events-coral/90 text-events-cream font-display uppercase tracking-wider"
          >
            {saveLabel}
          </Button>
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
