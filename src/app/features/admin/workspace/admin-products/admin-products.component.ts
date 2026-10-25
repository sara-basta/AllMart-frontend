import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { ProductResponse } from '../../../../core/models/product/product-response.model';

@Component({
  selector: 'app-admin-products-component',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css',
})
export class AdminProductsComponent {
  private adminService = inject(AdminService);

  products = signal<ProductResponse[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);
  totalElements = signal(0);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(page = 0): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.adminService.getProducts(page, 20, true).subscribe({
      next: res => {
        this.products.set(res.content ?? []);
        this.currentPage.set(res.number ?? 0);
        this.totalPages.set(res.totalPages ?? 0);
        this.totalElements.set(res.totalElements ?? 0);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load products.');
        this.isLoading.set(false);
      },
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.adminService.deleteProduct(id).subscribe({
        next: () => {
          this.products.update(products => products.filter(p => p.id !== id));
          this.totalElements.update(total => total - 1);
        },
        error: () => {
          this.errorMessage.set('Failed to delete product.');
        }
      });
    }
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.loadProducts(newPage);
    }
  }
}
