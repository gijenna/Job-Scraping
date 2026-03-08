DROP POLICY IF EXISTS "Anyone can upload expert photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update expert photos" ON storage.objects;

CREATE POLICY "Anyone can upload expert photos" ON storage.objects
FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'email-assets' AND (storage.foldername(name))[1] = 'expert-photos');

CREATE POLICY "Anyone can update expert photos" ON storage.objects
FOR UPDATE TO anon, authenticated
USING (bucket_id = 'email-assets' AND (storage.foldername(name))[1] = 'expert-photos')
WITH CHECK (bucket_id = 'email-assets' AND (storage.foldername(name))[1] = 'expert-photos');