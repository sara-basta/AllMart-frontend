import {Injectable, signal, computed, effect, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CartItem} from '../../models/cart/cart-item.model';
import { ProductResponse } from '../../models/product/product-response.model';

@Injectable({
  providedIn: 'root',
})
export class Cart {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/carts';

  cartItems = signal<CartItem[]>(this.loadCart());

  private loadCart() {
    const item = localStorage.getItem('allmart_cart');
    return item ? JSON.parse(item) : [];
    // returns an empty array if item is null else the item as an array
  }

  addToCart(product: ProductResponse) {
    this.cartItems.update(items => {
      const existingItem = items.find(i => i.product.id === product.id);
      if (existingItem) {
        // return the mapped array to update the signal
        return items.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      // return the new array to update the signal
      return [...items, { product, quantity: 1 }];
    });
  }

  cartCount = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));

  totalPrice = computed(() =>
    this.cartItems().reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
  );

  constructor() {
    effect(() => {
      localStorage.setItem('allmart_cart', JSON.stringify(this.cartItems()));
    });
  }

  updateQuantity(productId: number, delta: number){
    this.cartItems.update(items =>
      items.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  }

  removeItem(productId: number) {
    this.cartItems.update(
      items => items
        .filter(i => i.product.id !== productId)
    );
  }
}
