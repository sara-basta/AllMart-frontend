import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AddressDraft, GuestCheckoutPayload, GuestCheckoutResponse, PaymentMethod } from '../../models/checkout/checkout.model';
import { PaymentRequest } from '../../models/payment/payment-request.model';
import { Order } from '../order/order';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CheckoutFlow {
  private http = inject(HttpClient);
  private order = inject(Order);

  private guestCheckoutApi = `${environment.apiUrl}/checkout/guest`;

  createGuestCheckout(payload: GuestCheckoutPayload): Observable<GuestCheckoutResponse> {
    return this.http.post<GuestCheckoutResponse>(this.guestCheckoutApi, payload);
  }

  createAuthenticatedOrder(input: {
    buyNowProductId: number | null;
    addressId?: number;
    newAddress?: AddressDraft;
  }): Observable<number> {
    if (input.buyNowProductId) {
      return this.order.createOrder({
        productId: input.buyNowProductId,
        addressId: input.addressId,
        newAddress: input.newAddress,
      }).pipe(map((response) => Number(response.id)));
    }

    return this.order.checkoutFromCart(input.addressId, input.newAddress)
      .pipe(map((response) => Number(response)));
  }

  processAuthenticatedPayment(orderId: number, paymentMethod: PaymentMethod) {
    const paymentRequest: PaymentRequest = { orderId, paymentMethod };

    return this.order.processPayment(paymentRequest);
  }
}
