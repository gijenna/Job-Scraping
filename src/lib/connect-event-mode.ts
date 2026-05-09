// Shared event-mode helper for Basecamp Connect (Outside Days Denver 26).
// Used by header strip, NoteComposer gating, intro modal, and any UI that
// needs to know whether we are pre, during, or post event.

export type EventMode = "pre_event" | "during_event" | "post_event";

// Denver Outside Days 26: Wed May 27, 2026, 4pm-7pm MT (UTC-6).
export const EVENT_START = new Date("2026-05-27T16:00:00-06:00");
export const POST_EVENT_START = new Date("2026-05-27T19:00:00-06:00");

export function getEventMode(now: Date = new Date()): EventMode {
  if (now < EVENT_START) return "pre_event";
  if (now < POST_EVENT_START) return "during_event";
  return "post_event";
}

export const MODE_HEADER_COPY: Record<EventMode, { title: string; body: string }> = {
  pre_event: {
    title: "The event hasn't started yet",
    body: "Star brands you want to meet and send a quick note so reps know to look for you.",
  },
  during_event: {
    title: "It's go time",
    body: "Walk the room, say hi, and tap a brand bubble after to log your conversation.",
  },
  post_event: {
    title: "The event has wrapped",
    body: "Send a thank-you note to anyone you spoke with, or reach out to brands you missed.",
  },
};

export const MODE_INTRO_COPY: Record<EventMode, { title: string; body: string }> = {
  pre_event: {
    title: "Welcome to the brand map",
    body: "Browse the brands coming to Outside Days. Star your favorites and send a short pre-event note so reps recognize you on the day.",
  },
  during_event: {
    title: "You're at the event",
    body: "Walk up, introduce yourself, and tap the brand bubble after each chat to log who you met. We'll send your follow-up notes after the event ends.",
  },
  post_event: {
    title: "Keep the conversation going",
    body: "Drop a quick thank-you note to anyone you met, or reach out to a brand you missed. Reps see your full profile alongside your message.",
  },
};

import { useEffect, useState } from "react";
export function useEventMode(): EventMode {
  const [mode, setMode] = useState<EventMode>(() => getEventMode());
  useEffect(() => {
    const id = setInterval(() => setMode(getEventMode()), 60_000);
    return () => clearInterval(id);
  }, []);
  return mode;
}
