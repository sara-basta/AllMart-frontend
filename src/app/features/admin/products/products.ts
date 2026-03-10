import { Component, inject, signal } from '@angular/core';
import { Product } from '../../../core/services/product/product';
import { ProductResponse } from '../../../core/models/product/product-response.model';
import { RouterLink } from '@angular/router';
import { PaginatedResponse } from '../../../core/models/paginated-response.model';

@Component({
  selector: 'app-products',
  imports: [RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private product = inject(Product);

  products = signal<ProductResponse[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);
  totalElements = signal(0);
  isLoading = signal(true);

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts(page: number = 0) {
    this.isLoading.set(true);
    this.product.getAdminProducts(page, 10).subscribe({
      next: (res: PaginatedResponse<ProductResponse> ) => {
        // if content is undefined then give it an empty array
        this.products.set(res.content || []);

        this.currentPage.set(res.number);
        this.totalPages.set(res.totalPages);
        this.totalElements.set(res.totalElements);
        
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.isLoading.set(false);
      }
    });
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.product.deleteProduct(id).subscribe({
        next: () => this.loadProducts(this.currentPage()),
        error: (err) => console.error('Failed to delete product', err)
      });
    }
  }

  changePage(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.loadProducts(newPage);
    }
  }
}
