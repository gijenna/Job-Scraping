/// <reference types="npm:@types/react@18.3.1" />
import * as React from "npm:react@18.3.1";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from "npm:@react-email/components@0.0.22";
import type { TemplateEntry } from "./registry.ts";

interface Props {
  recipientName?: string;
  expertSlug?: string;
  profileUrl?: string;
  ogCardUrl?: string;
  editUrl?: string;
}

const PROJECT = "qpnzjcbdtybwazceggmv";
const SITE = "https://basecampoutdoorevents.com";

const cardUrl = (slug: string, format: string) =>
  `https://${PROJECT}.supabase.co/functions/v1/expert-card-image/${encodeURIComponent(slug)}/minneapolis?format=${format}&download=1&v=${Date.now()}`;

const Email = ({
  recipientName = "there",
  expertSlug = "your-name",
  profileUrl,
  ogCardUrl,
  editUrl,
}: Props) => {
  const first = (recipientName || "there").split(/\s+/)[0];
  const profile =
    profileUrl ||
    `https://${PROJECT}.supabase.co/functions/v1/expert-og/${encodeURIComponent(expertSlug)}/minneapolis`;
  const og = ogCardUrl || cardUrl(expertSlug, "og");
  const edit = editUrl || `${SITE}/MNexperts/edit/${encodeURIComponent(expertSlug)}`;

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>You're official. Here's your card + share image for Minneapolis.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>You're official, {first}</Heading>
          <Text style={text}>
            Your Industry Expert card is live for Basecamp Outdoor Lounge @ OR Minneapolis, Thursday Aug 20, 10:30 AM to 12:30 PM.
          </Text>
          <Text style={text}>
            <Link href={edit} style={inlineLink}>Edit it here anytime.</Link>
          </Text>

          <Section style={ctaBox}>
            <Button href={profile} style={ctaBtn}>See how good your card looks live!</Button>
          </Section>

          <Text style={smallText}>
            Or copy your share link:
          </Text>
          <Section style={copyBox}>
            <Link href={profile} style={copyLink}>{profile}</Link>
          </Section>

          <Text style={text}>
            We'd love you to let folks know you're coming via the link above (which goes right to your card!), or here's a share image, ready to post:
          </Text>

          <Section style={{ textAlign: "center" as const, margin: "16px 0" }}>
            <Link href={og}>
              <Img src={og} alt="LinkedIn / Post card" style={cardImg} />
            </Link>
            <Text style={cardLabel}>LinkedIn / X Post</Text>
            <Link href={og} style={dlLink}>Download</Link>
          </Section>

          <Text style={italicNote}>
            (We only have 100 slots, so someone in your network might be super grateful you tipped them off to the opportunity.)
          </Text>

          <Hr style={hr} />

          <Heading style={h2}>A tiny ask</Heading>
          <Text style={text}>
            Tag{" "}
            <Link href="https://www.instagram.com/basecampoutdoorjobs/" style={inlineLink}>
              @basecampoutdoorjobs
            </Link>{" "}
            when you post. It helps the next round of experts see what this looks like and makes the whole room bigger.
          </Text>

          <Text style={text}>
            Have any questions at all? Just reply to this email and I'll take care of it.
          </Text>

          <Text style={signoff}>{'<3'} Jenna &amp; the Basecamp crew</Text>
        </Container>
      </Body>
    </Html>
  );
};

export const template = {
  component: Email,
  subject: "You're official. Your Minneapolis expert card is live",
  displayName: "MN Expert - published confirmation",
  previewData: {
    recipientName: "Jenna",
    expertSlug: "jenna-celmer",
  },
} satisfies TemplateEntry;

const main = { backgroundColor: "#ffffff", fontFamily: "'Josefin Sans', Arial, sans-serif", color: "#19363B" };
const container = { padding: "24px 28px", maxWidth: "600px" };
const h1 = { fontSize: "26px", fontWeight: 700, color: "#19363B", margin: "0 0 12px" };
const h2 = { fontSize: "18px", fontWeight: 600, color: "#19363B", margin: "18px 0 8px" };
const text = { fontSize: "15px", lineHeight: "22px", color: "#19363B", margin: "0 0 12px" };
const smallText = { fontSize: "13px", lineHeight: "18px", color: "#19363B", margin: "12px 0 6px" };
const italicNote = { fontSize: "14px", lineHeight: "20px", color: "#19363B", fontStyle: "italic" as const, margin: "8px 0 0" };
const hr = { borderColor: "#F5E6D3", margin: "22px 0" };
const inlineLink = { color: "#ED7660", textDecoration: "underline" };
const ctaBox = { textAlign: "center" as const, margin: "16px 0 8px" };
const ctaBtn = {
  backgroundColor: "#ED7660",
  color: "#ffffff",
  padding: "12px 22px",
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: 600,
  textDecoration: "none",
  display: "inline-block",
};
const copyBox = {
  backgroundColor: "#F5E6D3",
  padding: "10px 12px",
  borderRadius: "6px",
  margin: "0 0 14px",
  wordBreak: "break-all" as const,
};
const copyLink = { fontSize: "13px", color: "#19363B", textDecoration: "none", fontFamily: "monospace" };
const cardImg = {
  width: "100%",
  maxWidth: "480px",
  height: "auto",
  borderRadius: "8px",
  border: "1px solid #F5E6D3",
  display: "block",
  margin: "0 auto 6px",
};
const cardLabel = { fontSize: "13px", fontWeight: 600, color: "#19363B", margin: "0 0 4px", textAlign: "center" as const };
const dlLink = { fontSize: "13px", color: "#ED7660", textDecoration: "underline" };
const signoff = { fontSize: "15px", color: "#19363B", margin: "18px 0 0" };
