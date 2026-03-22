import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductResponse } from '../../models/product/product-response.model';
import { ProductRequest } from '../../models/product/product-request.model';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Product {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/products`;

  getAllProducts(): Observable<PaginatedResponse<ProductResponse>> {
    return this.http.get<PaginatedResponse<ProductResponse>>(this.apiUrl);
  }

  getProductById(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/${id}`);
  }

  getAdminProductById(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/admin/${id}`);
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

  getAdminProducts(page: number = 0, size: number = 10, includeDeleted: boolean = true): Observable<PaginatedResponse<ProductResponse>> {
    return this.http.get<PaginatedResponse<ProductResponse>>(`${this.apiUrl}/admin?page=${page}&size=${size}&includeDeleted=${includeDeleted}`);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createProduct(productData: ProductRequest): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(this.apiUrl, productData);
  }

  updateProduct(id: number, productData: any): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.apiUrl}/${id}`, productData);
  }
}
