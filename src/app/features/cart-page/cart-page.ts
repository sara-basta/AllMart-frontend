import { Component, inject } from '@angular/core';
import { Cart } from '../../core/services/cart/cart';
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../../core/services/auth/auth';

@Component({
  selector: 'app-cart-page',
  imports: [RouterLink],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css',
})
export class CartPage {
  private cart = inject(Cart);
  private router = inject(Router);
  private auth = inject(Auth);

  cartCount = this.cart.cartCount;
  cartItems = this.cart.cartItems;
  totalPrice = this.cart.totalPrice;

  updateQuantity(productId: number, delta: number) {
    this.cart.updateQuantity(productId, delta);
  }

  removeItem(productId: number) {
    this.cart.removeItem(productId);
  }

  handleCheckout() {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/cart/checkout']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
