import { OrderStatus, PaymentMethod } from '@/types';

export const PAKISTAN_MAJOR_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Mardan',
  'Gujrat',
  'Sheikhupura',
  'Jhelum',
  'Sahiwal',
  'Wah Cantt',
  'Rahim Yar Khan',
  'Kasur',
  'Muzaffarabad',
  'Mirpur (AJK)',
  'Other / Remote City'
] as const;

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bg: string; step: number; description: string }
> = {
  New: {
    label: 'Order Placed',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10 border-amber-500/20',
    step: 1,
    description: 'We have received your order and are validating details.',
  },
  Confirmed: {
    label: 'Confirmed',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10 border-blue-500/20',
    step: 2,
    description: 'Payment / verification confirmed. Queued for crafting.',
  },
  'In Production': {
    label: 'In Production',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10 border-purple-500/20',
    step: 3,
    description: 'Your item is being personalized, printed & quality inspected.',
  },
  Shipped: {
    label: 'Dispatched / In Transit',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
    step: 4,
    description: 'Handed over to courier partner. On its way to your doorstep.',
  },
  Delivered: {
    label: 'Delivered',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    step: 5,
    description: 'Successfully delivered. Enjoy your personalized keepsake!',
  },
  Cancelled: {
    label: 'Cancelled',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10 border-rose-500/20',
    step: 0,
    description: 'Order was cancelled.',
  },
  Returned: {
    label: 'Returned',
    color: 'text-stone-500',
    bg: 'bg-stone-500/10 border-stone-500/20',
    step: 0,
    description: 'Returned to studio.',
  },
};

export const PAYMENT_METHOD_CONFIG: Record<
  PaymentMethod,
  { name: string; subtitle: string; badge: string; isInstant: boolean }
> = {
  COD: {
    name: 'Cash on Delivery (COD)',
    subtitle: 'Pay with cash upon delivery at your doorstep anywhere in Pakistan',
    badge: 'Popular',
    isInstant: false,
  },
  JazzCash: {
    name: 'JazzCash Transfer / Till',
    subtitle: 'Send money to our official JazzCash account and upload receipt screenshot',
    badge: 'Manual Verification',
    isInstant: false,
  },
  Easypaisa: {
    name: 'Easypaisa Mobile Account',
    subtitle: 'Send money to our official Easypaisa account and upload receipt screenshot',
    badge: 'Manual Verification',
    isInstant: false,
  },
  BankTransfer: {
    name: 'Direct Online Bank Transfer (IBFT / Raast)',
    subtitle: 'Transfer via Meezan Bank or Raast and enter your transaction reference ID',
    badge: 'Manual Verification',
    isInstant: false,
  },
  Card: {
    name: 'Debit / Credit Card (Visa & Mastercard)',
    subtitle: 'Secure payment via Visa or Mastercard (Scaffolded Gateway)',
    badge: 'Gateway',
    isInstant: true,
  },
};

export const OCCASIONS_LIST = [
  "Valentine's Day",
  "Friendship Day",
  'Birthday',
  'Anniversary & Wedding',
  'Eid Mubarak',
  'Graduation & Corporate',
  'Just Because / Personal',
] as const;

export const RECIPIENTS_LIST = [
  'For Him (Husband / Boyfriend / Brother)',
  'For Her (Wife / Girlfriend / Sister)',
  'Best Friend / Soulmate',
  'Parents & Family',
  'Colleague / Mentor',
] as const;

export const COURIER_PARTNERS = [
  { name: 'TCS Express', trackingUrl: 'https://www.tcsexpress.com/track/' },
  { name: 'Leopards Courier', trackingUrl: 'https://leopardscourier.com/tracking/' },
  { name: 'Call Courier', trackingUrl: 'https://callcourier.com.pk/tracking/' },
  { name: 'Trax Logistics', trackingUrl: 'https://trax.pk/tracking/' },
  { name: 'Rider Courier', trackingUrl: 'https://withrider.com/tracking/' },
  { name: 'M&P Express', trackingUrl: 'https://mulphilog.com/tracking' },
];
