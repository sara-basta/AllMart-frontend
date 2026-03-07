import { Component, Input,inject} from '@angular/core';
import { ProductResponse } from '../../../core/models/product/product-response.model';
import { RouterLink } from '@angular/router';
import { Cart } from '../../../core/services/cart/cart';
import { Wishlist } from '../../../core/services/wishlist/wishlist';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {

  @Input({ required: true }) product!: ProductResponse;

  private cart = inject(Cart);

  onAddToCart(event: Event) {
    //stop the click from navigating to the product details page
    event.stopPropagation();
    event.preventDefault();

    this.cart.addToCart(this.product);
  }

  wishlist = inject(Wishlist);

  
  onWishlistClick(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    this.wishlist.toggleWishlist(this.product);
  }
}
