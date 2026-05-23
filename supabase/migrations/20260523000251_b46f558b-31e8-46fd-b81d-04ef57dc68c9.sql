
-- 1. Drop public SELECT policy on base table (PII leak)
DROP POLICY IF EXISTS "Public can view attendees" ON public.afterparty_attendees;

-- 2. Admin SELECT policy: any signed-in @wearetheoutdoorindustry.com user
CREATE POLICY "Admins can view all attendees"
  ON public.afterparty_attendees
  FOR SELECT
  TO authenticated
  USING (
    lower(coalesce((auth.jwt() ->> 'email'), '')) LIKE '%@wearetheoutdoorindustry.com'
  );

-- 3. Admin UPDATE / DELETE policies for admin tools
CREATE POLICY "Admins can update any attendee"
  ON public.afterparty_attendees
  FOR UPDATE
  TO authenticated
  USING (
    lower(coalesce((auth.jwt() ->> 'email'), '')) LIKE '%@wearetheoutdoorindustry.com'
  )
  WITH CHECK (
    lower(coalesce((auth.jwt() ->> 'email'), '')) LIKE '%@wearetheoutdoorindustry.com'
  );

CREATE POLICY "Admins can delete any attendee"
  ON public.afterparty_attendees
  FOR DELETE
  TO authenticated
  USING (
    lower(coalesce((auth.jwt() ->> 'email'), '')) LIKE '%@wearetheoutdoorindustry.com'
  );

-- 4. Recreate public view to include public_listing (still excludes email/phone/pin/auth)
DROP VIEW IF EXISTS public.afterparty_attendees_public;
CREATE VIEW public.afterparty_attendees_public AS
  SELECT id,
         attendee_number,
         full_name,
         slug,
         role,
         status,
         photo_url,
         cartoon_url,
         social_links,
         niches,
         looking_for,
         creator_types,
         audience_size,
         platforms,
         brands_wishlist,
         mind_blowing_fact,
         company,
         company_url,
         company_role,
         show_instagram,
         show_linkedin,
         brand_seeking,
         budget_range,
         brand_fit_notes,
         invited_by,
         public_listing,
         created_at,
         updated_at
  FROM public.afterparty_attendees;

GRANT SELECT ON public.afterparty_attendees_public TO anon, authenticated;
