ALTER TABLE public.candidates
  ADD COLUMN IF NOT EXISTS signup_mode text,
  ADD COLUMN IF NOT EXISTS field_other text;