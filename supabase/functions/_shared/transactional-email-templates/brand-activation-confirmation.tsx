/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Link, Preview, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface BrandActivationConfirmationProps {
  recipientName?: string
  afterPartyUrl?: string
}

const BrandActivationConfirmationEmail = ({
  recipientName = 'there',
  afterPartyUrl = 'https://basecampoutdoorevents.com',
}: BrandActivationConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Got your activation request, let's get your brand in the mix</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Got it, {recipientName}</Heading>

        <Text style={text}>Let's get your brand in the mix.</Text>

        <Text style={text}>
          Pricing starts at $500, and our goal is getting you an easy win. Jenna will personally
          reach out to hear your vision or co-create one.
        </Text>

        <Text style={text}>
          In the meantime, keep an eye on your matches on the{' '}
          <Link href={afterPartyUrl} style={link}>Guest List page</Link>{' '}
          & make sure your card is updated. We'll use your answers to surface people we think
          you'll want to meet.
        </Text>

        <Text style={text}>Questions? Just hit reply.</Text>

        <Text style={fineprint}>
          A note: any swag or giveaways you contribute may be tax deductible as a donation if
          you'd like to structure it that way. Just let Jenna know.
        </Text>

        <Hr style={hr} />
        <Text style={signoff}>
          {'<3 '}
          <Link href="https://basecampjobs.com" style={signoffLink}>Basecamp</Link>
          {' \u00D7 '}
          <Link href="https://popflyclub.com" style={signoffLink}>Popfly</Link>
          {'  (& '}
          <Link href="https://outsideinc.com" style={signoffLink}>Outside</Link>
          {'!)'}
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: BrandActivationConfirmationEmail,
  subject: "Got it, let's get your brand in the mix",
  displayName: 'Brand activation confirmation',
  previewData: {
    recipientName: 'Jane',
    afterPartyUrl: 'https://basecampoutdoorevents.com/afterparty/jane-doe',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Josefin Sans', Arial, sans-serif" }
const container = { padding: '32px 28px', maxWidth: '560px' }
const h1 = { fontSize: '26px', fontWeight: 600, color: '#19363B', margin: '0 0 18px' }
const text = { fontSize: '15px', color: '#19363B', lineHeight: '1.6', margin: '0 0 16px' }
const link = { color: '#ED7660', textDecoration: 'underline', fontWeight: 600 }
const hr = { borderColor: 'rgba(25,54,59,0.15)', margin: '24px 0 16px' }
const signoff = { fontSize: '13px', color: '#ED7660', margin: '0', fontWeight: 600 }
const signoffLink = { color: '#ED7660', textDecoration: 'underline', fontWeight: 600 }
