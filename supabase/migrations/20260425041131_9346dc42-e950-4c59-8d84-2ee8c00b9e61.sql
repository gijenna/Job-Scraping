-- Add invited_by attribution to attendees
ALTER TABLE public.afterparty_attendees
  ADD COLUMN IF NOT EXISTS invited_by text;

-- Partner / sponsor bubble logos shown on the afterparty invite page
CREATE TABLE IF NOT EXISTS public.afterparty_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  website_url text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.afterparty_partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view partners"
  ON public.afterparty_partners FOR SELECT
  USING (true);

CREATE POLICY "Authenticated can insert partners"
  ON public.afterparty_partners FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update partners"
  ON public.afterparty_partners FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete partners"
  ON public.afterparty_partners FOR DELETE TO authenticated
  USING (true);

-- Brand spotlights organised by category (brands, beverages, food, giveaways)
CREATE TABLE IF NOT EXISTS public.afterparty_spotlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  description text,
  logo_url text,
  website_url text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.afterparty_spotlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view spotlights"
  ON public.afterparty_spotlights FOR SELECT
  USING (true);

CREATE POLICY "Authenticated can insert spotlights"
  ON public.afterparty_spotlights FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update spotlights"
  ON public.afterparty_spotlights FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete spotlights"
  ON public.afterparty_spotlights FOR DELETE TO authenticated
  USING (true);