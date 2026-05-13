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
import BrandLeadCapture from "./BrandLeadCapture";
import { useEventMode } from "@/lib/connect-event-mode";
import {
  connectNotesGetMine,
  connectionsList,
  candidateMe,
  brandRepMe,
  type ConnectNote,
} from "@/lib/connect-session";

interface Props {
  open: boolean;
  expert: Expert | null;
  // "brand_rep" or "expert" controls how the connection form is wired
  subjectType: "brand_rep" | "expert";
  brand?: { id: string; name: string; logo_url?: string | null; website_url?: string | null } | null;
  /** When set, render an inline sponsor credit section in the card body. */
  sponsorContext?: "expert_zone_header";
  sponsorBrand?: { id: string; name: string; logo_url?: string | null; website_url?: string | null } | null;
  /** When set, render the brand-level lead capture under the card. */
  leadCaptureBrandId?: string | null;
  onClose: () => void;
  onNoteChanged?: (recipientId: string, hasNote: boolean) => void;
  onConnectionSaved?: () => void;
}

const ConnectPersonSheet = ({
  open, expert, subjectType, brand,
  sponsorContext, sponsorBrand,
  leadCaptureBrandId,
  onClose, onNoteChanged, onConnectionSaved,
}: Props) => {
  const mode = useEventMode();
  const [note, setNote] = useState<ConnectNote | null>(null);
  const [connection, setConnection] = useState<any | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  // Viewer auth state: drives whether "Send a note" is visible and what it does.
  // - "candidate"      → real candidate session, normal note composer
  // - "brand_or_expert"→ rep/expert session, hide note footer entirely
  // - "guest"          → no session, show note button but intercept w/ prompt
  // - "loading"        → not yet resolved (default to guest behavior visually)
  const [viewer, setViewer] = useState<"loading" | "candidate" | "brand_or_expert" | "guest">("loading");
  const [authPromptOpen, setAuthPromptOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const c = await candidateMe().catch(() => null);
        if (cancelled) return;
        if (c?.session?.subject_type === "candidate") { setViewer("candidate"); return; }
        const r = await brandRepMe().catch(() => null);
        if (cancelled) return;
        if (r?.session?.subject_type === "brand_rep") { setViewer("brand_or_expert"); return; }
        setViewer("guest");
      } catch {
        if (!cancelled) setViewer("guest");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!open || !expert) {
      setNote(null);
      setConnection(null);
      return;
    }
    if (viewer !== "candidate") return;
    connectNotesGetMine(expert.id).then((r) => setNote(r.note || null)).catch(() => {});
    connectionsList().then((r) => {
      const match = (r.connections || []).find((c: any) =>
        subjectType === "expert" ? c.expert_id === expert.id : c.brand_rep_id === expert.id
      );
      setConnection(match || null);
    }).catch(() => {});
  }, [open, expert?.id, subjectType, viewer]);

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
          hideClose
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
            {sponsorContext === "expert_zone_header" && sponsorBrand && (
              <div className="mt-5 mx-1 rounded-2xl border border-events-coral/40 bg-events-cream/5 p-4 space-y-2">
                <div className="flex items-center gap-3">
                  {sponsorBrand.logo_url ? (
                    <img src={sponsorBrand.logo_url} alt={sponsorBrand.name} className="w-10 h-10 rounded-full bg-events-cream object-contain p-1" />
                  ) : null}
                  <div className="font-display text-events-cream text-sm">
                    Industry experts brought to you by {sponsorBrand.name}
                  </div>
                </div>
                <p className="font-body text-[12px] text-events-cream/70 leading-snug">
                  {sponsorBrand.name} sponsors the Industry Expert Zone so candidates can get advice from people who have walked the path.
                </p>
                {sponsorBrand.website_url && (
                  <a
                    href={sponsorBrand.website_url.startsWith("http") ? sponsorBrand.website_url : `https://${sponsorBrand.website_url}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-block text-events-coral text-xs font-display uppercase tracking-wider hover:underline"
                  >
                    Learn more about {sponsorBrand.name}
                  </a>
                )}
              </div>
            )}
            {leadCaptureBrandId && <BrandLeadCapture brandId={leadCaptureBrandId} />}
          </div>

          {viewer !== "brand_or_expert" && (
            <div className="border-t border-events-cream/10 px-4 py-3 bg-events-teal shadow-[0_-8px_20px_-12px_rgba(0,0,0,0.6)]">
              <ConnectActionFooter
                mode={mode}
                hasNote={!!note}
                hasConnection={!!connection}
                onSendNote={() => {
                  if (viewer === "candidate") setComposerOpen(true);
                  else setAuthPromptOpen(true);
                }}
                onLogConnection={() => {
                  if (viewer === "candidate") setFormOpen(true);
                  else setAuthPromptOpen(true);
                }}
                onViewConnection={() => setFormOpen(true)}
              />
            </div>
          )}
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

      {authPromptOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70"
          onClick={() => setAuthPromptOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-events-teal rounded-2xl shadow-2xl p-6 text-events-cream"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setAuthPromptOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-events-cream/10 hover:bg-events-cream/20 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-headline font-bold text-xl pr-8">
              Register and sign in to send notes
            </h3>
            <p className="font-body text-sm text-events-cream/80 mt-3">
              Notes help {expert.full_name?.split(" ")[0] || "this rep"} remember you and what you wanted to chat about. Register for the event first, then sign up for Connect to send notes.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <a
                href="https://basecampoutdoor.typeform.com/outsidedays"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-events-coral hover:bg-events-coral/90 text-events-cream font-display font-bold text-sm uppercase tracking-wider px-5 py-3 rounded-full transition-colors"
              >
                Register for the event
              </a>
              <a
                href="/outsidedays26/connect"
                className="inline-flex items-center justify-center border border-events-cream/40 text-events-cream/90 hover:border-events-cream hover:text-events-cream font-display font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-full transition-colors"
              >
                Already registered? Continue to Connect
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConnectPersonSheet;
