import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductResponse } from '../../models/product/product-response.model';
import { PaginatedResponse } from '../../models/paginated-response.model';

@Injectable({
  providedIn: 'root',
})
export class Product {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/products';

  getAllProducts(): Observable<PaginatedResponse<ProductResponse>> {
    return this.http.get<PaginatedResponse<ProductResponse>>(this.apiUrl);
  }
}
