import { Check, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';

const Subscription = () => {
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
    buttonText: 'Coming Soon',
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Choose Your Spiritual Journey
          </h1>
          <p className="text-muted-foreground text-lg">
            Support the preservation of sacred texts and unlock the complete library of ancient wisdom.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="flex justify-center max-w-md mx-auto">
          <Card className="relative flex flex-col border-primary shadow-lg w-full">
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
            <CardFooter>
              <Button 
                className="w-full"
                disabled
              >
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12 text-muted-foreground">
          <p className="text-sm">
            All plans include access to our mobile-friendly reader. Premium features coming soon!
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Subscription;
