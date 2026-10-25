import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { AdminStatsResponse } from '../../../../core/models/admin/admin-stats-response.model';

@Component({
  selector: 'app-admin-dashboard-component',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  private adminService = inject(AdminService);

  stats = signal<AdminStatsResponse | null>(null);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.adminService.getStats().subscribe({
      next: stats => {
        this.stats.set(stats);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load platform statistics.');
        this.isLoading.set(false);
      },
    });
  }
}
