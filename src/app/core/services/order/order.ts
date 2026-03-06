import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderResponse } from '../../models/order/order-response.model';
import { PaymentRequest } from '../../models/payment/payment-request.model';


@Injectable({ providedIn: 'root' })
export class Order {
  private http = inject(HttpClient);

  private cartsApi = 'http://localhost:8080/api/carts';
  private paymentsApi = 'http://localhost:8080/api/payments';
  private ordersApi = 'http://localhost:8080/api/orders';

  checkoutFromCart(addressId: number): Observable<string> {
    const params = new HttpParams().set('addressId', addressId.toString());
    return this.http.post(`${this.cartsApi}/my-cart/checkout`, null, {
      params,
      responseType: 'text'
    });
  }

  processPayment(request: PaymentRequest): Observable<string> {
    return this.http.post(`${this.paymentsApi}`, request, {
      responseType: 'text'
    });
  }

  getHistory(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.ordersApi}/my-orders`);
  }

  createOrder(request: { productId: number; addressId: number }): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.ordersApi, request);
  }
}
