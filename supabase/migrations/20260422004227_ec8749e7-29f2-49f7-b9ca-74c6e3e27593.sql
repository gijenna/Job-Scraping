-- 1. Add opt-out column (default visible)
ALTER TABLE public.afterparty_attendees
  ADD COLUMN IF NOT EXISTS public_listing boolean NOT NULL DEFAULT true;

-- 2. Public, safe-fields-only view
CREATE OR REPLACE VIEW public.afterparty_guest_list
WITH (security_invoker = on) AS
SELECT
  a.id,
  a.attendee_number,
  a.role,
  -- "Jordan M." — first word + initial of last word
  CASE
    WHEN position(' ' in trim(a.full_name)) = 0
      THEN trim(a.full_name)
    ELSE split_part(trim(a.full_name), ' ', 1)
         || ' '
         || left(split_part(trim(a.full_name), ' ', array_length(string_to_array(trim(a.full_name), ' '), 1)), 1)
         || '.'
  END AS display_name,
  a.company,
  a.cartoon_url,
  a.niches,
  a.creator_types,
  a.looking_for,
  a.mind_blowing_fact,
  a.created_at
FROM public.afterparty_attendees a
WHERE a.public_listing = true
  AND a.status = 'submitted';

-- 3. Public read access on the view
GRANT SELECT ON public.afterparty_guest_list TO anon, authenticated;

-- 4. Realtime: ensure the underlying table broadcasts changes
ALTER TABLE public.afterparty_attendees REPLICA IDENTITY FULL;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'afterparty_attendees'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.afterparty_attendees';
  END IF;
END $$;