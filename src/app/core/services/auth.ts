import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/auth/login-request.model';
import { AuthResponse } from '../models/auth/auth-response.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/auth';

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }

  saveToken(token: string): void {
    localStorage.setItem('jwt_token',token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
  }

}
