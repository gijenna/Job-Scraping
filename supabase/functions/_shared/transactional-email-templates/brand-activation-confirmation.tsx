/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface BrandActivationConfirmationProps {
  recipientName?: string
}

const BrandActivationConfirmationEmail = ({
  recipientName = 'there',
}: BrandActivationConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>We got your request — Jenna will be in touch shortly</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Got it, {recipientName} 🌲</Heading>
        <Text style={text}>
          Thanks for raising your hand to activate your brand at the Creator After Party.
        </Text>
        <Text style={text}>
          <strong>Jenna</strong> will personally reach out within the next business day to walk
          through activation options, pricing, and what fits your goals.
        </Text>
        <Text style={text}>
          In the meantime, keep an eye on your matches on the After Party page — the creators
          we pair you with are who you'll be hanging with on the night.
        </Text>

        <Hr style={hr} />
        <Text style={footer}>
          Questions? Just reply to this email — it goes straight to Jenna.
        </Text>
        <Text style={signoff}>
          — Basecamp Match × Popfly
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: BrandActivationConfirmationEmail,
  subject: 'We got your request — Jenna will be in touch',
  displayName: 'Brand activation confirmation',
  previewData: { recipientName: 'Jane' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Josefin Sans', Arial, sans-serif" }
const container = { padding: '32px 28px', maxWidth: '560px' }
const h1 = { fontSize: '26px', fontWeight: 600, color: '#19363B', margin: '0 0 18px' }
const text = { fontSize: '15px', color: '#19363B', lineHeight: '1.6', margin: '0 0 16px' }
const hr = { borderColor: 'rgba(25,54,59,0.15)', margin: '24px 0 16px' }
const footer = { fontSize: '13px', color: 'rgba(25,54,59,0.7)', margin: '0 0 8px', lineHeight: '1.5' }
const signoff = { fontSize: '13px', color: '#ED7660', margin: '0', fontWeight: 600 }
