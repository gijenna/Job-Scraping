ALTER TABLE public.candidates
  ADD COLUMN IF NOT EXISTS brand_contact_consent boolean NOT NULL DEFAULT false;

ALTER TABLE public.brand_lead_responses
  ADD COLUMN IF NOT EXISTS share_contact_info boolean NOT NULL DEFAULT false;