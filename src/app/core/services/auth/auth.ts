import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest } from '../../models/auth/login-request.model';
import { AuthResponse } from '../../models/auth/auth-response.model';
import { RegisterRequest } from '../../models/auth/register-request.model';
import { Cart } from '../cart/cart';
import { User } from '../user/user';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private http = inject(HttpClient);
  private router = inject(Router);
  private user = inject(User);
  private cart = inject(Cart);

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


  logout() {
    this.user.currentUserSignal.set(null);

    localStorage.removeItem('jwt_token');

    this.cart.clearLocalCart();

    this.router.navigate(['/catalog']);
  }

  register(credentials: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`,credentials);
  }

}
