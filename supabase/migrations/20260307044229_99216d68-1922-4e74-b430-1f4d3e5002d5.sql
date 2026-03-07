
-- Add end_date column
ALTER TABLE public.events ADD COLUMN end_date timestamptz;

-- Drop restrictive delete policy and replace with one allowing any authenticated user
DROP POLICY IF EXISTS "Creator can delete events" ON public.events;
CREATE POLICY "Authenticated users can delete events"
  ON public.events
  FOR DELETE
  TO authenticated
  USING (true);

-- Also update the update policy to allow any authenticated user
DROP POLICY IF EXISTS "Creator can update events" ON public.events;
CREATE POLICY "Authenticated users can update events"
  ON public.events
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
