import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/services/product/product';
import { ProductResponse } from '../../../core/models/product/product-response.model';
import { User } from '../../../core/services/user/user';
import { Auth } from '../../../core/services/auth/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-seller-products',
  imports: [CommonModule, RouterLink],
  templateUrl: './seller-products.html',
  styleUrl: './seller-products.css',
})
export class SellerProducts {
  private productService = inject(Product);
  private userService = inject(User);
  private authService = inject(Auth);
  private router = inject(Router);
  products = signal<ProductResponse[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const tokenUserId = this.authService.getUserId();
    if (tokenUserId !== null) {
      this.loadProducts(tokenUserId);
      return;
    }

    const currentUser = this.userService.currentUserSignal();
    if (currentUser) {
      this.loadProducts(currentUser.id);
    } else {
      this.userService.getCurrentUser().subscribe({
        next: user => {
          this.userService.currentUserSignal.set(user);
          this.loadProducts(user.id);
        },
        error: () => {
          this.errorMessage.set('Unable to identify the seller.');
          this.isLoading.set(false);
        },
      });
    }
  }

  deleteProduct(productId: number): void {
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.products.update(products => products.filter(product => product.id !== productId));
      },
      error: () => {
        this.errorMessage.set('Unable to delete the product.');
      },
    });
  }

  editProduct(productId: number): void {
    this.router.navigate(['/seller/products/edit', productId]);
  }

  private loadProducts(sellerId: number): void {
    this.productService.getAllProducts().subscribe({
      next: response => {
        this.products.set((response.content ?? []).filter(product => product.sellerId === sellerId));
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load your products.');
        this.isLoading.set(false);
      },
    });
  }
}
