ALTER TABLE public.connect_notes ADD COLUMN IF NOT EXISTS note_cta text;
ALTER TABLE public.connect_notes DROP CONSTRAINT IF EXISTS connect_notes_note_cta_check;
ALTER TABLE public.connect_notes ADD CONSTRAINT connect_notes_note_cta_check CHECK (note_cta IS NULL OR note_cta IN ('follow_up','look_out_for_application','grab_coffee','memorable_only'));
ALTER TABLE public.connect_notes DROP CONSTRAINT IF EXISTS connect_notes_note_timing_check;
ALTER TABLE public.connect_notes ADD CONSTRAINT connect_notes_note_timing_check CHECK (note_timing IN ('pre_event','during_event','post_event'));