-- Expert status enum
CREATE TYPE public.expert_status AS ENUM ('invited', 'viewed', 'started', 'confirmed');

-- Event/city configurations
CREATE TABLE public.expert_cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  event_title text NOT NULL,
  event_date timestamp with time zone,
  event_location text,
  event_time_details text,
  arrival_time text,
  branding_color text DEFAULT '#ED7660',
  hero_image_url text,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Expert profiles
CREATE TABLE public.industry_experts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text,
  slug text UNIQUE NOT NULL,
  job_title text,
  current_company text,
  photo_url text,
  linkedin_url text,
  field_of_work text,
  years_in_industry integer,
  years_in_city integer,
  ask_me_about text,
  favorite_media text,
  previous_companies text,
  niche_interests text[] DEFAULT '{}',
  status expert_status DEFAULT 'invited',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- City assignments
CREATE TABLE public.expert_city_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id uuid REFERENCES public.industry_experts(id) ON DELETE CASCADE NOT NULL,
  city_slug text REFERENCES public.expert_cities(slug) ON DELETE CASCADE NOT NULL,
  card_version jsonb DEFAULT '{}',
  published boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(expert_id, city_slug)
);

-- Questions
CREATE TABLE public.expert_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id uuid REFERENCES public.industry_experts(id) ON DELETE SET NULL,
  expert_name text,
  city_slug text,
  question_text text NOT NULL,
  admin_answer text,
  show_in_faq boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.expert_cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_city_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_questions ENABLE ROW LEVEL SECURITY;

-- expert_cities policies
CREATE POLICY "Public can view active cities" ON public.expert_cities FOR SELECT USING (active = true);
CREATE POLICY "Auth can insert cities" ON public.expert_cities FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth can update cities" ON public.expert_cities FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can delete cities" ON public.expert_cities FOR DELETE TO authenticated USING (true);

-- industry_experts policies
CREATE POLICY "Public can view experts" ON public.industry_experts FOR SELECT USING (true);
CREATE POLICY "Auth can insert experts" ON public.industry_experts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth can update experts" ON public.industry_experts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can delete experts" ON public.industry_experts FOR DELETE TO authenticated USING (true);

-- expert_city_assignments policies
CREATE POLICY "Public can view published assignments" ON public.expert_city_assignments FOR SELECT USING (published = true);
CREATE POLICY "Auth can insert assignments" ON public.expert_city_assignments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth can update assignments" ON public.expert_city_assignments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can delete assignments" ON public.expert_city_assignments FOR DELETE TO authenticated USING (true);

-- expert_questions policies
CREATE POLICY "Anyone can submit questions" ON public.expert_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth can view questions" ON public.expert_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth can update questions" ON public.expert_questions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can delete questions" ON public.expert_questions FOR DELETE TO authenticated USING (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_expert_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_expert_updated_at
  BEFORE UPDATE ON public.industry_experts
  FOR EACH ROW EXECUTE FUNCTION public.update_expert_updated_at();

-- Seed cities
INSERT INTO public.expert_cities (slug, name, event_title, event_location, event_time_details, arrival_time, branding_color)
VALUES
  ('denver', 'Denver', 'GATHER Denver', 'Denver, CO', '1-4 PM', '12:30 PM', '#ED7660'),
  ('portland', 'Portland', 'GATHER PNW', 'Portland, OR', '2-5 PM', '1:30 PM', '#ED7660'),
  ('minneapolis', 'Minneapolis', 'GATHER Minneapolis', 'Minneapolis, MN', 'TBD', 'TBD', '#E1B624');