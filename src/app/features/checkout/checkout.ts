import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Address } from '../../core/services/address/address';
import { Order } from '../../core/services/order/order';
import { Cart } from '../../core/services/cart/cart';
import { FormsModule } from '@angular/forms';
import { PaymentRequest } from '../../core/models/payment/payment-request.model';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
@Component({
  selector: 'app-checkout',
  imports: [RouterLink, FormsModule],
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
  cardNumber = signal<string>('');

  isCreatingNewAddress = signal<boolean>(false);
  newStreet = signal<string>('');
  newCity = signal<string>('');
  newZipCode = signal<string>('');


  stripePromise = loadStripe('pk_test_51TBxcgRsei3heG1XzZn2qNGgPWfoqFLI0aTmUil9rdoMTP0PMSd32lM0f8C5jwnzjRYuzxAFsSRqzstXyNCS9Mx00085FMEC1U');
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  clientSecret = signal<string | null>(null);
  isProcessingPayment = signal(false);
  paymentError = signal<string>('');

  isLoading = signal<boolean>(false);

  ngOnInit() {
    this.address.loadMyAddresses();

    this.route.queryParams.subscribe(params => {
      if (params['productId']) {
        this.buyNowProductId.set(Number(params['productId']));
      }
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
  const addressId = this.selectedAddressId();
  const paymentMethod = this.selectedPayment();
  const productId = this.buyNowProductId();
  const isNew = this.isCreatingNewAddress();

  if (!addressId && !isNew) {
      alert("Please select or enter a shipping address.");
      return;
    }
    if (isNew && (!this.newStreet() || !this.newCity() || !this.newZipCode())) {
      alert("Please fill out all fields for the new address.");
      return;
    }
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    const newAddressObj = isNew ? {
      street: this.newStreet(),
      city: this.newCity(),
      zipCode: this.newZipCode()
    } : undefined;

    if (productId) {
      // buy now flow
      const request = { 
        productId: productId, 
        addressId: addressId ? addressId : undefined,
        newAddress: newAddressObj
      };

      this.order.createOrder(request).subscribe({
        next: (res) => this.executePayment(Number(res.id), paymentMethod),
        error: (err) => console.error('Buy Now failed:', err)
      });
  } else {
    const idToSend = addressId ? addressId : undefined;
    this.order.checkoutFromCart(idToSend, newAddressObj).subscribe({
      next: (res) => this.executePayment(Number(res), paymentMethod),
      error: (err) => console.error('Cart Checkout failed:', err)
    });
  }
}

private executePayment(orderId: number, paymentMethod: 'CASH_ON_DELIVERY' | 'CREDIT_CARD') {
  if (!orderId || isNaN(orderId)) {
    alert("Order failed: Invalid ID received from server.");
    return;
  }

  const paymentRequest: PaymentRequest = {
    orderId,
    paymentMethod,
  };

  this.order.processPayment(paymentRequest).subscribe({
  next: async (res: any) => {
        if (paymentMethod === 'CASH_ON_DELIVERY') {
          this.cart.clearLocalCart();
          this.router.navigate(['/profile']);
        } else if (res.clientSecret) {
          this.clientSecret.set(res.clientSecret);
          this.stripe = await this.stripePromise;
          
          if (this.stripe) {
            this.elements = this.stripe.elements({ clientSecret: res.clientSecret });
            const paymentElement = this.elements.create('payment');
            
            setTimeout(() => {
              paymentElement.mount('#payment-element');
            }, 100);
          }
        }
      },
      error: (err) => {
        console.error('Payment processing failed:', err);
        alert("Order created, but payment failed. Check your order history.");
        this.router.navigate(['/profile']);
      }
    });
  }


  async confirmStripePayment() {
    if (!this.stripe || !this.elements) return;

    this.isProcessingPayment.set(true);
    this.paymentError.set('');

    this.cart.clearLocalCart(); 

    const { error } = await this.stripe.confirmPayment({
      elements: this.elements,
      confirmParams: {
        return_url: 'http://localhost:4200/profile', 
      },
    });

    if (error) {
      this.paymentError.set(error.message || 'An unexpected error occurred.');
      this.isProcessingPayment.set(false);
    } 
  }
}
