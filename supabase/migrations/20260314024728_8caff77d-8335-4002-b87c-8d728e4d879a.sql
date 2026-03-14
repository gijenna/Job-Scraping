CREATE TABLE public.event_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_slug text NOT NULL,
  setting_key text NOT NULL,
  setting_value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_slug, setting_key)
);

ALTER TABLE public.event_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view settings" ON public.event_settings FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated can insert settings" ON public.event_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update settings" ON public.event_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete settings" ON public.event_settings FOR DELETE TO authenticated USING (true);