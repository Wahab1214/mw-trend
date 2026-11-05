'use client';

import * as React from 'react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const toast = useToast();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in required fields.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
      toast.success('Your message has been sent to our Lahore studio! We will reply within 24 hours.', 'Message Sent');
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none space-y-10">
      <Breadcrumb items={[{ label: 'Contact Us' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-black text-text-primary">
          Get in Touch With Our Studio
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          Have a custom bulk order, corporate inquiry, or need design assistance? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-5">
            <h3 className="font-serif font-bold text-lg text-text-primary border-b border-border pb-3">
              Studio Headquarters
            </h3>

            <div className="space-y-4 text-xs text-text-secondary">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="text-text-primary block font-semibold">Lahore Creative Studio</strong>
                  <span>Gulberg III, Main Boulevard, Lahore, Pakistan</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <div>
                  <strong className="text-text-primary block font-semibold">WhatsApp &amp; Support</strong>
                  <span>+92 300 1234567 (10 AM - 10 PM PKT)</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <div>
                  <strong className="text-text-primary block font-semibold">Official Email</strong>
                  <span>support@mwtrends.pk</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/923001234567?text=Hi%20MW%20Trends,%20I%20have%20an%20inquiry"
                target="_blank"
                rel="noreferrer"
                className="block w-full"
              >
                <Button variant="outline" size="md" className="w-full gap-2 border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 text-xs font-semibold">
                  <MessageCircle className="w-4 h-4" />
                  <span>Instant WhatsApp Chat</span>
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-border space-y-6 shadow-sm">
            <h3 className="font-serif font-bold text-lg text-text-primary border-b border-border pb-3">
              Send Us a Direct Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  placeholder="e.g. Ayesha Tariq"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  type="email"
                  label="Email Address"
                  placeholder="ayesha@gmail.com"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone (WhatsApp)"
                  placeholder="03001234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Input
                  label="Subject"
                  placeholder="e.g. Bulk Corporate Customization"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <Textarea
                label="Message / Inquiry"
                placeholder="Describe your design questions or bulk order requirements..."
                value={message}
                required
                charLimit={500}
                onChange={(e) => setMessage(e.target.value)}
              />

              <Button
                type="submit"
                variant="gold"
                size="md"
                isLoading={isSubmitting}
                className="gap-2 font-bold uppercase tracking-wider text-xs"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
