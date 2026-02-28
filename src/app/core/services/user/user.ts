import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { UserResponse } from '../../models/user/user-response.model';
import { Observable } from 'rxjs';

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
