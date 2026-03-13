
CREATE TABLE public.event_logos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_slug text NOT NULL,
  name text NOT NULL,
  domain text,
  logo_url text,
  url text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.event_logos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view logos" ON public.event_logos
  FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated can insert logos" ON public.event_logos
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update logos" ON public.event_logos
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete logos" ON public.event_logos
  FOR DELETE TO authenticated USING (true);
