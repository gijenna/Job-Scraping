
-- Notes table for Connect messaging
CREATE TABLE IF NOT EXISTS public.connect_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  candidate_id uuid NOT NULL,
  recipient_type text NOT NULL CHECK (recipient_type IN ('brand_rep','expert')),
  recipient_id uuid NOT NULL,
  brand_id uuid,
  message text NOT NULL CHECK (char_length(message) <= 500 AND char_length(message) > 0),
  note_timing text NOT NULL CHECK (note_timing IN ('pre_event','during_event','post_event')),
  is_active boolean NOT NULL DEFAULT true
);

CREATE UNIQUE INDEX IF NOT EXISTS connect_notes_unique_active
  ON public.connect_notes (candidate_id, recipient_id)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS connect_notes_recipient_idx
  ON public.connect_notes (recipient_id) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS connect_notes_brand_idx
  ON public.connect_notes (brand_id) WHERE is_active = true;

ALTER TABLE public.connect_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on connect_notes"
  ON public.connect_notes FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE TRIGGER connect_notes_set_updated_at
  BEFORE UPDATE ON public.connect_notes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Candidate onboarding flag
ALTER TABLE public.candidates
  ADD COLUMN IF NOT EXISTS has_seen_map_intro boolean NOT NULL DEFAULT false;

-- Email templates (idempotent)
INSERT INTO public.email_templates (template_key, subject, body)
VALUES
  ('candidate_note_received_pre_event',
   'Your note is in their inbox.',
   'Hi {first_name}, your note to {rep_name} at {brand_name} has been sent. They''ll see it on their dashboard before the event. No promise they''ll reply, but you''ve made yourself memorable. Heads up: at the event you''ll likely only get to talk to one rep per brand, so make this conversation count if it happens. See you May 28.'),
  ('candidate_note_received_post_event',
   'Your note is on its way.',
   'Hi {first_name}, your note to {rep_name} at {brand_name} has been sent. They''ll see it on their dashboard with everyone else they met at the event. If they want to reply, they have your email and LinkedIn. Thanks for using Basecamp Connect.')
ON CONFLICT (template_key) DO NOTHING;
