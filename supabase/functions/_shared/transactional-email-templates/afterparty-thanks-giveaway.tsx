/// <reference types="npm:@types/react@18.3.1" />
import * as React from "npm:react@18.3.1";
import {
  Body,
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
  eventPhotos?: string[]; // optional gallery thumbnails
}

const KUMA_CHAIR_IMG =
  "https://qpnzjcbdtybwazceggmv.supabase.co/storage/v1/object/public/email-assets/afterparty-thanks/kuma-backtrack-chair.jpg";

const PHOTO_BASE =
  "https://qpnzjcbdtybwazceggmv.supabase.co/storage/v1/object/public/email-assets/afterparty-thanks";
const DEFAULT_PHOTOS = [
  `${PHOTO_BASE}/photo-1-crowd.jpg`,
  `${PHOTO_BASE}/photo-2-sunglasses.jpg`,
  `${PHOTO_BASE}/photo-3-scream.jpg`,
  `${PHOTO_BASE}/photo-4-saps.jpg`,
  `${PHOTO_BASE}/photo-5-dj.jpg`,
  `${PHOTO_BASE}/photo-6-outside.jpg`,
];

const Email = ({ recipientName = "there", eventPhotos }: Props) => {
  const first = (recipientName || "there").split(/\s+/)[0];
  const photos = (eventPhotos && eventPhotos.length > 0 ? eventPhotos : DEFAULT_PHOTOS).slice(0, 6);
  const row1 = photos.slice(0, 3);
  const row2 = photos.slice(3, 6);

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Open meeee for gifties from Basecamp x Popfly.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>One last giveaway 🎁</Heading>
          <Text style={text}>
            Hey {first}, we looooved seeing you at our Oakley after-party! You definitely brought the hype.
          </Text>

          {/* PHOTOS */}
          <Heading style={h2}>Want to see if you're in any photos?</Heading>
          <Text style={text}>
            Browse the full gallery here:{" "}
            <Link href="https://anthonymarz.pixieset.com/popflyweoutside/" style={inlineLink}>
              anthonymarz.pixieset.com/popflyweoutside
            </Link>
            . Please credit{" "}
            <Link href="https://www.instagram.com/anthonymarz/" style={inlineLink}>
              @anthonymarz
            </Link>
            .
          </Text>

          {row1.length > 0 && (
            <Row style={{ margin: "8px 0 8px" }}>
              {row1.map((src, i) => (
                <Column key={`r1-${i}`} style={photoCol} align="center">
                  <Img src={src} alt="After-party moment" style={photoImg} />
                </Column>
              ))}
            </Row>
          )}
          {row2.length > 0 && (
            <Row style={{ margin: "0 0 16px" }}>
              {row2.map((src, i) => (
                <Column key={`r2-${i}`} style={photoCol} align="center">
                  <Img src={src} alt="After-party moment" style={photoImg} />
                </Column>
              ))}
            </Row>
          )}

          <Hr style={hr} />

          {/* CHAIR GIVEAWAY */}
          <Heading style={h2}>Want to win retro chairs?</Heading>
          <Row>
            <Column style={{ width: "55%", verticalAlign: "top", paddingRight: "12px" }}>
              <Text style={text}>
                <strong>Reply all</strong> to shoot us back a quickie email telling us what you liked about hanging out in Oakley RiNo. We're planning MORE parties, so we'll keep the good stuff.
              </Text>
              <Text style={text}>
                We'll randomly select a winner from the responses to nab a set of{" "}
                <Link
                  href="https://www.kumaoutdoorgear.com/store/category/chairs-17/product/backtrack-chair-18/"
                  style={inlineLink}
                >
                  KUMA Backtrack chairs
                </Link>
                .
              </Text>
            </Column>
            <Column style={{ width: "45%", verticalAlign: "top" }} align="center">
              <Img src={KUMA_CHAIR_IMG} alt="KUMA Backtrack Chair" style={chairImg} />
            </Column>
          </Row>

          <Hr style={hr} />

          {/* PROMO CODES */}
          <Heading style={h2}>Want to work, hire, or collab?</Heading>
          <Section style={promoBox}>
            <Text style={promoLine}>
              Get FREE early access to{" "}
              <Link href="https://basecampjobs.com/" style={inlineLink}>
                Basecampjobs.com
              </Link>{" "}
              with code <strong style={code}>FindYourCalling</strong> to find your dream job, or post gigs for free with code <strong style={code}>HireSmarter</strong>.
            </Text>
            <Text style={promoLine}>
              Check out{" "}
              <Link href="https://www.popfly.com/" style={inlineLink}>
                Popfly.com
              </Link>{" "}
              to make content collabs as an outdoor industry creator or marketer way easier.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* MUSIC + FOOD */}
          <Heading style={h2}>Big thanks to our vibes crew</Heading>
          <Text style={text}>
            🎧 Music by{" "}
            <Link href="https://www.instagram.com/p/DYAj67XlkX2/" style={inlineLink}>
              DJ Homie
            </Link>
            {" "}·{" "}
            🍕 Pizza by{" "}
            <Link href="https://www.instagram.com/joeyparmspizza/" style={inlineLink}>
              Joey Parm
            </Link>
          </Text>

          <Hr style={hr} />

          {/* SPONSORS */}
          <Heading style={h2}>Want to ensure more parties? Follow our sponsors!</Heading>
          <Text style={text}>
            <Link href="https://www.instagram.com/oakley/" style={inlineLink}>Oakley</Link>
            {" · "}
            <Link href="https://www.instagram.com/getoutside/" style={inlineLink}>Basecamp / Outside Days</Link>
            {" · "}
            <Link href="https://www.instagram.com/yeti/" style={inlineLink}>YETI</Link>
            {" · "}
            <Link href="https://www.instagram.com/nemoequipment/" style={inlineLink}>NEMO Equipment</Link>
            {" · "}
            <Link href="https://www.instagram.com/dod_outdoors/" style={inlineLink}>DOD Outdoors</Link>
            {" · "}
            <Link href="https://www.instagram.com/niteize/" style={inlineLink}>Nite Ize</Link>
            {" · "}
            <Link href="https://www.instagram.com/turtleboxaudio/" style={inlineLink}>Turtlebox</Link>
            {" · "}
            <Link href="https://www.instagram.com/ing_outdoors/" style={inlineLink}>ING Outdoors</Link>
            {" · "}
            <Link href="https://www.instagram.com/deuter/" style={inlineLink}>Deuter</Link>
            {" · "}
            <Link href="https://www.instagram.com/kumaoutdoor/" style={inlineLink}>Kuma Outdoor Gear</Link>
            {" · "}
            <Link href="https://www.instagram.com/hydrapak/" style={inlineLink}>HydraPak</Link>
            {" · "}
            <Link href="https://www.instagram.com/creeperssocks/" style={inlineLink}>Creepers Socks</Link>
            {" · "}
            <Link href="https://www.instagram.com/paka/" style={inlineLink}>PAKA</Link>
            {" · "}
            <Link href="https://www.instagram.com/puffindrinkwear/" style={inlineLink}>Puffin Drinkware</Link>
          </Text>

          <Heading style={h3}>Bevys</Heading>
          <Text style={text}>
            <Link href="https://www.instagram.com/drink_saps" style={inlineLink}>Sap's</Link>
            {" · "}
            <Link href="https://www.instagram.com/bestdaybrewing" style={inlineLink}>Best Day</Link>
            {" · "}
            <Link href="https://www.instagram.com/telluridebrewing" style={inlineLink}>Telluride Brewing</Link>
            {" · "}
            <Link href="https://www.instagram.com/westboundanddownbrewing" style={inlineLink}>Westbound &amp; Down</Link>
            {" · "}
            <Link href="https://www.instagram.com/drinkbrez" style={inlineLink}>Brez</Link>
            {" · "}
            <Link href="https://www.instagram.com/skabrewing" style={inlineLink}>Ska Brewing</Link>
            {" · "}
            <Link href="https://www.instagram.com/4nosesbrewing" style={inlineLink}>4 Noses</Link>
            {" · "}
            <Link href="https://www.instagram.com/rodandhammer" style={inlineLink}>Rod &amp; Hammer</Link>
          </Text>

          <Section style={swagBox}>
            <Text style={swagText}>
              🎁 The first 50 guests got swag bags with gifts from{" "}
              <Link href="https://www.instagram.com/deuter/" style={swagLink}>Deuter</Link>,{" "}
              <Link href="https://www.instagram.com/ing_outdoors/" style={swagLink}>ING Outdoors</Link>,{" "}
              <Link href="https://www.instagram.com/niteize/" style={swagLink}>Nite Ize</Link>,{" "}
              <Link href="https://www.instagram.com/hydrapak/" style={swagLink}>HydraPak</Link>,{" "}
              <Link href="https://www.instagram.com/creeperssocks/" style={swagLink}>Creepers Socks</Link>,{" "}
              <Link href="https://www.instagram.com/paka/" style={swagLink}>PAKA</Link>,{" "}
              <Link href="https://www.instagram.com/puffindrinkwear/" style={swagLink}>Puffin Drinkware</Link>, and{" "}
              <Link href="https://www.instagram.com/oakley/" style={swagLink}>Oakley</Link>.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* RAFFLE RECAP */}
          <Heading style={h2}>9pm Raffle winners (huge thanks to the sponsors)</Heading>
          <Section style={raffleBox}>
            <Text style={raffleItem}>• Down Anorak 1.0 / Founder's Batch from <Link href="https://www.instagram.com/temi.earth/" style={inlineLink}>@temi.earth</Link></Text>
            <Text style={raffleItem}>• Turtlebox Original Speaker from <Link href="https://www.instagram.com/turtleboxaudio/" style={inlineLink}>@turtleboxaudio</Link></Text>
            <Text style={raffleItem}>• 3 year membership from <Link href="https://www.instagram.com/ing_outdoors/" style={inlineLink}>@ing_outdoors</Link></Text>
            <Text style={raffleItem}>• From <Link href="https://www.instagram.com/dod_outdoors/" style={inlineLink}>@dod_outdoors</Link>: Sugoi Chair, Glacier Bundle, Kura Soft Cooler 11, Pera Moe Fire Pit, One Touch Dome Tent, and Kamaboko Super Tent (S)</Text>
            <Text style={raffleItem}>• Roadie 15 or Roadie 24 hard cooler from <Link href="https://www.instagram.com/yeti/" style={inlineLink}>@yeti</Link></Text>
            <Text style={raffleItem}>• Stargaze Chairs from <Link href="https://www.instagram.com/nemoequipment/" style={inlineLink}>@nemoequipment</Link></Text>
            <Text style={raffleItem}>• Backtrack Chairs from <Link href="https://www.instagram.com/kumaoutdoor/" style={inlineLink}>@kumaoutdoor</Link></Text>
            <Text style={raffleItem}>• Radiant Starlit Rechargeable Lantern + String Lights from <Link href="https://www.instagram.com/niteize/" style={inlineLink}>@niteize</Link></Text>
            <Text style={raffleItem}>• Outside Days tickets from <Link href="https://www.instagram.com/getoutside/" style={inlineLink}>@getoutside</Link></Text>
          </Section>

          <Hr style={hr} />

          {/* P.S. FOLLOW */}
          <Heading style={h2}>P.S. Next stop: Minneapolis, August 👀</Heading>
          <Text style={text}>
            Don't forget to follow{" "}
            <Link href="https://www.instagram.com/basecampoutdoorjobs/" style={inlineLink}>
              @basecampoutdoorjobs
            </Link>
            {" "}and{" "}
            <Link href="https://www.instagram.com/popflyco/" style={inlineLink}>
              @popflyco
            </Link>
            {" "}so you know when the next party drops.
          </Text>

          <Text style={signoff}>{'<3'} Jenna, Basecamp &amp; Popfly</Text>
        </Container>
      </Body>
    </Html>
  );
};

export const template = {
  component: Email,
  subject: "One last giveaway from Basecamp x Popfly! Open meeee for gifties.",
  displayName: "After Party - thank-you + KUMA chair giveaway",
  previewData: {
    recipientName: "Jenna",
    eventPhotos: [],
  },
} satisfies TemplateEntry;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "'Josefin Sans', \"Helvetica Neue\", Arial, sans-serif",
};
const container = { padding: "32px 28px", maxWidth: "600px" };
const h1 = { fontSize: "30px", fontWeight: 700, color: "#19363B", margin: "0 0 12px", lineHeight: "1.15" };
const h2 = { fontSize: "20px", fontWeight: 600, color: "#19363B", margin: "20px 0 8px" };
const h3 = { fontSize: "14px", fontWeight: 700, color: "#19363B", margin: "16px 0 6px", textTransform: "uppercase" as const, letterSpacing: "0.5px" };
const text = { fontSize: "15px", color: "#333", lineHeight: "1.6", margin: "0 0 14px" };
const inlineLink = { color: "#ED7660", textDecoration: "underline", fontWeight: 600 };
const hr = { borderColor: "#eee", margin: "22px 0" };
const photoCol = { padding: "0 4px", width: "33.33%", verticalAlign: "top" as const };
const photoImg = { width: "100%", height: "auto", borderRadius: "8px", display: "block" };
const chairImg = {
  width: "100%",
  maxWidth: "180px",
  height: "auto",
  borderRadius: "10px",
  display: "block",
  border: "3px solid #E1B624",
};
const promoBox = { backgroundColor: "#F5E6D3", borderRadius: "12px", padding: "16px 20px", margin: "8px 0 12px" };
const promoLine = { fontSize: "14px", color: "#19363B", lineHeight: "1.55", margin: "0 0 10px" };
const code = {
  backgroundColor: "#19363B",
  color: "#E1B624",
  padding: "2px 8px",
  borderRadius: "4px",
  fontFamily: "monospace",
  fontSize: "13px",
};
const swagBox = { backgroundColor: "#19363B", borderRadius: "12px", padding: "16px 20px", margin: "16px 0" };
const swagText = { fontSize: "14px", color: "#F5E6D3", lineHeight: "1.6", margin: 0 };
const swagLink = { color: "#ED7660", textDecoration: "underline", fontWeight: 600 };
const raffleBox = { margin: "8px 0 16px" };
const raffleItem = { fontSize: "13px", color: "#333", lineHeight: "1.55", margin: "0 0 4px" };
const signoff = { fontSize: "15px", color: "#19363B", fontWeight: 600, margin: "22px 0 0" };
