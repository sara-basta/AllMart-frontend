import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order } from '../../../core/services/order/order';
import { OrderResponse } from '../../../core/models/order/order-response.model';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {

  private orderService = inject(Order);

  orders = signal<OrderResponse[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  searchOrderId = signal<number | null>(null);
  searchUserId = signal<number | null>(null);

  statusOptions = ['PENDING', 'CONFIRMED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  searchByOrderId() {
    const id = this.searchOrderId();
    if (!id) return;
    
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.searchUserId.set(null);

    this.orderService.getAdminOrderById(id).subscribe({
      next: (order) => {
        this.orders.set([order]);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Order not found', err);
        this.orders.set([]);
        this.errorMessage.set(`Order #${id} not found.`);
        this.isLoading.set(false);
      }
    });
  }

  searchByUserId() {
    const userId = this.searchUserId();
    if (!userId) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.searchOrderId.set(null);

    this.orderService.getOrdersByUser(userId).subscribe({
      next: (ordersList) => {
        this.orders.set(ordersList || []);
        if (ordersList.length === 0) {
          this.errorMessage.set(`No orders found for User ID ${userId}.`);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch user orders', err);
        this.orders.set([]);
        this.errorMessage.set(`Failed to retrieve orders for User ID ${userId}.`);
        this.isLoading.set(false);
      }
    });
  }

  resetSearch() {
    this.searchOrderId.set(null);
    this.searchUserId.set(null);
    this.orders.set([]);
    this.errorMessage.set(null);
  }

  updateStatus(id: number, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value;
    
    if (confirm(`Are you sure you want to change Order #${id} to ${newStatus}?`)) {
      this.orderService.updateOrderStatus(id, newStatus).subscribe({
        next: (updatedOrder) => {
          this.orders.update(currentOrders => 
            currentOrders.map(o => o.id === id ? updatedOrder : o)
          );
        },
        error: (err) => {
          console.error('Failed to update status', err);
          alert('Failed to update status. Check backend logs.');
          const originalOrder = this.orders().find(o => o.id === id);
          if (originalOrder) {
            selectElement.value = originalOrder.status; 
          }
        }
      });
    } else {
      const originalOrder = this.orders().find(o => o.id === id);
      if (originalOrder) {
        selectElement.value = originalOrder.status; 
      }
    }
  }

}
