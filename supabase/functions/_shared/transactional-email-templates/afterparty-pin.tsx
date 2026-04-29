/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface AfterPartyPinProps {
  pin?: string
  name?: string
}

const AfterPartyPinEmail = ({ pin = '0000', name }: AfterPartyPinProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Creator After Party verification code is {pin}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {name ? `Hey ${name},` : 'Verify it\u2019s you'}
        </Heading>
        <Text style={text}>
          Use this code to access your Creator After Party invite. It expires in 10 minutes.
        </Text>
        <div style={pinBox}>{pin}</div>
        <Text style={small}>
          Didn't request this? You can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AfterPartyPinEmail,
  subject: 'Your Creator After Party code',
  displayName: 'After Party verification PIN',
  previewData: { pin: '4271', name: 'Jenna' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Josefin Sans', Inter, Arial, sans-serif" }
const container = { padding: '32px 24px', maxWidth: '480px' }
const h1 = { fontSize: '22px', fontWeight: 600, color: '#080808', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#55575d', lineHeight: '1.6', margin: '0 0 24px' }
const pinBox = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: '40px',
  fontWeight: 700,
  letterSpacing: '0.4em',
  color: '#080808',
  backgroundColor: '#F5E6D3',
  padding: '20px 24px',
  borderRadius: '12px',
  textAlign: 'center' as const,
  margin: '0 0 24px',
}
const small = { fontSize: '12px', color: '#999999', margin: '24px 0 0' }
