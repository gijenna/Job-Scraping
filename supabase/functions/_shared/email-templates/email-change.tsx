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
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface EmailChangeEmailProps {
  siteName: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  email,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email change for Basecamp Outdoor Events</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://qpnzjcbdtybwazceggmv.supabase.co/storage/v1/object/public/email-assets/basecamp-logo.png"
          alt="Basecamp Outdoor Events"
          width="180"
          style={logo}
        />
        <Heading style={h1}>Confirm your new email</Heading>
        <Text style={text}>
          You requested to change your email from{' '}
          <Link href={`mailto:${email}`} style={link}>{email}</Link> to{' '}
          <Link href={`mailto:${newEmail}`} style={link}>{newEmail}</Link>.
        </Text>
        <Text style={text}>Tap below to confirm the switch:</Text>
        <Button style={button} href={confirmationUrl}>
          Confirm Email Change
        </Button>
        <Text style={footer}>
          Didn't request this? Please secure your account immediately.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

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
const link = { color: '#19363B', textDecoration: 'underline' }
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
