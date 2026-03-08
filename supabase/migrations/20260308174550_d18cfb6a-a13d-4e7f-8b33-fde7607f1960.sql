-- Allow anon/public users to update their own expert profiles via the intake form
CREATE POLICY "Public can update experts"
ON public.industry_experts
FOR UPDATE TO anon
USING (true)
WITH CHECK (true);