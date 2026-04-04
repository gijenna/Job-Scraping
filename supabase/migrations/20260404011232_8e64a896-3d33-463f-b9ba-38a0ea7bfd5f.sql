
-- Create event_map_brands table
CREATE TABLE public.event_map_brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_slug text NOT NULL DEFAULT 'denver26',
  name text NOT NULL,
  description text,
  logo_url text,
  website_url text,
  table_count integer NOT NULL DEFAULT 1,
  is_activation boolean NOT NULL DEFAULT false,
  sponsor_brand_id uuid REFERENCES public.event_map_brands(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.event_map_brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view map brands" ON public.event_map_brands FOR SELECT TO public USING (true);
CREATE POLICY "Auth can insert map brands" ON public.event_map_brands FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth can update map brands" ON public.event_map_brands FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can delete map brands" ON public.event_map_brands FOR DELETE TO authenticated USING (true);

-- Create event_map_layouts table
CREATE TABLE public.event_map_layouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_slug text NOT NULL DEFAULT 'denver26',
  brand_id uuid NOT NULL REFERENCES public.event_map_brands(id) ON DELETE CASCADE,
  layout_type text NOT NULL DEFAULT 'draft',
  x integer NOT NULL DEFAULT 0,
  y integer NOT NULL DEFAULT 0,
  shape text NOT NULL DEFAULT 'line',
  rotation integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.event_map_layouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view map layouts" ON public.event_map_layouts FOR SELECT TO public USING (true);
CREATE POLICY "Auth can insert map layouts" ON public.event_map_layouts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth can update map layouts" ON public.event_map_layouts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can delete map layouts" ON public.event_map_layouts FOR DELETE TO authenticated USING (true);
