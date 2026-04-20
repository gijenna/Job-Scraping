-- Sequence for attendee numbers
CREATE SEQUENCE IF NOT EXISTS public.afterparty_attendee_number_seq START 1;

CREATE TABLE public.afterparty_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attendee_number integer NOT NULL DEFAULT nextval('public.afterparty_attendee_number_seq') UNIQUE,
  full_name text NOT NULL,
  slug text NOT NULL UNIQUE,
  email text,
  photo_url text,
  social_links jsonb DEFAULT '{}'::jsonb,
  role text NOT NULL CHECK (role IN ('creator', 'brand')),
  -- shared
  niches text[] DEFAULT '{}'::text[],
  looking_for text[] DEFAULT '{}'::text[],
  -- creator
  creator_types text[] DEFAULT '{}'::text[],
  audience_size text,
  platforms text[] DEFAULT '{}'::text[],
  brands_wishlist text,
  mind_blowing_fact text,
  -- brand
  company text,
  company_role text,
  brand_seeking text[] DEFAULT '{}'::text[],
  budget_range text,
  brand_fit_notes text,
  status text DEFAULT 'invited',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER SEQUENCE public.afterparty_attendee_number_seq OWNED BY public.afterparty_attendees.attendee_number;

CREATE TABLE public.afterparty_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attendee_id uuid NOT NULL REFERENCES public.afterparty_attendees(id) ON DELETE CASCADE,
  match_attendee_id uuid NOT NULL REFERENCES public.afterparty_attendees(id) ON DELETE CASCADE,
  score integer NOT NULL DEFAULT 0,
  reasons text[] DEFAULT '{}'::text[],
  rank integer,
  locked boolean NOT NULL DEFAULT false,
  generated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (attendee_id, match_attendee_id)
);

CREATE INDEX idx_afterparty_matches_attendee ON public.afterparty_matches(attendee_id, rank);

-- Updated_at trigger
CREATE TRIGGER afterparty_attendees_updated_at
  BEFORE UPDATE ON public.afterparty_attendees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_expert_updated_at();

ALTER TABLE public.afterparty_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.afterparty_matches ENABLE ROW LEVEL SECURITY;

-- Attendees: public read, public insert/update (name-edit flow), auth delete
CREATE POLICY "Public can view attendees" ON public.afterparty_attendees FOR SELECT USING (true);
CREATE POLICY "Public can insert attendees" ON public.afterparty_attendees FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Public can update attendees" ON public.afterparty_attendees FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Auth can insert attendees" ON public.afterparty_attendees FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth can update attendees" ON public.afterparty_attendees FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can delete attendees" ON public.afterparty_attendees FOR DELETE TO authenticated USING (true);

-- Matches: public read, auth-only writes
CREATE POLICY "Public can view matches" ON public.afterparty_matches FOR SELECT USING (true);
CREATE POLICY "Auth can insert matches" ON public.afterparty_matches FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth can update matches" ON public.afterparty_matches FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can delete matches" ON public.afterparty_matches FOR DELETE TO authenticated USING (true);