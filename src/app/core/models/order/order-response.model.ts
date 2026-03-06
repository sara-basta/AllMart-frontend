import {OrderItemResponse} from './order-item-response.model';

export interface OrderResponse {
  id: number;
  status: string;
  totalAmount: number;
  shippingCity: string;
  orderDate: string;
  items: OrderItemResponse[];
}
