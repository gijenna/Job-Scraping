
-- 1. Add new columns to afterparty_attendees
ALTER TABLE public.afterparty_attendees
  ADD COLUMN IF NOT EXISTS pin_hash text,
  ADD COLUMN IF NOT EXISTS pin_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS pin_attempts integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pin_locked_until timestamptz,
  ADD COLUMN IF NOT EXISTS auth_user_id uuid,
  ADD COLUMN IF NOT EXISTS slug_opened_at timestamptz,
  ADD COLUMN IF NOT EXISTS email_verified boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_afterparty_attendees_auth_user_id
  ON public.afterparty_attendees(auth_user_id);

CREATE INDEX IF NOT EXISTS idx_afterparty_attendees_slug
  ON public.afterparty_attendees(slug);

-- 2. Drop old permissive policies
DROP POLICY IF EXISTS "Public can view attendees" ON public.afterparty_attendees;
DROP POLICY IF EXISTS "Public can insert attendees" ON public.afterparty_attendees;
DROP POLICY IF EXISTS "Public can update attendees" ON public.afterparty_attendees;
DROP POLICY IF EXISTS "Auth can insert attendees" ON public.afterparty_attendees;
DROP POLICY IF EXISTS "Auth can update attendees" ON public.afterparty_attendees;
DROP POLICY IF EXISTS "Auth can delete attendees" ON public.afterparty_attendees;

-- 3. Create safe public view (drops sensitive fields)
DROP VIEW IF EXISTS public.afterparty_attendees_public;
CREATE VIEW public.afterparty_attendees_public
WITH (security_invoker = true)
AS
SELECT
  id,
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
  company_role,
  brand_seeking,
  budget_range,
  brand_fit_notes,
  created_at,
  updated_at
FROM public.afterparty_attendees;

GRANT SELECT ON public.afterparty_attendees_public TO anon, authenticated;

-- 4. New RLS on afterparty_attendees: authenticated users can update only their own row
CREATE POLICY "Authenticated can view own attendee"
  ON public.afterparty_attendees
  FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Authenticated can update own attendee"
  ON public.afterparty_attendees
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

-- Service role bypasses RLS automatically; no policy needed.

-- 5. Tighten afterparty_matches: drop public/auth writes, keep public read
DROP POLICY IF EXISTS "Auth can insert matches" ON public.afterparty_matches;
DROP POLICY IF EXISTS "Auth can update matches" ON public.afterparty_matches;
DROP POLICY IF EXISTS "Auth can delete matches" ON public.afterparty_matches;
-- Public can view matches policy stays.

-- 6. Tighten afterparty_suggestions: keep public insert, drop auth read/update/delete
--    (admin reads happen via edge function with service role)
DROP POLICY IF EXISTS "Auth can view suggestions" ON public.afterparty_suggestions;
DROP POLICY IF EXISTS "Auth can update suggestions" ON public.afterparty_suggestions;
DROP POLICY IF EXISTS "Auth can delete suggestions" ON public.afterparty_suggestions;
-- "Public can insert suggestions" policy stays.

-- 7. Admin action log
CREATE TABLE IF NOT EXISTS public.admin_action_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_email text NOT NULL,
  action text NOT NULL,
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_action_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can read admin action log"
  ON public.admin_action_log
  FOR SELECT
  TO public
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can insert admin action log"
  ON public.admin_action_log
  FOR INSERT
  TO public
  WITH CHECK (auth.role() = 'service_role');
