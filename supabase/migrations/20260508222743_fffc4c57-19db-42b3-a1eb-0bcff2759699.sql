CREATE TABLE public.afterparty_interest (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  role_title text NOT NULL,
  attendee_type text NOT NULL CHECK (attendee_type IN ('brand','creator','industry')),
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  reviewed_at timestamptz,
  notes text
);

ALTER TABLE public.afterparty_interest ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit interest"
  ON public.afterparty_interest FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can view interest"
  ON public.afterparty_interest FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated can update interest"
  ON public.afterparty_interest FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete interest"
  ON public.afterparty_interest FOR DELETE
  TO authenticated USING (true);