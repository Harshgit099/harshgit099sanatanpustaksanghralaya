import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Bookmark, TrendingUp, Clock, User } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ScriptureCard from '@/components/scripture/ScriptureCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ReadingProgressWithScripture {
  id: string;
  scripture_id: string;
  current_chapter: number;
  current_verse: number;
  progress_percentage: number;
  last_read_at: string;
  scriptures: {
    id: string;
    title: string;
    title_hindi: string | null;
    description: string | null;
    category: string;
    total_chapters: number | null;
    total_verses: number | null;
  };
}

interface BookmarkWithScripture {
  id: string;
  scripture_id: string;
  created_at: string;
  scriptures: {
    id: string;
    title: string;
    title_hindi: string | null;
    description: string | null;
    category: string;
    total_chapters: number | null;
    total_verses: number | null;
  };
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [readingProgress, setReadingProgress] = useState<ReadingProgressWithScripture[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkWithScripture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    const fetchUserData = async () => {
      if (!user) return;

      const [progressResult, bookmarksResult] = await Promise.all([
        supabase
          .from('reading_progress')
          .select(`
            id,
            scripture_id,
            current_chapter,
            current_verse,
            progress_percentage,
            last_read_at,
            scriptures (
              id,
              title,
              title_hindi,
              description,
              category,
              total_chapters,
              total_verses
            )
          `)
          .eq('user_id', user.id)
          .order('last_read_at', { ascending: false }),
        supabase
          .from('bookmarks')
          .select(`
            id,
            scripture_id,
            created_at,
            scriptures (
              id,
              title,
              title_hindi,
              description,
              category,
              total_chapters,
              total_verses
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ]);

      if (progressResult.data) {
        setReadingProgress(progressResult.data as unknown as ReadingProgressWithScripture[]);
      }

      if (bookmarksResult.data) {
        setBookmarks(bookmarksResult.data as unknown as BookmarkWithScripture[]);
      }

      setLoading(false);
    };

    if (user) {
      fetchUserData();
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  const totalProgress = readingProgress.length > 0
    ? readingProgress.reduce((acc, p) => acc + Number(p.progress_percentage), 0) / readingProgress.length
    : 0;

  return (
    <Layout>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 opacity-0 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold">
                  Welcome Back!
                </h1>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 opacity-0 animate-fade-in-up animation-delay-100">
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{readingProgress.length}</p>
                  <p className="text-sm text-muted-foreground">Reading</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Bookmark className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{bookmarks.length}</p>
                  <p className="text-sm text-muted-foreground">Bookmarks</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{Math.round(totalProgress)}%</p>
                  <p className="text-sm text-muted-foreground">Avg Progress</p>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Reading */}
          <section className="mb-12 opacity-0 animate-fade-in-up animation-delay-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Continue Reading
              </h2>
              <Button asChild variant="ghost" size="sm">
                <Link to="/library">Browse More</Link>
              </Button>
            </div>

            {readingProgress.length === 0 ? (
              <div className="glass-card rounded-xl p-8 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-2">No reading history yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start reading scriptures to track your progress
                </p>
                <Button asChild>
                  <Link to="/library">Browse Library</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {readingProgress.slice(0, 3).map((item) => (
                  <Link
                    key={item.id}
                    to={`/scripture/${item.scripture_id}`}
                    className="glass-card rounded-xl p-4 hover:shadow-lg transition-all group"
                  >
                    <h3 className="font-display font-semibold group-hover:text-primary transition-colors mb-1">
                      {item.scriptures.title}
                    </h3>
                    {item.scriptures.title_hindi && (
                      <p className="font-devanagari text-sm text-muted-foreground mb-3">
                        {item.scriptures.title_hindi}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        Ch. {item.current_chapter}, V. {item.current_verse}
                      </span>
                      <span className="font-medium text-primary">
                        {Math.round(Number(item.progress_percentage))}%
                      </span>
                    </div>
                    <Progress value={Number(item.progress_percentage)} className="h-1.5" />
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Bookmarks */}
          <section className="opacity-0 animate-fade-in-up animation-delay-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-accent" />
                Bookmarked Scriptures
              </h2>
            </div>

            {bookmarks.length === 0 ? (
              <div className="glass-card rounded-xl p-8 text-center">
                <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-2">No bookmarks yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Bookmark scriptures to save them for later
                </p>
                <Button asChild variant="outline">
                  <Link to="/library">Browse Library</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {bookmarks.map((bookmark) => (
                  <ScriptureCard
                    key={bookmark.id}
                    id={bookmark.scriptures.id}
                    title={bookmark.scriptures.title}
                    titleHindi={bookmark.scriptures.title_hindi}
                    description={bookmark.scriptures.description}
                    category={bookmark.scriptures.category}
                    totalChapters={bookmark.scriptures.total_chapters}
                    totalVerses={bookmark.scriptures.total_verses}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
