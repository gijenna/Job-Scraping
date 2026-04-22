CREATE POLICY "Anyone can RSVP (insert attendee)"
ON public.afterparty_attendees
FOR INSERT
TO anon, authenticated
WITH CHECK (true);