import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/services/product/product';
import { ProductResponse } from '../../core/models/product/product-response.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  public product = inject(Product);

  productList: ProductResponse[] = [];

  ngOnInit(): void {
    this.product.getAllProducts().subscribe({
      next: (data) => {
        this.productList = data.content;
      },
      error: (err) => {
        console.error('Failed to fetch products', err);
      }
    });
  }
  
}
