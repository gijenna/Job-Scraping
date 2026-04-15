-- Update all event pages to use the Basecamp favicon
INSERT INTO event_settings (event_slug, setting_key, setting_value)
VALUES 
  ('pnw26', 'page_favicon', 'https://qpnzjcbdtybwazceggmv.supabase.co/storage/v1/object/public/page-meta/basecamp-favicon.png'),
  ('outsidedays26', 'page_favicon', 'https://qpnzjcbdtybwazceggmv.supabase.co/storage/v1/object/public/page-meta/basecamp-favicon.png'),
  ('outsidedays26-cos', 'page_favicon', 'https://qpnzjcbdtybwazceggmv.supabase.co/storage/v1/object/public/page-meta/basecamp-favicon.png'),
  ('events', 'page_favicon', 'https://qpnzjcbdtybwazceggmv.supabase.co/storage/v1/object/public/page-meta/basecamp-favicon.png'),
  ('gather-pnw', 'page_favicon', 'https://qpnzjcbdtybwazceggmv.supabase.co/storage/v1/object/public/page-meta/basecamp-favicon.png'),
  ('gather-denver', 'page_favicon', 'https://qpnzjcbdtybwazceggmv.supabase.co/storage/v1/object/public/page-meta/basecamp-favicon.png')
ON CONFLICT (event_slug, setting_key) 
DO UPDATE SET setting_value = EXCLUDED.setting_value;