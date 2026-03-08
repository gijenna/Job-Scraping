-- Add expert_type to assignments (per-event type)
ALTER TABLE public.expert_city_assignments ADD COLUMN expert_type text NOT NULL DEFAULT 'industry_expert';

-- Copy existing type data from industry_experts to assignments
UPDATE public.expert_city_assignments eca
SET expert_type = ie.expert_type
FROM public.industry_experts ie
WHERE eca.expert_id = ie.id AND ie.expert_type != 'industry_expert';

-- Drop the column from industry_experts (no longer needed there)
ALTER TABLE public.industry_experts DROP COLUMN expert_type;