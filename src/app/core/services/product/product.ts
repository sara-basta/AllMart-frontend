import { HttpClient, HttpParams } from '@angular/common/http';
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

  getProductById(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/${id}`);
  }

  searchProduct(name?: string, categoryId?: number, minPrice?: number, maxPrice?: number): Observable<PaginatedResponse<ProductResponse>> {
  let params = new HttpParams();

  if (name) {
    params = params.set('name', name);
  }
  if (categoryId) {
    params = params.set('categoryId', categoryId.toString());
  }
  if (minPrice) {
    params = params.set('minPrice', minPrice.toString());
  }
  if (maxPrice) {
    params = params.set('maxPrice', maxPrice.toString());
  }

  return this.http.get<PaginatedResponse<ProductResponse>>(this.apiUrl, { params });
}
}
