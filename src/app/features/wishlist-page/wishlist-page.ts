import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Wishlist } from '../../core/services/wishlist/wishlist';
import { Cart } from '../../core/services/cart/cart';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist-page',
  imports: [RouterLink, CommonModule],
  templateUrl: './wishlist-page.html',
  styleUrl: './wishlist-page.css',
})
export class WishlistPage implements OnInit{
  wishlist = inject(Wishlist);
  cart = inject(Cart);

  ngOnInit() {
    // fetch from API only when cash empty
    if (this.wishlist.wishlistItems().length === 0) {
      this.wishlist.loadWishlist();
    }
  }
}
