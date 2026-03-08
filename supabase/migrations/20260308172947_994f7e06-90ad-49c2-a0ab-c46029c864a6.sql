
-- Allow public (unauthenticated) users to view all assignments (needed for intake form)
CREATE POLICY "Public can view all assignments"
  ON public.expert_city_assignments FOR SELECT
  TO anon
  USING (true);

-- Allow public users to insert assignments (needed for intake form city selection)
CREATE POLICY "Public can insert assignments"
  ON public.expert_city_assignments FOR INSERT
  TO anon
  WITH CHECK (true);
