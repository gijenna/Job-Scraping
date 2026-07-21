
-- Make the guest list view enforce caller RLS
ALTER VIEW public.afterparty_guest_list SET (security_invoker = on);
ALTER VIEW public.afterparty_attendees_public SET (security_invoker = on);

-- afterparty_interest: was readable/updatable/deletable by ANY authenticated user (PII).
DROP POLICY IF EXISTS "Authenticated can view interest" ON public.afterparty_interest;
DROP POLICY IF EXISTS "Authenticated can update interest" ON public.afterparty_interest;
DROP POLICY IF EXISTS "Authenticated can delete interest" ON public.afterparty_interest;
CREATE POLICY "Admins can view interest" ON public.afterparty_interest
  FOR SELECT TO authenticated
  USING (lower(coalesce(auth.jwt() ->> 'email', '')) LIKE '%@wearetheoutdoorindustry.com');
CREATE POLICY "Admins can update interest" ON public.afterparty_interest
  FOR UPDATE TO authenticated
  USING (lower(coalesce(auth.jwt() ->> 'email', '')) LIKE '%@wearetheoutdoorindustry.com')
  WITH CHECK (lower(coalesce(auth.jwt() ->> 'email', '')) LIKE '%@wearetheoutdoorindustry.com');
CREATE POLICY "Admins can delete interest" ON public.afterparty_interest
  FOR DELETE TO authenticated
  USING (lower(coalesce(auth.jwt() ->> 'email', '')) LIKE '%@wearetheoutdoorindustry.com');

-- brand_activation_requests: same problem, same fix.
DROP POLICY IF EXISTS "Authenticated can view activation requests" ON public.brand_activation_requests;
DROP POLICY IF EXISTS "Authenticated can update activation requests" ON public.brand_activation_requests;
DROP POLICY IF EXISTS "Authenticated can delete activation requests" ON public.brand_activation_requests;
CREATE POLICY "Admins can view activation requests" ON public.brand_activation_requests
  FOR SELECT TO authenticated
  USING (lower(coalesce(auth.jwt() ->> 'email', '')) LIKE '%@wearetheoutdoorindustry.com');
CREATE POLICY "Admins can update activation requests" ON public.brand_activation_requests
  FOR UPDATE TO authenticated
  USING (lower(coalesce(auth.jwt() ->> 'email', '')) LIKE '%@wearetheoutdoorindustry.com')
  WITH CHECK (lower(coalesce(auth.jwt() ->> 'email', '')) LIKE '%@wearetheoutdoorindustry.com');
CREATE POLICY "Admins can delete activation requests" ON public.brand_activation_requests
  FOR DELETE TO authenticated
  USING (lower(coalesce(auth.jwt() ->> 'email', '')) LIKE '%@wearetheoutdoorindustry.com');

-- afterparty_attendees Popfly policies granted full SELECT/UPDATE on all attendee PII to
-- any @popfly.com Supabase user. Remove them; door check-in should go through an
-- admin-mediated edge function if needed.
DROP POLICY IF EXISTS "Popfly door can view all attendees" ON public.afterparty_attendees;
DROP POLICY IF EXISTS "Popfly door can update any attendee" ON public.afterparty_attendees;
