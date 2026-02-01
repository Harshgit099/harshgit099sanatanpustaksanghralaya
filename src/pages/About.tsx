import Layout from '@/components/layout/Layout';
import { BookOpen, Heart, Users, Target } from 'lucide-react';

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <span className="text-6xl om-symbol mb-4 block">ॐ</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            About <span className="text-primary">Sanatan Pustak Sanghralaya</span>
          </h1>
          <p className="font-devanagari text-xl text-muted-foreground">
            सनातन पुस्तक संग्रहालय के बारे में
          </p>
        </div>

        {/* Mission Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="glass-card rounded-2xl p-8">
            <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-3">
              <Target className="w-6 h-6 text-primary" />
              Our Mission
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Sanatan Pustak Sanghralaya is dedicated to preserving and sharing the timeless wisdom 
              of Hindu scriptures with seekers around the world. Our mission is to make ancient 
              texts accessible to everyone, fostering spiritual growth and understanding of 
              Sanatan Dharma.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We believe that the profound teachings contained in the Vedas, Puranas, Upanishads, 
              and other sacred texts hold the keys to understanding life's deepest questions and 
              achieving spiritual fulfillment.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">Authentic Texts</h3>
            <p className="text-sm text-muted-foreground">
              We curate and present authentic versions of sacred scriptures with accurate translations.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">Community First</h3>
            <p className="text-sm text-muted-foreground">
              Building a community of seekers who share a love for ancient wisdom and spiritual growth.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">Free Access</h3>
            <p className="text-sm text-muted-foreground">
              Committed to providing free access to spiritual knowledge for all seekers.
            </p>
          </div>
        </div>

        {/* Quote Section */}
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="glass-card rounded-2xl p-8">
            <p className="font-devanagari text-2xl text-primary mb-4">
              "तमसो मा ज्योतिर्गमय"
            </p>
            <p className="text-lg text-muted-foreground italic mb-2">
              "Lead me from darkness to light"
            </p>
            <cite className="text-sm text-muted-foreground">— Brihadaranyaka Upanishad</cite>
          </blockquote>
        </div>
      </div>
    </Layout>
  );
};

export default About;
