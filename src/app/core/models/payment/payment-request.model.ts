export interface PaymentRequest {
  orderId: number;
  paymentMethod: 'CASH_ON_DELIVERY' | 'CREDIT_CARD';
  cardNumber?: string;
}
