import { OrderItemResponse } from '../order/order-item-response.model';

export interface VendorOrderResponse {
  vendorOrderId: number;
  parentOrderId: number;
  status: string;
  vendorSubtotal: number;
  platformFee: number;
  netRevenue: number;
  buyerEmail: string;
  shippingCity: string;
  createdAt: string;
  items: OrderItemResponse[];
}
