/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as afterpartyMatches } from './afterparty-matches.tsx'
import { template as afterpartyInvite } from './afterparty-invite.tsx'
import { template as afterpartyPin } from './afterparty-pin.tsx'
import { template as afterpartyRsvpConfirmation } from './afterparty-rsvp-confirmation.tsx'
import { template as brandActivationAlert } from './brand-activation-alert.tsx'
import { template as brandActivationConfirmation } from './brand-activation-confirmation.tsx'
import { template as afterpartyInterestAlert } from './afterparty-interest-alert.tsx'
import { template as candidateNoteReceivedPreEvent } from './candidate-note-received-pre-event.tsx'
import { template as candidateNoteReceivedPostEvent } from './candidate-note-received-post-event.tsx'
import { template as feedbackFromUser } from './feedback-from-user.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'afterparty-matches': afterpartyMatches,
  'afterparty-invite': afterpartyInvite,
  'afterparty-pin': afterpartyPin,
  'afterparty-rsvp-confirmation': afterpartyRsvpConfirmation,
  'brand-activation-alert': brandActivationAlert,
  'brand-activation-confirmation': brandActivationConfirmation,
  'afterparty-interest-alert': afterpartyInterestAlert,
  'candidate-note-received-pre-event': candidateNoteReceivedPreEvent,
  'candidate-note-received-post-event': candidateNoteReceivedPostEvent,
  'feedback-from-user': feedbackFromUser,
}
