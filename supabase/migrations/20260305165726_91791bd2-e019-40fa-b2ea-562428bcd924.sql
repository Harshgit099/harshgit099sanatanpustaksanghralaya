
ALTER TABLE public.profiles
ADD COLUMN subscription_start timestamp with time zone DEFAULT NULL,
ADD COLUMN subscription_end timestamp with time zone DEFAULT NULL,
ADD COLUMN is_subscribed boolean DEFAULT false;
