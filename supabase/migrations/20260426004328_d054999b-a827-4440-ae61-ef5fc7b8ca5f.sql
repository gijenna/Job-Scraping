CREATE POLICY "Verified phone function can attach attendee owner"
ON public.afterparty_attendees
FOR UPDATE
TO authenticated
USING (
  auth.uid() = auth_user_id
  OR auth.role() = 'service_role'
  OR auth_user_id IS NULL
)
WITH CHECK (
  auth.uid() = auth_user_id
  OR auth.role() = 'service_role'
);
