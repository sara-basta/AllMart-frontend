import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '../../services/auth/auth';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../services/user/user';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit{

  private auth = inject(Auth);
  public user = inject(User);
  private router = inject(Router);

  ngOnInit(): void {
    // when the header appears, check if we have a token
    if (this.auth.getToken()) {
      this.user.fetchAndSaveProfile(); 
    }
  }

  onLogout(): void {
    localStorage.removeItem('jwt_token');
    this.user.clearUser();
    this.router.navigate(['/home']);
  }
}
