import { Link } from 'react-router-dom';
import { BookOpen, Clock, Star } from 'lucide-react';

interface ScriptureCardProps {
  id: string;
  title: string;
  titleHindi?: string | null;
  description?: string | null;
  category: string;
  totalChapters?: number | null;
  totalVerses?: number | null;
  featured?: boolean;
  progress?: number;
}

const ScriptureCard = ({
  id,
  title,
  titleHindi,
  description,
  category,
  totalChapters,
  totalVerses,
  featured,
  progress,
}: ScriptureCardProps) => {
  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      Vedas: 'from-amber-500 to-orange-500',
      Puranas: 'from-purple-500 to-indigo-500',
      Itihasa: 'from-emerald-500 to-teal-500',
      Darshana: 'from-blue-500 to-cyan-500',
      Smriti: 'from-rose-500 to-pink-500',
      Shastra: 'from-red-500 to-orange-500',
    };
    return colors[cat] || 'from-primary to-accent';
  };

  return (
    <Link to={`/scripture/${id}`} className="group block h-full">
      <article className="relative h-full glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
        {/* Header with gradient */}
        <div className={`relative h-32 bg-gradient-to-br ${getCategoryColor(category)} p-4`}>
          {featured && (
            <div className="absolute top-3 right-3">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
          )}
          <div className="absolute bottom-4 left-4">
            <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium">
              {category}
            </span>
          </div>
          <div className="absolute -bottom-8 right-4">
            <div className="w-16 h-20 bg-card rounded-lg shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 pt-6">
          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1 pr-16">
            {title}
          </h3>
          {titleHindi && (
            <p className="font-devanagari text-sm text-muted-foreground mb-2">
              {titleHindi}
            </p>
          )}
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {totalChapters && (
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                {totalChapters} Ch.
              </span>
            )}
            {totalVerses && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {totalVerses.toLocaleString()} Verses
              </span>
            )}
          </div>

          {/* Progress Bar */}
          {typeof progress === 'number' && progress > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-primary">{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

export default ScriptureCard;
