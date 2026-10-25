import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorService } from '../../../core/services/vendor/vendor.service';
import { SellerStatsResponse } from '../../../core/models/vendor/seller-stats-response.model';
import { Auth } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-seller-dashboard',
  imports: [CommonModule],
  templateUrl: './seller-dashboard.html',
  styleUrl: './seller-dashboard.css',
})
export class SellerDashboard {
  private vendorService = inject(VendorService);
  private authService = inject(Auth);
  stats = signal<SellerStatsResponse | null>(null);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId === null) {
      this.errorMessage.set('Unable to identify the seller.');
      this.isLoading.set(false);
      return;
    }

    this.vendorService.getStats(userId).subscribe({
      next: stats => {
        this.stats.set(stats);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load seller statistics.');
        this.isLoading.set(false);
      },
    });
  }
}
