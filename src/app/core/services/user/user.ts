import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { UserResponse } from '../../models/user/user-response.model';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../models/paginated-response.model';
import { UserRequest } from '../../models/user/user-request.model';

@Injectable({
  providedIn: 'root',
})
export class User {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/users';

  currentUserSignal = signal<UserResponse | null>(null);

  getCurrentUser(): Observable<UserResponse>{
    return this.http.get<UserResponse>(`${this.apiUrl}/profile`);
  }

  getUsers(id?: number, page: number = 0, size: number = 10): Observable<PaginatedResponse<UserResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (id) {
      params = params.set('id', id.toString());
    }

    return this.http.get<PaginatedResponse<UserResponse>>(this.apiUrl, { params });
  }

  createUser(userData: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.apiUrl, userData);
  }

  fetchAndSaveProfile() {
    this.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUserSignal.set(user);
      },
      error: (err) => {
        console.error('Failed to fetch profile', err);
        this.currentUserSignal.set(null);
      }
    });
  }

  clearUser(): void {
   this.currentUserSignal.set(null);
  }
}
