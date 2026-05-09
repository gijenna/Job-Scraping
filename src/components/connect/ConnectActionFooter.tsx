// Sticky action footer shown at the bottom of ConnectPersonSheet.
// Mode-aware: button labels change based on event mode + whether the
// candidate already has a note or connection with this person.

import { Mail, ClipboardList, Eye, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventMode } from "@/lib/connect-event-mode";

interface Props {
  mode: EventMode;
  hasNote: boolean;
  hasConnection: boolean;
  onSendNote: () => void;
  onLogConnection: () => void;
  onViewConnection: () => void;
}

const ConnectActionFooter = ({
  mode, hasNote, hasConnection,
  onSendNote, onLogConnection, onViewConnection,
}: Props) => {
  if (mode === "pre_event") {
    return (
      <Button
        onClick={onSendNote}
        className="w-full h-12 bg-events-coral hover:bg-events-coral/90 text-events-cream font-display uppercase tracking-wider"
      >
        {hasNote ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Edit your note</> : <><Mail className="w-4 h-4 mr-2" /> Send a note</>}
      </Button>
    );
  }

  if (mode === "during_event") {
    return (
      <Button
        onClick={hasConnection ? onViewConnection : onLogConnection}
        className="w-full h-12 bg-events-coral hover:bg-events-coral/90 text-events-cream font-display uppercase tracking-wider"
      >
        {hasConnection ? <><Eye className="w-4 h-4 mr-2" /> View your notes</> : <><ClipboardList className="w-4 h-4 mr-2" /> Log a connection</>}
      </Button>
    );
  }

  // post_event
  return (
    <div className="space-y-2">
      <Button
        onClick={onSendNote}
        className="w-full h-12 bg-events-coral hover:bg-events-coral/90 text-events-cream font-display uppercase tracking-wider"
      >
        {hasNote ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Edit your note</> : <><Mail className="w-4 h-4 mr-2" /> Send a note</>}
      </Button>
      {hasConnection && (
        <Button
          onClick={onViewConnection}
          variant="ghost"
          className="w-full h-11 text-events-cream/80 hover:text-events-cream border border-events-cream/15"
        >
          <Eye className="w-4 h-4 mr-2" /> View / edit connection
        </Button>
      )}
    </div>
  );
};

export default ConnectActionFooter;
