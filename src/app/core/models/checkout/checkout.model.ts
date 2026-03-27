import { CartItem } from '../cart/cart-item.model';

export type PaymentMethod = 'CREDIT_CARD' | 'CASH_ON_DELIVERY';

export interface AddressDraft {
  street: string;
  city: string;
  zipCode: string;
}

export interface GuestCheckoutPayload {
  email: string;
  shippingAddress: AddressDraft;
  paymentMethod: PaymentMethod;
  items: {
	productId: number;
	quantity: number;
  }[];
}

export interface GuestCheckoutResponse {
  url: string;
}

export const mapCartItemsToOrderItems = (items: CartItem[]): GuestCheckoutPayload['items'] =>
  items.map((item) => ({
	productId: item.product.id,
	quantity: item.quantity,
  }));

