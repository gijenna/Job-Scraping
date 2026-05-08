-- =========================================================
-- CAREER FAIR PHASE 1 SCHEMA
-- =========================================================

-- ---- Helper: updated_at trigger fn (re-use if exists) ----
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- ---- candidates ----
CREATE TABLE IF NOT EXISTS public.candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  phone_last_four text GENERATED ALWAYS AS (right(regexp_replace(coalesce(phone,''),'[^0-9]','','g'),4)) STORED,

  photo_url text,

  poachable_status text NOT NULL,
  career_stage text NOT NULL,
  field text NOT NULL,
  focus text NOT NULL,
  years_in_current_field integer NOT NULL DEFAULT 0,
  the_hook text NOT NULL,

  current_title text,
  current_company text,
  linkedin_url text,
  dream_role_title text,
  job_types_seeking text[] DEFAULT '{}'::text[],
  current_location text,
  open_to_relocation boolean,
  relocation_locations text,
  remote_preference text,
  areas_of_expertise text[] DEFAULT '{}'::text[],
  dream_companies jsonb DEFAULT '[]'::jsonb,
  niche_experience jsonb DEFAULT '[]'::jsonb,
  the_pitch text,
  resume_url text,
  prior_careers jsonb DEFAULT '[]'::jsonb,
  total_years_professional integer,
  outdoor_industry_experience boolean,
  outdoor_industry_years integer,
  management_experience boolean,
  management_years integer,
  min_pay_rate text,
  portfolio_url text,
  workplace_type_preference text[] DEFAULT '{}'::text[],

  dei_gender text,
  dei_race_ethnicity text[],
  dei_lgbtq text,
  dei_disability text,
  dei_veteran text,

  profile_completeness_score integer GENERATED ALWAYS AS (
    (CASE WHEN photo_url IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN current_title IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN current_company IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN linkedin_url IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN dream_role_title IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN job_types_seeking IS NOT NULL AND array_length(job_types_seeking,1) > 0 THEN 1 ELSE 0 END) +
    (CASE WHEN current_location IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN open_to_relocation IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN remote_preference IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN areas_of_expertise IS NOT NULL AND array_length(areas_of_expertise,1) > 0 THEN 1 ELSE 0 END) +
    (CASE WHEN dream_companies IS NOT NULL AND jsonb_array_length(dream_companies) > 0 THEN 1 ELSE 0 END) +
    (CASE WHEN niche_experience IS NOT NULL AND jsonb_array_length(niche_experience) > 0 THEN 1 ELSE 0 END) +
    (CASE WHEN the_pitch IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN resume_url IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN prior_careers IS NOT NULL AND jsonb_array_length(prior_careers) > 0 THEN 1 ELSE 0 END) +
    (CASE WHEN total_years_professional IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN outdoor_industry_experience IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN management_experience IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN min_pay_rate IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN portfolio_url IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN workplace_type_preference IS NOT NULL AND array_length(workplace_type_preference,1) > 0 THEN 1 ELSE 0 END)
  ) STORED
);

CREATE UNIQUE INDEX IF NOT EXISTS candidates_email_lower_idx
  ON public.candidates (lower(email));
CREATE INDEX IF NOT EXISTS candidates_login_lookup_idx
  ON public.candidates (lower(first_name), lower(last_name), phone_last_four);

DROP TRIGGER IF EXISTS candidates_updated_at ON public.candidates;
CREATE TRIGGER candidates_updated_at BEFORE UPDATE ON public.candidates
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on candidates"
  ON public.candidates FOR ALL TO public
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ---- connections ----
CREATE TABLE IF NOT EXISTS public.connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  candidate_id uuid NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  brand_id uuid REFERENCES public.event_map_brands(id) ON DELETE SET NULL,
  brand_rep_id uuid REFERENCES public.industry_experts(id) ON DELETE SET NULL,
  expert_id uuid REFERENCES public.industry_experts(id) ON DELETE SET NULL,

  private_notes text,
  contact_info_received text,
  follow_up_direction text,
  role_flagged text,
  message_to_brand text,
  message_sent_at timestamptz,
  would_want_as_mentor boolean,
  mentor_topics text
);

CREATE INDEX IF NOT EXISTS connections_candidate_idx ON public.connections(candidate_id);
CREATE INDEX IF NOT EXISTS connections_brand_idx ON public.connections(brand_id);
CREATE INDEX IF NOT EXISTS connections_brand_rep_idx ON public.connections(brand_rep_id);
CREATE INDEX IF NOT EXISTS connections_expert_idx ON public.connections(expert_id);

DROP TRIGGER IF EXISTS connections_updated_at ON public.connections;
CREATE TRIGGER connections_updated_at BEFORE UPDATE ON public.connections
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on connections"
  ON public.connections FOR ALL TO public
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ---- candidate_starred_brands ----
CREATE TABLE IF NOT EXISTS public.candidate_starred_brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  candidate_id uuid NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  brand_id uuid NOT NULL REFERENCES public.event_map_brands(id) ON DELETE CASCADE,
  UNIQUE (candidate_id, brand_id)
);
ALTER TABLE public.candidate_starred_brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on candidate_starred_brands"
  ON public.candidate_starred_brands FOR ALL TO public
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ---- brand_starred_attendee (schema only) ----
CREATE TABLE IF NOT EXISTS public.brand_starred_attendee (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  brand_id uuid NOT NULL REFERENCES public.event_map_brands(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  UNIQUE (brand_id, candidate_id)
);
ALTER TABLE public.brand_starred_attendee ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on brand_starred_attendee"
  ON public.brand_starred_attendee FOR ALL TO public
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ---- filter_logs ----
CREATE TABLE IF NOT EXISTS public.filter_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  brand_rep_id uuid REFERENCES public.industry_experts(id) ON DELETE SET NULL,
  filters_applied jsonb,
  keyword_search text,
  results_count integer,
  wishlist_query text
);
ALTER TABLE public.filter_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on filter_logs"
  ON public.filter_logs FOR ALL TO public
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ---- email_templates ----
CREATE TABLE IF NOT EXISTS public.email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key text UNIQUE NOT NULL,
  subject text,
  body text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text
);
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on email_templates"
  ON public.email_templates FOR ALL TO public
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE TABLE IF NOT EXISTS public.email_template_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES public.email_templates(id) ON DELETE CASCADE,
  subject text,
  body text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.email_template_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on email_template_versions"
  ON public.email_template_versions FOR ALL TO public
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Seed one template
INSERT INTO public.email_templates (template_key, subject, body)
VALUES ('candidate_signup_confirmation',
        'Welcome to Outside Days, {first_name}',
        'Hi {first_name}, your career fair profile is ready. See you in Denver.')
ON CONFLICT (template_key) DO NOTHING;

-- ---- user_sessions (custom auth) ----
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL,
  subject_type text NOT NULL CHECK (subject_type IN ('candidate','brand_rep')),
  subject_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  last_seen_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS user_sessions_token_idx ON public.user_sessions(token);
CREATE INDEX IF NOT EXISTS user_sessions_subject_idx ON public.user_sessions(subject_type, subject_id);

ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on user_sessions"
  ON public.user_sessions FOR ALL TO public
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ---- extend event_map_brands ----
ALTER TABLE public.event_map_brands
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

-- ---- extend industry_experts (brand rep login) ----
ALTER TABLE public.industry_experts
  ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.industry_experts
  ADD COLUMN IF NOT EXISTS phone_last_four text
  GENERATED ALWAYS AS (right(regexp_replace(coalesce(phone,''),'[^0-9]','','g'),4)) STORED;
CREATE INDEX IF NOT EXISTS industry_experts_login_lookup_idx
  ON public.industry_experts (lower(full_name), phone_last_four);

-- ---- Storage buckets ----
INSERT INTO storage.buckets (id, name, public)
VALUES ('candidate-photos','candidate-photos', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('candidate-resumes','candidate-resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Service-role-only access (anon and authenticated have no policies, so they can't access)
CREATE POLICY "Service role can read candidate-photos"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'candidate-photos' AND auth.role() = 'service_role');
CREATE POLICY "Service role can write candidate-photos"
  ON storage.objects FOR INSERT TO public
  WITH CHECK (bucket_id = 'candidate-photos' AND auth.role() = 'service_role');
CREATE POLICY "Service role can update candidate-photos"
  ON storage.objects FOR UPDATE TO public
  USING (bucket_id = 'candidate-photos' AND auth.role() = 'service_role');
CREATE POLICY "Service role can delete candidate-photos"
  ON storage.objects FOR DELETE TO public
  USING (bucket_id = 'candidate-photos' AND auth.role() = 'service_role');

CREATE POLICY "Service role can read candidate-resumes"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'candidate-resumes' AND auth.role() = 'service_role');
CREATE POLICY "Service role can write candidate-resumes"
  ON storage.objects FOR INSERT TO public
  WITH CHECK (bucket_id = 'candidate-resumes' AND auth.role() = 'service_role');
CREATE POLICY "Service role can update candidate-resumes"
  ON storage.objects FOR UPDATE TO public
  USING (bucket_id = 'candidate-resumes' AND auth.role() = 'service_role');
CREATE POLICY "Service role can delete candidate-resumes"
  ON storage.objects FOR DELETE TO public
  USING (bucket_id = 'candidate-resumes' AND auth.role() = 'service_role');
