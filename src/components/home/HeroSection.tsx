import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/library?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D97706' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">ॐ</div>
      <div className="absolute top-40 right-20 text-4xl opacity-15 animate-float animation-delay-500">卐</div>
      <div className="absolute bottom-40 left-20 text-5xl opacity-15 animate-float animation-delay-300">🙏</div>
      <div className="absolute bottom-20 right-10 text-4xl opacity-20 animate-float animation-delay-700">🕉️</div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 opacity-0 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Digital Scripture Library</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 opacity-0 animate-fade-in-up animation-delay-100">
            <span className="gradient-text">Sanatan Pustak</span>
          </h1>
          
          <h2 className="font-devanagari text-2xl sm:text-3xl lg:text-4xl text-muted-foreground mb-6 opacity-0 animate-fade-in-up animation-delay-200">
            सनातन पुस्तक संग्रहालय
          </h2>

          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto opacity-0 animate-fade-in-up animation-delay-300">
            Explore the timeless wisdom of ancient Hindu scriptures. 
            From the Vedas to the Puranas, discover the spiritual treasures of Sanatan Dharma.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-10 opacity-0 animate-fade-in-up animation-delay-400">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center bg-card border border-border rounded-full shadow-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                <Search className="w-5 h-5 text-muted-foreground ml-5" />
                <Input
                  type="text"
                  placeholder="Search scriptures, authors, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent focus-visible:ring-0 text-base py-6"
                />
                <Button type="submit" className="m-1.5 rounded-full px-6">
                  Search
                </Button>
              </div>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up animation-delay-500">
            <Button asChild size="lg" className="group glow-primary">
              <a href="/library">
                <BookOpen className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Browse Library
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="group">
              <a href="/categories">
                Explore Categories
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto opacity-0 animate-fade-in-up animation-delay-700">
            {[
              { value: '15+', label: 'Sacred Texts' },
              { value: '100+', label: 'Chapters' },
              { value: '∞', label: 'Wisdom' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-display font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
