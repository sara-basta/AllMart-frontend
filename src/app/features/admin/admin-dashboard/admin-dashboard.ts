import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { User } from '../../../core/services/user/user';
import { Product } from '../../../core/services/product/product';
@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit{

  private user = inject(User);
  private product = inject(Product);

  currentDate = new Date();
  
  metrics = signal({
    totalProducts: 0,
    totalUsers: 0
  });

  ngOnInit() {
    this.user.getUsers(undefined, 0, 1).subscribe({
      next: (res: any) => {
        this.metrics.update(m => ({ ...m, totalUsers: res.page?.totalElements || 0 }));
      },
      error: (err) => console.error('User count fetch failed', err)
    });

    this.product.getAdminProducts(0, 1).subscribe({
      next: (res: any) => {
        this.metrics.update(m => ({ ...m, totalProducts: res.page?.totalElements || 0 }));
      },
      error: (err) => console.error('Product count fetch failed', err)
    });
  }

}
