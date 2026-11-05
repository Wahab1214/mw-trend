import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PaymentMethod, CartItem } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number into Pakistani Rupee format: e.g. "Rs. 1,499"
 */
export function formatPKR(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'Rs. 0';
  }
  const formatted = Math.round(amount).toLocaleString('en-PK');
  return `Rs. ${formatted}`;
}

/**
 * Format ISO date string into readable display
 */
export function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Format date with time
 */
export function formatDateTime(dateString: string | undefined): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    return d.toLocaleString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

/**
 * Slug generator
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

/**
 * Generates human-readable order number: MW-001042
 */
export function generateOrderNumber(seq?: number): string {
  const num = seq || Math.floor(100000 + Math.random() * 900000);
  return `MW-${num}`;
}

/**
 * Resolves available payment methods across all items in the cart.
 * If all items accept COD, COD is available. If an item restricts payment,
 * only the intersection is allowed.
 */
export function getCompatiblePaymentMethods(items: CartItem[]): PaymentMethod[] {
  if (!items || items.length === 0) {
    return ['COD', 'JazzCash', 'Easypaisa', 'BankTransfer', 'Card'];
  }

  const allMethods: PaymentMethod[] = ['COD', 'JazzCash', 'Easypaisa', 'BankTransfer', 'Card'];

  return allMethods.filter((method) =>
    items.every((item) => item.allowed_payment_methods && item.allowed_payment_methods.includes(method))
  );
}

/**
 * Calculate net profit and profit margin for an order
 */
export function calculateOrderProfit(
  subtotal: number,
  discount: number,
  shippingFee: number,
  costPriceTotal: number,
  courierCost: number,
  otherExpense: number
) {
  const netRevenue = subtotal - discount + shippingFee;
  const totalExpenses = costPriceTotal + courierCost + otherExpense;
  const netProfit = netRevenue - totalExpenses;
  const marginPercent = netRevenue > 0 ? (netProfit / netRevenue) * 100 : 0;

  return {
    netRevenue,
    totalExpenses,
    netProfit,
    marginPercent: Number(marginPercent.toFixed(1)),
  };
}

/**
 * Validates Pakistani mobile phone numbers:
 * Accepts: 03001234567, 0300-1234567, +923001234567, 923001234567
 */
export function isValidPakistanPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, '');
  const regex = /^((\+92)|(0092)|(92)|0)?3[0-9]{9}$/;
  return regex.test(cleaned);
}
