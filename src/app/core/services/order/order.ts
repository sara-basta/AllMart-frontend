import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderResponse } from '../../models/order/order-response.model';
import { PaymentRequest } from '../../models/payment/payment-request.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class Order {
  private http = inject(HttpClient);

  private cartsApi = `${environment.apiUrl}/carts`;
  private paymentsApi = `${environment.apiUrl}/payments`;
  private ordersApi = `${environment.apiUrl}/orders`;

  checkoutFromCart(addressId?: number, newAddress?: { street: string, city: string, zipCode: string }): Observable<string> {
    let params = new HttpParams();
    
    if (addressId) {
      params = params.set('addressId', addressId.toString());
    }

    return this.http.post(`${this.cartsApi}/my-cart/checkout`, newAddress || null, {
      params,
      responseType: 'text'
    });
  }

  processPayment(request: PaymentRequest): Observable<{clientSecret?: string, message?: string}> {
    return this.http.post<{clientSecret?: string, message?: string}>(`${this.paymentsApi}`, request);
  }

  getHistory(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.ordersApi}/my-orders?page=${page}&size=${size}`);
  }

  createOrder(request: { productId: number; addressId?: number; newAddress?: { street: string, city: string, zipCode: string } }): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.ordersApi, request);
  }

  cancelOrder(orderId: number): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.ordersApi}/${orderId}/cancel`, null);
  }

  getOrderById(id: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.ordersApi}/${id}`);
  }

  getAdminOrderById(id: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.ordersApi}/admin/${id}`);
  }

  getOrdersByUser(userId: number): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.ordersApi}/user/${userId}`);
  }

  updateOrderStatus(id: number, status: string): Observable<OrderResponse> {
    const payload = { status: status }; 
    return this.http.patch<OrderResponse>(`${this.ordersApi}/${id}/status`, payload);
  }
}
