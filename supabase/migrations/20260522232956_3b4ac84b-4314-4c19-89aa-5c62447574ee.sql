
-- Parent-company support for event_map_brands
ALTER TABLE public.event_map_brands
  ADD COLUMN IF NOT EXISTS parent_brand_id uuid REFERENCES public.event_map_brands(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS primary_child boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS map_size text NOT NULL DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS child_logo_ids uuid[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS extra_logo_urls jsonb NOT NULL DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_event_map_brands_parent ON public.event_map_brands(parent_brand_id);

-- Per-rep/expert restriction: if set, expert only appears under listed brand names (case-insensitive match against brand.name or alias)
ALTER TABLE public.industry_experts
  ADD COLUMN IF NOT EXISTS restricted_to_brand_names text[];
