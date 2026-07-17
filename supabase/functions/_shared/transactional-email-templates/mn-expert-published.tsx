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
  Row,
  Column,
  Text,
  Hr,
} from "npm:@react-email/components@0.0.22";
import type { TemplateEntry } from "./registry.ts";

interface Props {
  recipientName?: string;
  expertSlug?: string;
  profileUrl?: string;
  ogCardUrl?: string;
  igPortraitUrl?: string;
  igStoryUrl?: string;
}

const PROJECT = "qpnzjcbdtybwazceggmv";
const cardUrl = (slug: string, format: string) =>
  `https://${PROJECT}.supabase.co/functions/v1/expert-card-image/${encodeURIComponent(slug)}/minneapolis?format=${format}&download=1`;

const Email = ({
  recipientName = "there",
  expertSlug = "your-name",
  profileUrl,
  ogCardUrl,
  igPortraitUrl,
  igStoryUrl,
}: Props) => {
  const first = (recipientName || "there").split(/\s+/)[0];
  const profile = profileUrl || `https://basecampoutdoorevents.com/minneapolis26?map_expert=${encodeURIComponent(expertSlug)}`;
  const og = ogCardUrl || cardUrl(expertSlug, "og");
  const igp = igPortraitUrl || cardUrl(expertSlug, "ig_portrait");
  const igs = igStoryUrl || cardUrl(expertSlug, "ig_story");

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>You're official. Here's your card + share images for Minneapolis.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>You're official, {first} 🎉</Heading>
          <Text style={text}>
            Your Industry Expert card is live for Basecamp Outdoor Lounge · OR Minneapolis, Thursday Aug 20, 10:30 AM to 12:30 PM. The community can find you, and brands can see who's in the room.
          </Text>

          <Section style={ctaBox}>
            <Button href={profile} style={ctaBtn}>See your card in the room</Button>
          </Section>

          <Hr style={hr} />

          <Heading style={h2}>Share images, ready to post</Heading>
          <Text style={text}>
            Three formats, sized right for each spot. Tap to download, then post wherever your people hang out.
          </Text>

          <Section>
            <Row>
              <Column style={colThird} align="center">
                <Link href={og}>
                  <Img src={og} alt="LinkedIn / Post card" style={cardImg} />
                </Link>
                <Text style={cardLabel}>LinkedIn / X Post</Text>
                <Link href={og} style={dlLink}>Download</Link>
              </Column>
              <Column style={colThird} align="center">
                <Link href={igp}>
                  <Img src={igp} alt="Instagram Post" style={cardImg} />
                </Link>
                <Text style={cardLabel}>Instagram Post</Text>
                <Link href={igp} style={dlLink}>Download</Link>
              </Column>
              <Column style={colThird} align="center">
                <Link href={igs}>
                  <Img src={igs} alt="Instagram Story" style={cardImg} />
                </Link>
                <Text style={cardLabel}>Instagram Story</Text>
                <Link href={igs} style={dlLink}>Download</Link>
              </Column>
            </Row>
          </Section>

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
            Need to tweak your card, add a company, or fix a typo? Just reply to this email and I'll take care of it.
          </Text>

          <Text style={signoff}>{'<3'} Jenna &amp; the Basecamp crew</Text>
        </Container>
      </Body>
    </Html>
  );
};

export const template = {
  component: Email,
  subject: "You're official — your Minneapolis expert card + share images",
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
const colThird = { width: "33%", verticalAlign: "top", padding: "0 6px" };
const cardImg = {
  width: "100%",
  maxWidth: "170px",
  height: "auto",
  borderRadius: "8px",
  border: "1px solid #F5E6D3",
  display: "block",
  margin: "0 auto 6px",
};
const cardLabel = { fontSize: "13px", fontWeight: 600, color: "#19363B", margin: "0 0 4px", textAlign: "center" as const };
const dlLink = { fontSize: "13px", color: "#ED7660", textDecoration: "underline" };
const signoff = { fontSize: "15px", color: "#19363B", margin: "18px 0 0" };
