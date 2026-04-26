/// <reference types="npm:@types/react@18.3.1" />
import * as React from "npm:react@18.3.1";
import { Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Link } from "npm:@react-email/components@0.0.22";
import type { TemplateEntry } from "./registry.ts";

interface AfterPartyRsvpConfirmationProps {
  recipientName?: string;
  inviteUrl?: string;
  guestsUrl?: string;
  matchesUrl?: string;
  /** True when the attendee has already requested brand activation */
  brandActivated?: boolean;
  /** Attendee role, used to tweak copy */
  role?: "creator" | "brand" | "industry_expert";
}

const AfterPartyRsvpConfirmationEmail = ({
  recipientName = "there",
  inviteUrl = "https://basecampoutdoorevents.com/afterparty",
  guestsUrl = "https://basecampoutdoorevents.com/guests",
  matchesUrl,
  brandActivated = false,
  role,
}: AfterPartyRsvpConfirmationProps) => {
  // ALL primary CTAs go to the guest list dashboard. The personal invite
  // URL is kept only as the "find your card" deep-link via the guest list
  // (which carries ?slug= so the dashboard knows who you are).
  const dashboardUrl = guestsUrl;

  // Role-aware match copy: tell them who they'll be matched WITH (the
  // opposite of who they are), so the value of filling out their card
  // is concrete.
  const isCreator = role === "creator";
  const isBrand = role === "brand";
  const matchTargetShort = isCreator
    ? "brands you should meet"
    : isBrand
      ? "creators you should meet"
      : "people you should meet";
  const yourCardLabel = isCreator
    ? "your full creator card"
    : isBrand
      ? "your full brand card"
      : "the rest of your card";

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>You're on the list, {recipientName} — get suggestions on {matchTargetShort}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>You're on the list, {recipientName}</Heading>

          <Text style={text}>
            Save the date: <strong>Thursday, May 28 · 7 to 9pm</strong>.
          </Text>

          <Text style={text}>
            A calendar invite is on its way, and the full venue address will be updated closer to the event.
          </Text>

          <Hr style={hr} />

          <Heading as="h2" style={h2}>What next</Heading>

          <Text style={text}>
            <strong>1. Get suggestions on {matchTargetShort}.</strong> Fill out {yourCardLabel} to get matched to people in the room you might not have known to look for. The more you share (niches, what you're looking for, a quick fact about something you've made), the better your matches.
          </Text>
          <Button href={dashboardUrl} style={button}>
            Add my info & see suggestions →
          </Button>

          <Text style={text}>
            <strong>2. See who else is coming.</strong> Browse the full guest list — who's bringing giveaways, who's bringing snacks, and who you should say hi to.
          </Text>
          <Button href={dashboardUrl} style={secondaryButton}>
            See who's coming →
          </Button>

          <Hr style={hr} />

          {role === "brand" && brandActivated ? (
            <>
              <Heading as="h2" style={h2}>About your activation request</Heading>
              <Text style={text}>
                Got your activation request, thank you. I'll personally reach out within one business day to walk through options that fit your goals.
              </Text>
              <Text style={text}>
                Eager to chat sooner? Just reply to this email, it comes straight to me.
              </Text>
            </>
          ) : (
            <>
              <Heading as="h2" style={h2}>Want to get more involved?</Heading>
              <Text style={text}>
                Brands, beverages, food, swag, or anything that makes the night yours, <strong>just hit reply</strong>. This email goes straight to me and I'd love to chat.
              </Text>
            </>
          )}

          <Text style={signoff}>Jenna</Text>

          <Hr style={hr} />
          <Text style={footer}>
            <Link href="https://basecampjobs.com" style={footerLink}>Basecamp Match</Link> 🔥 × <Link href="https://popfly.com" style={footerLink}>Popfly</Link> ✨
          </Text>
          <Text style={footer}>
            <Link href={dashboardUrl} style={footerLink}>Bookmark your dashboard</Link> so it's easy to find your card, matches, and the guest list.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export const template = {
  component: AfterPartyRsvpConfirmationEmail,
  subject: (data: Record<string, any>) => {
    const first = (data?.recipientName || "").toString().trim().split(/\s+/)[0] || "you";
    return `You're on the list, ${first}`;
  },
  displayName: "After Party RSVP confirmation",
  previewData: {
    recipientName: "Jenna",
    inviteUrl: "https://basecampoutdoorevents.com/afterparty/jenna",
    guestsUrl: "https://basecampoutdoorevents.com/guests?slug=jenna",
    matchesUrl: "https://basecampoutdoorevents.com/guests?slug=jenna",
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
const footer = { fontSize: "13px", color: "#666", margin: "0 0 6px", lineHeight: "1.5" };
const footerLink = { color: "#ED7660", textDecoration: "underline", fontWeight: 600 };
