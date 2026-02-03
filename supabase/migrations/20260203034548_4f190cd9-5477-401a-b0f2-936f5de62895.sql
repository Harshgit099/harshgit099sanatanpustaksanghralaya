-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- info, update, event, announcement
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Anyone can view active notifications
CREATE POLICY "Anyone can view active notifications"
ON public.notifications
FOR SELECT
USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- Admins and moderators can manage notifications
CREATE POLICY "Admins and moderators can insert notifications"
ON public.notifications
FOR INSERT
WITH CHECK (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Admins and moderators can update notifications"
ON public.notifications
FOR UPDATE
USING (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Admins and moderators can delete notifications"
ON public.notifications
FOR DELETE
USING (is_admin_or_moderator(auth.uid()));

-- Create user_notification_reads to track which notifications a user has read
CREATE TABLE public.user_notification_reads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, notification_id)
);

-- Enable RLS
ALTER TABLE public.user_notification_reads ENABLE ROW LEVEL SECURITY;

-- Users can view their own reads
CREATE POLICY "Users can view their own notification reads"
ON public.user_notification_reads
FOR SELECT
USING (auth.uid() = user_id);

-- Users can mark notifications as read
CREATE POLICY "Users can mark notifications as read"
ON public.user_notification_reads
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own reads
CREATE POLICY "Users can delete their own notification reads"
ON public.user_notification_reads
FOR DELETE
USING (auth.uid() = user_id);