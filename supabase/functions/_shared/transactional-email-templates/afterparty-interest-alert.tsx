/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface AfterPartyInterestAlertProps {
  fullName?: string
  email?: string
  company?: string
  roleTitle?: string
  attendeeType?: string
  reason?: string
  submittedAt?: string
}

const AfterPartyInterestAlertEmail = ({
  fullName = 'Someone',
  email,
  company,
  roleTitle,
  attendeeType,
  reason,
  submittedAt,
}: AfterPartyInterestAlertProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New After Party interest from {fullName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New After Party interest 🌲</Heading>
        <Text style={text}>
          Someone just submitted interest to attend the After Party. Review and
          decide whether to invite them.
        </Text>

        <Hr style={hr} />

        <Text style={label}>Name</Text>
        <Text style={value}>{fullName}</Text>

        {email ? (<><Text style={label}>Email</Text><Text style={value}>{email}</Text></>) : null}
        {company ? (<><Text style={label}>Company</Text><Text style={value}>{company}</Text></>) : null}
        {roleTitle ? (<><Text style={label}>Role</Text><Text style={value}>{roleTitle}</Text></>) : null}
        {attendeeType ? (<><Text style={label}>Coming as</Text><Text style={value}>{attendeeType}</Text></>) : null}
        {reason ? (<><Text style={label}>Why they want to come</Text><Text style={value}>{reason}</Text></>) : null}
        {submittedAt ? (<><Text style={label}>Submitted</Text><Text style={value}>{submittedAt}</Text></>) : null}

        <Hr style={hr} />
        <Text style={footer}>
          Tracked in the afterparty_interest table and the After Party Interest Google Sheet tab.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AfterPartyInterestAlertEmail,
  subject: (data: Record<string, any>) =>
    `🌲 After Party interest: ${data.fullName || 'New request'}${data.attendeeType ? ` (${data.attendeeType})` : ''}`,
  displayName: 'After Party interest alert (admin)',
  to: 'jenna@wearetheoutdoorindustry.com',
  previewData: {
    fullName: 'Jane Doe',
    email: 'jane@acme.com',
    company: 'Acme Outdoor',
    roleTitle: 'Marketing Lead',
    attendeeType: 'brand',
    reason: 'We sponsor a lot of trail events and want to meet creators.',
    submittedAt: 'May 8, 2026 9:01 AM PT',
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
