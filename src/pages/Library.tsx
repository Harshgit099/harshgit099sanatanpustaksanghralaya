import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, BookOpen } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ScriptureCard from '@/components/scripture/ScriptureCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Scripture {
  id: string;
  title: string;
  title_hindi: string | null;
  description: string | null;
  category: string;
  subcategory: string | null;
  author: string | null;
  total_chapters: number | null;
  total_verses: number | null;
  featured: boolean | null;
}

interface ReadingProgress {
  scripture_id: string;
  progress_percentage: number;
}

const categories = [
  'All',
  'Vedas',
  'Puranas',
  'Itihasa',
  'Darshana',
  'Smriti',
  'Shastra',
];

const Library = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [scriptures, setScriptures] = useState<Scripture[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch scriptures
      let query = supabase.from('scriptures').select('*');

      if (selectedCategory !== 'All') {
        query = query.ilike('category', selectedCategory);
      }

      if (searchQuery) {
        query = query.or(
          `title.ilike.%${searchQuery}%,title_hindi.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`
        );
      }

      const { data: scripturesData, error } = await query.order('title');

      if (!error && scripturesData) {
        setScriptures(scripturesData);
      }

      // Fetch reading progress if user is logged in
      if (user) {
        const { data: progressData } = await supabase
          .from('reading_progress')
          .select('scripture_id, progress_percentage')
          .eq('user_id', user.id);

        if (progressData) {
          const progressMap: Record<string, number> = {};
          progressData.forEach((p: ReadingProgress) => {
            progressMap[p.scripture_id] = Number(p.progress_percentage);
          });
          setProgress(progressMap);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [selectedCategory, searchQuery, user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams((params) => {
      if (searchQuery) {
        params.set('search', searchQuery);
      } else {
        params.delete('search');
      }
      return params;
    });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchParams((params) => {
      if (category !== 'All') {
        params.set('category', category.toLowerCase());
      } else {
        params.delete('category');
      }
      return params;
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSearchParams({});
  };

  return (
    <Layout>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2 opacity-0 animate-fade-in">
              Scripture <span className="text-primary">Library</span>
            </h1>
            <p className="text-muted-foreground opacity-0 animate-fade-in animation-delay-100">
              Explore our collection of sacred Hindu texts
            </p>
          </div>

          {/* Search & Filters */}
          <div className="mb-8 space-y-4 opacity-0 animate-fade-in animation-delay-200">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search scriptures, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
              <Button
                type="button"
                variant="outline"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
              </Button>
            </form>

            {/* Category Filters */}
            <div className={`flex flex-wrap gap-2 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryChange(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
              {(searchQuery || selectedCategory !== 'All') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : scriptures.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-xl font-semibold mb-2">No scriptures found</h2>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Found {scriptures.length} scripture{scriptures.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {scriptures.map((scripture, index) => (
                  <div
                    key={scripture.id}
                    className="opacity-0 animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ScriptureCard
                      id={scripture.id}
                      title={scripture.title}
                      titleHindi={scripture.title_hindi}
                      description={scripture.description}
                      category={scripture.category}
                      totalChapters={scripture.total_chapters}
                      totalVerses={scripture.total_verses}
                      featured={scripture.featured || false}
                      progress={progress[scripture.id]}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Library;
