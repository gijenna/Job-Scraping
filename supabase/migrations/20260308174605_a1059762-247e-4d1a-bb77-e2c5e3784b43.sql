-- Allow anon users to update their city assignments
CREATE POLICY "Public can update assignments"
ON public.expert_city_assignments
FOR UPDATE TO anon
USING (true)
WITH CHECK (true);