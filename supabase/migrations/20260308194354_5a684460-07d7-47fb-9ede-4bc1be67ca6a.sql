CREATE POLICY "Public can insert experts"
ON public.industry_experts
FOR INSERT TO anon
WITH CHECK (true);