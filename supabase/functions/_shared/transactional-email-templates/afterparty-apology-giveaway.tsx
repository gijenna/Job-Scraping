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
  eventPhotos?: string[];
}

const ASSET_BASE =
  "https://qpnzjcbdtybwazceggmv.supabase.co/storage/v1/object/public/email-assets/afterparty-thanks";
const KUMA_CHAIR_IMG = `${ASSET_BASE}/kuma-backtrack-chair.jpg`;
const POPFLY_LOGO = `${ASSET_BASE}/popfly-logo.png`;
const BASECAMP_MATCH_LOGO = `${ASSET_BASE}/basecamp-match-logo.png`;

const DEFAULT_PHOTOS = [
  `${ASSET_BASE}/photo-1-crowd.jpg`,
  `${ASSET_BASE}/photo-2-sunglasses.jpg`,
  `${ASSET_BASE}/photo-3-scream.jpg`,
  `${ASSET_BASE}/photo-7-chair.jpg`,
  `${ASSET_BASE}/photo-4-saps.jpg`,
  `${ASSET_BASE}/photo-8-neon.jpg`,
  `${ASSET_BASE}/photo-5-dj.jpg`,
  `${ASSET_BASE}/photo-6-outside.jpg`,
];

const fav = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

type Sponsor = { name: string; href: string; domain: string };

const SPONSORS: Sponsor[] = [
  { name: "Oakley", href: "https://www.instagram.com/oakley/", domain: "oakley.com" },
  { name: "Outside", href: "https://www.instagram.com/getoutside/", domain: "outsideinc.com" },
  { name: "YETI", href: "https://www.instagram.com/yeti/", domain: "yeti.com" },
  { name: "NEMO Equipment", href: "https://www.instagram.com/nemoequipment/", domain: "nemoequipment.com" },
  { name: "DOD Outdoors", href: "https://www.instagram.com/dodoutdoors.usa/", domain: "dodoutdoors.com" },
  { name: "Nite Ize", href: "https://www.instagram.com/niteize/", domain: "niteize.com" },
  { name: "Turtlebox", href: "https://www.instagram.com/turtleboxaudio/", domain: "turtleboxaudio.com" },
  { name: "ING Outdoors", href: "https://www.instagram.com/ingoutdoors/", domain: "ingoutdoors.com" },
  { name: "Deuter", href: "https://www.instagram.com/deuter/", domain: "deuter.com" },
  { name: "Kuma Outdoor Gear", href: "https://www.instagram.com/kumaoutdoor/", domain: "kumaoutdoorgear.com" },
  { name: "HydraPak", href: "https://www.instagram.com/hydrapak/", domain: "hydrapak.com" },
  { name: "Creepers Socks", href: "https://www.instagram.com/creeperssocks/", domain: "creeperssocks.com" },
  { name: "PAKA", href: "https://www.instagram.com/paka/", domain: "pakaapparel.com" },
  { name: "Puffin Drinkware", href: "https://www.instagram.com/puffindrinkwear/", domain: "puffindrinkware.com" },
];

const BEVYS: Sponsor[] = [
  { name: "Sap's", href: "https://www.instagram.com/sapsoriginal/", domain: "sapsoriginal.com" },
  { name: "Best Day", href: "https://www.instagram.com/bestdaybrewing", domain: "bestdaybrewing.com" },
  { name: "Telluride Brewing", href: "https://www.instagram.com/telluridebrewing", domain: "telluridebrewingco.com" },
  { name: "Westbound & Down", href: "https://www.instagram.com/westboundanddownbrewing", domain: "westboundanddown.com" },
  { name: "Brez", href: "https://www.instagram.com/drinkabrez/", domain: "drinkbrez.com" },
  { name: "Ska Brewing", href: "https://www.instagram.com/skabrewing", domain: "skabrewing.com" },
  { name: "4 Noses", href: "https://www.instagram.com/4nosesbrewing", domain: "4nosesbrewing.com" },
  { name: "Rod & Hammer", href: "https://www.instagram.com/rodandhammer", domain: "rodandhammer.com" },
];

const SponsorChip = ({ s }: { s: Sponsor }) => (
  <span style={chip}>
    <Img src={fav(s.domain)} alt="" width={18} height={18} style={chipLogo} />
    <Link href={s.href} style={chipLink}>{s.name}</Link>
  </span>
);

const Email = ({ recipientName = "there", eventPhotos }: Props) => {
  const first = (recipientName || "there").split(/\s+/)[0];
  const photos = (eventPhotos && eventPhotos.length > 0 ? eventPhotos : DEFAULT_PHOTOS).slice(0, 8);
  const row1 = photos.slice(0, 4);
  const row2 = photos.slice(4, 8);

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>An apology giveaway from Basecamp x Popfly.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Got stuck in line? 🫶</Heading>
          <Text style={text}>
            Hey {first}, we didn't see you on the rooftop last Thursday, so we're gonna assume you're one of the folks who didn't make it into the party!
          </Text>
          <Text style={text}>
            We super appreciate you coming &amp; your incredible patience and attitudes, and will make sure we expand our footprint next year.
          </Text>

          <Hr style={hr} />

          {/* CHAIR GIVEAWAY */}
          <Heading style={h2}>An apology giveaway for "The Line"</Heading>
          <Row>
            <Column style={{ width: "58%", verticalAlign: "top", paddingRight: "12px" }}>
              <Text style={text}>
                To honor and celebrate the camaraderie of "The Line," we wanted to carry on the spirit of the "ONE OF US" chant and give you an opp to nab a set of{" "}
                <Link
                  href="https://www.kumaoutdoorgear.com/store/category/chairs-17/product/backtrack-chair-18/"
                  style={inlineLink}
                >
                  KUMA Backtrack chairs
                </Link>
                .
              </Text>
              <Text style={text}>
                To win, just <strong>reply all</strong> and tell us one GOOD thing that happened in line. Maybe it's someone you met, maybe it's something you heard, maybe it's something you felt.
              </Text>
            </Column>
            <Column style={{ width: "42%", verticalAlign: "top" }} align="center">
              <Img src={KUMA_CHAIR_IMG} alt="KUMA Backtrack Chair" style={chairImg} />
            </Column>
          </Row>

          <Hr style={hr} />

          {/* PHOTOS */}
          <Heading style={h2}>A few moments from the night</Heading>
          <Text style={text}>
            Browse the full gallery here:{" "}
            <Link href="https://anthonymarz.pixieset.com/popflyweoutside/" style={inlineLink}>
              anthonymarz.pixieset.com/popflyweoutside
            </Link>
            . Need to post/share one of these bad boys? Tag{" "}
            <Link href="https://www.instagram.com/anthonymarz/" style={inlineLink}>
              @anthonymarz
            </Link>
            {" "}for credit.
          </Text>

          {row1.length > 0 && (
            <Row style={{ margin: "8px 0 6px" }}>
              {row1.map((src, i) => (
                <Column key={`r1-${i}`} style={photoCol} align="center">
                  <Img src={src} alt="After-party moment" style={photoImg} />
                </Column>
              ))}
            </Row>
          )}
          {row2.length > 0 && (
            <Row style={{ margin: "0 0 14px" }}>
              {row2.map((src, i) => (
                <Column key={`r2-${i}`} style={photoCol} align="center">
                  <Img src={src} alt="After-party moment" style={photoImg} />
                </Column>
              ))}
            </Row>
          )}

          <Hr style={hr} />

          {/* PROMO CODES */}
          <Heading style={h2}>Want to work, hire, or collab in the Outdoor Industry? 🌲</Heading>
          <Section style={promoBox}>
            {/* Basecamp Match block */}
            <Row>
              <Column style={{ width: "110px", verticalAlign: "middle", paddingRight: "14px" }} align="center">
                <Link href="https://basecampmatch.com/">
                  <Img src={BASECAMP_MATCH_LOGO} alt="Basecamp Match" width={96} height={48} style={brandLogo} />
                </Link>
              </Column>
              <Column style={{ verticalAlign: "top" }}>
                <Text style={promoIntro}>
                  Get secret early access to{" "}
                  <Link href="https://basecampjobs.com/" style={inlineLink}>
                    Basecampjobs.com
                  </Link>
                  !
                </Text>
                <Text style={promoLine}>
                  • Find your dream job with code <strong style={code}>FindYourCalling</strong>
                </Text>
                <Text style={promoLine}>
                  • Post gigs for free with code <strong style={code}>HireSmarter</strong>
                </Text>
              </Column>
            </Row>

            <Hr style={promoDivider} />

            {/* Popfly block */}
            <Row>
              <Column style={{ width: "110px", verticalAlign: "middle", paddingRight: "14px" }} align="center">
                <Link href="https://www.popfly.com/">
                  <Img src={POPFLY_LOGO} alt="Popfly" width={96} height={48} style={brandLogo} />
                </Link>
              </Column>
              <Column style={{ verticalAlign: "top" }}>
                <Text style={promoIntro}>
                  The Creator Marketing Platform Built for Adventure
                </Text>
                <Text style={promoLine}>
                  • Creators and creatives:{" "}
                  <Link href="https://www.popfly.com/creators" style={inlineLink}>
                    Join the community
                  </Link>
                  .
                </Text>
                <Text style={promoLine}>
                  • Brands and marketers:{" "}
                  <Link href="https://www.popfly.com/brands" style={inlineLink}>
                    Schedule a demo
                  </Link>
                  .
                </Text>
              </Column>
            </Row>
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
          <Section style={sponsorBox}>
            <div style={chipWrap}>
              {SPONSORS.map((s) => (
                <SponsorChip key={s.name} s={s} />
              ))}
            </div>

            <Heading style={h3}>Bevys</Heading>
            <div style={chipWrap}>
              {BEVYS.map((s) => (
                <SponsorChip key={s.name} s={s} />
              ))}
            </div>
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

          <Text style={signoff}>{'<3'} Basecamp &amp; Popfly (&amp; our friends at Oakley &amp; Outside!)</Text>
        </Container>
      </Body>
    </Html>
  );
};

export const template = {
  component: Email,
  subject: "Got stuck in line at the Oakley After-party? APOLOGY GIVEAWAY!",
  displayName: "After Party - apology giveaway (uncheckedin registrants)",
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
const h3 = { fontSize: "13px", fontWeight: 700, color: "#19363B", margin: "16px 0 8px", textTransform: "uppercase" as const, letterSpacing: "0.6px" };
const text = { fontSize: "15px", color: "#333", lineHeight: "1.6", margin: "0 0 14px" };
const inlineLink = { color: "#ED7660", textDecoration: "underline", fontWeight: 600 };
const hr = { borderColor: "#eee", margin: "22px 0" };
const photoCol = { padding: "0 3px", width: "25%", verticalAlign: "top" as const };
const photoImg = { width: "100%", maxWidth: "130px", height: "auto", borderRadius: "6px", display: "block" };
const chairImg = {
  width: "100%",
  maxWidth: "160px",
  height: "auto",
  borderRadius: "10px",
  display: "block",
  border: "3px solid #E1B624",
};
const promoBox = { backgroundColor: "#F5E6D3", borderRadius: "12px", padding: "18px 22px", margin: "8px 0 12px" };
const promoDivider = { borderColor: "#E8D5B5", margin: "14px 0" };
const promoIntro = { fontSize: "16px", color: "#19363B", fontWeight: 600, lineHeight: "1.5", margin: "0 0 10px" };
const promoLine = { fontSize: "14px", color: "#19363B", lineHeight: "1.55", margin: "0 0 8px" };
const code = {
  backgroundColor: "#19363B",
  color: "#E1B624",
  padding: "2px 8px",
  borderRadius: "4px",
  fontFamily: "monospace",
  fontSize: "13px",
};
const brandLogo = {
  height: "42px",
  width: "auto",
  maxWidth: "120px",
  opacity: 0.85,
  display: "block",
};
const sponsorBox = {
  backgroundColor: "#FAF6EF",
  borderRadius: "12px",
  padding: "16px 18px",
  margin: "6px 0 8px",
  border: "1px solid #EFE4D2",
};
const chipWrap = { lineHeight: "2.2" };
const chip = {
  display: "inline-block",
  backgroundColor: "#ffffff",
  border: "1px solid #E8DFCD",
  borderRadius: "999px",
  padding: "4px 12px 4px 6px",
  margin: "3px 4px 3px 0",
  verticalAlign: "middle" as const,
  whiteSpace: "nowrap" as const,
};
const chipLogo = {
  display: "inline-block",
  verticalAlign: "middle" as const,
  borderRadius: "999px",
  marginRight: "6px",
  backgroundColor: "#fff",
};
const chipLink = {
  color: "#19363B",
  textDecoration: "none",
  fontWeight: 600,
  fontSize: "13px",
  verticalAlign: "middle" as const,
};
const signoff = { fontSize: "15px", color: "#19363B", fontWeight: 600, margin: "22px 0 0" };
