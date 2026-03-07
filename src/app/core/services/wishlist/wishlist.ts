import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ProductResponse } from '../../models/product/product-response.model';

@Injectable({
  providedIn: 'root',
})
export class Wishlist {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/wishlists';

  wishlistItems = signal<ProductResponse[]>([]); 
  wishlistIds = signal<Set<number>>(new Set()); 
  isLoading = signal<boolean>(false);

  loadWishlist(page: number = 0, size: number = 10) {
    this.isLoading.set(true);
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    this.http.get<{ content: ProductResponse[] }>(this.apiUrl, { params }).subscribe({
      next: (response) => {
        const products = response.content; 
        this.wishlistItems.set(products);
        this.wishlistIds.set(new Set(products.map(p => p.id)));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load wishlist:', err);
        this.isLoading.set(false);
      }
    });
  }

  toggleWishlist(product: ProductResponse) {
    const isSaved = this.wishlistIds().has(product.id);

    if (isSaved) {
      this.wishlistIds.update(ids => { ids.delete(product.id); return new Set(ids); });
      this.wishlistItems.update(items => items.filter(p => p.id !== product.id));

      this.http.delete(`${this.apiUrl}/${product.id}`).subscribe({
        error: (err) => {
          console.error('Failed to remove from wishlist:', err);
          this.loadWishlist();
        }
      });
    } else {
      this.wishlistIds.update(ids => { ids.add(product.id); return new Set(ids); });
      this.wishlistItems.update(items => [...items, product]);

      this.http.post(`${this.apiUrl}/${product.id}`, null).subscribe({
        error: (err) => {
          console.error('Failed to add to wishlist:', err);
          this.loadWishlist();
        }
      });
    }
  }

  // helper for the html page
  isInWishlist(productId: number): boolean {
    return this.wishlistIds().has(productId);
  }
}
