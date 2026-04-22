/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface AfterPartyInviteProps {
  recipientName?: string
  attendeeNumber?: number
  inviteUrl?: string
  role?: 'creator' | 'brand' | 'industry_expert'
}

const AfterPartyInviteEmail = ({
  recipientName = 'there',
  attendeeNumber,
  inviteUrl = 'https://basecampoutdoorevents.com/afterparty',
  role,
}: AfterPartyInviteProps) => {
  const activateUrl = `${inviteUrl}${inviteUrl.includes('?') ? '&' : '?'}activate=1`
  return (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You're in for the Creator After Party — fill out your profile so we can match you</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Hey {recipientName} — you're in 🌲🔥</Heading>
        {attendeeNumber && (
          <Text style={numberBadge}>You're attendee #{attendeeNumber}</Text>
        )}
        <Text style={text}>
          You're invited to the <strong>Basecamp Match × Popfly Creator After Party</strong>.
        </Text>
        <Text style={text}>
          Fill out your profile and we'll match you with your <strong>5 people</strong> for the night —
          creators, brands, and industry folks worth saying hi to.
        </Text>
        <Text style={text}>
          The more you fill in, the better the matches. Takes about 3 minutes.
        </Text>

        <Button href={inviteUrl} style={button}>
          Fill out your profile →
        </Button>

        {role === 'brand' && (
          <>
            <Hr style={hr} />
            <Heading as="h2" style={h2}>Want to activate your brand at the After Party?</Heading>
            <Text style={text}>
              Tap below and Jenna will personally reach out within one business day to walk through
              activation options — product moments, branded touches, anything that fits the night.
            </Text>
            <Button href={activateUrl} style={secondaryButton}>
              Activate my brand →
            </Button>
          </>
        )}

        <Hr style={hr} />

        <Text style={footer}>
          Your link is personal — bookmark it. You can come back and edit anything before the event.
        </Text>
      </Container>
    </Body>
  </Html>
  )
}

export const template = {
  component: AfterPartyInviteEmail,
  subject: "You're in — meet your 5 people at the After Party",
  displayName: 'After Party invite',
  previewData: {
    recipientName: 'Alex',
    attendeeNumber: 12,
    inviteUrl: 'https://basecampoutdoorevents.com/afterparty/alex-rivera',
    role: 'brand',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const h1 = { fontSize: '26px', fontWeight: 'bold', color: '#19363B', margin: '0 0 16px' }
const numberBadge = {
  display: 'inline-block', backgroundColor: '#E1B624', color: '#19363B',
  padding: '6px 14px', borderRadius: '999px', fontSize: '14px',
  fontWeight: 'bold', margin: '0 0 20px',
}
const text = { fontSize: '15px', color: '#19363B', lineHeight: '1.6', margin: '0 0 16px' }
const button = {
  backgroundColor: '#ED7660', color: '#ffffff', padding: '14px 28px',
  borderRadius: '8px', fontWeight: 'bold', fontSize: '15px',
  textDecoration: 'none', display: 'inline-block', margin: '12px 0 24px',
}
const hr = { borderColor: '#e5e5e5', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#666', margin: '0' }
const h2 = { fontSize: '18px', fontWeight: 'bold', color: '#19363B', margin: '0 0 12px' }
const secondaryButton = {
  backgroundColor: '#F5E6D3', color: '#ED7660', padding: '12px 24px',
  borderRadius: '8px', fontWeight: 'bold', fontSize: '14px',
  textDecoration: 'none', display: 'inline-block', margin: '8px 0 16px',
  border: '2px solid #ED7660',
}
