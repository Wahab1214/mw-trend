'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Menu, X, Compass, PackageCheck } from 'lucide-react';
import { useCart } from '@/lib/store/cart-context';
import { useWishlist } from '@/lib/store/wishlist-context';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { INITIAL_PRODUCTS } from '@/lib/mock-data';

export function Header() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const { count: wishlistCount } = useWishlist();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter search results
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return INITIAL_PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.category_name?.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [searchQuery]);

  const navLinks = [
    { label: 'Shop All', href: '/shop' },
    { label: 'Custom Mugs', href: '/category/custom-mugs' },
    { label: 'Luxury Pens', href: '/category/luxury-pens' },
    { label: 'Apparel', href: '/category/apparel-t-shirts' },
    { label: 'Love Cards', href: '/category/love-cards' },
    { label: 'Gift Finder', href: '/gift-finder', highlight: true },
    { label: 'Track Order', href: '/track-order' },
  ];

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300 border-b border-border/60 bg-surface/90 backdrop-blur-md',
          scrolled && 'shadow-sm border-border'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Mobile menu trigger */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -ml-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-elevated focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-3 group focus:outline-none">
                <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-black flex items-center justify-center p-1.5 border border-gold/40 shadow-sm group-hover:border-gold transition-colors">
                  <Image
                    src="/brand/monogram.svg"
                    alt="MW Trends Monogram"
                    width={40}
                    height={40}
                    priority
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-black text-xl sm:text-2xl tracking-wider gold-gradient-text leading-tight">
                    MW
                  </span>
                  <span className="font-serif text-[9px] sm:text-[10px] tracking-[0.3em] text-text-secondary group-hover:text-gold transition-colors font-medium">
                    TRENDS
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-3 py-1.5 text-xs xl:text-sm font-medium rounded-lg transition-colors duration-150',
                      link.highlight
                        ? 'text-gold hover:text-gold-light font-semibold bg-gold/10 hover:bg-gold/15'
                        : isActive
                        ? 'text-gold font-semibold'
                        : 'text-text-secondary hover:text-text-primary hover:bg-elevated/50'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Action Icons */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Search Toggle */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-lg text-text-secondary hover:text-gold hover:bg-elevated transition-colors"
                aria-label="Search catalog"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 rounded-lg text-text-secondary hover:text-gold hover:bg-elevated transition-colors hidden sm:flex"
                aria-label="View wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-black">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account / Admin Portal */}
              <Link
                href="/admin"
                className="p-2 rounded-lg text-text-secondary hover:text-gold hover:bg-elevated transition-colors hidden sm:flex"
                aria-label="Admin Portal"
                title="Admin Dashboard"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={openCart}
                className="relative p-2 rounded-lg text-text-secondary hover:text-gold hover:bg-elevated transition-colors"
                aria-label="Open Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-black">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-surface px-4 py-3 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href ? 'bg-gold/15 text-gold font-bold' : 'text-text-primary hover:bg-elevated'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-text-muted px-3">
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gold font-semibold flex items-center gap-1.5 py-1"
              >
                <User className="w-4 h-4" />
                Staff Admin Portal
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Instant Search Modal */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
          setSearchQuery('');
        }}
        title="Search Gifts & Collections"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            autoFocus
            type="search"
            placeholder="Search mugs, pens, shirts, cards, hoodies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-base py-3 h-12"
          />

          {searchQuery.trim() && (
            <div className="space-y-2 mt-4">
              <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Products ({searchResults.length})
              </div>

              {searchResults.length === 0 ? (
                <p className="text-sm text-text-secondary py-4 text-center">
                  No personalized gifts found matching &quot;{searchQuery}&quot;. Try searching for &quot;mug&quot;, &quot;pen&quot;, or &quot;card&quot;.
                </p>
              ) : (
                <div className="divide-y divide-border/60">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-3 py-2.5 px-2 hover:bg-elevated rounded-lg transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-elevated overflow-hidden shrink-0">
                        {product.images[0] && (
                          <Image
                            src={product.images[0].image_url}
                            alt={product.title}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-text-primary group-hover:text-gold transition-colors truncate">
                          {product.title}
                        </h4>
                        <p className="text-xs text-text-muted">{product.category_name}</p>
                      </div>
                      <div className="text-sm font-serif font-bold text-gold">
                        Rs. {product.sale_price || product.regular_price}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="pt-2 text-center">
                <Link
                  href={`/shop?q=${encodeURIComponent(searchQuery)}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="text-xs font-semibold text-gold hover:underline"
                >
                  View all search results &rarr;
                </Link>
              </div>
            </div>
          )}

          {!searchQuery.trim() && (
            <div className="pt-2">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {['Custom Gold Mug', 'Engraved Pen', 'Anniversary Card', 'Streetwear Tee', 'Impact Phone Case', 'Dad Cap'].map(
                  (term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setSearchQuery(term)}
                      className="text-xs px-3 py-1.5 rounded-full bg-elevated hover:bg-gold/20 hover:text-gold transition-colors text-text-secondary"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
