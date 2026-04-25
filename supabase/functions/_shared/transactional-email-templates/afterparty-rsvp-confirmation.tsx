/// <reference types="npm:@types/react@18.3.1" />
import * as React from "npm:react@18.3.1";
import { Body, Container, Head, Heading, Html, Preview, Text, Button, Hr } from "npm:@react-email/components@0.0.22";
import type { TemplateEntry } from "./registry.ts";

interface AfterPartyRsvpConfirmationProps {
  recipientName?: string;
  inviteUrl?: string;
  guestsUrl?: string;
  /** True when the attendee has already requested brand activation */
  brandActivated?: boolean;
  /** Attendee role, used to tweak copy */
  role?: "creator" | "brand" | "industry_expert";
}

const AfterPartyRsvpConfirmationEmail = ({
  recipientName = "there",
  inviteUrl = "https://basecampoutdoorevents.com/afterparty",
  guestsUrl = "https://basecampoutdoorevents.com/guests",
  brandActivated = false,
  role,
}: AfterPartyRsvpConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You're on the list for the Creator After Party 🌲</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>You're on the list, {recipientName} 🌲</Heading>

        <Text style={text}>
          Save the date: <strong>Thursday, May 28 · 7–9pm</strong>. A calendar invite with the full venue
          address will land in your inbox closer to the event. For now, just hold the night.
        </Text>

        <Hr style={hr} />

        <Heading as="h2" style={h2}>What to do next</Heading>
        <Text style={text}>
          <strong>1. Edit your card.</strong> The more you share (niches, what you're looking for, a quick
          fact about something you've made), the better your matches.
        </Text>
        <Button href={inviteUrl} style={button}>
          See &amp; edit my card →
        </Button>

        <Text style={text}>
          <strong>2. See your matches.</strong> They'll appear right under your card and we'll send a final
          set the morning of the event.
        </Text>

        <Text style={text}>
          <strong>3. Check out who's coming.</strong>
        </Text>
        <Button href={guestsUrl} style={secondaryButton}>
          See who's coming →
        </Button>

        <Hr style={hr} />

        {role === "brand" && brandActivated ? (
          <>
            <Heading as="h2" style={h2}>About your activation request</Heading>
            <Text style={text}>
              Got your activation request, thank you. I'll personally reach out within one business day to
              walk through options that fit your goals.
            </Text>
            <Text style={text}>
              Eager to chat sooner? Just reply to this email, it comes straight to me.
            </Text>
          </>
        ) : (
          <>
            <Heading as="h2" style={h2}>Want to get more involved?</Heading>
            <Text style={text}>
              Brands, beverages, food, swag, or anything that makes the night yours, just hit reply. This
              email goes straight to me and I'd love to chat.
            </Text>
          </>
        )}

        <Text style={signoff}>— Jenna</Text>

        <Hr style={hr} />
        <Text style={footer}>
          Basecamp Match × Popfly · Bookmark your card link, it's personal.
        </Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: AfterPartyRsvpConfirmationEmail,
  subject: (data: Record<string, any>) => {
    const first = (data?.recipientName || "").toString().trim().split(/\s+/)[0] || "you";
    return `You're on the list, ${first} 🌲`;
  },
  displayName: "After Party RSVP confirmation",
  previewData: {
    recipientName: "Jane",
    inviteUrl: "https://basecampoutdoorevents.com/afterparty/jane-doe",
    guestsUrl: "https://basecampoutdoorevents.com/guests",
    brandActivated: false,
    role: "creator",
  },
} satisfies TemplateEntry;

const main = { backgroundColor: "#ffffff", fontFamily: "Arial, sans-serif" };
const container = { padding: "32px 28px", maxWidth: "560px" };
const h1 = { fontSize: "26px", fontWeight: "bold", color: "#19363B", margin: "0 0 16px" };
const h2 = { fontSize: "18px", fontWeight: "bold", color: "#19363B", margin: "8px 0 12px" };
const text = { fontSize: "15px", color: "#19363B", lineHeight: "1.6", margin: "0 0 16px" };
const button = {
  backgroundColor: "#ED7660",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "14px",
  textDecoration: "none",
  display: "inline-block",
  margin: "4px 0 20px",
};
const secondaryButton = {
  backgroundColor: "#F5E6D3",
  color: "#19363B",
  padding: "10px 20px",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "14px",
  textDecoration: "none",
  display: "inline-block",
  margin: "4px 0 20px",
  border: "1px solid #E1B624",
};
const hr = { borderColor: "#e5e5e5", margin: "24px 0" };
const signoff = { fontSize: "15px", color: "#ED7660", margin: "20px 0 0", fontWeight: 600 };
const footer = { fontSize: "13px", color: "#666", margin: "0", lineHeight: "1.5" };
