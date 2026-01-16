-- Add translation_group_id to link different language versions of the same book
ALTER TABLE public.scriptures 
ADD COLUMN translation_group_id uuid DEFAULT NULL;

-- Add index for faster lookups
CREATE INDEX idx_scriptures_translation_group ON public.scriptures(translation_group_id);

-- Add comment explaining the column
COMMENT ON COLUMN public.scriptures.translation_group_id IS 'Groups different language versions of the same scripture together';