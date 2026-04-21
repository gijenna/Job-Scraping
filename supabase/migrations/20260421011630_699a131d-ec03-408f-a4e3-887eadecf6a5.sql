CREATE TABLE public.afterparty_suggestions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('niche', 'looking_for')),
  value text NOT NULL,
  attendee_id uuid REFERENCES public.afterparty_attendees(id) ON DELETE SET NULL,
  attendee_name text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewed_at timestamp with time zone
);

ALTER TABLE public.afterparty_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert suggestions"
ON public.afterparty_suggestions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Auth can view suggestions"
ON public.afterparty_suggestions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Auth can update suggestions"
ON public.afterparty_suggestions
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Auth can delete suggestions"
ON public.afterparty_suggestions
FOR DELETE
TO authenticated
USING (true);

CREATE INDEX idx_afterparty_suggestions_status ON public.afterparty_suggestions(status);