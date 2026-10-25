import { OrderItemResponse } from '../order/order-item-response.model';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface VendorOrderResponse {
  vendorOrderId: number;
  parentOrderId: number;
  status: OrderStatus;
  vendorSubtotal: number;
  platformFee: number;
  netRevenue: number;
  buyerEmail: string;
  shippingCity: string;
  createdAt: string;
  items: OrderItemResponse[];
}

export interface SellerStatsResponse {
  grossRevenue: number;
  totalPlatformFees: number;
  netRevenue: number;
  activeProductCount: number;
}
