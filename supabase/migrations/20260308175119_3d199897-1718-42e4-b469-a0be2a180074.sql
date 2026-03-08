-- Allow anon users to delete their city assignments from the intake form
CREATE POLICY "Public can delete assignments"
ON public.expert_city_assignments
FOR DELETE TO anon
USING (true);