-- Add display_order column for chronological ordering within categories
ALTER TABLE public.scriptures ADD COLUMN display_order integer DEFAULT 100;

-- Update Vedas scriptures in chronological order
UPDATE public.scriptures SET display_order = 1 WHERE title = 'Rigveda';
UPDATE public.scriptures SET display_order = 2 WHERE title = 'Yajurveda';
UPDATE public.scriptures SET display_order = 3 WHERE title = 'Samaveda';
UPDATE public.scriptures SET display_order = 4 WHERE title = 'Atharvaveda';
UPDATE public.scriptures SET display_order = 5 WHERE title = 'Upanishads';