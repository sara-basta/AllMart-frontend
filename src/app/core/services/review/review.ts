import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ReviewRequest } from '../../models/review/review-request.model';
import { ReviewResponse } from '../../models/review/review-response.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Review {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reviews`;

  getProductReviews(productId: number, page: number = 0, size: number = 10): Observable<{ content: ReviewResponse[] }> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<{ content: ReviewResponse[] }>(`${this.apiUrl}/${productId}`, { params });
  }

  addReview(productId: number, request: ReviewRequest): Observable<ReviewResponse> {
    return this.http.post<ReviewResponse>(`${this.apiUrl}/${productId}`, request);
  }

  checkEligibility(productId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${productId}/can-review`);
  }
}
