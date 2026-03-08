CREATE POLICY "Auth can view all cities" ON public.expert_cities
FOR SELECT TO authenticated USING (true);