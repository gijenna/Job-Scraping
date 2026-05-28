
ALTER TABLE public.afterparty_attendees
  ADD COLUMN IF NOT EXISTS checked_in_at timestamptz,
  ADD COLUMN IF NOT EXISTS checked_in_by text;

CREATE POLICY "Popfly door can view all attendees"
ON public.afterparty_attendees
FOR SELECT
TO authenticated
USING (lower(COALESCE((auth.jwt() ->> 'email'::text), ''::text)) LIKE '%@popfly.com');

CREATE POLICY "Popfly door can update any attendee"
ON public.afterparty_attendees
FOR UPDATE
TO authenticated
USING (lower(COALESCE((auth.jwt() ->> 'email'::text), ''::text)) LIKE '%@popfly.com')
WITH CHECK (lower(COALESCE((auth.jwt() ->> 'email'::text), ''::text)) LIKE '%@popfly.com');

ALTER TABLE public.afterparty_attendees REPLICA IDENTITY FULL;
