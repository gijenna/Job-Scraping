ALTER TABLE public.afterparty_partners
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS expanded_description text,
  ADD COLUMN IF NOT EXISTS photo_url text,
  ADD COLUMN IF NOT EXISTS value text,
  ADD COLUMN IF NOT EXISTS show_in_icon_grid boolean NOT NULL DEFAULT false;