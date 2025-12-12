import { Link } from 'react-router-dom';
import { Heart, Instagram, Mail, BookOpen } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Vedas', href: '/categories/vedas' },
    { name: 'Puranas', href: '/categories/puranas' },
    { name: 'Itihasa', href: '/categories/itihasa' },
    { name: 'Upanishads', href: '/categories/upanishads' },
  ];

  const resources = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ];

  return (
    <footer className="bg-card border-t border-border">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <span className="text-4xl om-symbol">ॐ</span>
              <div>
                <h3 className="font-display text-xl font-bold">Sanatan Pustak Sanghralay</h3>
                <p className="text-sm text-muted-foreground font-devanagari">सनातन पुस्तक संग्रहालय</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your gateway to ancient Hindu scriptures and timeless spiritual wisdom. 
              Explore the treasures of Sanatan Dharma.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-foreground">Scripture Categories</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-foreground">Resources</h4>
            <ul className="space-y-2">
              {resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-foreground">Stay Connected</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get updates on new scriptures and spiritual insights.
            </p>
            <div className="flex gap-4">
              <a
                href="mailto:contact@sanatanpustak.com"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="/library"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <BookOpen className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Sanatan Pustak Sanghralay. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-primary fill-primary" /> for Sanatan Dharma
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
