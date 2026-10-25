import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SellerStatsResponse } from '../../models/vendor/seller-stats-response.model';
import { VendorOrderResponse } from '../../models/vendor/vendor-order-response.model';
import { PaginatedResponse } from '../../models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class VendorService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/vendor/orders`;

  getStats(userId: number): Observable<SellerStatsResponse> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<SellerStatsResponse>(`${this.apiUrl}/stats`, { params });
  }

  getOrders(status?: string, page = 0, size = 10): Observable<PaginatedResponse<VendorOrderResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<PaginatedResponse<VendorOrderResponse>>(this.apiUrl, { params });
  }

  updateOrderStatus(id: number, status: string): Observable<VendorOrderResponse> {
    return this.http.patch<VendorOrderResponse>(`${this.apiUrl}/${id}/status`, { status });
  }
}
