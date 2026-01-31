-- Allow admins and moderators to insert scriptures
CREATE POLICY "Admins and moderators can insert scriptures"
ON public.scriptures
FOR INSERT
WITH CHECK (public.is_admin_or_moderator(auth.uid()));

-- Allow admins and moderators to update scriptures
CREATE POLICY "Admins and moderators can update scriptures"
ON public.scriptures
FOR UPDATE
USING (public.is_admin_or_moderator(auth.uid()));

-- Allow admins and moderators to delete scriptures
CREATE POLICY "Admins and moderators can delete scriptures"
ON public.scriptures
FOR DELETE
USING (public.is_admin_or_moderator(auth.uid()));