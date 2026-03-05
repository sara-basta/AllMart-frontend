import {Injectable, signal, computed, effect, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CartItem} from '../../models/cart/cart-item.model';
import { ProductResponse } from '../../models/product/product-response.model';
import { User } from '../user/user';

@Injectable({
  providedIn: 'root',
})
export class Cart {

  private http = inject(HttpClient);
  private user = inject(User);

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

    // sync guest cart with user cart once the user logs in
    effect(() => {
      const items = this.cartItems();
      const user = this.user.currentUserSignal();

      if (user && items.length >= 0) {
        this.syncWithBackend(items);
      }
    });
  }

  private syncWithBackend(items: CartItem[]) {
    // take on productId and quantity from the response to fit the backend structure
    const payload = items.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }));

    this.http.post(`${this.apiUrl}/sync`, payload).subscribe({
      next: () => console.log('Cart synced with database'),
      error: (err) => console.error('Sync failed:', err)
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
  clearLocalCart() {
    this.cartItems.set([]);

    localStorage.removeItem('allmart_cart');

    console.log('Local cart cleared on logout.');
  }
}
