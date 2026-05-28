// Job-seeker FAQ for Outside Days Connect. Shown as a yellow "FAQ" pill in the
// ConnectHome header until POST_EVENT_START. Opens a dialog with the curated
// Q&A plus a link to the full helpful-info doc.

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { POST_EVENT_START } from "@/lib/connect-event-mode";
import { ExternalLink } from "lucide-react";

const FULL_DOC_URL =
  "https://docs.google.com/document/d/15QZ8yHXtDMtu0h-PJC7avUYeMcIHzwagNa1CXQ18OFk/edit?tab=t.f1e8hy6v7u53";

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "Should I bring a printed resume?",
    a: (
      <>
        Only if you want to. Some recruiters love them, some won't care, some won't accept them.
        We've designed the Connect app to give you options. Since most companies will make you
        formally apply, that's likely where your resume stands out. Focus on a memorable
        conversation and pitch instead. That's what we'd suggest most highly.
      </>
    ),
  },
  {
    q: "What should I wear?",
    a: (
      <>
        Whatever makes you feel most comfy. The outdoor industry is indeed casual, you'll see
        flannel and gear all over, but you'll also see suits and skirts. What makes you feel good
        and is clean? Wear that. Items that are memorable are kind of a hack too, you could add
        them to your notes to brands ("I was the lady in the yellow jacket" or "I wore the bumble
        bee tie").
      </>
    ),
  },
  {
    q: "Which companies will be there?",
    a: (
      <>
        Any companies on the map will be present. Companies not on the map will not. Be sure to
        check our industry expert section as well, but folks in that area do not formally
        represent those companies, they're here to share their own journeys and give insight.
      </>
    ),
  },
  {
    q: "Does the career fair come with festival access?",
    a: (
      <>
        It does not. The career fair is a stand-alone event. You can buy festival or industry
        conference tickets separately.
      </>
    ),
  },
  {
    q: "What type of note should I send to brands before or after the event?",
    a: (
      <>
        If you have a clear idea of a role you want to talk about, or how you could help the
        brand save time, increase revenue, or something else compelling, send that note. Prime
        them for the conversation you plan to have. Impress them. Make them look for you.
      </>
    ),
  },
];

const CandidateFAQ = () => {
  const [open, setOpen] = useState(false);

  // Hide after the event wraps.
  if (new Date() >= POST_EVENT_START) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Job seeker FAQ"
        className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-display uppercase tracking-wider bg-events-yellow text-events-teal hover:bg-events-yellow/90 px-2.5 sm:px-3 py-1.5 rounded-full transition-colors shadow-sm shrink-0"
      >
        FAQ
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg bg-events-teal text-events-cream border-events-cream/15 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-afterparty text-3xl text-events-yellow">
              Job Seeker FAQ
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 mt-2">
            {FAQS.map((item) => (
              <div key={item.q}>
                <div className="font-display text-sm text-events-coral mb-1.5">{item.q}</div>
                <div className="font-body text-sm text-events-cream/85 leading-relaxed">
                  {item.a}
                </div>
              </div>
            ))}

            <a
              href={FULL_DOC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-display uppercase tracking-wider bg-events-coral text-events-cream hover:bg-events-coral/90 px-3 py-2 rounded-full transition-colors mt-2"
            >
              More helpful event info <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CandidateFAQ;
