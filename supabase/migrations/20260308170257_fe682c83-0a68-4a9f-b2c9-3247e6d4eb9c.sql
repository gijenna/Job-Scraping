-- Drop the restrictive SELECT policy
DROP POLICY "Public can view published assignments" ON public.expert_city_assignments;

-- Allow public to view published, and authenticated to view all
CREATE POLICY "Public can view published assignments" ON public.expert_city_assignments
FOR SELECT USING (published = true);

CREATE POLICY "Auth can view all assignments" ON public.expert_city_assignments
FOR SELECT TO authenticated USING (true);