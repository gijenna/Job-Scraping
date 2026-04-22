/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface BrandActivationAlertProps {
  fullName?: string
  company?: string
  email?: string
  message?: string
  attendeeId?: string
  submittedAt?: string
}

const BrandActivationAlertEmail = ({
  fullName = 'A brand',
  company,
  email,
  message,
  attendeeId,
  submittedAt,
}: BrandActivationAlertProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New brand activation request from {fullName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New brand activation request 🚨</Heading>
        <Text style={text}>
          A brand just pressed "Activate my brand" at the After Party page. Reach out to
          start the conversation.
        </Text>

        <Hr style={hr} />

        <Text style={label}>Name</Text>
        <Text style={value}>{fullName}</Text>

        {company ? (
          <>
            <Text style={label}>Company</Text>
            <Text style={value}>{company}</Text>
          </>
        ) : null}

        {email ? (
          <>
            <Text style={label}>Email</Text>
            <Text style={value}>{email}</Text>
          </>
        ) : null}

        {message ? (
          <>
            <Text style={label}>Their note</Text>
            <Text style={value}>{message}</Text>
          </>
        ) : null}

        {attendeeId ? (
          <>
            <Text style={label}>Attendee ID</Text>
            <Text style={mono}>{attendeeId}</Text>
          </>
        ) : null}

        {submittedAt ? (
          <>
            <Text style={label}>Submitted</Text>
            <Text style={value}>{submittedAt}</Text>
          </>
        ) : null}

        <Hr style={hr} />
        <Text style={footer}>
          Tracked in the brand_activation_requests table.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: BrandActivationAlertEmail,
  subject: (data: Record<string, any>) =>
    `🚨 Brand activation: ${data.fullName || 'New request'}${data.company ? ` (${data.company})` : ''}`,
  displayName: 'Brand activation alert (admin)',
  to: 'jenna@wearetheoutdoorindustry.com',
  previewData: {
    fullName: 'Jane Doe',
    company: 'Acme Outdoor',
    email: 'jane@acme.com',
    message: "We'd love to sponsor a table.",
    attendeeId: '00000000-0000-0000-0000-000000000000',
    submittedAt: 'Apr 22, 2026 9:01 AM PT',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Josefin Sans', Arial, sans-serif" }
const container = { padding: '32px 28px', maxWidth: '560px' }
const h1 = { fontSize: '24px', fontWeight: 600, color: '#19363B', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#19363B', lineHeight: '1.55', margin: '0 0 16px' }
const label = { fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#ED7660', margin: '14px 0 4px', fontWeight: 600 }
const value = { fontSize: '15px', color: '#19363B', margin: '0 0 6px', lineHeight: '1.5' }
const mono = { fontSize: '12px', color: '#19363B', margin: '0 0 6px', fontFamily: 'monospace' }
const hr = { borderColor: 'rgba(25,54,59,0.15)', margin: '20px 0' }
const footer = { fontSize: '12px', color: 'rgba(25,54,59,0.6)', margin: '12px 0 0' }
