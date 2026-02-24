import { Component, Input } from '@angular/core';
import { ProductResponse } from '../../../core/models/product/product-response.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {

  @Input({ required: true }) product!: ProductResponse;
  
}
