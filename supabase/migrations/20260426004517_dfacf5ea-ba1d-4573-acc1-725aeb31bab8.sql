CREATE POLICY "Authenticated can claim unowned invited attendee"
ON public.afterparty_attendees
FOR UPDATE
TO authenticated
USING (
  auth_user_id IS NULL
  AND status = 'invited'
)
WITH CHECK (
  auth_user_id = auth.uid()
);
