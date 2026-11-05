import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ToastProvider } from '@/components/ui/toast';
import { CartProvider } from '@/lib/store/cart-context';
import { WishlistProvider } from '@/lib/store/wishlist-context';
import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/layout/cart-drawer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { WhatsAppFloating } from '@/components/layout/whatsapp-floating';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'MW Trends | Premium Personalized Gifts & Print on Demand Pakistan',
    template: '%s | MW Trends',
  },
  description:
    "Pakistan's premier print-on-demand studio. Order custom monogram mugs, laser-engraved pens, heavyweight streetwear tees, custom caps, and romantic gold-foil cards with nationwide COD.",
  keywords: [
    'custom gifts pakistan',
    'print on demand pakistan',
    'personalized mugs lahore',
    'laser engraved pens karachi',
    'custom oversized t shirts',
    'anniversary cards pakistan',
    'cash on delivery gifts pakistan',
  ],
  authors: [{ name: 'MW Trends Studio' }],
  creator: 'MW Trends',
  icons: {
    icon: '/brand/monogram.svg',
    shortcut: '/brand/monogram.svg',
    apple: '/brand/monogram.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://mwtrends.pk',
    siteName: 'MW Trends',
    title: 'MW Trends | Premium Personalized Gifts & Print on Demand Pakistan',
    description:
      'Order custom monogram mugs, engraved pens, streetwear tees, and keepsake cards with live 3D preview and cash on delivery across Pakistan.',
    images: [
      {
        url: '/brand/logo.svg',
        width: 1200,
        height: 630,
        alt: 'MW Trends Luxury Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MW Trends | Premium Personalized Gifts in Pakistan',
    description: 'Custom mugs, pens, shirts, hoodies, caps, and cards with nationwide delivery.',
    images: ['/brand/logo.svg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/brand/monogram.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen bg-background text-text-primary antialiased flex flex-col selection:bg-gold selection:text-black">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ToastProvider>
            <CartProvider>
              <WishlistProvider>
                <AnnouncementBar />
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <CartDrawer />
                <MobileBottomNav />
                <WhatsAppFloating />
              </WishlistProvider>
            </CartProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
