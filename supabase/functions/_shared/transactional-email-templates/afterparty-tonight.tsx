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
            <strong>{VENUE_NAME}</strong> —{" "}
            <Link href={MAPS_URL} style={mapsLink}>
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
          {matches.length ? (
            <Section style={matchesGrid}>
              {matches.map((m, i) => (
                <Section key={i} style={miniMatch}>
                  <Text style={miniNumber}>#{m.number}</Text>
                  <Text style={miniName}>
                    {m.name}{" "}
                    <span style={miniRole}>· {m.role}</span>
                  </Text>
                </Section>
              ))}
            </Section>
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
            We've got Make Your Own Jewellery, a Recovery Zone, Aura Photography, a tubular light show, DJ Homie, live painting, and drinks courtesy of Sap's, Best Day, Strive Soda, Telluride Brewing, Westbound &amp; Down, Brez, Ska Brewing, 4 Noses &amp; Rod &amp; Hammer.
          </Text>

          <Section style={swagBox}>
            <Text style={swagText}>
              🎁 The first 50 guests get swag bags with gifts from deuter, ing outdoors, Nite Ize, hydrapak, Creepers Socks, PAKA, Puffin Drinkware, and Oakley.
            </Text>
          </Section>

          <Hr style={hr} />

          <Heading style={h2}>P.S. Raffle at 9pm</Heading>
          <Text style={text}>
            We're giving away a TON of prizes. Be on site at <strong>9pm</strong> to win:
          </Text>
          <Section style={raffleBox}>
            <Text style={raffleItem}>• Down Anorak 1.0 / Founder's Batch — @temi.earth</Text>
            <Text style={raffleItem}>• Gen 3 Speaker — @turtleboxaudio</Text>
            <Text style={raffleItem}>• 3 year membership — @ing_outdoors</Text>
            <Text style={raffleItem}>• Sugoi Chair (Olive), Glacier Bundle, Kura Soft Cooler 10, Pera Moe Fire Pit, 1Pull Dome Tent + Kiso Awning Pole, Kamaboko Tent (Small) — @dod_outdoors</Text>
            <Text style={raffleItem}>• 15 hard cooler or 24 hard cooler — @yeti</Text>
            <Text style={raffleItem}>• Stargaze Chairs — @nemoequipment</Text>
            <Text style={raffleItem}>• Backtrack Chairs — @kumaoutdoor</Text>
            <Text style={raffleItem}>• String lights — @niteize</Text>
            <Text style={raffleItem}>• Outside Days tickets — @getoutside</Text>
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
      { number: 8, name: "Patagonia (Patagonia)", role: "brand" },
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
const mapsLink = { color: "#ED7660", textDecoration: "underline", fontWeight: 600 };
const checklistBox = { backgroundColor: "#F5E6D3", borderRadius: "12px", padding: "16px 20px", margin: "8px 0 20px" };
const checklistTitle = { fontSize: "14px", fontWeight: 700, color: "#19363B", margin: "0 0 8px", textTransform: "uppercase" as const, letterSpacing: "0.5px" };
const checklistItem = { fontSize: "14px", color: "#19363B", lineHeight: "1.5", margin: "0 0 6px" };
const hr = { borderColor: "#eee", margin: "20px 0" };
const sectionLabel = { fontSize: "14px", fontWeight: 700, color: "#19363B", margin: "0 0 10px", textTransform: "uppercase" as const, letterSpacing: "0.5px" };
const matchesGrid = { margin: "0 0 16px" };
const miniMatch = {
  padding: "8px 12px",
  backgroundColor: "#fafafa",
  borderLeft: "3px solid #E1B624",
  borderRadius: "6px",
  margin: "0 0 6px",
};
const miniNumber = {
  display: "inline-block",
  fontWeight: "bold",
  color: "#E1B624",
  margin: "0 0 2px",
  fontSize: "12px",
};
const miniName = { fontSize: "14px", fontWeight: 600, color: "#19363B", margin: 0 };
const miniRole = { fontSize: "11px", color: "#888", textTransform: "uppercase" as const, letterSpacing: "0.5px", fontWeight: 400 };
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
const raffleBox = { margin: "8px 0 16px" };
const raffleItem = { fontSize: "13px", color: "#333", lineHeight: "1.5", margin: "0 0 4px" };
const signoff = { fontSize: "15px", color: "#19363B", fontWeight: 600, margin: "20px 0 0" };
const fineprint = { fontSize: "11px", color: "#999", lineHeight: "1.5", margin: "16px 0 0", fontStyle: "italic" as const };
