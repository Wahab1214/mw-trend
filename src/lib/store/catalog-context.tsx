'use client';

import * as React from 'react';
import {
  Category,
  Product,
  StoreSettings,
  FlashSale,
  Bundle,
  Review,
} from '@/types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_STORE_SETTINGS,
} from '@/lib/mock-data';
import { fetchCatalogData } from '@/lib/catalog-client';

interface CatalogContextValue {
  categories: Category[];
  products: Product[];
  settings: StoreSettings;
  flashSale: FlashSale | null;
  bundles: Bundle[];
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  refreshCatalog: () => Promise<void>;
}

const CatalogContext = React.createContext<CatalogContextValue>({
  categories: INITIAL_CATEGORIES,
  products: INITIAL_PRODUCTS,
  settings: INITIAL_STORE_SETTINGS,
  flashSale: null,
  bundles: [],
  reviews: [],
  isLoading: true,
  error: null,
  refreshCatalog: async () => {},
});

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = React.useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = React.useState<Product[]>(INITIAL_PRODUCTS);
  const [settings, setSettings] = React.useState<StoreSettings>(INITIAL_STORE_SETTINGS);
  const [flashSale, setFlashSale] = React.useState<FlashSale | null>(null);
  const [bundles, setBundles] = React.useState<Bundle[]>([]);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const refreshCatalog = React.useCallback(async () => {
    try {
      const data = await fetchCatalogData(false);
      if (Array.isArray(data.categories)) setCategories(data.categories);
      if (Array.isArray(data.products)) setProducts(data.products);
      if (data.settings) setSettings(data.settings);
      setFlashSale(data.flashSale || null);
      setBundles(Array.isArray(data.bundles) ? data.bundles : []);
      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Unable to sync catalog from server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  return (
    <CatalogContext.Provider
      value={{
        categories,
        products,
        settings,
        flashSale,
        bundles,
        reviews,
        isLoading,
        error,
        refreshCatalog,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  return React.useContext(CatalogContext);
}
