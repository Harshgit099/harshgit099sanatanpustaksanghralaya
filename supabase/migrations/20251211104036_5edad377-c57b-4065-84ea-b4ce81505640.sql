-- Create storage bucket for scripture PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('scripture-pdfs', 'scripture-pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for public read access
CREATE POLICY "Public can view scripture PDFs"
ON storage.objects FOR SELECT
USING (bucket_id = 'scripture-pdfs');

-- Create policy for authenticated uploads (admin)
CREATE POLICY "Authenticated users can upload scripture PDFs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'scripture-pdfs' AND auth.role() = 'authenticated');

-- Add pdf_url column to scriptures table
ALTER TABLE public.scriptures
ADD COLUMN IF NOT EXISTS pdf_url TEXT;