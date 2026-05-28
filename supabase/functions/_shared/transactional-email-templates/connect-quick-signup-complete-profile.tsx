/// <reference types="npm:@types/react@18.3.1" />
import * as React from "npm:react@18.3.1";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "npm:@react-email/components@0.0.22";
import type { TemplateEntry } from "./registry.ts";

interface Props {
  first_name?: string;
  profile_url?: string;
}

const DEFAULT_URL = "https://basecampoutdoorevents.com/outsidedays26/connect/profile";

const Email = ({
  first_name = "there",
  profile_url = DEFAULT_URL,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You're in. Finish your profile so brands can actually find you.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>You're in, {first_name}.</Heading>
        <Text style={text}>
          You signed up with just the basics so you could get into the map quickly. That's enough to walk the floor today, but it's not enough for recruiters to find you after.
        </Text>

        <Heading as="h2" style={h2}>Why finish your profile</Heading>
        <Text style={text}>
          Brand recruiters use the Connect dashboard during and after the event to search for talent by field, focus, career stage, location, and what you're open to. Your name and email alone don't show up in those searches.
        </Text>
        <Text style={text}>
          A complete profile means:
        </Text>
        <Section style={bulletWrap}>
          <Text style={bullet}>· You appear in filtered searches when recruiters look for someone with your skills</Text>
          <Text style={bullet}>· Reps see your hook, current role, and what you're looking for before they reach out</Text>
          <Text style={bullet}>· Brands you didn't get a chance to meet today can still find you tomorrow</Text>
          <Text style={bullet}>· A face and a one-liner makes you 10x more memorable than a name in a list</Text>
        </Section>

        <Section style={{ textAlign: "center" as const, margin: "28px 0 18px" }}>
          <Button href={profile_url} style={button}>
            Finish my profile
          </Button>
        </Section>

        <Text style={text}>
          It takes about 5 minutes. Do it tonight while the conversations are still fresh.
        </Text>

        <Text style={footer}>
          Basecamp Outdoor · Outside Days Denver
        </Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: Email,
  subject: "You're in. Now finish your profile so brands can find you.",
  displayName: "Connect: quick-signup complete-your-profile nudge",
  previewData: {
    first_name: "Jenna",
    profile_url: DEFAULT_URL,
  },
} satisfies TemplateEntry;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "'Josefin Sans', Arial, sans-serif",
};
const container = { padding: "32px 28px", maxWidth: "560px" };
const h1 = { fontSize: "26px", fontWeight: 600, color: "#19363B", margin: "0 0 18px" };
const h2 = { fontSize: "18px", fontWeight: 600, color: "#19363B", margin: "24px 0 10px" };
const text = { fontSize: "15px", color: "#19363B", lineHeight: 1.6, margin: "0 0 14px" };
const bulletWrap = { margin: "6px 0 6px" };
const bullet = { fontSize: "15px", color: "#19363B", lineHeight: 1.55, margin: "0 0 6px" };
const button = {
  backgroundColor: "#ED7660",
  color: "#F5E6D3",
  fontSize: "15px",
  fontWeight: 600,
  padding: "12px 24px",
  borderRadius: "10px",
  textDecoration: "none",
  display: "inline-block",
};
const footer = {
  fontSize: "12px",
  color: "#19363B",
  opacity: 0.6,
  margin: "28px 0 0",
};
