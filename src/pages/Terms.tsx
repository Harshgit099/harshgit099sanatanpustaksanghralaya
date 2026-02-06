import Layout from '@/components/layout/Layout';
import { FileText } from 'lucide-react';

const Terms = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Terms of <span className="text-primary">Service</span>
          </h1>
          <p className="text-muted-foreground">
            Last updated: January 2026
          </p>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto">
          <div className="glass-card rounded-2xl p-8 space-y-8">
            <section>
              <h2 className="font-display text-xl font-semibold mb-3">Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using Sanatan Pustak Sanghralaya, you accept and agree to be bound 
                by these Terms of Service. If you do not agree to these terms, please do not use 
                our services.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold mb-3">Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                Sanatan Pustak Sanghralaya provides a digital library of Hindu scriptures and 
                spiritual texts. Our services include access to scripture texts, reading tools, 
                bookmarking features, and personalized reading progress tracking.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold mb-3">User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                To access certain features, you may need to create an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold mb-3">Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Use our services for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
                <li>Reproduce or redistribute content without permission</li>
                <li>Use automated systems to access the service</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold mb-3">Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                The scriptures provided are part of the public domain of Hindu spiritual heritage. 
                However, our platform design, features, and original content are protected by 
                intellectual property rights. You may use the scriptures for personal, 
                non-commercial purposes.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold mb-3">Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are provided "as is" without warranties of any kind. We strive to 
                provide accurate translations and texts, but we do not guarantee the accuracy 
                or completeness of any content. The scriptures are for spiritual guidance and 
                should not be considered as professional advice.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold mb-3">Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                Sanatan Pustak Sanghralaya shall not be liable for any indirect, incidental, 
                special, or consequential damages arising from your use of our services.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold mb-3">Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users 
                of significant changes. Continued use of our services after changes constitutes 
                acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold mb-3">Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms of Service, please contact us at{' '}
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

export default Terms;
