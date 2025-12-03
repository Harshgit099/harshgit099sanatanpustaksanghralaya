import { Link } from 'react-router-dom';
import { BookOpen, ScrollText, Flame, Stars, Compass, Mountain } from 'lucide-react';

const categories = [
  {
    id: 'vedas',
    name: 'Vedas',
    nameHindi: 'वेद',
    description: 'The oldest scriptures of Hinduism, containing hymns and philosophical teachings',
    icon: ScrollText,
    color: 'from-amber-500 to-orange-600',
    count: 4,
  },
  {
    id: 'puranas',
    name: 'Puranas',
    nameHindi: 'पुराण',
    description: 'Ancient texts narrating the history of the universe and cosmic genealogies',
    icon: Stars,
    color: 'from-purple-500 to-indigo-600',
    count: 3,
  },
  {
    id: 'itihasa',
    name: 'Itihasa',
    nameHindi: 'इतिहास',
    description: 'Epic narratives including Ramayana and Mahabharata',
    icon: Mountain,
    color: 'from-emerald-500 to-teal-600',
    count: 3,
  },
  {
    id: 'darshana',
    name: 'Darshana',
    nameHindi: 'दर्शन',
    description: 'Philosophical schools of Hindu thought and spiritual practices',
    icon: Compass,
    color: 'from-blue-500 to-cyan-600',
    count: 1,
  },
  {
    id: 'smriti',
    name: 'Smriti',
    nameHindi: 'स्मृति',
    description: 'Traditional texts including law codes and ethical teachings',
    icon: BookOpen,
    color: 'from-rose-500 to-pink-600',
    count: 1,
  },
  {
    id: 'shastra',
    name: 'Shastra',
    nameHindi: 'शास्त्र',
    description: 'Scientific and technical treatises covering various subjects',
    icon: Flame,
    color: 'from-red-500 to-orange-600',
    count: 1,
  },
];

const CategorySection = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 opacity-0 animate-fade-in">
            Explore <span className="text-primary">Scripture Categories</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in animation-delay-100">
            Dive into the vast ocean of Hindu literature organized by traditional classifications
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/library?category=${category.id}`}
              className="group opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
            >
              <div className="relative h-full glass-card rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                {/* Background Gradient */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${category.color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`} />
                
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <category.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <div className="relative">
                  <div className="flex items-baseline gap-2 mb-2">
                    <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <span className="font-devanagari text-muted-foreground text-sm">
                      {category.nameHindi}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {category.count} {category.count === 1 ? 'Text' : 'Texts'}
                    </span>
                    <span className="text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
                      Explore →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
