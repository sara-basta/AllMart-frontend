import { Component, Input } from '@angular/core';
import { ProductResponse } from '../../../core/models/product/product-response.model';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {

  @Input({ required: true }) product!: ProductResponse;
  
}
