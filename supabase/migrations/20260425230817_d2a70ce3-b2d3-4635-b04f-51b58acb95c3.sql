ALTER TABLE public.afterparty_attendees
  ADD COLUMN IF NOT EXISTS show_instagram boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_linkedin  boolean NOT NULL DEFAULT true;

DROP VIEW IF EXISTS public.afterparty_guest_list;

CREATE VIEW public.afterparty_guest_list AS
SELECT
  a.id,
  a.attendee_number,
  a.role,
  CASE
    WHEN POSITION(' ' IN TRIM(BOTH FROM a.full_name)) = 0 THEN TRIM(BOTH FROM a.full_name)
    ELSE ((split_part(TRIM(BOTH FROM a.full_name), ' ', 1) || ' ') ||
          "left"(split_part(TRIM(BOTH FROM a.full_name), ' ',
                            array_length(string_to_array(TRIM(BOTH FROM a.full_name), ' '), 1)), 1)) || '.'
  END AS display_name,
  a.company,
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
  AND (a.status = ANY (ARRAY['confirmed'::text, 'submitted'::text]));