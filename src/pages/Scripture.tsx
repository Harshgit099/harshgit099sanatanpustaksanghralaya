import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BookOpen, Clock, User, ArrowLeft, Bookmark, BookmarkCheck, Share2, Star } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Scripture {
  id: string;
  title: string;
  title_hindi: string | null;
  description: string | null;
  description_hindi: string | null;
  category: string;
  subcategory: string | null;
  author: string | null;
  language: string | null;
  total_chapters: number | null;
  total_verses: number | null;
  featured: boolean | null;
}

interface ReadingProgress {
  current_chapter: number;
  current_verse: number;
  progress_percentage: number;
}

const Scripture = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scripture, setScripture] = useState<Scripture | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchScripture = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('scriptures')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching scripture:', error);
      } else {
        setScripture(data);
      }

      // Fetch user progress and bookmark status
      if (user) {
        const [progressResult, bookmarkResult] = await Promise.all([
          supabase
            .from('reading_progress')
            .select('current_chapter, current_verse, progress_percentage')
            .eq('user_id', user.id)
            .eq('scripture_id', id)
            .maybeSingle(),
          supabase
            .from('bookmarks')
            .select('id')
            .eq('user_id', user.id)
            .eq('scripture_id', id)
            .maybeSingle(),
        ]);

        if (progressResult.data) {
          setProgress({
            current_chapter: progressResult.data.current_chapter,
            current_verse: progressResult.data.current_verse,
            progress_percentage: Number(progressResult.data.progress_percentage),
          });
        }

        setIsBookmarked(!!bookmarkResult.data);
      }

      setLoading(false);
    };

    fetchScripture();
  }, [id, user]);

  const handleBookmark = async () => {
    if (!user) {
      toast.error('Please sign in to bookmark scriptures');
      return;
    }

    if (!id) return;

    if (isBookmarked) {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('scripture_id', id);

      if (!error) {
        setIsBookmarked(false);
        toast.success('Bookmark removed');
      }
    } else {
      const { error } = await supabase.from('bookmarks').insert({
        user_id: user.id,
        scripture_id: id,
      });

      if (!error) {
        setIsBookmarked(true);
        toast.success('Scripture bookmarked!');
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: scripture?.title,
          text: scripture?.description || `Read ${scripture?.title} on Sanatan Pustak Sanghralay`,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const startReading = async () => {
    // Navigate to reader page
    navigate(`/read/${id}`);
    
    // Track progress if logged in
    if (user && id) {
      await supabase.from('reading_progress').upsert(
        {
          user_id: user.id,
          scripture_id: id,
          current_chapter: progress?.current_chapter || 1,
          current_verse: progress?.current_verse || 1,
          progress_percentage: progress?.progress_percentage || 5,
          last_read_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,scripture_id' }
      );
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!scripture) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">Scripture not found</h1>
          <p className="text-muted-foreground mb-4">The scripture you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/library">Browse Library</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Vedas: 'from-amber-500 to-orange-500',
      Puranas: 'from-purple-500 to-indigo-500',
      Itihasa: 'from-emerald-500 to-teal-500',
      Darshana: 'from-blue-500 to-cyan-500',
      Smriti: 'from-rose-500 to-pink-500',
      Shastra: 'from-red-500 to-orange-500',
    };
    return colors[category] || 'from-primary to-accent';
  };

  return (
    <Layout>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            to="/library"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 opacity-0 animate-fade-in"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 opacity-0 animate-fade-in-up animation-delay-100">
              {/* Header */}
              <div className="glass-card rounded-2xl p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Book Cover */}
                  <div className="flex-shrink-0">
                    <div className={`w-40 h-56 rounded-xl bg-gradient-to-br ${getCategoryColor(scripture.category)} flex items-center justify-center shadow-xl`}>
                      <BookOpen className="w-16 h-16 text-white" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(scripture.category)} text-white`}>
                        {scripture.category}
                      </span>
                      {scripture.subcategory && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                          {scripture.subcategory}
                        </span>
                      )}
                      {scripture.featured && (
                        <Star className="w-4 h-4 text-accent fill-accent" />
                      )}
                    </div>

                    <h1 className="font-display text-3xl font-bold mb-1">{scripture.title}</h1>
                    {scripture.title_hindi && (
                      <p className="font-devanagari text-xl text-muted-foreground mb-4">
                        {scripture.title_hindi}
                      </p>
                    )}

                    {scripture.author && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <User className="w-4 h-4" />
                        <span>By {scripture.author}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                      {scripture.total_chapters && (
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{scripture.total_chapters} Chapters</span>
                        </div>
                      )}
                      {scripture.total_verses && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{scripture.total_verses.toLocaleString()} Verses</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button onClick={startReading} className="glow-primary">
                        <BookOpen className="w-4 h-4 mr-2" />
                        {progress ? 'Continue Reading' : 'Start Reading'}
                      </Button>
                      <Button variant="outline" onClick={handleBookmark}>
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 mr-2 text-primary" />
                        ) : (
                          <Bookmark className="w-4 h-4 mr-2" />
                        )}
                        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleShare}>
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-display text-xl font-semibold mb-4">About this Scripture</h2>
                {scripture.description && (
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {scripture.description}
                  </p>
                )}
                {scripture.description_hindi && (
                  <p className="font-devanagari text-muted-foreground leading-relaxed">
                    {scripture.description_hindi}
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 opacity-0 animate-fade-in-up animation-delay-200">
              {/* Reading Progress */}
              {user && progress && (
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-display font-semibold mb-4">Your Progress</h3>
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Overall</span>
                      <span className="font-medium text-primary">
                        {Math.round(progress.progress_percentage)}%
                      </span>
                    </div>
                    <Progress value={progress.progress_percentage} className="h-2" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Currently at Chapter {progress.current_chapter}, Verse {progress.current_verse}
                  </p>
                </div>
              )}

              {/* Quick Stats */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-semibold mb-4">Quick Facts</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Category</dt>
                    <dd className="font-medium">{scripture.category}</dd>
                  </div>
                  {scripture.subcategory && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Type</dt>
                      <dd className="font-medium">{scripture.subcategory}</dd>
                    </div>
                  )}
                  {scripture.language && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Language</dt>
                      <dd className="font-medium capitalize">{scripture.language}</dd>
                    </div>
                  )}
                  {scripture.author && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Author</dt>
                      <dd className="font-medium">{scripture.author}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* CTA for non-logged users */}
              {!user && (
                <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-primary/5 to-accent/5">
                  <h3 className="font-display font-semibold mb-2">Track Your Journey</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sign in to save your reading progress and bookmarks
                  </p>
                  <Button asChild className="w-full">
                    <Link to="/auth">Sign In</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Scripture;
