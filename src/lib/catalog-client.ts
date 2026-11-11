import {
  Category,
  Product,
  StoreSettings,
  FlashSale,
  Bundle,
  Review,
  Order,
  Coupon,
} from '@/types';

export interface CatalogResponse {
  categories: Category[];
  products: Product[];
  settings: StoreSettings | null;
  flashSale: FlashSale | null;
  bundles: Bundle[];
  reviews: Review[];
}

export async function fetchCatalogData(includeUnpublished = false): Promise<CatalogResponse> {
  const qs = includeUnpublished ? '?all=true' : '';
  const res = await fetch(`/api/catalog${qs}`, { cache: 'no-store' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to load catalog from server.');
  }
  return res.json();
}

export async function fetchProductByIdOrSlug(idOrSlug: string): Promise<Product | null> {
  const res = await fetch(`/api/products/${encodeURIComponent(idOrSlug)}`, {
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to load product.');
  }
  const data = await res.json();
  return data.product || null;
}

export async function compressImageFile(
  file: File,
  maxWidth = 1100,
  maxHeight = 1100,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Invalid image file'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image'));
    reader.readAsDataURL(file);
  });
}

export async function uploadImageToCloud(
  file: File,
  folder: 'products' | 'categories' | 'customer-uploads' | 'payment-proofs' = 'products'
): Promise<string> {
  const dataUrl = await compressImageFile(file);
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataUrl, folder, filename: file.name }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) {
    throw new Error(data.error || 'Failed to upload image to cloud storage.');
  }
  return data.url;
}

export async function fetchCategoriesApi(): Promise<Category[]> {
  const res = await fetch('/api/categories', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load categories.');
  const data = await res.json();
  return data.categories || [];
}

export async function createCategoryApi(payload: {
  name: string;
  description?: string;
  image_url?: string;
}): Promise<Category> {
  const res = await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to create category.');
  return data.category;
}

export async function updateCategoryApi(
  id: string,
  updates: Partial<Category>
): Promise<Category> {
  const res = await fetch(`/api/categories/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to update category.');
  return data.category;
}

export async function deleteCategoryApi(id: string): Promise<void> {
  const res = await fetch(`/api/categories/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to delete category.');
}

export async function createProductApi(payload: Partial<Product>): Promise<Product> {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to save product.');
  return data.product;
}

export async function updateProductApi(
  id: string,
  payload: Partial<Product>
): Promise<Product> {
  const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to update product.');
  return data.product;
}

export async function deleteProductApi(id: string): Promise<void> {
  const url = id === 'all' ? '/api/products' : `/api/products/${encodeURIComponent(id)}`;
  const res = await fetch(url, { method: 'DELETE' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to delete product.');
}

export async function fetchOrdersApi(): Promise<Order[]> {
  const res = await fetch('/api/orders', { cache: 'no-store' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load orders.');
  return data.orders || [];
}

export async function fetchOrderByIdApi(id: string): Promise<Order | null> {
  const res = await fetch(`/api/orders/${encodeURIComponent(id)}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to fetch order.');
  return data.order || null;
}

export async function createOrderApi(payload: Record<string, any>): Promise<Order> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to place order.');
  return data.order;
}

export async function updateOrderApi(
  id: string,
  updates: Record<string, any>
): Promise<Order> {
  const res = await fetch(`/api/orders/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to update order.');
  return data.order;
}

export async function trackOrderApi(
  orderNumber: string,
  phone?: string
): Promise<Order | null> {
  const params = new URLSearchParams({ orderNumber });
  if (phone) params.set('phone', phone);
  const res = await fetch(`/api/orders/track?${params.toString()}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to track order.');
  return data.order || null;
}

export async function fetchSettingsApi(): Promise<StoreSettings | null> {
  const res = await fetch('/api/settings', { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json().catch(() => ({}));
  return data.settings || null;
}

export async function updateSettingsApi(settings: StoreSettings): Promise<StoreSettings> {
  const res = await fetch('/api/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to save store settings.');
  return data.settings;
}

export async function validateCouponApi(
  code: string,
  subtotal: number
): Promise<{ valid: boolean; coupon?: Coupon; error?: string }> {
  const res = await fetch('/api/marketing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'validate_coupon', code, subtotal }),
  });
  return res.json();
}
