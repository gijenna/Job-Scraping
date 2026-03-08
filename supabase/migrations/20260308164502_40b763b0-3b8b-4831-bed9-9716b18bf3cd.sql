CREATE POLICY "Anyone can view expert photos"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'email-assets' AND (storage.foldername(name))[1] = 'expert-photos');