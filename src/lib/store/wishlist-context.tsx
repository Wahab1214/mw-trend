'use client';

import * as React from 'react';
import { useToast } from '@/components/ui/toast';

interface WishlistContextType {
  wishlistIds: string[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string, productTitle?: string) => void;
  clearWishlist: () => void;
  count: number;
}

const WishlistContext = React.createContext<WishlistContextType | undefined>(undefined);
const WISHLIST_STORAGE_KEY = 'mw_trends_wishlist_v1';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = React.useState<string[]>([]);
  const [isInitialized, setIsInitialized] = React.useState<boolean>(false);
  const toast = useToast();

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        setWishlistIds(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    setIsInitialized(true);
  }, []);

  React.useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    }
  }, [wishlistIds, isInitialized]);

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  const toggleWishlist = (productId: string, productTitle?: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        toast.info(productTitle ? `Removed "${productTitle}" from Wishlist` : 'Removed from Wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        toast.success(productTitle ? `Added "${productTitle}" to Wishlist` : 'Saved to Wishlist');
        return [...prev, productId];
      }
    });
  };

  const clearWishlist = () => {
    setWishlistIds([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
        count: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = React.useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
