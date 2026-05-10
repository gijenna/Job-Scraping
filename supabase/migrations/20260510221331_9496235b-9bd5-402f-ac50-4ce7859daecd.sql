CREATE TABLE public.brand_lead_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL,
  brand_id uuid NOT NULL,
  response_value text NOT NULL CHECK (response_value IN ('soon','eventually')),
  question_text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (candidate_id, brand_id)
);

CREATE INDEX idx_brand_lead_responses_brand ON public.brand_lead_responses (brand_id, updated_at DESC);

ALTER TABLE public.brand_lead_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on brand_lead_responses"
  ON public.brand_lead_responses
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE TRIGGER trg_brand_lead_responses_updated_at
  BEFORE UPDATE ON public.brand_lead_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();