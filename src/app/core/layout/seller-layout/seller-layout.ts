import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from '../../services/auth/auth';

@Component({
  selector: 'app-seller-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './seller-layout.html',
  styleUrl: './seller-layout.css',
})
export class SellerLayout {
  auth = inject(Auth);
}
