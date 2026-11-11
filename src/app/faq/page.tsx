'use client';

import * as React from 'react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Accordion } from '@/components/ui/accordion';

export default function FAQPage() {
  const faqItems = [
    {
      id: 'faq-1',
      title: 'How do I personalize my gift?',
      content:
        'Select your desired item, fill in the name, date, or custom details on the product page, and place your order. You can also send high-resolution pictures directly to our official WhatsApp (+92 337 0566870) with your order reference.',
    },
    {
      id: 'faq-2',
      title: 'Do you offer Cash on Delivery (COD) across Pakistan?',
      content:
        'Yes! We offer Cash on Delivery across major and remote cities in Pakistan including Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, and Peshawar.',
    },
    {
      id: 'faq-3',
      title: 'How long does customization and delivery take?',
      content:
        'Production typically takes 24 to 48 hours after confirmation, and courier dispatch across Pakistan takes 2 to 4 business days.',
    },
    {
      id: 'faq-4',
      title: 'What if my frame or mug arrives damaged?',
      content:
        'If an order arrives damaged in transit, please share a quick photo with our WhatsApp support team (+92 337 0566870) within 48 hours for a prompt replacement.',
    },
    {
      id: 'faq-5',
      title: 'Can I pay via JazzCash, Easypaisa, or Bank Transfer?',
      content:
        'Yes. Alongside Cash on Delivery, we accept JazzCash, Easypaisa, and Bank Transfer. You can enter your Transaction ID (TID) or upload a screenshot during checkout.',
    },
    {
      id: 'faq-6',
      title: 'Do you accept bulk wedding or corporate gift orders?',
      content:
        'Yes, for custom wedding favors (Mayon/Mehndi cards, Nikkah booklets) or corporate engraved pens and mugs, contact us on WhatsApp (+92 337 0566870) for bulk rates.',
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
