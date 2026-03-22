import { Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripePromise = loadStripe(environment.stripePublicKey);

  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;

  async mountPaymentElement(clientSecret: string, elementSelector: string): Promise<void> {
    this.stripe = await this.stripePromise;
    if (!this.stripe) {
      throw new Error('Stripe failed to load properly.');
    }

    // Destroy existing elements to prevent the "double mount" crash if user hits back/refresh
    if (this.elements) {
      this.elements = null; 
    }

    this.elements = this.stripe.elements({ clientSecret });
    const paymentElement = this.elements.create('payment');
    paymentElement.mount(elementSelector);
  }

  async confirmPayment(returnUrl: string) {
    if (!this.stripe || !this.elements) {
      throw new Error('Payment elements not initialized.');
    }

    return await this.stripe.confirmPayment({
      elements: this.elements,
      confirmParams: {
        return_url: returnUrl,
      },
    });
  }
}
