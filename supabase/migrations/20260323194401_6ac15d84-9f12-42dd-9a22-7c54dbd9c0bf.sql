
-- Create page-meta storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('page-meta', 'page-meta', true);

-- Allow authenticated users to upload to page-meta bucket
CREATE POLICY "Authenticated can upload page-meta"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'page-meta');

-- Allow authenticated users to update page-meta objects
CREATE POLICY "Authenticated can update page-meta"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'page-meta')
WITH CHECK (bucket_id = 'page-meta');

-- Allow authenticated users to delete page-meta objects
CREATE POLICY "Authenticated can delete page-meta"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'page-meta');

-- Allow public to view page-meta objects
CREATE POLICY "Public can view page-meta"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'page-meta');
