import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VendorService } from '../../../core/services/vendor/vendor.service';
import { VendorOrderResponse } from '../../../core/models/vendor/vendor-order-response.model';

@Component({
  selector: 'app-seller-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './seller-orders.html',
  styleUrl: './seller-orders.css',
})
export class SellerOrders {
  private vendorService = inject(VendorService);
  orders = signal<VendorOrderResponse[]>([]);
  selectedStatus = signal('');
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  statusOptions = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.vendorService.getOrders(this.selectedStatus() || undefined).subscribe({
      next: response => {
        this.orders.set(response.content ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load your orders.');
        this.isLoading.set(false);
      },
    });
  }

  updateStatus(order: VendorOrderResponse, event: Event): void {
    const status = (event.target as HTMLSelectElement).value;
    this.vendorService.updateOrderStatus(order.vendorOrderId, status).subscribe({
      next: updated => this.orders.update(orders =>
        orders.map(current => current.vendorOrderId === updated.vendorOrderId ? updated : current)),
      error: () => this.errorMessage.set('Unable to update this order status.'),
    });
  }
}
