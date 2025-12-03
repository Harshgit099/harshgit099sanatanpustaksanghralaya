import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface Scripture {
  id: string;
  title: string;
  title_hindi: string | null;
  description: string | null;
  category: string;
  total_chapters: number | null;
  total_verses: number | null;
}

const FeaturedSection = () => {
  const [scriptures, setScriptures] = useState<Scripture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedScriptures = async () => {
      const { data, error } = await supabase
        .from('scriptures')
        .select('*')
        .eq('featured', true)
        .limit(4);

      if (!error && data) {
        setScriptures(data);
      }
      setLoading(false);
    };

    fetchFeaturedScriptures();
  }, []);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Vedas: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      Puranas: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      Itihasa: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    };
    return colors[category] || 'bg-primary/10 text-primary';
  };

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-accent fill-accent" />
              <span className="text-sm font-medium text-accent">Featured Collection</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Sacred <span className="text-primary">Scriptures</span>
            </h2>
          </div>
          <Button asChild variant="outline" className="group">
            <Link to="/library">
              View All
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scriptures.map((scripture, index) => (
            <Link
              key={scripture.id}
              to={`/scripture/${scripture.id}`}
              className="group opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <article className="relative h-full glass-card rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
                {/* Decorative Element */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl" />
                
                <div className="relative flex gap-5">
                  {/* Book Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-28 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      <BookOpen className="w-10 h-10 text-primary-foreground" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mb-2 ${getCategoryColor(scripture.category)}`}>
                      {scripture.category}
                    </div>
                    
                    <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                      {scripture.title}
                    </h3>
                    
                    {scripture.title_hindi && (
                      <p className="font-devanagari text-muted-foreground text-sm mb-2">
                        {scripture.title_hindi}
                      </p>
                    )}
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {scripture.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {scripture.total_chapters && (
                        <span>{scripture.total_chapters} Chapters</span>
                      )}
                      {scripture.total_verses && (
                        <span>{scripture.total_verses.toLocaleString()} Verses</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Read More Indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-primary text-sm font-medium">Read →</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
