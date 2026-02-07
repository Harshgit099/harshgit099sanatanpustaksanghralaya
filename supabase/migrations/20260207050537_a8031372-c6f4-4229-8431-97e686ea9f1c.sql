
-- Payment requests table
CREATE TABLE public.payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  upi_id TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 20,
  status TEXT NOT NULL DEFAULT 'pending',
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payment requests"
ON public.payment_requests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payment requests"
ON public.payment_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payment requests"
ON public.payment_requests FOR SELECT
USING (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Admins can update payment requests"
ON public.payment_requests FOR UPDATE
USING (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Admins can delete payment requests"
ON public.payment_requests FOR DELETE
USING (is_admin_or_moderator(auth.uid()));

CREATE TRIGGER update_payment_requests_updated_at
BEFORE UPDATE ON public.payment_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Contact messages table
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact message (even unauthenticated via anon key)
CREATE POLICY "Anyone can submit contact messages"
ON public.contact_messages FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view contact messages"
ON public.contact_messages FOR SELECT
USING (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Admins can update contact messages"
ON public.contact_messages FOR UPDATE
USING (is_admin_or_moderator(auth.uid()));

CREATE POLICY "Admins can delete contact messages"
ON public.contact_messages FOR DELETE
USING (is_admin_or_moderator(auth.uid()));
