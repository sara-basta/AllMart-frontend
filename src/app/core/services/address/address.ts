import { Injectable, inject, signal } from '@angular/core';
import { UserAddress } from '../../models/user/user-address.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class Address {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/users/profile/addresses`;

  userAddresses = signal<UserAddress[]>([]);

  loadMyAddresses(){
    this.http.get<UserAddress[]>(this.apiUrl).subscribe({
      next: (data) => {this.userAddresses.set(data);},
      error: (err) => console.error('Failed to load addresses:', err)
    });
  }

  deleteAddress(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.userAddresses.update(prev => prev.filter(a => a.id !== id));
      },
      error: (err) => console.error('Delete failed:', err)
    });
  }

  addAddress(address: Partial<UserAddress>) {
    return this.http.post<UserAddress>(this.apiUrl, address).subscribe({
      next: (newAddress) => {
        this.userAddresses.update(prev => [...prev, newAddress]);
      }
    });
  }

  updateAddress(addressId: number, data: { street: string; city: string; zipCode: string }): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${addressId}`, data);
  }

}
