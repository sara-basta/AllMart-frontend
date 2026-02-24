import { FormsModule } from '@angular/forms';
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/services/product/product';
import { ProductResponse } from '../../core/models/product/product-response.model';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule,ProductCard,FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  public product = inject(Product);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  minTerm: number | null = null;
  maxTerm: number | null = null;

  productList = signal<ProductResponse[]>([]);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const searchTerm = params['name'];
      const minTerm = params['minPrice'];
      const maxTerm = params['maxPrice'];

      if (searchTerm || minTerm || maxTerm) {
        this.product.searchProduct(searchTerm,undefined,minTerm,maxTerm).subscribe({
          next: (data) => {
            this.productList.set(data.content);
          },
          error: (err) => {
            console.error('Failed to search products', err);
          }
        });
      } else {
        this.product.getAllProducts().subscribe({
          next: (data) => {
            this.productList.set(data.content);
          },
          error: (err) => {
            console.error('Failed to fetch products', err);
          }
        });
      }
    });
  }
applyFilters(): void {
    const queryParams: any = {};
    const currentName = this.route.snapshot.queryParamMap.get('name');
    if (currentName) {
      queryParams.name = currentName;
    }

    if (this.minTerm) queryParams.minPrice = this.minTerm;
    if (this.maxTerm) queryParams.maxPrice = this.maxTerm;

    this.router.navigate(['/'], { queryParams });
  }
}
