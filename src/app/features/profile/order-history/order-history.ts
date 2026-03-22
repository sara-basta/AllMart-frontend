import { Component, input, output } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderResponse } from '../../../core/models/order/order-response.model';

@Component({
  selector: 'app-order-history',
  imports: [DatePipe, NgClass, RouterLink],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css',
})
export class OrderHistory {

  orders = input<OrderResponse[]>([]);
  selectedOrder = input<OrderResponse | null>(null);
  isLoading = input<boolean>(false);
  
  currentPage = input<number>(0);
  totalPages = input<number>(0);
  totalElements = input<number>(0);

  onViewOrder = output<number>();
  onCancelOrder = output<number>();
  onBackToHistory = output<void>();
  onPageChange = output<number>();

  nextPage() {
    if (this.currentPage() < this.totalPages() - 1) {
      this.onPageChange.emit(this.currentPage() + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 0) {
      this.onPageChange.emit(this.currentPage() - 1);
    }
  }

}
