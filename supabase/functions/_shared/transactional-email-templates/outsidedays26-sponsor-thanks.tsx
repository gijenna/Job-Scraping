/// <reference types="npm:@types/react@18.3.1" />
import * as React from "npm:react@18.3.1";
import {
  Body,
  Button,
  Column,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Hr,
} from "npm:@react-email/components@0.0.22";
import type { TemplateEntry } from "./registry.ts";

interface CompanyPhoto {
  url: string;
  alt?: string;
}

interface Props {
  recipientName?: string;
  companyName?: string;
  companyFolderUrl?: string;
  customGreeting?: string;
  customIntro?: string;
  companyPhotos?: CompanyPhoto[];
  companyLabel?: string;
  companyAlbumUrl?: string;
  companyAlbumLinkText?: string;
}

const ASSET_BASE =
  "https://qpnzjcbdtybwazceggmv.supabase.co/storage/v1/object/public/email-assets";
const BASECAMP_MATCH_LOGO = `${ASSET_BASE}/afterparty-thanks/basecamp-match-logo.png`;
const PHOTO_001 = `${ASSET_BASE}/outsidedays26-sponsor%2FAnthonyMarz_Basecamp-001.jpg`;
const PHOTO_043 = `${ASSET_BASE}/outsidedays26-sponsor%2FAnthonyMarz_Basecamp-043.jpg`;
const PHOTO_068 = `${ASSET_BASE}/outsidedays26-sponsor%2FAnthonyMarz_Basecamp-068.jpg`;
const PHOTO_073 = `${ASSET_BASE}/outsidedays26-sponsor%2FAnthonyMarz_Basecamp-073.jpg`;
const PHOTO_075 = `${ASSET_BASE}/outsidedays26-sponsor%2FAnthonyMarz_Basecamp-075.jpg`;
const PHOTO_179 = `${ASSET_BASE}/outsidedays26-sponsor%2FAnthonyMarz_Basecamp-179.jpg`;
const PHOTO_9060 = `${ASSET_BASE}/outsidedays26-sponsor%2FIMG_9060.jpg`;

const PIXIESET_URL = "https://anthonymarz.pixieset.com/basecampoutdooroutsidedays/";
const DASHBOARD_URL = "https://basecampoutdoorevents.com/outsidedays26/dashboard";
const JOBS_URL = "https://basecampjobs.com/home-employer";
const OPTIN_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1XvRvbPKqW9H1W4lx73TnqB9HHa9SF532d28S5DGOPQQ/edit?gid=0#gid=0";

const Email = ({
  recipientName = "there",
  companyName,
  companyFolderUrl,
}: Props) => {
  const first = (recipientName || "there").split(/\s+/)[0];

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <Font
          fontFamily="Josefin Sans"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/josefinsans/v34/Qw3PZQNVED7rKGKxtqIqX5E-AVSJrOCfjY46_DjQXME.ttf",
            format: "truetype",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Josefin Sans"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/josefinsans/v34/Qw3PZQNVED7rKGKxtqIqX5E-AVSJrOCfjY46_ObXXME.ttf",
            format: "truetype",
          }}
          fontWeight={600}
          fontStyle="normal"
        />
        <Font
          fontFamily="Josefin Sans"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/josefinsans/v34/Qw3PZQNVED7rKGKxtqIqX5E-AVSJrOCfjY46_N_XXME.ttf",
            format: "truetype",
          }}
          fontWeight={700}
          fontStyle="normal"
        />
      </Head>
      <Preview>Your GATHER Career Fair recap, photos, and free job posts on Basecampjobs.com.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={heroBannerWrap}>
            <Img
              src={PHOTO_043}
              alt="We're Hiring sign at GATHER"
              width={544}
              style={heroBanner}
            />
          </Section>

          <Heading style={h1}>Thanks for showing up for GATHER 🌲</Heading>
          <Text style={text}>
            Hi {first},
          </Text>
          <Text style={text}>
            We are thrilled you joined us for this year's GATHER Career Fair with Outside Days. We welcomed just over 500 community members to this year's event. You put in <em>work</em>.
          </Text>

          <Hr style={hr} />

          {/* PHOTOS */}
          <Heading style={h2}>Photos of your team 📸</Heading>
          <Text style={text}>
            We attached a few of our favorite shots of {companyName ? <strong>{companyName}</strong> : "your team"} to this email. You can find the rest here:
          </Text>
          <Section style={photoGrid}>
            <Img src={PHOTO_001} alt="Basecamp Outdoor stickers scattered on a table" width={104} height={130} style={photoTilePortrait} />
            <Img src={PHOTO_068} alt="Wide overhead view of the GATHER Career Fair floor" width={104} height={130} style={photoTilePortrait} />
            <Img src={PHOTO_073} alt="Attendee reading Outside magazine at the event" width={104} height={130} style={photoTilePortrait} />
            <Img src={PHOTO_9060} alt="Two attendees laughing during a conversation at GATHER" width={104} height={130} style={photoTilePortrait} />
            <Img src={PHOTO_179} alt="REI rep smiling at her booth at GATHER" width={104} height={130} style={photoTilePortrait} />
          </Section>
          <Text style={text}>
            {companyFolderUrl ? (
              <>
                · <Link href={companyFolderUrl} style={inlineLink}>Your company folder</Link><br />
              </>
            ) : null}
            · <Link href={PIXIESET_URL} style={inlineLink}>All event photos</Link>
          </Text>
          <Text style={smallText}>
            If you share these anywhere (please do!), credit{" "}
            <Link href="https://www.instagram.com/anthonymarz/" style={inlineLink}>@anthonymarz</Link>
            {" "}and{" "}
            <Link href="https://www.instagram.com/basecampoutdoorjobs/" style={inlineLink}>@basecampoutdoorjobs</Link>.
          </Text>

          <Hr style={hr} />

          {/* BASECAMP JOBS PROMO */}
          <Section style={promoBox}>
            <Img
              src={BASECAMP_MATCH_LOGO}
              alt="Basecamp Match"
              width={120}
              height={56}
              style={brandLogo}
            />
            <Heading style={h2NoTop}>
              Jobs with pay details are FREE to post on Basecampjobs.com
            </Heading>
            <Text style={text}>
              Our new job board is easy to use and free when you help us close the wage gap by including a pay range on every role. As a thanks for participating in GATHER, you get early access plus FREE candidate match boosts (normally $400/job).
            </Text>
            <Text style={text}>
              If you have not made an employer account yet, enter code <strong style={code}>HireSmarter</strong> on the employer landing page.
            </Text>
            <Button href={JOBS_URL} style={ctaBtn}>
              Post a job on Basecampjobs.com
            </Button>
          </Section>

          <Hr style={hr} />

          {/* CONNECT DASHBOARD */}
          <Heading style={h2}>Follow up with candidates 💬</Heading>
          <Section style={connectSection}>
            <Row>
              <Column style={connectPhotoCol}>
                <Img
                  src={PHOTO_075}
                  alt="GATHER attendee holding event materials"
                  width={180}
                  style={connectPhoto}
                />
              </Column>
              <Column style={connectTextCol}>
                <Text style={{ ...text, margin: "0 0 12px" }}>
                  Log in to your Connect dashboard, the tool we built for this event, to see and message every candidate who visited your table or sent your team a note. You can also search and filter all 554 registered candidates.
                </Text>
                <Button href={DASHBOARD_URL} style={ctaBtnTeal}>
                  Open your Connect dashboard
                </Button>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* OPT-IN LIST */}
          <Heading style={h2}>One-time email to ~1,100 opted-in registrants 📨</Heading>
          <Text style={text}>
            You can send <strong>one</strong> email to every registrant who opted in. Request access to the list here:
          </Text>
          <Text style={text}>
            <Link href={OPTIN_SHEET_URL} style={inlineLink}>
              Opted-in registrant list (request access)
            </Link>
          </Text>
          <Text style={smallText}>
            A few ground rules: you can invite them to sign up for your email list in your one-time send, but you cannot add them to it.
          </Text>

          <Hr style={hr} />

          <Text style={signoff}>
            Thanks again for making GATHER what it is.<br />
            {'<3'} Jenna &amp; the Basecamp crew
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export const template = {
  component: Email,
  subject: "Your GATHER Career Fair recap + free job posts on Basecampjobs.com",
  displayName: "OutsideDays26 - sponsor thank-you",
  previewData: {
    recipientName: "Jenna",
    companyName: "Sample Brand",
    companyFolderUrl: "https://anthonymarz.pixieset.com/basecampoutdooroutsidedays/",
  },
} satisfies TemplateEntry;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "'Josefin Sans', \"Helvetica Neue\", Arial, sans-serif",
};
const container = { padding: "32px 28px", maxWidth: "600px" };
const h1 = { fontSize: "30px", fontWeight: 700, color: "#19363B", margin: "0 0 12px", lineHeight: "1.15" };
const h2 = { fontSize: "20px", fontWeight: 600, color: "#19363B", margin: "20px 0 8px" };
const h2NoTop = { fontSize: "20px", fontWeight: 600, color: "#19363B", margin: "10px 0 8px" };
const text = { fontSize: "15px", color: "#333", lineHeight: "1.6", margin: "0 0 14px" };
const smallText = { fontSize: "13px", color: "#555", lineHeight: "1.55", margin: "0 0 12px" };
const inlineLink = { color: "#ED7660", textDecoration: "underline", fontWeight: 600 };
const hr = { borderColor: "#eee", margin: "22px 0" };
const heroBannerWrap = { margin: "0 0 18px" };
const heroBanner = {
  display: "block",
  width: "100%",
  height: "104px",
  objectFit: "cover" as const,
  borderRadius: "10px",
};
const photoGrid = { margin: "4px 0 16px", textAlign: "center" as const, whiteSpace: "nowrap" as const };
const photoTilePortrait = {
  display: "inline-block",
  width: "104px",
  height: "130px",
  objectFit: "cover" as const,
  borderRadius: "8px",
  margin: "0 3px 6px 0",
};
const promoBox = {
  backgroundColor: "#F5E6D3",
  borderRadius: "12px",
  padding: "20px 22px",
  margin: "8px 0 12px",
};
const brandLogo = { height: "56px", width: "auto", maxWidth: "140px", display: "block", margin: "0 0 6px" };
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
const connectSection = { margin: "4px 0 8px" };
const connectPhotoCol = { width: "180px", verticalAlign: "top" as const, paddingRight: "16px" };
const connectTextCol = { verticalAlign: "top" as const };
const connectPhoto = {
  display: "block",
  width: "180px",
  height: "auto",
  borderRadius: "10px",
};
const code = {
  backgroundColor: "#19363B",
  color: "#E1B624",
  padding: "2px 8px",
  borderRadius: "4px",
  fontFamily: "monospace",
  fontSize: "13px",
};
const signoff = { fontSize: "15px", color: "#19363B", fontWeight: 600, lineHeight: "1.6", margin: "22px 0 0" };
