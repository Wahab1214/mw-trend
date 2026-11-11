'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/store/cart-context';
import { useWishlist } from '@/lib/store/wishlist-context';
import { useCatalog } from '@/lib/store/catalog-context';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search, ShoppingBag, Heart, Menu, X } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { categories, products } = useCatalog();

  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { label: 'Shop All', href: '/shop' },
    ...categories.slice(0, 4).map((cat) => ({
      label: cat.name,
      href: `/category/${cat.slug}`,
    })),
    { label: 'Track Order', href: '/track-order' },
  ];

  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.short_description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 6)
    : [];

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300 border-b select-none',
          isScrolled
            ? 'bg-background/95 backdrop-blur-md border-border shadow-md'
            : 'bg-background border-border/60'
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
                      'px-3 py-1.5 text-xs xl:text-sm font-medium rounded-lg transition-colors duration-150 whitespace-nowrap',
                      isActive
                        ? 'text-gold font-semibold bg-gold/10'
                        : 'text-text-secondary hover:text-text-primary hover:bg-elevated/50'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Utility Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-lg text-text-secondary hover:text-gold hover:bg-elevated/60 transition-colors"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              <ThemeToggle />

              <Link
                href="/wishlist"
                className="relative p-2 rounded-lg text-text-secondary hover:text-gold hover:bg-elevated/60 transition-colors hidden sm:inline-flex"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-black shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={openCart}
                className="relative p-2 rounded-lg text-text-secondary hover:text-gold hover:bg-elevated/60 transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-black shadow-sm animate-in zoom-in-75">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-surface px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <Link
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-text-primary hover:text-gold hover:bg-elevated transition-colors"
            >
              Shop All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-gold hover:bg-elevated transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-border flex items-center justify-between px-3">
              <Link
                href="/track-order"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs font-semibold text-gold hover:underline"
              >
                Track Order
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs text-text-secondary hover:text-gold flex items-center gap-1"
              >
                <Heart className="w-3.5 h-3.5" /> Wishlist ({wishlistCount})
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        title="Search MW Trends Catalog"
        size="lg"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gold absolute left-3.5 top-3.5 pointer-events-none" />
            <Input
              placeholder="Search cards, frames, Nikkah booklets, pens, mugs, wallets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {searchQuery.trim() && (
            <div className="space-y-2 max-h-[360px] overflow-y-auto pt-2">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                Results ({searchResults.length})
              </span>

              {searchResults.length === 0 ? (
                <p className="text-sm text-text-muted py-6 text-center">
                  No personalized products found matching &quot;{searchQuery}&quot;.
                </p>
              ) : (
                <div className="divide-y divide-border/60">
                  {searchResults.map((product) => {
                    const thumb = product.images?.[0]?.image_url;
                    return (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 py-2.5 px-2 hover:bg-elevated rounded-lg transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-lg bg-black border border-border overflow-hidden shrink-0 flex items-center justify-center">
                          {thumb ? (
                            <Image
                              src={thumb}
                              alt={product.title}
                              width={48}
                              height={48}
                              unoptimized={thumb.startsWith('data:')}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <Image
                              src="/brand/monogram.svg"
                              alt="MW Trends"
                              width={24}
                              height={24}
                              className="object-contain opacity-70"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-text-primary group-hover:text-gold transition-colors truncate">
                            {product.title}
                          </h4>
                          <p className="text-xs text-text-muted">{product.category_name}</p>
                        </div>
                        <div className="text-sm font-serif font-bold text-gold whitespace-nowrap">
                          Rs. {product.sale_price || product.regular_price}
                        </div>
                      </Link>
                    );
                  })}
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
                {[
                  'Love Identity Card',
                  'Spotify Frame',
                  'Magic Mirror',
                  'Nikkah Booklet',
                  'Wooden Pen',
                  'Photo Mug',
                  'Wallet',
                ].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setSearchQuery(term)}
                    className="text-xs px-3 py-1.5 rounded-full bg-elevated hover:bg-gold/20 hover:text-gold transition-colors text-text-secondary"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
