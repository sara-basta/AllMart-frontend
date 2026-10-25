import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminStatsResponse } from '../../models/admin/admin-stats-response.model';
import { OrderResponse } from '../../models/order/order-response.model';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { ProductResponse } from '../../models/product/product-response.model';
import { UserResponse } from '../../models/user/user-response.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin`;

  getStats(): Observable<AdminStatsResponse> {
    return this.http.get<AdminStatsResponse>(`${this.apiUrl}/stats`);
  }

  getUsers(page = 0, size = 20): Observable<PaginatedResponse<UserResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PaginatedResponse<UserResponse>>(`${this.apiUrl}/users`, { params });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  getProducts(page = 0, size = 20, includeDeleted = true): Observable<PaginatedResponse<ProductResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('includeDeleted', includeDeleted.toString());
    return this.http.get<PaginatedResponse<ProductResponse>>(`${this.apiUrl}/products`, { params });
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }

  getOrders(page = 0, size = 20): Observable<PaginatedResponse<OrderResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PaginatedResponse<OrderResponse>>(`${this.apiUrl}/orders`, { params });
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/orders/${id}`);
  }
}
