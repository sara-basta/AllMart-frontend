import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Address } from '../../core/services/address/address';
import { Order } from '../../core/services/order/order';
import { Cart } from '../../core/services/cart/cart';

@Component({
  selector: 'app-checkout',
  imports: [],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit{

  private address = inject(Address);
  private order = inject(Order);
  private cart = inject(Cart);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  userAddresses = this.address.userAddresses;
  selectedAddressId = signal<number | null>(null);
  selectedPayment = signal<'CASH_ON_DELIVERY' | 'CREDIT_CARD' | null>(null);
  buyNowProductId = signal<number | null>(null);

  ngOnInit() {
    this.address.loadMyAddresses();

    this.route.queryParams.subscribe(params => {
      if (params['productId']) {
        this.buyNowProductId.set(Number(params['productId']));
      }
    });
  }

  confirmOrder() {
    const addressId = this.selectedAddressId();
    const paymentMethod = this.selectedPayment();

    if (!addressId || !paymentMethod) return;

    const productId = this.buyNowProductId();

    if (productId) {
      // order from buy now button
      this.order.createOrder({ productId, addressId }).subscribe({
        next: () => this.router.navigate(['/profile']),
        error: (err) => console.error('Buy Now failed:', err)
      });
    } else {
      // order from cart
      this.order.checkoutFromCart(addressId).subscribe({
        next: () => {
          this.cart.clearLocalCart();
          this.router.navigate(['/profile']);
        },
        error: (err) => console.error('Cart Checkout failed:', err)
      });
    }
  }
}
