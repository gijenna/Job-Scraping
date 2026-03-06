
-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  cost DECIMAL DEFAULT 0,
  registration_link TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('in-person', 'digital', 'workshop')),
  location TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public can view events" ON public.events FOR SELECT USING (true);

-- Authenticated insert
CREATE POLICY "Authenticated users can insert events" ON public.events FOR INSERT TO authenticated WITH CHECK (true);

-- Creator can update
CREATE POLICY "Creator can update events" ON public.events FOR UPDATE TO authenticated USING (auth.uid() = created_by);

-- Creator can delete
CREATE POLICY "Creator can delete events" ON public.events FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Storage bucket for event photos
INSERT INTO storage.buckets (id, name, public) VALUES ('event-photos', 'event-photos', true);

-- Storage policies
CREATE POLICY "Event photos are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'event-photos');

CREATE POLICY "Authenticated users can upload event photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'event-photos');

CREATE POLICY "Authenticated users can update event photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'event-photos');

CREATE POLICY "Authenticated users can delete event photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'event-photos');
