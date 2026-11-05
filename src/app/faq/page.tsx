'use client';

import * as React from 'react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Accordion } from '@/components/ui/accordion';

export default function FAQPage() {
  const faqItems = [
    {
      id: 'faq-1',
      title: 'How does live customization work?',
      content:
        'When you select a product like our Royal Gold Monogram Mug or Laser-Engraved Pen, you can type your recipient name, select font choices, and customize the text color. Our interactive 3D canvas displays a real-time preview of how the printed or etched item will look. What you see is what our studio crafts.',
    },
    {
      id: 'faq-2',
      title: 'Do you offer Cash on Delivery (COD) across Pakistan?',
      content:
        'Yes! We offer 100% verified Cash on Delivery across more than 250+ cities, towns, and districts in Pakistan including Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, and Peshawar.',
    },
    {
      id: 'faq-3',
      title: 'How long does printing and delivery take?',
      content:
        'Because each item is customized with precision, production takes 24 hours. Courier dispatch via TCS or Leopards takes 1-2 business days for major metropolitan hubs and 2-3 days for other regions.',
    },
    {
      id: 'faq-4',
      title: 'What if my ceramic mug or gift arrives damaged?',
      content:
        'We have a 100% Zero-Risk Arrival Guarantee. If your order arrives chipped or damaged in transit, simply snap a quick photo and WhatsApp our support team at +92 300 1234567 within 48 hours for an immediate free reprint and express replacement.',
    },
    {
      id: 'faq-5',
      title: 'Can I pay via JazzCash, Easypaisa, or Online Bank Transfer?',
      content:
        'Absolutely. We accept manual verification payments via JazzCash Mobile/Till, Easypaisa, and Meezan Bank (Raast ID). Enter your Transaction ID (TID) at checkout and our finance team verifies it instantly.',
    },
    {
      id: 'faq-6',
      title: 'Do you offer corporate or bulk gift discounts?',
      content:
        'Yes, for corporate branding (custom company logo on mugs, hoodies, or pens for 20+ units), please message us directly on WhatsApp or submit the contact form for wholesale tier pricing.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.title,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.content,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none space-y-8">
        <Breadcrumb items={[{ label: 'Frequently Asked Questions' }]} />

        <div className="text-center max-w-xl mx-auto space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-text-primary">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary">
            Everything you need to know about ordering personalized gifts from MW Trends Pakistan.
          </p>
        </div>

        <div className="rounded-2xl bg-surface border border-border p-6 sm:p-8 shadow-sm">
          <Accordion items={faqItems} allowMultiple />
        </div>
      </div>
    </>
  );
}
