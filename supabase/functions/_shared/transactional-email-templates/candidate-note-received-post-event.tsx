/// <reference types="npm:@types/react@18.3.1" />
import * as React from "npm:react@18.3.1";
import { Body, Container, Head, Heading, Html, Preview, Text } from "npm:@react-email/components@0.0.22";
import type { TemplateEntry } from "./registry.ts";

interface Props {
  first_name?: string;
  rep_name?: string;
  brand_name?: string;
}

const Email = ({ first_name = "there", rep_name = "the rep", brand_name = "their team" }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your note to {rep_name} at {brand_name} has been sent.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Your note is on its way.</Heading>
        <Text style={text}>Hi {first_name},</Text>
        <Text style={text}>
          Your note to {rep_name} at {brand_name} has been sent. They'll see it on their dashboard with everyone else they met at the event.
        </Text>
        <Text style={text}>
          If they want to reply, they have your email and LinkedIn. Thanks for using Basecamp Connect.
        </Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: Email,
  subject: "Your note is on its way.",
  displayName: "Connect: post-event note confirmation",
  previewData: { first_name: "Alex", rep_name: "Sam", brand_name: "Patagonia" },
} satisfies TemplateEntry;

const main = { backgroundColor: "#ffffff", fontFamily: "'Josefin Sans', Arial, sans-serif" };
const container = { padding: "32px 28px", maxWidth: "560px" };
const h1 = { fontSize: "24px", fontWeight: 600, color: "#19363B", margin: "0 0 18px" };
const text = { fontSize: "15px", color: "#19363B", lineHeight: 1.6, margin: "0 0 14px" };
