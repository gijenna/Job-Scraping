Bundle: Connect Landing Update, Profile Copy, Welcome Emails, Portability Checkbox

Update 1: Connect landing value-prop section

File: src/pages/outsidedays/Connect.tsx

Insert a new section between the hero image and BranchPicker ("How much time do you have right now?"). Wrap copy in EditableText with new settingKeys so it's admin-editable:

Headline stand_out_title (default: "Stand out before you walk in.") styled to match existing branch title (font-afterparty, 3xl/4xl, events-cream).

Four bullet lines (separate EditableText blocks stand_out_b1 ... stand_out_b4, each with a coral checkmark ✓ prefix rendered as a styled span). Stacked, each on its own line, font-body, events-cream, generous py-8 wrapper, mobile px-4.

Default bullet content:

- stand_out_b1: "See exactly who's coming and which brands are hiring"

- stand_out_b2: "Research reps so you walk up to their table prepared"

- stand_out_b3: "Star brands you want to visit so lines feel shorter on the day"

- stand_out_b4: "Reach out ahead of the event if you want them to know who you are"

Update 2: Comprehensive profile page copy

File: src/pages/outsidedays/ConnectFull.tsx (line ~294)

Keep "Build your profile" heading. Replace the single subtitle EditableText with three sequentially-keyed paragraph blocks (build_intro_p1, build_intro_p2, build_intro_p3):

- build_intro_p1: "Brands have hundreds of candidates to look at. They'll filter by specific things, like field, experience, and what kind of role you want. The more your profile says, the more filters you show up in."

- build_intro_p2: "Required fields have an asterisk. The rest is up to you."

- build_intro_p3: "But blanks aren't searchable." (slightly emphasized: italic or font-medium with extra top margin)

Update 3: Welcome emails for candidates and brand reps

Schema

Migration:

- ALTER TABLE email_templates ADD COLUMN preview_text text;

- ALTER TABLE brand_reps ADD COLUMN welcome_email_sent_at timestamp with time zone;

- ALTER TABLE industry_experts ADD COLUMN welcome_email_sent_at timestamp with time zone;

- UPDATE brand_reps SET welcome_email_sent_at = NOW() WHERE welcome_email_sent_at IS NULL; (marks all existing reps as already welcomed)

- UPDATE industry_experts SET welcome_email_sent_at = NOW() WHERE welcome_email_sent_at IS NULL; (marks all existing experts as already welcomed)

Insert two new rows into email_templates:

- candidate_welcome (subject + preview text + body as specified below)

- brand_rep_welcome (subject + preview text + body as specified below)

Sending edge function

Create supabase/functions/send-template-email/index.ts that:

- Accepts { template_key, to, variables }

- Loads the row from email_templates

- Renders subject/body/preview_text by replacing {first_name}, {connect_url}, {dashboard_url}

- Converts the lightweight markdown in the body (**bold**, [label](url), blank-line paragraphs, - bullets) to HTML

- Wraps body in a branded shell (Josefin Sans, Dark Teal/Coral palette consistent with existing email branding) with hidden preheader div containing preview_text

- Sends via Resend using [jenna@wearetheoutdoorindustry.com](mailto:jenna@wearetheoutdoorindustry.com) as From and Reply-To

- On error, logs to email_send_log with status failed and returns 200 (non-blocking)

Email content for candidate_welcome:

Subject: Basecamp x Outside Days: profile started

Preview text: Brands can't read your mind, though.

Body:

Hi {first_name},

Welcome to Basecamp Connect, your prep hub for the Outside Days Career Fair on [May 28, 3-6pm, at the CU Denver Student Wellness Center on Auraria Campus]([https://www.google.com/maps/place/CU+Denver+Student+Wellness+Center/@39.7471407,-105.0029184,17z](https://www.google.com/maps/place/CU+Denver+Student+Wellness+Center/@39.7471407,-105.0029184,17z)).

**Here's where to log back in anytime:**

{connect_url}

Your login is your full name plus the last 4 digits of your phone number.

What to do next:

- Finish your profile so you show up in brand searches

- Browse the map to see who's coming

- Star the brands you want to visit at the event

- Send notes to specific reps you want to meet

Questions? Reply to this email.

See you May 28,

Jenna

Basecamp Outdoor

Email content for brand_rep_welcome:

Subject: Your Basecamp x Outside Days Career Fair dashboard is live

Preview text: You don't have to remember everyone. We do that part.

Body:

Hi {first_name},

You're set up on Basecamp Connect, the new platform for the Outside Days Career Fair on [May 28, 3-6pm, at the CU Denver Student Wellness Center on Auraria Campus]([https://www.google.com/maps/place/CU+Denver+Student+Wellness+Center/@39.7471407,-105.0029184,17z](https://www.google.com/maps/place/CU+Denver+Student+Wellness+Center/@39.7471407,-105.0029184,17z)).

**Here's where to log in:**

{dashboard_url}

Your login is your full name plus the last 4 digits of your phone number.

In the dashboard you can:

- See every candidate registered for the event

- Filter by field, experience, and what they're looking for

- Read notes from candidates reaching out to you

- See who plans to visit your table

After the event you can follow up with everyone who came by.

Questions? Reply to this email.

See you May 28,

Jenna

Basecamp Outdoor

Triggers (fired async, fire-and-forget; failures don't block signup or login)

Candidate welcome trigger:

In supabase/functions/candidate-auth/index.ts, after signup_create_basics AND signup_create insert success, invoke send-template-email with candidate_welcome. Uses EdgeRuntime.waitUntil so it doesn't block the response. The candidate has no welcome_email_sent_at field; the candidate trigger fires only on the initial signup_create_basics save, which by definition happens once per candidate.

Brand rep / industry expert welcome trigger:

The welcome email must fire on either of two events, whichever happens FIRST, and only ONCE per rep/expert. Existing reps and experts are marked as already-welcomed via the migration above, so they will never receive this email.

Event A: First successful dashboard login

- Location: supabase/functions/brand-rep-auth/index.ts, in the login action after successful verification

- Logic: After a successful login, check the rep/expert record. If welcome_email_sent_at IS NULL AND the rep/expert has an expert_city_assignments row for the Denver Outside Days 26 city, invoke send-template-email with brand_rep_welcome, then UPDATE the rep/expert record SET welcome_email_sent_at = NOW().

Event B: First card content save

- Location: the edge function or API endpoint that handles saving brand rep card content or industry expert card content (the existing edit flow at [sponsor-attract-hub.lovable.app](http://sponsor-attract-hub.lovable.app) or wherever the card_save action lives)

- Logic: After a successful save, check the rep/expert record. If welcome_email_sent_at IS NULL AND the rep/expert has an expert_city_assignments row for the Denver Outside Days 26 city, invoke send-template-email with brand_rep_welcome, then UPDATE the rep/expert record SET welcome_email_sent_at = NOW().

Both triggers check and update the same flag. If a rep logs in AND saves their card, they receive exactly one email (whichever action set the flag first). The other action sees welcome_email_sent_at is no longer NULL and does nothing.

Denver scoping: the trigger checks for an expert_city_assignments row whose city_id matches the Denver Outside Days 26 city. Use a constant or config value for this city_id. Future events use the same pattern with their own city_id constants and their own welcome email templates.

Admin UI

Currently no UI exists for email_templates. Add a new admin page src/pages/AdminEmailTemplates.tsx (route /admin/email-templates, gated by isAdminUser) listing all rows with editable subject, preview_text, body (textarea, monospace) and Save button. Add a link from AdminConnect.tsx. This same UI works for the existing 3 templates plus the 2 new ones.

Update 4: Basecamp Jobs data portability checkbox

Schema

Migration: ALTER TABLE candidates ADD COLUMN data_portability_consent boolean NOT NULL DEFAULT false;

Forms

Add a small, calm checkbox above submit in BOTH:

- The essentials/quick form (component inside Connect.tsx)

- The comprehensive form ConnectFull.tsx

Label renders: "I'm interested in Basecamp Jobs when it launches. You can use my profile data here so I don't have to start from scratch." with the brand name "Basecamp Jobs" as an <a href="[https://basecampjobs.com](https://basecampjobs.com)" target="_blank">.

Styling: text-xs text-events-cream/70, no coral. Visually distinct from required fields. Default state: unchecked.

State plumbed into both signup payloads. candidate-auth/index.ts accepts data_portability_consent in signup_create_basics and signup_create insert maps. When form is submitted with box checked, save data_portability_consent = true. When unchecked or left blank, save false.

Admin visibility

Add Data Portability boolean column to the candidate admin view used in AdminConnect/dashboard candidate list (existing CSV export gets a new data_portability_consent column; filter chip optional, but column will be present in export).

Out of scope / unchanged

Auth (beyond the trigger logic added in brand-rep-auth/index.ts), taxonomies, dashboard filter logic, sort dropdown, profile completeness meter, Resend setup itself, existing email templates, existing form fields beyond what's specified, page structure, navigation.

Verification

- /outsidedays26/connect shows new "Stand out before you walk in." section with four checkmark bullets above the time question

- /outsidedays26/connect/full shows new three-paragraph "Build your profile" copy

- Creating a fresh candidate triggers candidate_welcome email with bold "Here's where to log back in anytime:" line, hyperlinked May 28 location, and preheader "Brands can't read your mind, though."

- All existing brand reps and industry experts have welcome_email_sent_at populated and receive NO welcome email

- A new brand rep added going forward who logs in to the dashboard for the first time AND is assigned to Denver Outside Days 26 receives brand_rep_welcome exactly once

- A new brand rep added going forward who saves their card content for the first time AND is assigned to Denver Outside Days 26 receives brand_rep_welcome exactly once

- The same rep performing both actions receives only ONE welcome email total

- A new brand rep assigned to a different city (e.g., a future Boston event) does NOT receive the Denver welcome email

- Both candidate signup forms show portability checkbox; submitting checked saves true; "Basecamp Jobs" links to [https://basecampjobs.com](https://basecampjobs.com)

- Admin email templates page lists all 5 templates with editable subject, preview text, body

- No em dashes anywhere in new copy or HTML