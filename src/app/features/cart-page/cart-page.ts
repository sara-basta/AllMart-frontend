import { Component, computed, inject } from '@angular/core';
import { Cart } from '../../core/services/cart/cart';
import { RouterLink, Router } from '@angular/router';
import { CartItem } from '../../core/models/cart/cart-item.model';

@Component({
  selector: 'app-cart-page',
  imports: [RouterLink],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css',
})
export class CartPage {
  private cart = inject(Cart);
  private router = inject(Router);

  cartCount = this.cart.cartCount;
  cartItems = this.cart.cartItems;
  totalPrice = this.cart.totalPrice;
  sellerGroups = computed(() => {
    const groups = new Map<string, CartItem[]>();
    for (const item of this.cartItems()) {
      const seller = item.product.sellerName?.trim() || 'Independent seller';
      groups.set(seller, [...(groups.get(seller) ?? []), item]);
    }
    return Array.from(groups.entries()).map(([sellerName, items]) => ({ sellerName, items }));
  });

  updateQuantity(productId: number, delta: number) {
    this.cart.updateQuantity(productId, delta);
  }

  removeItem(productId: number) {
    this.cart.removeItem(productId);
  }

  handleCheckout() {
    this.router.navigate(['/cart/checkout']);
  }
}
