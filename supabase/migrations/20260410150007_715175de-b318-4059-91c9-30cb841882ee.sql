
CREATE TABLE public.link_clicks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  page_path text NOT NULL,
  link_url text NOT NULL,
  link_text text,
  session_id text
);

ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert link clicks"
ON public.link_clicks FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Authenticated can view link clicks"
ON public.link_clicks FOR SELECT
TO authenticated
USING (true);

CREATE INDEX idx_link_clicks_page_path ON public.link_clicks (page_path);
CREATE INDEX idx_link_clicks_link_url ON public.link_clicks (link_url);
