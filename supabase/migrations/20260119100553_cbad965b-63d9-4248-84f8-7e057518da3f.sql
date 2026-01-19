-- Drop the restrictive policy and create a permissive one
DROP POLICY IF EXISTS "Anyone can view scriptures" ON public.scriptures;

-- Create a permissive policy for public access
CREATE POLICY "Anyone can view scriptures" 
ON public.scriptures 
FOR SELECT 
TO public
USING (true);