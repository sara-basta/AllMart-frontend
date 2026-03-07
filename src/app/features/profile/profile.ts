import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { User } from '../../core/services/user/user';
import { Address } from '../../core/services/address/address';
import { Order } from '../../core/services/order/order';
import { OrderResponse } from '../../core/models/order/order-response.model';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, CommonModule, DatePipe, NgClass],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit{
  public user = inject(User);
  private address = inject(Address);
  private order = inject(Order);

  userAddresses = this.address.userAddresses;
  orders = signal<OrderResponse[]>([]);
  isLoadingOrders = signal<boolean>(true);
  activeTab = signal<'profile' | 'orders'>('profile');

  ngOnInit() {
    this.address.loadMyAddresses();
    this.loadOrderHistory();
  }

  removeAddress(id: number) {
    if (confirm('Are you sure you want to delete this address?')) {
      this.address.deleteAddress(id);
    }
  }

  loadOrderHistory() {
    this.order.getHistory().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.isLoadingOrders.set(false);
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.isLoadingOrders.set(false);
      }
    });
  }

  onCancelOrder(orderId: number) {
    this.order.cancelOrder(orderId).subscribe({
        next: () => {
          this.orders.update(orders =>
            orders.map(
              o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o
            )
          );
        },
        error: (err) => {
          console.error('Failed to cancel order:', err);
        }
    });
  }
}
