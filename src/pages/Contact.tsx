import Layout from '@/components/layout/Layout';
import { Mail, MessageCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email address').max(255),
  subject: z.string().trim().min(1, 'Subject is required').max(200),
  message: z.string().trim().min(1, 'Message is required').max(2000),
});

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const raw = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    const result = contactSchema.safeParse(raw);
    if (!result.success) {
      toast({ title: "Validation Error", description: result.error.errors[0].message, variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    const { error } = await supabase.from('contact_messages').insert({
      name: result.data.name,
      email: result.data.email,
      subject: result.data.subject,
      message: result.data.message,
    });

    if (error) {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
    } else {
      toast({ title: "Message Sent!", description: "Thank you for reaching out. We'll get back to you soon." });
      (e.target as HTMLFormElement).reset();
    }

    setIsSubmitting(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions or suggestions? We'd love to hear from you. 
            Reach out to us and we'll respond as soon as we can.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div className="glass-card rounded-2xl p-8">
            <h2 className="font-display text-2xl font-semibold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Your Name</label>
                <Input id="name" name="name" placeholder="Enter your name" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                <Input id="email" name="email" type="email" placeholder="Enter your email" required />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                <Input id="subject" name="subject" placeholder="What is this about?" required />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                <Textarea id="message" name="message" placeholder="Write your message here..." rows={5} required />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold mb-1">Email Us</h3>
                  <p className="text-muted-foreground text-sm mb-2">For general inquiries and support</p>
                  <a href="mailto:sanatanpustaksanghralaya@zohomail.in" className="text-primary hover:underline text-sm break-all">
                    sanatanpustaksanghralaya@zohomail.in
                  </a>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold mb-1">Feedback</h3>
                  <p className="text-muted-foreground text-sm">
                    We welcome your suggestions for improving our scripture library and adding new texts.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold mb-1">Our Presence</h3>
                  <p className="text-muted-foreground text-sm">
                    Sanatan Pustak Sanghralaya is a digital platform serving seekers of spiritual knowledge worldwide.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 text-center">
              <p className="font-devanagari text-xl text-primary mb-2">"सर्वे भवन्तु सुखिनः"</p>
              <p className="text-sm text-muted-foreground italic">"May all beings be happy"</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
