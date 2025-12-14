-- Add parent_scripture_id for hierarchical volumes
ALTER TABLE public.scriptures 
ADD COLUMN parent_scripture_id uuid REFERENCES public.scriptures(id) ON DELETE CASCADE;

-- Update Volume 1 to link to parent Mahabharata
UPDATE public.scriptures 
SET parent_scripture_id = '12b4ff8b-2ca3-4e38-8bec-3104f91d594a'
WHERE id = 'a21b84c7-3a55-4e80-9f1e-18cbe4c7d83b';

-- Insert Volume 2
INSERT INTO public.scriptures (
  title, title_hindi, description, description_hindi, category, subcategory, 
  author, pdf_url, parent_scripture_id, total_chapters
) VALUES (
  'Mahabharata Volume 2',
  'महाभारत (द्वितीय खंड)',
  'The second volume of the Mahabharata, continuing the great epic of the Kurukshetra War.',
  'महाभारत का दूसरा खंड, कुरुक्षेत्र युद्ध की महान गाथा जारी।',
  'Itihasa',
  'Epic',
  'Vyasa',
  '/pdfs/mahabharata-volume-2.pdf',
  '12b4ff8b-2ca3-4e38-8bec-3104f91d594a',
  18
);