import Layout from '@/components/layout/Layout';
import { Shield } from 'lucide-react';

const Privacy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="text-muted-foreground">
            Last updated: January 2026
          </p>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto">
          <div className="glass-card rounded-2xl p-8 space-y-8">
            <section>
              <h2 className="font-display text-xl font-semibold mb-3">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Sanatan Pustak Sanghralaya ("we," "our," or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, and safeguard your information when 
                you visit our website and use our services.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold mb-3">Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We may collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Account information (name, email address) when you register</li>
                <li>Reading preferences and bookmarks</li>
                <li>Communication data when you contact us</li>
                <li>Usage data and analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold mb-3">How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide and maintain our services</li>
                <li>Save your reading progress and preferences</li>
                <li>Improve and personalize your experience</li>
                <li>Communicate with you about updates and new scriptures</li>
                <li>Ensure the security of our platform</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold mb-3">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate security measures to protect your personal information. 
                However, no method of transmission over the Internet is 100% secure, and we cannot 
                guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold mb-3">Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar technologies to enhance your browsing experience, 
                remember your preferences, and analyze site traffic. You can control cookie 
                settings through your browser.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold mb-3">Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our service may contain links to third-party websites. We are not responsible 
                for the privacy practices of these external sites. We encourage you to read 
                their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold mb-3">Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Access your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold mb-3">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:sanatanpustaksanghralaya@zohomail.in" className="text-primary hover:underline">
                  sanatanpustaksanghralaya@zohomail.in
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
