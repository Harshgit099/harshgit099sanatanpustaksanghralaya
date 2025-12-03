import { Link } from 'react-router-dom';
import { BookOpen, ScrollText, Flame, Stars, Compass, Mountain, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const categories = [
  {
    id: 'vedas',
    name: 'Vedas',
    nameHindi: 'वेद',
    description: 'The oldest scriptures of Hinduism, containing hymns, philosophical discussions, and instructions for rituals. The four Vedas are Rigveda, Yajurveda, Samaveda, and Atharvaveda.',
    icon: ScrollText,
    color: 'from-amber-500 to-orange-600',
    bgPattern: 'from-amber-500/10 to-orange-500/5',
    subcategories: ['Samhita', 'Brahmanas', 'Aranyakas', 'Upanishads'],
  },
  {
    id: 'puranas',
    name: 'Puranas',
    nameHindi: 'पुराण',
    description: 'Ancient texts that narrate the history of the universe from creation to destruction, genealogies of kings, heroes, sages, and demigods.',
    icon: Stars,
    color: 'from-purple-500 to-indigo-600',
    bgPattern: 'from-purple-500/10 to-indigo-500/5',
    subcategories: ['Mahapuranas', 'Upapuranas', 'Sthala Puranas'],
  },
  {
    id: 'itihasa',
    name: 'Itihasa',
    nameHindi: 'इतिहास',
    description: 'The great epics of Hindu tradition - Ramayana and Mahabharata. These texts contain moral and philosophical teachings through narrative stories.',
    icon: Mountain,
    color: 'from-emerald-500 to-teal-600',
    bgPattern: 'from-emerald-500/10 to-teal-500/5',
    subcategories: ['Ramayana', 'Mahabharata', 'Harivamsa'],
  },
  {
    id: 'darshana',
    name: 'Darshana',
    nameHindi: 'दर्शन',
    description: 'The six orthodox schools of Hindu philosophy - Nyaya, Vaisheshika, Samkhya, Yoga, Mimamsa, and Vedanta.',
    icon: Compass,
    color: 'from-blue-500 to-cyan-600',
    bgPattern: 'from-blue-500/10 to-cyan-500/5',
    subcategories: ['Nyaya', 'Vaisheshika', 'Samkhya', 'Yoga', 'Mimamsa', 'Vedanta'],
  },
  {
    id: 'smriti',
    name: 'Smriti',
    nameHindi: 'स्मृति',
    description: 'Traditional texts including law codes (Dharmashastra), ethical teachings, and guidance for daily life and social conduct.',
    icon: BookOpen,
    color: 'from-rose-500 to-pink-600',
    bgPattern: 'from-rose-500/10 to-pink-500/5',
    subcategories: ['Dharmasutras', 'Dharmashastras', 'Nibandhas'],
  },
  {
    id: 'shastra',
    name: 'Shastra',
    nameHindi: 'शास्त्र',
    description: 'Scientific and technical treatises covering various subjects including politics, economics, arts, and sciences.',
    icon: Flame,
    color: 'from-red-500 to-orange-600',
    bgPattern: 'from-red-500/10 to-orange-500/5',
    subcategories: ['Arthashastra', 'Kamashastra', 'Natyashastra', 'Ayurveda'],
  },
];

const Categories = () => {
  return (
    <Layout>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 opacity-0 animate-fade-in">
              Scripture <span className="gradient-text">Categories</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in animation-delay-100">
              Explore the vast ocean of Hindu literature organized by traditional classifications. 
              Each category represents a unique aspect of ancient Indian wisdom.
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-8">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/library?category=${category.id}`}
                className="block opacity-0 animate-fade-in-up group"
                style={{ animationDelay: `${(index + 2) * 100}ms` }}
              >
                <article className={`relative glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01]`}>
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${category.bgPattern} opacity-50`} />
                  
                  <div className="relative p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <category.icon className="w-10 h-10 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-baseline gap-3 mb-2">
                          <h2 className="font-display text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {category.name}
                          </h2>
                          <span className="font-devanagari text-lg text-muted-foreground">
                            {category.nameHindi}
                          </span>
                        </div>
                        
                        <p className="text-muted-foreground mb-4 max-w-3xl">
                          {category.description}
                        </p>

                        {/* Subcategories */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {category.subcategories.map((sub) => (
                            <span
                              key={sub}
                              className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>

                        {/* CTA */}
                        <div className="flex items-center text-primary font-medium">
                          <span>Explore {category.name}</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
