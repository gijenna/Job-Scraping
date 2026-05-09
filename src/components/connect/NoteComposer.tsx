// Mode-aware note composer. Sends a short note from a candidate to a brand rep
// or industry expert. Disabled during the event (per spec). Server enforces
// the 500-char limit and timing.

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useEventMode } from "@/lib/connect-event-mode";
import {
  connectNotesGetMine, connectNotesUpsert, connectNotesRetract,
} from "@/lib/connect-session";

export interface NoteRecipient {
  recipient_type: "brand_rep" | "expert";
  recipient_id: string;
  full_name: string;
  photo_url?: string | null;
  job_title?: string | null;
  current_company?: string | null;
  ask_me_about?: string | null;
}

interface Props {
  open: boolean;
  recipient: NoteRecipient | null;
  onClose: () => void;
  onSaved?: (recipientId: string, hasNote: boolean) => void;
}

const MAX = 500;

const GUIDANCE: Record<string, { heading: string; body: string }> = {
  pre_event: {
    heading: "Save a pre-event note",
    body: "A short note helps the rep know to look for you. Mention what drew you to them and one thing you'd love to chat about. They'll see it with their Connect follow-up.",
  },
  post_event: {
    heading: "Save a thank-you note",
    body: "Quickly remind them where you met, what stuck with you, and what you'd love to do next. They'll see it with their Connect follow-up.",
  },
  during_event: {
    heading: "Notes are paused during the event",
    body: "Walk up and say hi instead. You can save a follow-up note as soon as the event wraps.",
  },
};

const NoteComposer = ({ open, recipient, onClose, onSaved }: Props) => {
  const mode = useEventMode();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [existingId, setExistingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !recipient) return;
    setLoading(true);
    setMessage("");
    setExistingId(null);
    connectNotesGetMine(recipient.recipient_id)
      .then((r) => {
        if (r.note) {
          setMessage(r.note.message || "");
          setExistingId(r.note.id);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, recipient?.recipient_id]);

  if (!open || !recipient) return null;

  const disabled = mode === "during_event";
  const guidance = GUIDANCE[mode];

  const submit = async () => {
    if (!message.trim() || disabled) return;
    setBusy(true);
    try {
      await connectNotesUpsert({
        recipient_type: recipient.recipient_type,
        recipient_id: recipient.recipient_id,
        message: message.trim().slice(0, MAX),
      });
      toast({ title: existingId ? "Note updated" : "Note saved", description: `Saved for ${recipient.full_name}. They'll see it in their Connect follow-up.` });
      onSaved?.(recipient.recipient_id, true);
      onClose();
    } catch (e: any) {
      toast({ title: "Could not send", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const retract = async () => {
    if (!existingId) return;
    setBusy(true);
    try {
      await connectNotesRetract(recipient.recipient_id);
      toast({ title: "Note retracted" });
      onSaved?.(recipient.recipient_id, false);
      onClose();
    } catch (e: any) {
      toast({ title: "Could not retract", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative w-full sm:max-w-lg bg-events-teal text-events-cream rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-events-cream/10 hover:bg-events-cream/20 flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Recipient summary */}
          <div className="p-5 pb-3 flex items-center gap-3 border-b border-events-cream/10">
            <div className="w-12 h-12 rounded-full bg-events-cream/10 overflow-hidden flex items-center justify-center shrink-0">
              {recipient.photo_url ? (
                <img src={recipient.photo_url} alt={recipient.full_name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-display text-events-cream/70 text-sm">
                  {recipient.full_name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <div className="font-display text-events-cream truncate">{recipient.full_name}</div>
              <div className="text-xs font-body text-events-cream/60 truncate">
                {[recipient.job_title, recipient.current_company].filter(Boolean).join(" · ")}
              </div>
            </div>
          </div>

          {/* Guidance */}
          <div className="px-5 pt-4">
            <h3 className="font-afterparty text-2xl text-events-cream">{guidance.heading}</h3>
            <p className="text-sm font-body text-events-cream/70 mt-1">{guidance.body}</p>
          </div>

          {recipient.ask_me_about && (
            <div className="mx-5 mt-4 rounded-xl bg-events-coral/15 border border-events-coral/30 px-3 py-2.5">
              <div className="text-[10px] uppercase tracking-wider font-display text-events-coral mb-0.5">Ask them about</div>
              <div className="text-sm font-body text-events-cream/85">{recipient.ask_me_about}</div>
            </div>
          )}

          <div className="p-5 pt-4 space-y-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MAX))}
              maxLength={MAX}
              rows={6}
              disabled={disabled || loading}
              placeholder={disabled ? "Notes paused while the event is live." : "Hey, I'd love to chat about..."}
              className="bg-events-cream/5 border-events-cream/15 text-events-cream placeholder:text-events-cream/40"
            />
            <div className="flex items-center justify-between text-[11px] font-body text-events-cream/50">
              <span>{message.length}/{MAX}</span>
              {existingId && <span>Editing your note</span>}
            </div>
          </div>

          <div className="p-5 pt-0 flex flex-wrap gap-2">
            <Button
              onClick={submit}
              disabled={busy || loading || disabled || !message.trim()}
              className="flex-1 min-w-[140px] bg-events-coral hover:bg-events-coral/90 text-events-cream"
            >
              <Send className="w-4 h-4 mr-2" />
              {existingId ? "Update note" : "Save note"}
            </Button>
            {existingId && (
              <Button
                variant="ghost"
                onClick={retract}
                disabled={busy}
                className="text-events-cream/70 hover:text-events-coral"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Retract
              </Button>
            )}
            <Button variant="ghost" onClick={onClose} className="text-events-cream/60">
              Cancel
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NoteComposer;
