'use client';

import * as React from 'react';
import { CartItem, PaymentMethod } from '@/types';
import { getCompatiblePaymentMethods } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';
import { useCatalog } from '@/lib/store/catalog-context';
import { validateCouponApi } from '@/lib/catalog-client';

interface CouponInfo {
  code: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  // Coupon
  appliedCoupon: CouponInfo | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;

  // Gift wrap
  isGiftWrapped: boolean;
  setIsGiftWrapped: (wrap: boolean) => void;
  giftMessage: string;
  setGiftMessage: (msg: string) => void;

  // Totals
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  giftWrapFee: number;
  total: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;

  // Payment compatibility
  availablePaymentMethods: PaymentMethod[];
}

const CartContext = React.createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'mw_trends_cart_v1';
const FREE_SHIPPING_THRESHOLD = 3000;
const BASE_SHIPPING_FEE = 250;
const GIFT_WRAP_PRICE = 150;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useCatalog();
  const freeShippingThreshold = Number(settings?.free_shipping_threshold ?? 3000);
  const baseShippingFee = Number(settings?.flat_shipping_rate ?? 200);
  const giftWrapPrice = Number(settings?.gift_wrap_price ?? 150);

  const [items, setItems] = React.useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [appliedCoupon, setAppliedCoupon] = React.useState<CouponInfo | null>(null);
  const [isGiftWrapped, setIsGiftWrapped] = React.useState<boolean>(false);
  const [giftMessage, setGiftMessage] = React.useState<string>('');
  const [isInitialized, setIsInitialized] = React.useState<boolean>(false);
  const toast = useToast();

  // Load from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage
  React.useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = (item: Omit<CartItem, 'id'>) => {
    // Generate unique composite key
    const customString = item.customization_data ? JSON.stringify(item.customization_data) : '';
    const id = `${item.product_id}_${item.variant_id || 'base'}_${encodeURIComponent(customString)}`;

    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, { ...item, id }];
    });

    toast.success(`"${item.title}" added to your bag`, 'Added to Bag');
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.info('Item removed from cart');
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setIsGiftWrapped(false);
    setGiftMessage('');
  };

  // Validate coupons directly against Supabase
  const applyCoupon = async (code: string): Promise<boolean> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return false;
    try {
      const currentSubtotal = items.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);
      const res = await validateCouponApi(cleanCode, currentSubtotal);
      if (!res.valid || !res.coupon) {
        toast.error(res.error || 'Invalid or expired coupon code', 'Coupon Error');
        return false;
      }
      setAppliedCoupon({
        code: res.coupon.code,
        discountType: res.coupon.discount_type,
        discountValue: Number(res.coupon.discount_value || 0),
      });
      toast.success(`Coupon ${res.coupon.code} applied!`, 'Coupon Applied');
      return true;
    } catch {
      toast.error('Unable to validate coupon right now.', 'Coupon Error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.info('Coupon removed');
  };

  // Calculations
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else if (appliedCoupon.discountType === 'fixed') {
      discountAmount = Math.min(subtotal, appliedCoupon.discountValue);
    }
  }

  const qualifiesForFreeShipping =
    (freeShippingThreshold > 0 && subtotal >= freeShippingThreshold) ||
    appliedCoupon?.discountType === 'free_shipping';
  const shippingFee = items.length === 0 ? 0 : qualifiesForFreeShipping ? 0 : baseShippingFee;
  const giftWrapFee = isGiftWrapped ? giftWrapPrice : 0;
  const total = Math.max(0, subtotal - discountAmount + shippingFee + giftWrapFee);

  const amountNeededForFreeShipping =
    freeShippingThreshold > 0 ? Math.max(0, freeShippingThreshold - subtotal) : 0;
  const availablePaymentMethods = getCompatiblePaymentMethods(items);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isGiftWrapped,
        setIsGiftWrapped,
        giftMessage,
        setGiftMessage,
        itemCount,
        subtotal,
        discountAmount,
        shippingFee,
        giftWrapFee,
        total,
        freeShippingThreshold,
        amountNeededForFreeShipping,
        availablePaymentMethods,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
