import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/services/product/product';
import { ProductResponse } from '../../core/models/product/product-response.model';
import { ProductCard } from '../../shared/components/product-card/product-card';

@Component({
  selector: 'app-home',
  imports: [CommonModule,ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  public product = inject(Product);

  productList = signal<ProductResponse[]>([]);

  ngOnInit(): void {
    this.product.getAllProducts().subscribe({
      next: (data) => {
        this.productList.set(data.content);
      },
      error: (err) => {
        console.error('Failed to fetch products', err);
      }
    });
  }
  
}
