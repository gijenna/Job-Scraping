// Sticky action footer shown at the bottom of ConnectPersonSheet.
// Mode-aware: button labels change based on event mode + whether the
// candidate already has a note or connection with this person.

import { Mail, ClipboardList, Eye, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventMode } from "@/lib/connect-event-mode";
import EditableText from "@/components/EditableText";

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
        {hasNote
          ? <><CheckCircle2 className="w-4 h-4 mr-2" /> <EditableText settingKey="footer_edit_note" defaultText="Edit your note" as="span" /></>
          : <><Mail className="w-4 h-4 mr-2" /> <EditableText settingKey="footer_send_note" defaultText="Send a note" as="span" /></>}
      </Button>
    );
  }

  if (mode === "during_event") {
    return (
      <Button
        onClick={hasConnection ? onViewConnection : onLogConnection}
        className="w-full h-12 bg-events-coral hover:bg-events-coral/90 text-events-cream font-display uppercase tracking-wider"
      >
        {hasConnection
          ? <><Eye className="w-4 h-4 mr-2" /> <EditableText settingKey="footer_view_notes" defaultText="View your notes" as="span" /></>
          : <><ClipboardList className="w-4 h-4 mr-2" /> <EditableText settingKey="footer_log_connection" defaultText="Log a connection" as="span" /></>}
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
        {hasNote
          ? <><CheckCircle2 className="w-4 h-4 mr-2" /> <EditableText settingKey="footer_edit_note" defaultText="Edit your note" as="span" /></>
          : <><Mail className="w-4 h-4 mr-2" /> <EditableText settingKey="footer_send_note" defaultText="Send a note" as="span" /></>}
      </Button>
      {hasConnection && (
        <Button
          onClick={onViewConnection}
          variant="ghost"
          className="w-full h-11 text-events-cream/80 hover:text-events-cream border border-events-cream/15"
        >
          <Eye className="w-4 h-4 mr-2" /> <EditableText settingKey="footer_view_edit_connection" defaultText="View / edit connection" as="span" />
        </Button>
      )}
    </div>
  );
};

export default ConnectActionFooter;
