
ALTER TABLE public.email_templates ADD COLUMN IF NOT EXISTS preview_text text;

ALTER TABLE public.industry_experts
  ADD COLUMN IF NOT EXISTS welcome_email_sent_at timestamp with time zone;

UPDATE public.industry_experts
  SET welcome_email_sent_at = NOW()
  WHERE welcome_email_sent_at IS NULL;

ALTER TABLE public.candidates
  ADD COLUMN IF NOT EXISTS data_portability_consent boolean NOT NULL DEFAULT false;

INSERT INTO public.email_templates (template_key, subject, preview_text, body)
VALUES (
  'candidate_welcome',
  'Basecamp x Outside Days: profile started',
  'Brands can''t read your mind, though.',
  $body$Hi {first_name},

Welcome to Basecamp Connect, your prep hub for the Outside Days Career Fair on [May 28, 3-6pm, at the CU Denver Student Wellness Center on Auraria Campus](https://www.google.com/maps/place/CU+Denver+Student+Wellness+Center/@39.7471407,-105.0029184,17z).

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
Basecamp Outdoor$body$
)
ON CONFLICT (template_key) DO NOTHING;

INSERT INTO public.email_templates (template_key, subject, preview_text, body)
VALUES (
  'brand_rep_welcome',
  'Your Basecamp x Outside Days Career Fair dashboard is live',
  'You don''t have to remember everyone. We do that part.',
  $body$Hi {first_name},

You're set up on Basecamp Connect, the new platform for the Outside Days Career Fair on [May 28, 3-6pm, at the CU Denver Student Wellness Center on Auraria Campus](https://www.google.com/maps/place/CU+Denver+Student+Wellness+Center/@39.7471407,-105.0029184,17z).

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
Basecamp Outdoor$body$
)
ON CONFLICT (template_key) DO NOTHING;
