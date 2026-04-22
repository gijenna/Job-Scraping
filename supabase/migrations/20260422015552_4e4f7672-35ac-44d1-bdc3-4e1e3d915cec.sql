CREATE POLICY "Public can view attendees"
ON public.afterparty_attendees
FOR SELECT
TO anon, authenticated
USING (true);