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

interface SponsorBrand {
  name: string;
  website_url?: string | null;
  logo_url?: string | null;
}
interface ExpertSpotlight {
  full_name?: string | null;
  job_title?: string | null;
  current_company?: string | null;
  photo_url?: string | null;
  website_url?: string | null;
}
interface Props {
  recipientName?: string;
  eventPhotos?: string[];
  sponsors?: SponsorBrand[];
  edgesFirst?: ExpertSpotlight;
}

const ASSET_BASE =
  "https://qpnzjcbdtybwazceggmv.supabase.co/storage/v1/object/public/email-assets";
const PHOTO_BASE = `${ASSET_BASE}/outsidedays26-thanks`;
const KUMA_CHAIR_IMG = `${ASSET_BASE}/afterparty-thanks/kuma-backtrack-chair.jpg`;
const BASECAMP_MATCH_LOGO = `${ASSET_BASE}/afterparty-thanks/basecamp-match-logo.png`;

const PIXIESET_URL = "https://anthonymarz.pixieset.com/basecampoutdooroutsidedays/";
const FEEDBACK_FORM = "https://basecampoutdoor.typeform.com/to/oknPzBB6";
const CONNECT_URL = "https://basecampoutdoorevents.com/outsidedays26/connect";

const DEFAULT_PHOTOS = [
  `${PHOTO_BASE}/photo-6-floor.jpg`,
  `${PHOTO_BASE}/photo-7-laugh.jpg`,
  `${PHOTO_BASE}/photo-5-rei.jpg`,
  `${PHOTO_BASE}/photo-2-outside-mag.jpg`,
  `${PHOTO_BASE}/photo-8-chair.jpg`,
  `${PHOTO_BASE}/photo-4-drone.jpg`,
  `${PHOTO_BASE}/photo-3-keychain.jpg`,
  `${PHOTO_BASE}/photo-1-stickers.jpg`,
];

const DEFAULT_EDGES: ExpertSpotlight = {
  full_name: "Kelly Bleck",
  job_title: "Owner & Fullstack Developer",
  current_company: "Edges First",
  photo_url:
    "https://qpnzjcbdtybwazceggmv.supabase.co/storage/v1/object/public/email-assets/expert-photos/expert-1775756018088.JPG",
  website_url: "https://edgesfirst.co/",
};

const VIBES: SponsorBrand[] = [
  { name: "Outside", website_url: "https://www.outsideinc.com/" },
  { name: "Sap's", website_url: "https://sapsoriginal.com/" },
  { name: "Edges First", website_url: "https://edgesfirst.co/" },
  { name: "Best Day", website_url: "https://bestdaybrewing.com/" },
  { name: "NEMO Equipment", website_url: "https://www.nemoequipment.com/" },
];

const fav = (url?: string | null): string | undefined => {
  if (!url) return undefined;
  try {
    const withProto = url.startsWith("http") ? url : `https://${url}`;
    const host = new URL(withProto).hostname.replace(/^www\./, "");
    return `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
  } catch {
    return undefined;
  }
};

const normalizeUrl = (u?: string | null): string | undefined => {
  if (!u) return undefined;
  const t = u.trim();
  if (!t) return undefined;
  return t.startsWith("http") ? t : `https://${t}`;
};

const SponsorChip = ({ s }: { s: SponsorBrand }) => {
  const href = normalizeUrl(s.website_url);
  const logo = s.logo_url || fav(s.website_url);
  const inner = (
    <>
      {logo && <Img src={logo} alt="" width={18} height={18} style={chipLogo} />}
      <span style={chipLinkText}>{s.name}</span>
    </>
  );
  return (
    <span style={chip}>
      {href ? (
        <Link href={href} style={chipLink}>
          {inner}
        </Link>
      ) : (
        inner
      )}
    </span>
  );
};

const Email = ({
  recipientName = "there",
  eventPhotos,
  sponsors,
  edgesFirst,
}: Props) => {
  const first = (recipientName || "there").split(/\s+/)[0];
  const photos = (eventPhotos && eventPhotos.length > 0 ? eventPhotos : DEFAULT_PHOTOS).slice(0, 8);
  const row1 = photos.slice(0, 4);
  const row2 = photos.slice(4, 8);
  const brands = (sponsors && sponsors.length > 0 ? sponsors : []) as SponsorBrand[];
  const edges = { ...DEFAULT_EDGES, ...(edgesFirst || {}) };

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Win a set of KUMA chairs + see the OutsideDays Career Fair recap.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thanks for showing up 🌲</Heading>
          <Text style={text}>
            Hey {first}, we're so glad you joined us at the OutsideDays Career Fair. The energy in that room was unreal, and a huge part of that was you. Below are a few ways to keep the momentum going.
          </Text>

          {/* CHAIR GIVEAWAY (now feedback-driven) */}
          <Section style={giveawayBox}>
            <Row>
              <Column style={{ width: "58%", verticalAlign: "top", paddingRight: "12px" }}>
                <Heading style={h2NoTop}>Win a set of retro chairs 👇</Heading>
                <Text style={text}>
                  We'd love your honest take on the day. Answer our quick 2-question feedback survey and you'll be entered to win a set of{" "}
                  <Link
                    href="https://www.kumaoutdoorgear.com/store/category/chairs-17/product/backtrack-chair-18/"
                    style={inlineLink}
                  >
                    KUMA Backtrack chairs
                  </Link>
                  . Two questions, that's it.
                </Text>
                <Button href={FEEDBACK_FORM} style={ctaBtn}>
                  Take the 2-question survey
                </Button>
              </Column>
              <Column style={{ width: "42%", verticalAlign: "top" }} align="center">
                <Img src={KUMA_CHAIR_IMG} alt="KUMA Backtrack Chair" style={chairImg} />
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* CONNECT DASHBOARD REMINDER */}
          <Heading style={h2}>Keep the conversations going 💬</Heading>
          <Text style={text}>
            Head to your Connect dashboard to send notes to the industry experts and recruiters you chatted with at the fair, and make sure your profile is set up so you come up in employer searches.
          </Text>
          <Button href={CONNECT_URL} style={ctaBtnTeal}>
            Open your Connect dashboard
          </Button>

          <Hr style={hr} />

          {/* WORK / HIRE / COLLAB */}
          <Heading style={h2}>Want to work, hire, or collab in the Outdoor Industry? 🏔️</Heading>
          <Section style={promoBox}>
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
                  · Find your dream job with code <strong style={code}>FindYourCalling</strong>
                </Text>
                <Text style={promoLine}>
                  · Post gigs for free with code <strong style={code}>HireSmarter</strong>
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* EDGES FIRST SPOTLIGHT */}
          <Heading style={h2}>Need a website in the next year? Meet Edges First 🛠️</Heading>
          <Section style={expertCard}>
            <Row>
              <Column style={{ width: "110px", verticalAlign: "top", paddingRight: "14px" }} align="center">
                {edges.photo_url && (
                  <Img src={edges.photo_url} alt={edges.full_name || "Edges First"} style={expertPhoto} />
                )}
              </Column>
              <Column style={{ verticalAlign: "top" }}>
                <Text style={expertName}>{edges.full_name}</Text>
                <Text style={expertRole}>
                  {edges.job_title}{edges.job_title && edges.current_company ? " · " : ""}{edges.current_company}
                </Text>
                <Text style={expertBlurb}>
                  Kelly built our site and a bunch of others you've probably visited. If you're planning a refresh, a launch, or just need someone who actually picks up the phone, start with her. She'll tell you the truth about what you need (and what you don't).
                </Text>
                {edges.website_url && (
                  <Button href={normalizeUrl(edges.website_url)!} style={ctaBtnCoral}>
                    Visit Edges First
                  </Button>
                )}
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* PHOTOS */}
          <Heading style={h2}>See if you made the gallery 📸</Heading>
          <Text style={text}>
            Browse the full set here:{" "}
            <Link href={PIXIESET_URL} style={inlineLink}>
              anthonymarz.pixieset.com/basecampoutdooroutsidedays
            </Link>
            . Posting one? Tag{" "}
            <Link href="https://www.instagram.com/anthonymarz/" style={inlineLink}>
              @anthonymarz
            </Link>
            {" "}so he gets the credit.
          </Text>

          {row1.length > 0 && (
            <Row style={{ margin: "8px 0 6px" }}>
              {row1.map((src, i) => (
                <Column key={`r1-${i}`} style={photoCol} align="center">
                  <Img src={src} alt="OutsideDays Career Fair moment" style={photoImg} />
                </Column>
              ))}
            </Row>
          )}
          {row2.length > 0 && (
            <Row style={{ margin: "0 0 14px" }}>
              {row2.map((src, i) => (
                <Column key={`r2-${i}`} style={photoCol} align="center">
                  <Img src={src} alt="OutsideDays Career Fair moment" style={photoImg} />
                </Column>
              ))}
            </Row>
          )}

          <Hr style={hr} />

          {/* VIBES */}
          <Heading style={h2}>Big thanks to our vibes crew</Heading>
          <Section style={sponsorBox}>
            <div style={chipWrap}>
              {VIBES.map((s) => (
                <SponsorChip key={s.name} s={s} />
              ))}
            </div>
          </Section>

          <Hr style={hr} />

          {/* OUTSIDE THANK YOU */}
          <Heading style={h2}>And a HUGE thank you to Outside 💛</Heading>
          <Text style={text}>
            <Link href="https://www.outsideinc.com/" style={inlineLink}>Outside</Link>{" "}
            hosted the whole career fair at the U of Outside and made sure it stayed free for every attendee and every brand. None of this happens without them.
          </Text>

          <Hr style={hr} />

          {/* CAREER FAIR SPONSORS */}
          {brands.length > 0 && (
            <>
              <Heading style={h2}>Follow the brands you met at the fair 🏕️</Heading>
              <Text style={text}>
                Every booth on the floor, in one place. Click any logo to dig in to their careers page or site.
              </Text>
              <Section style={sponsorBox}>
                <div style={chipWrap}>
                  {brands.map((s) => (
                    <SponsorChip key={s.name} s={s} />
                  ))}
                </div>
              </Section>
              <Hr style={hr} />
            </>
          )}

          {/* SIGN OFF */}
          <Heading style={h2}>P.S. We're already plotting the next one 👀</Heading>
          <Text style={text}>
            Follow{" "}
            <Link href="https://www.instagram.com/basecampoutdoorjobs/" style={inlineLink}>
              @basecampoutdoorjobs
            </Link>
            {" "}so you know when and where we pop up next.
          </Text>

          <Text style={signoff}>{'<3'} Jenna &amp; the Basecamp crew</Text>
        </Container>
      </Body>
    </Html>
  );
};

export const template = {
  component: Email,
  subject: "Win KUMA chairs + your OutsideDays Career Fair recap",
  displayName: "OutsideDays26 - thank-you + KUMA chair giveaway",
  previewData: {
    recipientName: "Jenna",
    eventPhotos: [],
    sponsors: [],
    edgesFirst: DEFAULT_EDGES,
  },
} satisfies TemplateEntry;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "'Josefin Sans', \"Helvetica Neue\", Arial, sans-serif",
};
const container = { padding: "32px 28px", maxWidth: "600px" };
const h1 = { fontSize: "30px", fontWeight: 700, color: "#19363B", margin: "0 0 12px", lineHeight: "1.15" };
const h2 = { fontSize: "20px", fontWeight: 600, color: "#19363B", margin: "20px 0 8px" };
const h2NoTop = { fontSize: "20px", fontWeight: 600, color: "#19363B", margin: "0 0 8px" };
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
const giveawayBox = {
  backgroundColor: "#FFF8E1",
  borderRadius: "12px",
  padding: "18px 20px",
  margin: "10px 0 8px",
  border: "1px solid #F2E2A8",
};
const ctaBtn = {
  backgroundColor: "#E1B624",
  color: "#19363B",
  padding: "11px 18px",
  borderRadius: "8px",
  fontWeight: 700,
  fontSize: "14px",
  textDecoration: "none",
  display: "inline-block",
};
const ctaBtnTeal = {
  backgroundColor: "#19363B",
  color: "#F5E6D3",
  padding: "11px 18px",
  borderRadius: "8px",
  fontWeight: 700,
  fontSize: "14px",
  textDecoration: "none",
  display: "inline-block",
};
const ctaBtnCoral = {
  backgroundColor: "#ED7660",
  color: "#ffffff",
  padding: "10px 16px",
  borderRadius: "8px",
  fontWeight: 700,
  fontSize: "13px",
  textDecoration: "none",
  display: "inline-block",
  marginTop: "6px",
};
const promoBox = { backgroundColor: "#F5E6D3", borderRadius: "12px", padding: "18px 22px", margin: "8px 0 12px" };
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
const brandLogo = { height: "42px", width: "auto", maxWidth: "120px", opacity: 0.85, display: "block" };
const expertCard = {
  backgroundColor: "#F5E6D3",
  borderRadius: "12px",
  padding: "18px 20px",
  margin: "8px 0 12px",
  border: "1px solid #E8D5B5",
};
const expertPhoto = {
  width: "96px",
  height: "96px",
  borderRadius: "999px",
  objectFit: "cover" as const,
  display: "block",
  border: "3px solid #ED7660",
};
const expertName = { fontSize: "18px", fontWeight: 700, color: "#19363B", margin: "0 0 2px" };
const expertRole = { fontSize: "13px", fontWeight: 500, color: "#19363B", opacity: 0.75, margin: "0 0 10px" };
const expertBlurb = { fontSize: "14px", color: "#19363B", lineHeight: "1.55", margin: "0 0 10px" };
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
const chipLinkText = {
  color: "#19363B",
  fontWeight: 600,
  fontSize: "13px",
  verticalAlign: "middle" as const,
};
const signoff = { fontSize: "15px", color: "#19363B", fontWeight: 600, margin: "22px 0 0" };
