ALTER TABLE public.afterparty_attendees
ADD COLUMN IF NOT EXISTS phone text;

CREATE INDEX IF NOT EXISTS idx_afterparty_attendees_phone_last4
ON public.afterparty_attendees ((right(regexp_replace(phone, '\D', '', 'g'), 4)));