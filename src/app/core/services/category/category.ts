import { PaginatedResponse } from '../../models/paginated-response.model';
import { Injectable, inject } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryResponse } from '../../models/product/category-response.model';
import { CategoryRequest } from '../../models/product/category-request.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Category {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/categories`;

  getAllCategories(): Observable<PaginatedResponse<CategoryResponse>> {
    return this.http.get<PaginatedResponse<CategoryResponse>>(this.apiUrl);
  }

  getCategoryById(id: number): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/${id}`);
  }

  createCategory(request: CategoryRequest): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(this.apiUrl, request);
  }

  updateCategory(id: number, request: Partial<CategoryRequest>): Observable<CategoryResponse> {
    return this.http.patch<CategoryResponse>(`${this.apiUrl}/${id}`, request);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
