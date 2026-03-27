import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartItem } from '../../core/models/cart/cart-item.model';
import { AddressDraft, GuestCheckoutPayload, mapCartItemsToOrderItems, PaymentMethod } from '../../core/models/checkout/checkout.model';
import { Address } from '../../core/services/address/address';
import { Auth } from '../../core/services/auth/auth';
import { Cart } from '../../core/services/cart/cart';
import { CheckoutFlow } from '../../core/services/checkout/checkout-flow';
import { Product } from '../../core/services/product/product';
import { StripeService } from '../../core/services/stripe/stripe';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-checkout',
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private address = inject(Address);
  private checkoutFlow = inject(CheckoutFlow);
  private product = inject(Product);
  private cart = inject(Cart);
  private stripeService = inject(StripeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoggedIn = signal(false);

  // Guest checkout state
  isBuyNow = signal(false);
  isLoadingItems = signal(false);
  itemsError = signal('');
  submitError = signal('');
  isSubmitting = signal(false);

  // Logged-in checkout state
  userAddresses = this.address.userAddresses;
  selectedAddressId = signal<number | null>(null);
  selectedPayment = signal<PaymentMethod | null>(null);
  isCreatingNewAddress = signal(false);
  newStreet = signal('');
  newCity = signal('');
  newZipCode = signal('');
  isLoading = signal(false);
  clientSecret = signal<string | null>(null);
  stripeOrderId = signal<number | null>(null);
  isProcessingPayment = signal(false);
  paymentError = signal('');

  buyNowProductId = signal<number | null>(null);
  private buyNowItems = signal<CartItem[]>([]);

  checkoutItems = computed(() => this.isBuyNow() ? this.buyNowItems() : this.cart.cartItems());

  orderTotal = computed(() =>
    this.checkoutItems().reduce((total, item) => total + (item.product.price * item.quantity), 0)
  );

  hasItems = computed(() => this.checkoutItems().length > 0);

  checkoutForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    shippingAddress: this.fb.nonNullable.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
    }),
    paymentMethod: this.fb.nonNullable.control<PaymentMethod>('CASH_ON_DELIVERY', Validators.required),
  });

  ngOnInit() {
    this.isLoggedIn.set(this.auth.isLoggedIn());

    if (this.isLoggedIn()) {
      this.address.loadMyAddresses();
    }

    const productIdParam = this.route.snapshot.queryParamMap.get('productId');

    if (!productIdParam) {
      this.isBuyNow.set(false);
      return;
    }

    const productId = Number(productIdParam);
    if (!Number.isFinite(productId) || productId <= 0) {
      this.itemsError.set('Invalid product selected for checkout.');
      this.buyNowProductId.set(null);
      this.buyNowItems.set([]);
      this.isBuyNow.set(true);
      return;
    }

    this.buyNowProductId.set(productId);
    this.loadBuyNowProduct(productId);
  }

  private loadBuyNowProduct(productId: number) {
    this.isBuyNow.set(true);
    this.isLoadingItems.set(true);
    this.itemsError.set('');

    this.product.getProductById(productId).subscribe({
      next: (productResponse) => {
        this.buyNowItems.set([{ product: productResponse, quantity: 1 }]);
        this.isLoadingItems.set(false);
      },
      error: () => {
        this.itemsError.set('Unable to load the selected product. Please try again.');
        this.buyNowItems.set([]);
        this.isLoadingItems.set(false);
      },
    });
  }

  placeOrder() {
    if (this.isLoggedIn()) {
      this.confirmOrder();
      return;
    }

    if (!this.validateGuestCheckout()) {
      return;
    }

    const payload = this.buildPayload(this.checkoutItems());
    this.isSubmitting.set(true);

    this.checkoutFlow.createGuestCheckout(payload).subscribe({
      next: (response) => this.handleRedirect(response.url),
      error: (error) => {
        this.submitError.set(error?.error?.error || 'Could not place your order right now.');
        this.isSubmitting.set(false);
      },
    });
  }

  toggleNewAddress(state: boolean) {
    this.isCreatingNewAddress.set(state);
    if (state) {
      this.selectedAddressId.set(null);
    }
  }

  selectSavedAddress(id: number) {
    this.selectedAddressId.set(id);
    this.isCreatingNewAddress.set(false);
  }

  confirmOrder() {
    if (!this.isLoggedIn()) {
      return;
    }

    const addressId = this.selectedAddressId();
    const paymentMethod = this.selectedPayment();
    const productId = this.buyNowProductId();
    const isNewAddress = this.isCreatingNewAddress();

    if (!addressId && !isNewAddress) {
      alert('Please select or enter a shipping address.');
      return;
    }

    if (isNewAddress && (!this.newStreet().trim() || !this.newCity().trim() || !this.newZipCode().trim())) {
      alert('Please fill out all fields for the new address.');
      return;
    }

    if (!paymentMethod) {
      alert('Please select a payment method.');
      return;
    }

    this.isLoading.set(true);

    this.checkoutFlow.createAuthenticatedOrder({
      buyNowProductId: productId,
      addressId: addressId ?? undefined,
      newAddress: isNewAddress ? this.buildNewAddress() : undefined,
    }).subscribe({
      next: (orderId) => this.executePayment(orderId, paymentMethod),
      error: (err) => {
        console.error('Checkout failed:', err);
        this.isLoading.set(false);
      },
    });
  }

  private executePayment(orderId: number, paymentMethod: PaymentMethod) {
    if (!orderId || Number.isNaN(orderId)) {
      alert('Order failed: invalid order ID received from server.');
      this.isLoading.set(false);
      return;
    }

    this.checkoutFlow.processAuthenticatedPayment(orderId, paymentMethod).subscribe({
      next: async (response: { clientSecret?: string }) => {
        this.isLoading.set(false);

        if (paymentMethod === 'CASH_ON_DELIVERY') {
          this.cart.clearLocalCart();
          void this.router.navigateByUrl(`/payment-success?orderId=${orderId}&status=confirmed`);
          return;
        }

        if (response.clientSecret) {
          this.clientSecret.set(response.clientSecret);
          this.stripeOrderId.set(orderId);

          setTimeout(() => {
            this.stripeService.mountPaymentElement(response.clientSecret!, '#payment-element')
              .catch((err) => console.error('Stripe mount error:', err));
          }, 100);
        }
      },
      error: (err) => {
        console.error('Payment initialization failed:', err);
        alert('Order created, but payment initialization failed. Check your order history.');
        this.isLoading.set(false);
      },
    });
  }

  async confirmStripePayment() {
    this.isProcessingPayment.set(true);
    this.paymentError.set('');

    try {
      const orderId = this.stripeOrderId();
      const returnUrl = orderId
        ? `${environment.frontendUrl}/payment-success?orderId=${orderId}&status=paid`
        : `${environment.frontendUrl}/payment-success?status=paid`;

      const { error } = await this.stripeService.confirmPayment(returnUrl);

      if (error) {
        this.paymentError.set(error.message || 'An unexpected payment error occurred.');
        this.isProcessingPayment.set(false);
        return;
      }

      this.cart.clearLocalCart();
    } catch (err: unknown) {
      this.paymentError.set(err instanceof Error ? err.message : 'Failed to connect to payment gateway.');
      this.isProcessingPayment.set(false);
    }
  }

  private buildPayload(items: CartItem[]): GuestCheckoutPayload {
    const formValue = this.checkoutForm.getRawValue();

    return {
      email: formValue.email,
      shippingAddress: {
        street: formValue.shippingAddress.street,
        city: formValue.shippingAddress.city,
        zipCode: formValue.shippingAddress.zipCode,
      },
      paymentMethod: formValue.paymentMethod,
      items: mapCartItemsToOrderItems(items),
    };
  }

  private validateGuestCheckout(): boolean {
    this.submitError.set('');

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return false;
    }

    if (!this.hasItems()) {
      this.submitError.set('Your checkout is empty. Add items before placing the order.');
      return false;
    }

    return true;
  }

  private buildNewAddress(): AddressDraft {
    return {
      street: this.newStreet().trim(),
      city: this.newCity().trim(),
      zipCode: this.newZipCode().trim(),
    };
  }

  private handleRedirect(url: string) {
    this.cart.clearLocalCart();

    if (!url) {
      this.submitError.set('Order created, but redirect URL is missing.');
      this.isSubmitting.set(false);
      return;
    }

    if (url.startsWith('http')) {
      window.location.href = url;
      return;
    }

    if (url.startsWith('/')) {
      this.router.navigateByUrl(url).catch(() => {
        this.submitError.set('Order placed, but navigation failed. Please open your profile orders.');
        this.isSubmitting.set(false);
      });
      return;
    }

    this.submitError.set('Unsupported redirect URL returned by server.');
    this.isSubmitting.set(false);
  }
}
