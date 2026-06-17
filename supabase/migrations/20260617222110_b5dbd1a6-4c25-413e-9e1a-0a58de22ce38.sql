ALTER TABLE public.expert_city_assignments
  ADD COLUMN IF NOT EXISTS attend_aug20_happyhour boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS attend_aug21_brunch boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.mn_past_expert_hidden (
  expert_id uuid PRIMARY KEY REFERENCES public.industry_experts(id) ON DELETE CASCADE,
  hidden_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.mn_past_expert_hidden TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mn_past_expert_hidden TO authenticated;
GRANT ALL ON public.mn_past_expert_hidden TO service_role;

ALTER TABLE public.mn_past_expert_hidden ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view hidden list" ON public.mn_past_expert_hidden FOR SELECT USING (true);
CREATE POLICY "Auth can insert hidden" ON public.mn_past_expert_hidden FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth can delete hidden" ON public.mn_past_expert_hidden FOR DELETE TO authenticated USING (true);

UPDATE public.expert_cities SET event_title = 'Basecamp Outdoor @ OR Gatherings' WHERE slug = 'minneapolis';