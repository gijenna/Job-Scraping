-- Fix afterparty_guest_list view to use the actual status value 'confirmed'
-- (previous definition filtered on a status string that no attendees ever have)
DROP VIEW IF EXISTS public.afterparty_guest_list;

CREATE VIEW public.afterparty_guest_list
WITH (security_invoker=on) AS
SELECT
  id,
  attendee_number,
  role,
  CASE
    WHEN POSITION(' ' IN TRIM(BOTH FROM full_name)) = 0 THEN TRIM(BOTH FROM full_name)
    ELSE (split_part(TRIM(BOTH FROM full_name), ' ', 1) || ' ') ||
         "left"(split_part(TRIM(BOTH FROM full_name), ' ', array_length(string_to_array(TRIM(BOTH FROM full_name), ' '), 1)), 1) || '.'
  END AS display_name,
  company,
  cartoon_url,
  niches,
  creator_types,
  looking_for,
  mind_blowing_fact,
  created_at
FROM public.afterparty_attendees a
WHERE public_listing = true
  AND status IN ('confirmed', 'submitted');