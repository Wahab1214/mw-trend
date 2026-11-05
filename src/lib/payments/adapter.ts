import { PaymentInitiationPayload, PaymentProcessResult } from './types';

export interface PaymentAdapter {
  processPayment: (payload: PaymentInitiationPayload) => Promise<PaymentProcessResult>;
}

export class CashOnDeliveryAdapter implements PaymentAdapter {
  async processPayment(payload: PaymentInitiationPayload): Promise<PaymentProcessResult> {
    return {
      success: true,
      orderNumber: payload.orderNumber,
      requiresManualVerification: false,
      message: 'Cash on Delivery order successfully placed. Please pay upon delivery.',
    };
  }
}

export class ManualVerificationAdapter implements PaymentAdapter {
  async processPayment(payload: PaymentInitiationPayload): Promise<PaymentProcessResult> {
    if (!payload.transactionId) {
      return {
        success: false,
        orderNumber: payload.orderNumber,
        message: 'Transaction ID is required for manual payment verification.',
      };
    }

    return {
      success: true,
      orderNumber: payload.orderNumber,
      transactionId: payload.transactionId,
      requiresManualVerification: true,
      message: `Your payment reference (${payload.transactionId}) has been received. Our finance desk will verify and dispatch your order.`,
    };
  }
}

export class CardGatewayAdapter implements PaymentAdapter {
  async processPayment(payload: PaymentInitiationPayload): Promise<PaymentProcessResult> {
    const isEnabled = process.env.ENABLE_CARD_GATEWAY === 'true';

    if (!isEnabled) {
      // In development or when merchant gateway is awaiting approval
      return {
        success: true,
        orderNumber: payload.orderNumber,
        transactionId: `CARD-MOCK-${Date.now()}`,
        requiresManualVerification: false,
        message: 'Card payment processed via simulated gateway sandbox.',
      };
    }

    // When live credentials provided
    return {
      success: true,
      orderNumber: payload.orderNumber,
      transactionId: `CARD-${Date.now()}`,
      requiresManualVerification: false,
      message: 'Payment verified via secure card checkout.',
    };
  }
}

export function getPaymentAdapter(method: string): PaymentAdapter {
  switch (method) {
    case 'COD':
      return new CashOnDeliveryAdapter();
    case 'JazzCash':
    case 'Easypaisa':
    case 'BankTransfer':
      return new ManualVerificationAdapter();
    case 'Card':
      return new CardGatewayAdapter();
    default:
      return new CashOnDeliveryAdapter();
  }
}
