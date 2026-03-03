import {ProductResponse} from '../product/product-response.model';

export interface CartItem {
  product: ProductResponse;
  quantity: number;
}
