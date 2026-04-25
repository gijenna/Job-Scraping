DROP VIEW IF EXISTS public.afterparty_attendees_public;
CREATE VIEW public.afterparty_attendees_public
WITH (security_invoker = true)
AS
SELECT
  id, attendee_number, full_name, slug, role, status,
  photo_url, cartoon_url, social_links, niches, looking_for,
  creator_types, audience_size, platforms, brands_wishlist,
  mind_blowing_fact, company, company_role, brand_seeking,
  budget_range, brand_fit_notes, invited_by, created_at, updated_at
FROM public.afterparty_attendees;
GRANT SELECT ON public.afterparty_attendees_public TO anon, authenticated;