CREATE TABLE public.brand_activation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attendee_id uuid REFERENCES public.afterparty_attendees(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  company text,
  email text,
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);

ALTER TABLE public.brand_activation_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit activation request"
  ON public.brand_activation_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can view activation requests"
  ON public.brand_activation_requests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can update activation requests"
  ON public.brand_activation_requests
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete activation requests"
  ON public.brand_activation_requests
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX idx_brand_activation_created ON public.brand_activation_requests (created_at DESC);