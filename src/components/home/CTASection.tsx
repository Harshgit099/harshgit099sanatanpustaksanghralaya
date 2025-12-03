import { Link } from 'react-router-dom';
import { UserPlus, BookMarked, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const CTASection = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: BookMarked,
      title: 'Save Bookmarks',
      description: 'Mark your favorite verses and passages for quick reference',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Continue reading from where you left off across all scriptures',
    },
    {
      icon: UserPlus,
      title: 'Personalized Experience',
      description: 'Get recommendations based on your reading preferences',
    },
  ];

  if (user) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Heading */}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 opacity-0 animate-fade-in">
            Begin Your <span className="gradient-text">Spiritual Journey</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto opacity-0 animate-fade-in animation-delay-100">
            Create a free account to unlock personalized features and enhance your reading experience
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${(index + 2) * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="opacity-0 animate-fade-in-up animation-delay-500">
            <Button asChild size="lg" className="group glow-primary px-8">
              <Link to="/auth">
                <UserPlus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Create Free Account
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
