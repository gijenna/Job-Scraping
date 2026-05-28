/// <reference types="npm:@types/react@18.3.1" />
import * as React from "npm:react@18.3.1";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Row,
  Column,
  Text,
  Button,
  Hr,
} from "npm:@react-email/components@0.0.22";
import type { TemplateEntry } from "./registry.ts";

interface MatchItem {
  number: number;
  name: string;
  role: string;
}

interface AfterPartyTonightProps {
  recipientName?: string;
  attendeeNumber?: number;
  matches?: MatchItem[];
  guestsUrl?: string;
}

const VENUE_NAME = "Oakley RiNo";
const VENUE_ADDR = "2660 Walnut St Ste #3, Denver, CO 80205";
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Oakley+RiNo+2660+Walnut+St+Denver+CO+80205";

const AfterPartyTonightEmail = ({
  recipientName = "there",
  attendeeNumber,
  matches = [],
  guestsUrl = "https://basecampoutdoorevents.com/guests",
}: AfterPartyTonightProps) => {
  const first = (recipientName || "there").split(/\s+/)[0];
  const numLabel = attendeeNumber ? `#${attendeeNumber}` : "your number";
  const top5 = matches.slice(0, 5);

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>See you tonight at Oakley RiNo. Doors 7:30pm.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Hey {first} 👋</Heading>
          {attendeeNumber ? (
            <Text style={numberBadge}>You're attendee #{attendeeNumber}</Text>
          ) : null}

          <Text style={text}>
            The after-party starts at <strong>7:30pm tonight</strong> at{" "}
            <strong>{VENUE_NAME}</strong>,{" "}
            <Link href={MAPS_URL} style={inlineLink}>
              {VENUE_ADDR}
            </Link>
            .
          </Text>

          <Section style={checklistBox}>
            <Text style={checklistTitle}>When you get here:</Text>
            <Text style={checklistItem}>
              • Tell Popfly your <strong>Name &amp; {numLabel}</strong> to check in
            </Text>
            <Text style={checklistItem}>
              • Show your ID if you plan to drink alcohol
            </Text>
            <Text style={checklistItem}>
              • Write your name &amp; number on a nametag
            </Text>
            <Text style={checklistItem}>
              • Head into the party, look for your matches, grab some pizza, grab a drink, or check out an Oakley demo
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={sectionLabel}>Your matches are:</Text>
          {top5.length ? (
            <Row style={{ margin: "0 0 14px" }}>
              {top5.map((m, i) => (
                <Column key={i} style={pillCol} align="center">
                  <Text style={pillNumber}>#{m.number}</Text>
                  <Text style={pillName}>{(m.name || "").split(/\s+/)[0]}</Text>
                </Column>
              ))}
            </Row>
          ) : (
            <Text style={muted}>
              Look for your name tag matches at the door, and ask the Basecamp team to point you to who you should meet.
            </Text>
          )}

          <Button href={guestsUrl} style={button}>
            See the full guest list →
          </Button>

          <Hr style={hr} />

          <Heading style={h2}>Don't feel like networking?</Heading>
          <Text style={text}>
            We've got Make Your Own Jewellery, a Recovery Zone, Aura Photography, a tubular light show, DJ Homie, live painting, and drinks courtesy of{" "}
            <Link href="https://www.sapsoriginal.com/" style={inlineLink}>Sap's</Link>,{" "}
            <Link href="https://bestdaybrewing.com/" style={inlineLink}>Best Day</Link>,{" "}
            <Link href="https://strivesoda.com/" style={inlineLink}>Strive Soda</Link>,{" "}
            <Link href="https://www.telluridebrewingco.com/" style={inlineLink}>Telluride Brewing</Link>,{" "}
            <Link href="https://www.westboundanddown.com/" style={inlineLink}>Westbound &amp; Down</Link>,{" "}
            <Link href="https://www.drinkbrez.com/" style={inlineLink}>Brez</Link>,{" "}
            <Link href="https://www.skabrewing.com/" style={inlineLink}>Ska Brewing</Link>,{" "}
            <Link href="https://www.4nosesbrewing.com/" style={inlineLink}>4 Noses</Link> &amp;{" "}
            <Link href="https://www.rodandhammer.com/" style={inlineLink}>Rod &amp; Hammer</Link>.
          </Text>

          <Section style={swagBox}>
            <Text style={swagText}>
              🎁 The first 50 guests get swag bags with gifts from{" "}
              <Link href="https://www.deuter.com/" style={swagLink}>Deuter</Link>,{" "}
              <Link href="https://ingoutdoors.com/" style={swagLink}>ING Outdoors</Link>,{" "}
              <Link href="https://niteize.com/" style={swagLink}>Nite Ize</Link>,{" "}
              <Link href="https://hydrapak.com/" style={swagLink}>HydraPak</Link>,{" "}
              <Link href="https://creeperssocks.com/" style={swagLink}>Creepers Socks</Link>,{" "}
              <Link href="https://www.pakaapparel.com/" style={swagLink}>PAKA</Link>,{" "}
              <Link href="https://puffindrinkware.com/" style={swagLink}>Puffin Drinkware</Link>, and{" "}
              <Link href="https://www.oakley.com/" style={swagLink}>Oakley</Link>.
            </Text>
          </Section>

          <Hr style={hr} />

          <Heading style={h2}>P.S. Raffle at 9pm</Heading>
          <Text style={text}>
            We're giving away a TON of prizes. Be on site at <strong>9pm</strong> to win:
          </Text>
          <Section style={raffleBox}>
            <Text style={raffleItem}>
              •{" "}
              <Link href="https://temiearth.com/products/the-anorak" style={inlineLink}>Down Anorak 1.0 / Founder's Batch</Link>
              {" "}from{" "}
              <Link href="https://www.instagram.com/temi.earth/" style={inlineLink}>@temi.earth</Link>
            </Text>
            <Text style={raffleItem}>
              •{" "}
              <Link href="https://turtleboxaudio.com/products/turtlebox-speaker-gen-3" style={inlineLink}>Gen 3 Speaker</Link>
              {" "}from{" "}
              <Link href="https://www.instagram.com/turtleboxaudio/" style={inlineLink}>@turtleboxaudio</Link>
            </Text>
            <Text style={raffleItem}>
              •{" "}
              <Link href="https://www.ingoutdoors.com/products/3-year-membership" style={inlineLink}>3 year membership</Link>
              {" "}from{" "}
              <Link href="https://www.instagram.com/ing_outdoors/" style={inlineLink}>@ing_outdoors</Link>
            </Text>
            <Text style={raffleItem}>
              •{" "}
              <Link href="https://dodoutdoors.com/collections/gear" style={inlineLink}>Sugoi Chair (Olive), Glacier Bundle, Kura Soft Cooler 10, Pera Moe Fire Pit, 1Pull Dome Tent + Kiso Awning Pole, Kamaboko Tent (Small)</Link>
              {" "}from{" "}
              <Link href="https://www.instagram.com/dod_outdoors/" style={inlineLink}>@dod_outdoors</Link>
            </Text>
            <Text style={raffleItem}>
              •{" "}
              <Link href="https://www.yeti.com/coolers/hard-coolers" style={inlineLink}>15 hard cooler or 24 hard cooler</Link>
              {" "}from{" "}
              <Link href="https://www.instagram.com/yeti/" style={inlineLink}>@yeti</Link>
            </Text>
            <Text style={raffleItem}>
              •{" "}
              <Link href="https://www.nemoequipment.com/collections/stargaze" style={inlineLink}>Stargaze Chairs</Link>
              {" "}from{" "}
              <Link href="https://www.instagram.com/nemoequipment/" style={inlineLink}>@nemoequipment</Link>
            </Text>
            <Text style={raffleItem}>
              •{" "}
              <Link href="https://www.kumaoutdoorgear.com/product/backtrack-chair-74" style={inlineLink}>Backtrack Chairs</Link>
              {" "}from{" "}
              <Link href="https://www.instagram.com/kumaoutdoor/" style={inlineLink}>@kumaoutdoor</Link>
            </Text>
            <Text style={raffleItem}>
              •{" "}
              <Link href="https://niteize.com/radiant-shine-line-multi-color-led-string-lights" style={inlineLink}>String lights</Link>
              {" "}from{" "}
              <Link href="https://www.instagram.com/niteize/" style={inlineLink}>@niteize</Link>
            </Text>
            <Text style={raffleItem}>
              •{" "}
              <Link href="https://www.outsideonline.com/outside-days-tickets" style={inlineLink}>Outside Days tickets</Link>
              {" "}from{" "}
              <Link href="https://www.instagram.com/getoutside/" style={inlineLink}>@getoutside</Link>
            </Text>
          </Section>

          <Text style={signoff}>{'<3'} Oakley, Popfly, Basecamp, &amp; Outside</Text>

          <Text style={fineprint}>
            By registering for this event, you're cool with Oakley shooting you an email about other fun stuff they're doing in store, and with your likeness being shared if you're captured in a photo at the event.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export const template = {
  component: AfterPartyTonightEmail,
  subject: (data: Record<string, any>) => {
    const num = data?.attendeeNumber;
    return num
      ? `See you tonight @ Oakley RiNo! (Your # is ${num} ;))`
      : `See you tonight @ Oakley RiNo!`;
  },
  displayName: "After Party - tonight reminder (9am)",
  previewData: {
    recipientName: "Jenna",
    attendeeNumber: 36,
    guestsUrl: "https://basecampoutdoorevents.com/guests?slug=jenna",
    matches: [
      { number: 17, name: "Alex Rivera", role: "brand" },
      { number: 23, name: "Sam Chen", role: "creator" },
      { number: 8, name: "Patagonia", role: "brand" },
      { number: 41, name: "Jordan Lee", role: "creator" },
      { number: 12, name: "Maya Patel", role: "creator" },
    ],
  },
} satisfies TemplateEntry;

const main = { backgroundColor: "#ffffff", fontFamily: "'Josefin Sans', \"Helvetica Neue\", Arial, sans-serif" };
const container = { padding: "32px 28px", maxWidth: "560px" };
const h1 = { fontSize: "28px", fontWeight: "bold", color: "#19363B", margin: "0 0 8px" };
const h2 = { fontSize: "20px", fontWeight: 600, color: "#19363B", margin: "20px 0 8px" };
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
const text = { fontSize: "15px", color: "#333", lineHeight: "1.55", margin: "0 0 16px" };
const muted = { fontSize: "14px", color: "#777", lineHeight: "1.5", margin: "0 0 16px", fontStyle: "italic" as const };
const inlineLink = { color: "#ED7660", textDecoration: "underline", fontWeight: 600 };
const checklistBox = { backgroundColor: "#F5E6D3", borderRadius: "12px", padding: "16px 20px", margin: "8px 0 20px" };
const checklistTitle = { fontSize: "14px", fontWeight: 700, color: "#19363B", margin: "0 0 8px", textTransform: "uppercase" as const, letterSpacing: "0.5px" };
const checklistItem = { fontSize: "14px", color: "#19363B", lineHeight: "1.5", margin: "0 0 6px" };
const hr = { borderColor: "#eee", margin: "20px 0" };
const sectionLabel = { fontSize: "14px", fontWeight: 700, color: "#19363B", margin: "0 0 10px", textTransform: "uppercase" as const, letterSpacing: "0.5px" };
const pillCol = {
  padding: "8px 4px",
  backgroundColor: "#F5E6D3",
  borderTop: "3px solid #E1B624",
  borderRadius: "6px",
  width: "20%",
  verticalAlign: "top" as const,
};
const pillNumber = {
  fontWeight: 700,
  color: "#E1B624",
  margin: "0 0 2px",
  fontSize: "13px",
  textAlign: "center" as const,
};
const pillName = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#19363B",
  margin: 0,
  textAlign: "center" as const,
  lineHeight: "1.2",
};
const button = {
  backgroundColor: "#ED7660",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "8px",
  textDecoration: "none",
  fontSize: "15px",
  fontWeight: "bold",
  display: "inline-block",
  margin: "8px 0 4px",
};
const swagBox = { backgroundColor: "#19363B", borderRadius: "12px", padding: "16px 20px", margin: "12px 0" };
const swagText = { fontSize: "14px", color: "#F5E6D3", lineHeight: "1.55", margin: 0 };
const swagLink = { color: "#ED7660", textDecoration: "underline", fontWeight: 600 };
const raffleBox = { margin: "8px 0 16px" };
const raffleItem = { fontSize: "13px", color: "#333", lineHeight: "1.5", margin: "0 0 4px" };
const signoff = { fontSize: "15px", color: "#19363B", fontWeight: 600, margin: "20px 0 0" };
const fineprint = { fontSize: "11px", color: "#999", lineHeight: "1.5", margin: "16px 0 0", fontStyle: "italic" as const };
