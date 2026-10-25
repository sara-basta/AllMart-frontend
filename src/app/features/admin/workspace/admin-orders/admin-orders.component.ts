import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { OrderResponse } from '../../../../core/models/order/order-response.model';

@Component({
  selector: 'app-admin-orders-component',
  imports: [CommonModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css',
})
export class AdminOrdersComponent {
  private adminService = inject(AdminService);

  orders = signal<OrderResponse[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);
  totalElements = signal(0);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(page = 0): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.adminService.getOrders(page, 20).subscribe({
      next: res => {
        this.orders.set(res.content ?? []);
        this.currentPage.set(res.number ?? 0);
        this.totalPages.set(res.totalPages ?? 0);
        this.totalElements.set(res.totalElements ?? 0);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load orders.');
        this.isLoading.set(false);
      },
    });
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.loadOrders(newPage);
    }
  }
}
