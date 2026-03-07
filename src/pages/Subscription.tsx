import { useState } from 'react';
import { Check, Crown, Loader2, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

const paymentSchema = z.object({
  email: z.string().trim().email('Invalid email address').max(255),
  upiId: z.string().trim().min(3, 'Invalid UPI ID').max(100).regex(/^[\w.\-]+@[\w]+$/, 'Invalid UPI ID format (e.g. name@upi)'),
});

const Subscription = () => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  const [upiId, setUpiId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const plan = {
    name: 'Premium',
    price: '₹20',
    period: '/month',
    description: 'Unlock the complete spiritual library',
    features: [
      'Access to all scriptures',
      'Ad-free experience',
      'Offline reading',
      'Priority support',
      'Exclusive content',
      'Reading progress sync',
    ],
    icon: Crown,
  };

  const handlePaymentRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = paymentSchema.safeParse({ email, upiId });
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    if (!user) {
      toast.error('Please log in first');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('payment_requests').insert({
        user_id: user.id,
        email: result.data.email,
        upi_id: result.data.upiId,
        amount: 20,
        status: 'pending',
      });

      if (error) throw error;

      toast.success('Payment request submitted! You will receive a UPI payment request shortly.');
      setSubmitted(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit payment request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Choose Your Spiritual Journey
          </h1>
          <p className="text-muted-foreground text-lg">
            Support the preservation of sacred texts and unlock the complete library of ancient wisdom.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plan Card */}
          <Card className="relative flex flex-col border-primary shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                Best Value
              </span>
            </div>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <plan.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm"> {plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-primary" />
                Pay via UPI
              </CardTitle>
              <CardDescription>
                Enter your details below. We'll send a UPI payment request to your UPI ID.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              {submitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                    <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-foreground">Request Submitted!</h3>
                  <p className="text-sm text-muted-foreground">
                    A UPI payment request of ₹20 will be sent to your UPI ID shortly. 
                    Once verified, your premium access will be activated.
                  </p>
                  <Button variant="outline" onClick={() => setSubmitted(false)}>
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handlePaymentRequest} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="pay-email">Email Address *</Label>
                    <Input
                      id="pay-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upi-id">UPI ID *</Label>
                    <Input
                      id="upi-id"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@upi"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      e.g. name@paytm, name@gpay, name@phonepe
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="text-lg om-symbol animate-om-spin">ॐ</span>
                        Submitting...
                      </>
                    ) : (
                      'Submit Payment Request'
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 text-muted-foreground">
          <p className="text-sm">
            After payment verification, your premium access will be activated within 24 hours.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Subscription;
