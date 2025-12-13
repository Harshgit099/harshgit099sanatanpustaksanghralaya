import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Music, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface Mantra {
  id: string;
  title: string;
  title_hindi: string | null;
  description: string | null;
  total_verses: number | null;
}

const MantraSection = () => {
  const [mantras, setMantras] = useState<Mantra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMantras = async () => {
      const { data, error } = await supabase
        .from('scriptures')
        .select('id, title, title_hindi, description, total_verses')
        .eq('category', 'Mantras')
        .limit(6);

      if (!error && data) {
        setMantras(data);
      }
      setLoading(false);
    };

    fetchMantras();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (mantras.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Divine Prayers</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Sacred <span className="text-primary">Mantras</span>
            </h2>
            <p className="text-muted-foreground mt-2">
              Experience the power of ancient hymns and prayers
            </p>
          </div>
          <Button asChild variant="outline" className="group">
            <Link to="/library?category=Mantras">
              View All Mantras
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Mantras Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mantras.map((mantra, index) => (
            <Link
              key={mantra.id}
              to={`/scripture/${mantra.id}`}
              className="group opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <article className="relative h-full glass-card rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border border-amber-500/20 hover:border-amber-500/40">
                {/* Decorative Gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-amber-500/10 rounded-full blur-xl" />
                
                <div className="relative flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Music className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {mantra.title}
                    </h3>
                    
                    {mantra.title_hindi && (
                      <p className="font-devanagari text-amber-600/80 dark:text-amber-400/80 text-sm">
                        {mantra.title_hindi}
                      </p>
                    )}
                    
                    {mantra.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                        {mantra.description}
                      </p>
                    )}

                    {mantra.total_verses && (
                      <div className="flex items-center gap-1 mt-3 text-xs text-amber-600 dark:text-amber-400">
                        <span>{mantra.total_verses} Verses</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-5 h-5 text-amber-500" />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MantraSection;
