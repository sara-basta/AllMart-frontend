import { Component, inject } from '@angular/core';
import { Cart } from '../../core/services/cart/cart';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  imports: [RouterLink],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css',
})
export class CartPage {
  private cart = inject(Cart);

  cartCount = this.cart.cartCount;
  cartItems = this.cart.cartItems;
  totalPrice = this.cart.totalPrice;

  updateQuantity(productId: number, delta: number) {
    this.cart.updateQuantity(productId, delta);
  }

  removeItem(productId: number) {
    this.cart.removeItem(productId);
  }
}
