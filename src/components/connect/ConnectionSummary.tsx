// Read-only summary of a single connection. Replaces direct opening of
// ConnectionForm from the connections list. Shows the recipient, the user's
// private notes, and the note they sent (if any). Edit buttons open the
// existing ConnectionForm / NoteComposer.

import { useEffect, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, Pencil, Mail } from "lucide-react";
import {
  connectNotesGetMine, type ConnectNote,
} from "@/lib/connect-session";
import ConnectionForm from "./ConnectionForm";
import NoteComposer, { NoteRecipient } from "./NoteComposer";

type Mode = "brand" | "brand_rep" | "expert";

interface Props {
  connection: any;
  mode: Mode;
  onClose: () => void;
  onChanged?: () => void;
}

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
    });
  } catch { return iso; }
};

const brandLogo = (b: any): string | null =>
  b?.logo_url ||
  (b?.website_url
    ? `https://logo.clearbit.com/${String(b.website_url).replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0]}`
    : null);

const ConnectionSummary = ({ connection, mode, onClose, onChanged }: Props) => {
  const [note, setNote] = useState<ConnectNote | null>(null);
  const [editing, setEditing] = useState(false);
  const [composing, setComposing] = useState(false);

  const recipientId =
    mode === "expert" ? connection.expert_id :
    mode === "brand_rep" ? connection.brand_rep_id : null;

  useEffect(() => {
    if (!recipientId) { setNote(null); return; }
    connectNotesGetMine(recipientId).then((r) => setNote(r.note || null)).catch(() => setNote(null));
  }, [recipientId]);

  const subjectName =
    mode === "expert" ? connection.expert?.full_name :
    mode === "brand_rep" ? connection.rep?.full_name :
    connection.brand?.name;
  const subjectFirstName = (subjectName || "them").split(" ")[0];
  const avatar =
    mode === "expert" ? connection.expert?.photo_url :
    mode === "brand_rep" ? connection.rep?.photo_url :
    brandLogo(connection.brand);
  const subtitle =
    mode === "expert" ? (connection.expert?.current_company || "Industry expert") :
    mode === "brand_rep" ? [connection.rep?.job_title, connection.brand?.name].filter(Boolean).join(" at ") :
    "Brand";

  const noteRecipient: NoteRecipient | null = recipientId ? {
    recipient_type: mode === "expert" ? "expert" : "brand_rep",
    recipient_id: recipientId,
    full_name: subjectName || "",
    photo_url: avatar,
    job_title: connection.rep?.job_title || connection.expert?.job_title,
    current_company: connection.rep?.current_company || connection.expert?.current_company || connection.brand?.name,
    ask_me_about: connection.expert?.ask_me_about,
  } : null;

  return (
    <>
      <Sheet open={!editing && !composing} onOpenChange={(o) => !o && onClose()}>
        <SheetContent
          side="bottom"
          hideClose
          className="bg-events-teal border-events-cream/10 text-events-cream p-0 h-[92vh] sm:h-[88vh] sm:max-w-lg sm:mx-auto sm:rounded-t-2xl flex flex-col"
        >
          {/* Header with single X */}
          <div className="px-5 pt-5 pb-3 flex items-start gap-3 border-b border-events-cream/10">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-events-cream/10 flex items-center justify-center shrink-0">
              {avatar ? (
                <img src={avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="font-display text-events-cream/70 text-sm">
                  {(subjectName || "?").split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-wider font-display text-events-cream/50">
                {mode === "brand" ? "Brand visit" : mode === "expert" ? "Industry expert" : "Brand rep"}
              </div>
              <div className="font-display font-bold truncate text-lg">{subjectName || "Untitled"}</div>
              <div className="text-xs font-body text-events-cream/60 truncate">{subtitle}</div>
              <div className="text-[10px] font-body text-events-cream/40 mt-0.5">Logged {formatDate(connection.created_at)}</div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-9 h-9 rounded-full bg-events-cream/10 hover:bg-events-cream/20 flex items-center justify-center shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
            {mode === "brand" && (
              <p className="font-body text-sm text-events-cream/80">
                You marked yourself as visiting this brand.
              </p>
            )}

            {/* Your private notes */}
            <Block label="Your private notes" hint="Only you can see these.">
              {connection.private_notes ? (
                <p className="font-body text-sm text-events-cream/90 whitespace-pre-wrap">{connection.private_notes}</p>
              ) : (
                <p className="font-body text-sm text-events-cream/40 italic">None yet.</p>
              )}
            </Block>

            {(mode === "brand_rep" || mode === "expert") && (connection.follow_up_direction || connection.contact_info_received || connection.role_flagged) && (
              <Block label="Follow up details">
                {connection.follow_up_direction && (
                  <Line label="How to follow up">{connection.follow_up_direction}</Line>
                )}
                {connection.contact_info_received && (
                  <Line label="Contact info received">{connection.contact_info_received}</Line>
                )}
                {mode === "brand_rep" && connection.role_flagged && (
                  <Line label="Role flagged">{connection.role_flagged}</Line>
                )}
              </Block>
            )}

            {mode === "expert" && connection.would_want_as_mentor && (
              <Block label="Mentor flag">
                <p className="font-body text-sm text-events-cream/90">
                  You flagged {subjectFirstName} as someone you'd want as a mentor.
                </p>
                {connection.mentor_topics && (
                  <Line label="Mentor topics">{connection.mentor_topics}</Line>
                )}
              </Block>
            )}

            {/* Note sent */}
            {(mode === "brand_rep" || mode === "expert") && (
              <div className="rounded-2xl border border-events-coral/30 bg-events-coral/5 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-events-coral" />
                  <span className="text-[10px] uppercase tracking-wider font-display text-events-coral">
                    {note ? `Your note to ${subjectFirstName}` : "No note sent yet"}
                  </span>
                </div>
                {note ? (
                  <>
                    <blockquote className="font-body text-sm text-events-cream/90 italic border-l-2 border-events-coral pl-3 whitespace-pre-wrap">
                      {note.message}
                    </blockquote>
                    <div className="flex items-center gap-2 flex-wrap">
                      {note.note_cta && (
                        <span className="text-[9px] uppercase tracking-wider font-display bg-events-coral/90 text-events-cream px-2 py-0.5 rounded-full">
                          {String(note.note_cta).replace(/_/g, " ")}
                        </span>
                      )}
                      <span className="text-[10px] font-body text-events-cream/50">
                        Sent {formatDate(note.created_at)}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="font-body text-xs text-events-cream/60">
                    Send a quick note so {subjectFirstName} remembers you.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Footer: edit actions */}
          <div className="border-t border-events-cream/10 px-5 py-4 bg-events-teal grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              onClick={() => setEditing(true)}
              variant="secondary"
              className="w-full h-11 bg-events-cream/10 hover:bg-events-cream/15 text-events-cream border border-events-cream/15"
            >
              <Pencil className="w-4 h-4 mr-1.5" />
              Edit connection
            </Button>
            {(mode === "brand_rep" || mode === "expert") && noteRecipient && (
              <Button
                onClick={() => setComposing(true)}
                className="w-full h-11 bg-events-coral hover:bg-events-coral/90 text-events-cream"
              >
                <Mail className="w-4 h-4 mr-1.5" />
                {note ? "Edit note" : "Send a note"}
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {editing && (
        <ConnectionForm
          open
          mode={mode}
          editingId={connection.id}
          brand={connection.brand}
          rep={connection.rep}
          expert={connection.expert}
          initial={{
            private_notes: connection.private_notes || "",
            follow_up_direction: connection.follow_up_direction || "",
            contact_info_received: connection.contact_info_received || "",
            role_flagged: connection.role_flagged || "",
            would_want_as_mentor: connection.would_want_as_mentor,
            mentor_topics: connection.mentor_topics || "",
          }}
          existingNote={note}
          onClose={() => setEditing(false)}
          onSaved={() => { setEditing(false); onChanged?.(); }}
        />
      )}

      {composing && noteRecipient && (
        <NoteComposer
          open
          recipient={noteRecipient}
          onClose={() => setComposing(false)}
          onSaved={() => {
            setComposing(false);
            if (recipientId) {
              connectNotesGetMine(recipientId).then((r) => setNote(r.note || null)).catch(() => {});
            }
            onChanged?.();
          }}
        />
      )}
    </>
  );
};

const Block = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <div className="text-[10px] uppercase tracking-wider font-display text-events-cream/50">{label}</div>
    {hint && <div className="text-[10px] font-body text-events-cream/40">{hint}</div>}
    <div className="space-y-2">{children}</div>
  </div>
);
const Line = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wider font-display text-events-cream/40">{label}</div>
    <div className="font-body text-sm text-events-cream/90 whitespace-pre-wrap">{children}</div>
  </div>
);

export default ConnectionSummary;
