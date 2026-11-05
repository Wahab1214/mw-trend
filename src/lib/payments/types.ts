import { PaymentMethod } from '@/types';

export interface PaymentProcessResult {
  success: boolean;
  orderNumber: string;
  transactionId?: string;
  requiresManualVerification?: boolean;
  gatewayRedirectUrl?: string;
  message: string;
}

export interface PaymentInitiationPayload {
  orderNumber: string;
  amount: number;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  proofImageUrl?: string;
  senderAccountName?: string;
}
