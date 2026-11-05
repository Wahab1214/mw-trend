'use client';

import * as React from 'react';
import { CartItem, PaymentMethod } from '@/types';
import { getCompatiblePaymentMethods } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';

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
  applyCoupon: (code: string) => boolean;
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

  // Pre-configured coupons
  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'MW10') {
      setAppliedCoupon({ code: 'MW10', discountType: 'percentage', discountValue: 10 });
      toast.success('10% discount applied!', 'Coupon Applied');
      return true;
    } else if (cleanCode === 'FREESHIP') {
      setAppliedCoupon({ code: 'FREESHIP', discountType: 'free_shipping', discountValue: BASE_SHIPPING_FEE });
      toast.success('Free Express Shipping applied!', 'Coupon Applied');
      return true;
    } else if (cleanCode === 'GOLD300') {
      setAppliedCoupon({ code: 'GOLD300', discountType: 'fixed', discountValue: 300 });
      toast.success('Rs. 300 discount applied!', 'Coupon Applied');
      return true;
    } else if (cleanCode === 'WELCOME15') {
      setAppliedCoupon({ code: 'WELCOME15', discountType: 'percentage', discountValue: 15 });
      toast.success('15% First Order discount applied!', 'Coupon Applied');
      return true;
    } else {
      toast.error('Invalid or expired coupon code', 'Coupon Error');
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
    subtotal >= FREE_SHIPPING_THRESHOLD || appliedCoupon?.discountType === 'free_shipping';
  const shippingFee = items.length === 0 ? 0 : qualifiesForFreeShipping ? 0 : BASE_SHIPPING_FEE;
  const giftWrapFee = isGiftWrapped ? GIFT_WRAP_PRICE : 0;
  const total = Math.max(0, subtotal - discountAmount + shippingFee + giftWrapFee);

  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
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
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
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
