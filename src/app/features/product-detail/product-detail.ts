import { ProductResponse } from './../../core/models/product/product-response.model';
import {Component, inject, OnInit, signal} from '@angular/core';
import { Product } from '../../core/services/product/product';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit{

  private product = inject(Product);
  private route = inject(ActivatedRoute);

  productRes = signal<ProductResponse | null>(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      const idString = param.get('id');
      if(idString){
        const id = Number(idString);
        this.product.getProductById(id).subscribe({
          next: (data) => {
            this.productRes.set(data);
          },
          error: (err) => {
            console.error('Failed to load product details', err);
          }
        });
      }
    }
  )};
}
