INSERT INTO public.event_settings (event_slug, setting_key, setting_value)
VALUES (
  'afterparty',
  'afterparty.extra_niches',
  COALESCE((
    SELECT string_agg(value, ', ' ORDER BY lower(value))
    FROM (
      SELECT DISTINCT ON (lower(trim(value))) trim(value) AS value
      FROM public.afterparty_suggestions
      WHERE kind = 'niche'
        AND status = 'approved'
        AND trim(value) <> ''
      ORDER BY lower(trim(value)), reviewed_at DESC NULLS LAST, created_at DESC
    ) approved_niches
  ), '')
)
ON CONFLICT (event_slug, setting_key)
DO UPDATE SET setting_value = EXCLUDED.setting_value;