/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr, Img, Link,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface FeedbackFromUserProps {
  senderName?: string
  senderEmail?: string
  message?: string
  pageUrl?: string
  userAgent?: string
  screenshotUrl?: string
  subjectType?: string
}

const FeedbackFromUserEmail = ({
  senderName,
  senderEmail,
  message,
  pageUrl,
  userAgent,
  screenshotUrl,
  subjectType,
}: FeedbackFromUserProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Feedback from {senderName || senderEmail || 'a user'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New feedback 💌</Heading>
        <Text style={text}>
          Just reply to this email to respond directly to {senderName || senderEmail || 'them'}.
        </Text>

        <Hr style={hr} />

        {senderName ? (<><Text style={label}>From</Text><Text style={value}>{senderName}</Text></>) : null}
        {senderEmail ? (<><Text style={label}>Email</Text><Text style={value}>{senderEmail}</Text></>) : null}
        {subjectType ? (<><Text style={label}>Role</Text><Text style={value}>{subjectType}</Text></>) : null}
        {pageUrl ? (<><Text style={label}>Page</Text><Text style={value}>{pageUrl}</Text></>) : null}

        <Text style={label}>Message</Text>
        <Text style={{ ...value, whiteSpace: 'pre-wrap' }}>{message || '(no message)'}</Text>

        {screenshotUrl ? (
          <>
            <Hr style={hr} />
            <Text style={label}>Screenshot</Text>
            <Link href={screenshotUrl} style={{ color: '#ED7660' }}>{screenshotUrl}</Link>
            <Img src={screenshotUrl} alt="Screenshot" style={img} />
          </>
        ) : null}

        {userAgent ? (
          <>
            <Hr style={hr} />
            <Text style={footer}>{userAgent}</Text>
          </>
        ) : null}
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: FeedbackFromUserEmail,
  subject: (data: Record<string, any>) =>
    `Feedback: ${(data.message || '').toString().slice(0, 60) || 'New message'}`,
  displayName: 'User feedback to Jenna',
  to: 'jenna@wearetheoutdoorindustry.com',
  previewData: {
    senderName: 'Jane Doe',
    senderEmail: 'jane@acme.com',
    subjectType: 'employer',
    pageUrl: 'https://basecampoutdoorevents.com/outsidedays26/dashboard',
    message: 'Filter buttons not working on mobile.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Josefin Sans', Arial, sans-serif" }
const container = { padding: '32px 28px', maxWidth: '560px' }
const h1 = { fontSize: '24px', fontWeight: 600, color: '#19363B', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#19363B', lineHeight: '1.55', margin: '0 0 16px' }
const label = { fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#ED7660', margin: '14px 0 4px', fontWeight: 600 }
const value = { fontSize: '15px', color: '#19363B', margin: '0 0 6px', lineHeight: '1.5' }
const hr = { borderColor: 'rgba(25,54,59,0.15)', margin: '20px 0' }
const footer = { fontSize: '12px', color: 'rgba(25,54,59,0.6)', margin: '12px 0 0' }
const img = { maxWidth: '100%', borderRadius: '6px', marginTop: '10px', border: '1px solid rgba(25,54,59,0.1)' }
