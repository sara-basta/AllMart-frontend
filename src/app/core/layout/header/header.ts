import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '../../services/auth/auth';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../services/user/user';
import { FormsModule } from '@angular/forms';
import { Cart } from '../../services/cart/cart';
import { Wishlist } from '../../services/wishlist/wishlist';

@Component({
  selector: 'app-header',
  imports: [RouterLink,FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit{

  private auth = inject(Auth);
  public user = inject(User);
  private router = inject(Router);
  private cart = inject(Cart);
  public wishlist = inject(Wishlist);

  totalItems = this.cart.cartCount;

  ngOnInit(): void {
    // when the header appears, check if we have a token
    if (this.auth.getToken()) {
      this.user.fetchAndSaveProfile();
      this.wishlist.loadWishlist();
    }
  }

  logout(): void {
    this.auth.logout();
  }

  searchTerm = '';

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.router.navigate(['catalog'], { queryParams: { name: this.searchTerm.trim() } });
    } else {
      this.router.navigate(['catalog']);
    }
  }
}
