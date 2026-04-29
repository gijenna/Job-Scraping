DROP VIEW IF EXISTS public.afterparty_guest_list;

CREATE VIEW public.afterparty_guest_list AS
SELECT
  a.id,
  a.attendee_number,
  a.role,
  CASE
    WHEN POSITION(' ' IN TRIM(a.full_name)) = 0 THEN TRIM(a.full_name)
    ELSE split_part(TRIM(a.full_name), ' ', 1) || ' ' || left(split_part(TRIM(a.full_name), ' ', array_length(string_to_array(TRIM(a.full_name), ' '), 1)), 1) || '.'
  END AS display_name,
  a.company,
  a.company_role,
  a.company_url,
  a.cartoon_url,
  a.niches,
  a.creator_types,
  a.looking_for,
  a.mind_blowing_fact,
  a.social_links,
  a.show_instagram,
  a.show_linkedin,
  a.created_at
FROM public.afterparty_attendees a
WHERE a.public_listing = true
  AND a.status = ANY (ARRAY['confirmed'::text, 'submitted'::text]);

GRANT SELECT ON public.afterparty_guest_list TO anon, authenticated;