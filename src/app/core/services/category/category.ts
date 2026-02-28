import { PaginatedResponse } from './../../models/paginated-response.model';
import { Injectable, inject } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryResponse } from '../../models/product/category-response.model';

@Injectable({
  providedIn: 'root',
})
export class Category {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/categories';

  getAllCategories(): Observable<PaginatedResponse<CategoryResponse>> {
    return this.http.get<PaginatedResponse<CategoryResponse>>(this.apiUrl);
  }

  getCategoryById(id: number): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/${id}`);
  }
}
