// Bottom-sheet wrapper that shows the FULL existing rep/expert card
// (ExpertCard) with a sticky mode-aware action footer. Used in Connect
// flows when a candidate taps a rep face or an expert in the zone.

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Expert } from "@/lib/expert-types";
import ExpertCard from "@/components/experts/ExpertCard";
import ConnectActionFooter from "./ConnectActionFooter";
import ConnectionForm from "./ConnectionForm";
import NoteComposer, { NoteRecipient } from "./NoteComposer";
import { useEventMode } from "@/lib/connect-event-mode";
import {
  connectNotesGetMine,
  connectionsList,
  type ConnectNote,
} from "@/lib/connect-session";

interface Props {
  open: boolean;
  expert: Expert | null;
  // "brand_rep" or "expert" — controls how the connection form is wired
  subjectType: "brand_rep" | "expert";
  brand?: { id: string; name: string; logo_url?: string | null; website_url?: string | null } | null;
  onClose: () => void;
  onNoteChanged?: (recipientId: string, hasNote: boolean) => void;
  onConnectionSaved?: () => void;
}

const ConnectPersonSheet = ({
  open, expert, subjectType, brand,
  onClose, onNoteChanged, onConnectionSaved,
}: Props) => {
  const mode = useEventMode();
  const [note, setNote] = useState<ConnectNote | null>(null);
  const [connection, setConnection] = useState<any | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    if (!open || !expert) {
      setNote(null);
      setConnection(null);
      return;
    }
    connectNotesGetMine(expert.id).then((r) => setNote(r.note || null)).catch(() => {});
    connectionsList().then((r) => {
      const match = (r.connections || []).find((c: any) =>
        subjectType === "expert" ? c.expert_id === expert.id : c.brand_rep_id === expert.id
      );
      setConnection(match || null);
    }).catch(() => {});
  }, [open, expert?.id, subjectType]);

  if (!expert) return null;

  const recipient: NoteRecipient = {
    recipient_type: subjectType,
    recipient_id: expert.id,
    full_name: expert.full_name,
    photo_url: expert.photo_url,
    job_title: expert.job_title,
    current_company: expert.current_company,
    ask_me_about: expert.ask_me_about,
  };

  return (
    <>
      <Sheet open={open && !composerOpen && !formOpen} onOpenChange={(o) => !o && onClose()}>
        <SheetContent
          side="bottom"
          className="bg-events-teal border-events-cream/10 text-events-cream p-0 h-[92vh] sm:max-w-lg sm:mx-auto sm:rounded-t-2xl flex flex-col"
        >
          <div className="sticky top-0 z-10 flex justify-end px-2 py-2 bg-events-teal/95 backdrop-blur border-b border-events-cream/10">
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-11 h-11 rounded-full bg-events-cream/10 hover:bg-events-cream/20 flex items-center justify-center text-events-cream transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 pt-2 pb-4">
            <ExpertCard expert={expert} autoExpand />
          </div>

          <div className="border-t border-events-cream/10 px-4 py-3 bg-events-teal shadow-[0_-8px_20px_-12px_rgba(0,0,0,0.6)]">
            <ConnectActionFooter
              mode={mode}
              hasNote={!!note}
              hasConnection={!!connection}
              onSendNote={() => setComposerOpen(true)}
              onLogConnection={() => setFormOpen(true)}
              onViewConnection={() => setFormOpen(true)}
            />
          </div>
        </SheetContent>
      </Sheet>

      <NoteComposer
        open={composerOpen}
        recipient={composerOpen ? recipient : null}
        onClose={() => setComposerOpen(false)}
        onSaved={(rid, has) => {
          onNoteChanged?.(rid, has);
          if (has) {
            connectNotesGetMine(rid).then((r) => setNote(r.note || null)).catch(() => {});
          } else {
            setNote(null);
          }
        }}
      />

      {formOpen && (
        <ConnectionForm
          open
          mode={subjectType}
          brand={brand || null}
          rep={subjectType === "brand_rep" ? { id: expert.id, full_name: expert.full_name, photo_url: expert.photo_url } : null}
          expert={subjectType === "expert" ? { id: expert.id, full_name: expert.full_name, photo_url: expert.photo_url } : null}
          editingId={connection?.id || null}
          initial={connection ? {
            private_notes: connection.private_notes || "",
            follow_up_direction: connection.follow_up_direction || "",
            contact_info_received: connection.contact_info_received || "",
            role_flagged: connection.role_flagged || "",
            would_want_as_mentor: connection.would_want_as_mentor,
            mentor_topics: connection.mentor_topics || "",
          } : null}
          existingNote={note}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            onConnectionSaved?.();
            // Refresh local state
            connectionsList().then((r) => {
              const match = (r.connections || []).find((c: any) =>
                subjectType === "expert" ? c.expert_id === expert.id : c.brand_rep_id === expert.id
              );
              setConnection(match || null);
            }).catch(() => {});
            connectNotesGetMine(expert.id).then((r) => {
              setNote(r.note || null);
              onNoteChanged?.(expert.id, !!r.note);
            }).catch(() => {});
          }}
        />
      )}
    </>
  );
};

export default ConnectPersonSheet;
