import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest } from '../../models/auth/login-request.model';
import { AuthResponse } from '../../models/auth/auth-response.model';
import { RegisterRequest } from '../../models/auth/register-request.model';
import { Cart } from '../cart/cart';
import { User } from '../user/user';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private http = inject(HttpClient);
  private router = inject(Router);
  private user = inject(User);
  private cart = inject(Cart);

  private apiUrl = `${environment.apiUrl}/auth`;

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }

  saveToken(token: string): void {
    localStorage.setItem('jwt_token',token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const encodedPayload = token.split('.')[1];
      const normalizedPayload = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = atob(
        normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '='),
      );
      const payload = JSON.parse(decodedPayload) as {
        userId?: number | string;
      };
      const claim = payload.userId;
      const userId = typeof claim === 'number' ? claim : Number(claim);
      return Number.isInteger(userId) && userId > 0 ? userId : null;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }


  logout() {
    this.user.currentUserSignal.set(null);

    localStorage.removeItem('jwt_token');

    this.cart.clearLocalCart();

    this.router.navigate(['/login']);
  }

  register(credentials: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`,credentials);
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      // Split the token, decode the payload, parse the JSON, and grab the role
      return JSON.parse(atob(token.split('.')[1])).role || null;
    } catch {
      return null;
    }
  }

}
