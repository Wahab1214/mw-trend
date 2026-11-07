'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X } from 'lucide-react';

export function WhatsAppFloating() {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = React.useState(false);

  // Show a welcome tooltip once after 3 seconds
  const [whatsappNumber, setWhatsappNumber] = React.useState('');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);

    try {
      const stored = localStorage.getItem('mw_trends_store_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.whatsapp_number) {
          const clean = parsed.whatsapp_number.replace(/[^0-9]/g, '');
          if (clean && clean.length >= 10) {
            setWhatsappNumber(clean);
          }
        }
      }
    } catch {
      // ignore
    }

    return () => clearTimeout(timer);
  }, []);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const defaultMessage = encodeURIComponent('Hi MW Trends! I would like to inquire about a personalized order / custom gift.');
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${defaultMessage}` : '/contact';

  return (
    <div className="fixed bottom-16 lg:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end select-none">
      {/* Friendly Tooltip */}
      {showTooltip && (
        <div className="mb-2 max-w-[210px] bg-surface border border-gold/30 rounded-xl p-3 shadow-xl text-xs text-text-primary animate-in fade-in slide-in-from-bottom-2 duration-300 relative">
          <button
            onClick={() => setShowTooltip(false)}
            aria-label="Close tooltip"
            className="absolute top-1.5 right-1.5 text-text-muted hover:text-text-primary p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
          <p className="font-semibold text-gold mb-0.5">Need help or fast order?</p>
          <p className="text-[11px] text-text-secondary">Chat directly with our Lahore design studio on WhatsApp!</p>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order or Chat on WhatsApp"
        className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group font-medium text-xs sm:text-sm"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline font-semibold">Order via WhatsApp</span>
      </a>
    </div>
  );
}
