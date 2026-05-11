
ALTER TABLE public.event_map_brands
  ADD COLUMN IF NOT EXISTS lead_question_intro text,
  ADD COLUMN IF NOT EXISTS lead_question_text text,
  ADD COLUMN IF NOT EXISTS lead_question_option_1 text,
  ADD COLUMN IF NOT EXISTS lead_question_option_2 text,
  ADD COLUMN IF NOT EXISTS lead_question_option_3 text,
  ADD COLUMN IF NOT EXISTS lead_question_active boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS lead_capture_visible_to_brand boolean NOT NULL DEFAULT true;

ALTER TABLE public.brand_lead_responses
  ADD COLUMN IF NOT EXISTS response_label text;

-- Allow response_value to hold new slugs (option_1/2/3); legacy "soon"/"eventually" remain valid.
-- No CHECK constraint exists, so nothing to drop.

INSERT INTO public.event_settings (event_slug, setting_key, setting_value)
VALUES ('outsidedays26', 'show_court_3', 'false')
ON CONFLICT DO NOTHING;

-- Backfill Edges First lead question (keep legacy "soon"/"eventually" semantics).
UPDATE public.event_map_brands
SET lead_question_intro = 'Kelly''s a women-led dev shop building beautiful sites for small orgs that help people get outside. She works with all budgets.',
    lead_question_text = 'Want to remember Kelly for future web work?',
    lead_question_option_1 = 'Yes, and I''ll need something soon',
    lead_question_option_2 = 'Yes, and I''ll need something eventually',
    lead_question_option_3 = NULL,
    lead_question_active = true,
    lead_capture_visible_to_brand = true
WHERE event_slug = 'denver26' AND lower(name) ILIKE '%edges first%';

-- Configure Basecamp.
UPDATE public.event_map_brands
SET lead_question_intro = 'Basecamp is building the jobs platform built for the outdoor industry.',
    lead_question_text = 'Do you want early access to Basecampjobs.com?',
    lead_question_option_1 = 'Yes',
    lead_question_option_2 = 'Already have it!',
    lead_question_option_3 = 'No, I will never be hiring, job hunting, or networking ever again!',
    lead_question_active = true,
    lead_capture_visible_to_brand = true
WHERE event_slug = 'denver26' AND lower(name) ILIKE '%basecamp%';

-- Create Oakley brand if missing.
INSERT INTO public.event_map_brands (
  event_slug, name, aliases, is_featured, is_activation, table_count,
  lead_question_intro, lead_question_text,
  lead_question_option_1, lead_question_option_2, lead_question_option_3,
  lead_question_active, lead_capture_visible_to_brand
)
SELECT 'denver26', 'Oakley', ARRAY['Oakley'], true, false, 1,
  'Have you visited the new Oakley store in RiNo? It''s modeled after their store in Milan, Italy.',
  'What would get you there?',
  'A discount',
  'A Meta glasses or goggles demo',
  'An in-store event like yoga',
  true, false
WHERE NOT EXISTS (
  SELECT 1 FROM public.event_map_brands
  WHERE event_slug = 'denver26' AND lower(name) = 'oakley'
);

-- Place Oakley on the map (open spot on Court 1) if not already placed.
INSERT INTO public.event_map_layouts (event_slug, brand_id, x, y, shape, rotation, layout_type)
SELECT 'denver26', b.id, 200, 700, 'line', 0, 'draft'
FROM public.event_map_brands b
WHERE b.event_slug = 'denver26' AND lower(b.name) = 'oakley'
  AND NOT EXISTS (
    SELECT 1 FROM public.event_map_layouts l
    WHERE l.event_slug = 'denver26' AND l.brand_id = b.id
  );
