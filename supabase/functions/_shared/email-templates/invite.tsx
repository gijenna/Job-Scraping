/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You're invited to join Basecamp Outdoor Events</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://qpnzjcbdtybwazceggmv.supabase.co/storage/v1/object/public/email-assets/basecamp-logo.png"
          alt="Basecamp Outdoor Events"
          width="180"
          style={logo}
        />
        <Heading style={h1}>You're invited!</Heading>
        <Text style={text}>
          You've been invited to join Basecamp Outdoor Events — where the
          outdoor industry gathers. Accept below to create your account.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Accept Invitation
        </Button>
        <Text style={footer}>
          Wasn't expecting this? You can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Space Grotesk', 'Josefin Sans', Arial, sans-serif" }
const container = { padding: '32px 28px' }
const logo = { marginBottom: '24px' }
const h1 = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#19363B',
  margin: '0 0 20px',
  fontFamily: "'Josefin Sans', Arial, sans-serif",
}
const text = {
  fontSize: '15px',
  color: '#4A5568',
  lineHeight: '1.6',
  margin: '0 0 24px',
}
const button = {
  backgroundColor: '#D4735E',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600' as const,
  borderRadius: '12px',
  padding: '14px 28px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#999999', margin: '32px 0 0' }
