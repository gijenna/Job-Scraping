ALTER TABLE public.event_map_brands
  ADD COLUMN IF NOT EXISTS offers_remote text,
  ADD COLUMN IF NOT EXISTS currently_hiring text,
  ADD COLUMN IF NOT EXISTS culture_blurb text;