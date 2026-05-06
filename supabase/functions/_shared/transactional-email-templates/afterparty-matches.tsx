/// <reference types="npm:@types/react@18.3.1" />
import * as React from "npm:react@18.3.1";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
  Hr,
} from "npm:@react-email/components@0.0.22";
import type { TemplateEntry } from "./registry.ts";

interface MatchItem {
  number: number;
  name: string;
  role: string;
  reason: string;
}

interface AfterPartyMatchesProps {
  recipientName?: string;
  attendeeNumber?: number;
  matches?: MatchItem[];
  /** @deprecated kept for backwards compat - use guestsUrl */
  inviteUrl?: string;
  guestsUrl?: string;
}

const AfterPartyMatchesEmail = ({
  recipientName = "there",
  attendeeNumber,
  matches = [],
  inviteUrl,
  guestsUrl = "https://basecampoutdoorevents.com/guests",
}: AfterPartyMatchesProps) => {
  const ctaUrl = guestsUrl || inviteUrl || "https://basecampoutdoorevents.com/guests";
  return (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>5 people you should look for tonight</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Hey {recipientName} 👋</Heading>
        {attendeeNumber && <Text style={numberBadge}>You're attendee #{attendeeNumber}</Text>}
        <Text style={text}>5 new connections are waiting. Here are their numbers, look out for them tonight.</Text>

        <Hr style={hr} />

        {matches.map((m, i) => (
          <Section key={i} style={matchRow}>
            <Text style={matchNumber}>#{m.number}</Text>
            <Text style={matchName}>
              {m.name} <span style={matchRole}>· {m.role}</span>
            </Text>
            <Text style={matchReason}>{m.reason}</Text>
          </Section>
        ))}

        <Hr style={hr} />

        <Button href={ctaUrl} style={button}>
          See the full guest list →
        </Button>

        <Text style={fineprint}>
          By registering for this event, you're cool with Oakley shooting you an email about other fun stuff they're doing in store, and with your likeness being shared if you're captured in a photo at the event.
        </Text>

        <Text style={footer}>Presented by Popfly × Basecamp Match</Text>
      </Container>
    </Body>
  </Html>
  );
};

export const template = {
  component: AfterPartyMatchesEmail,
  subject: (data: Record<string, any>) => {
    const first = (data?.recipientName || "").toString().trim().split(/\s+/)[0] || "you";
    return `Your 5 people for tonight, ${first}`;
  },
  displayName: "After Party - match blast",
  previewData: {
    recipientName: "Jane",
    attendeeNumber: 42,
    guestsUrl: "https://basecampoutdoorevents.com/guests?slug=jane-doe",
    matches: [
      { number: 17, name: "Alex Rivera", role: "brand", reason: "They're looking for videographers, and that's you" },
      { number: 23, name: "Sam Chen", role: "creator", reason: "Both into Climbing & Hiking" },
      { number: 8, name: "Patagonia", role: "brand", reason: "You named Patagonia as a dream brand" },
    ],
  },
} satisfies TemplateEntry;

const main = { backgroundColor: "#ffffff", fontFamily: "'Josefin Sans', \"Helvetica Neue\", Arial, sans-serif" };
const container = { padding: "32px 28px", maxWidth: "560px" };
const h1 = { fontSize: "28px", fontWeight: "bold", color: "#19363B", margin: "0 0 8px" };
const numberBadge = {
  display: "inline-block",
  padding: "4px 12px",
  borderRadius: "999px",
  backgroundColor: "#ED7660",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "bold",
  margin: "0 0 16px",
};
const text = { fontSize: "15px", color: "#444", lineHeight: "1.5", margin: "0 0 20px" };
const hr = { borderColor: "#eee", margin: "24px 0" };
const matchRow = { padding: "12px 16px", backgroundColor: "#fafafa", borderRadius: "12px", margin: "0 0 10px" };
const matchNumber = {
  display: "inline-block",
  fontWeight: "bold",
  color: "#E1B624",
  margin: "0 0 4px",
  fontSize: "14px",
};
const matchName = { fontSize: "16px", fontWeight: "bold", color: "#19363B", margin: "0 0 4px" };
const matchRole = { fontSize: "12px", color: "#888", textTransform: "uppercase" as const, letterSpacing: "0.5px" };
const matchReason = { fontSize: "13px", color: "#666", margin: 0 };
const button = {
  backgroundColor: "#ED7660",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "8px",
  textDecoration: "none",
  fontSize: "15px",
  fontWeight: "bold",
  display: "inline-block",
  margin: "8px 0",
};
const footer = { fontSize: "13px", color: "#888", margin: "24px 0 0" };
