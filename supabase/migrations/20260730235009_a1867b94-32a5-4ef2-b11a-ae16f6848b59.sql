CREATE TABLE public.hbcu_mentor_sponsor_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  company text NOT NULL,
  email text NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.hbcu_mentor_sponsor_inquiries TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.hbcu_mentor_sponsor_inquiries TO authenticated;
GRANT ALL ON public.hbcu_mentor_sponsor_inquiries TO service_role;
ALTER TABLE public.hbcu_mentor_sponsor_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit sponsor inquiries" ON public.hbcu_mentor_sponsor_inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read sponsor inquiries" ON public.hbcu_mentor_sponsor_inquiries FOR SELECT TO authenticated USING ((auth.jwt() ->> 'email') LIKE '%@wearetheoutdoorindustry.com');
CREATE POLICY "Admins can update sponsor inquiries" ON public.hbcu_mentor_sponsor_inquiries FOR UPDATE TO authenticated USING ((auth.jwt() ->> 'email') LIKE '%@wearetheoutdoorindustry.com') WITH CHECK ((auth.jwt() ->> 'email') LIKE '%@wearetheoutdoorindustry.com');
CREATE POLICY "Admins can delete sponsor inquiries" ON public.hbcu_mentor_sponsor_inquiries FOR DELETE TO authenticated USING ((auth.jwt() ->> 'email') LIKE '%@wearetheoutdoorindustry.com');

CREATE TABLE public.hbcu_mentor_applicants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  company text,
  role_title text,
  linkedin_url text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.hbcu_mentor_applicants TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.hbcu_mentor_applicants TO authenticated;
GRANT ALL ON public.hbcu_mentor_applicants TO service_role;
ALTER TABLE public.hbcu_mentor_applicants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can apply to mentor" ON public.hbcu_mentor_applicants FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read mentor applicants" ON public.hbcu_mentor_applicants FOR SELECT TO authenticated USING ((auth.jwt() ->> 'email') LIKE '%@wearetheoutdoorindustry.com');
CREATE POLICY "Admins can update mentor applicants" ON public.hbcu_mentor_applicants FOR UPDATE TO authenticated USING ((auth.jwt() ->> 'email') LIKE '%@wearetheoutdoorindustry.com') WITH CHECK ((auth.jwt() ->> 'email') LIKE '%@wearetheoutdoorindustry.com');
CREATE POLICY "Admins can delete mentor applicants" ON public.hbcu_mentor_applicants FOR DELETE TO authenticated USING ((auth.jwt() ->> 'email') LIKE '%@wearetheoutdoorindustry.com');

CREATE TABLE public.hbcu_mentor_student_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  campus text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.hbcu_mentor_student_waitlist TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.hbcu_mentor_student_waitlist TO authenticated;
GRANT ALL ON public.hbcu_mentor_student_waitlist TO service_role;
ALTER TABLE public.hbcu_mentor_student_waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can join student waitlist" ON public.hbcu_mentor_student_waitlist FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read student waitlist" ON public.hbcu_mentor_student_waitlist FOR SELECT TO authenticated USING ((auth.jwt() ->> 'email') LIKE '%@wearetheoutdoorindustry.com');
CREATE POLICY "Admins can update student waitlist" ON public.hbcu_mentor_student_waitlist FOR UPDATE TO authenticated USING ((auth.jwt() ->> 'email') LIKE '%@wearetheoutdoorindustry.com');
CREATE POLICY "Admins can delete student waitlist" ON public.hbcu_mentor_student_waitlist FOR DELETE TO authenticated USING ((auth.jwt() ->> 'email') LIKE '%@wearetheoutdoorindustry.com');

CREATE TRIGGER set_hbcu_sponsor_updated_at BEFORE UPDATE ON public.hbcu_mentor_sponsor_inquiries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_hbcu_applicants_updated_at BEFORE UPDATE ON public.hbcu_mentor_applicants FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_hbcu_waitlist_updated_at BEFORE UPDATE ON public.hbcu_mentor_student_waitlist FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();