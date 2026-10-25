import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { UserResponse } from '../../../../core/models/user/user-response.model';

@Component({
  selector: 'app-admin-users-component',
  imports: [CommonModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
})
export class AdminUsersComponent {
  private adminService = inject(AdminService);

  users = signal<UserResponse[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);
  totalElements = signal(0);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(page = 0): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.adminService.getUsers(page, 20).subscribe({
      next: res => {
        this.users.set(res.content ?? []);
        this.currentPage.set(res.number ?? 0);
        this.totalPages.set(res.totalPages ?? 0);
        this.totalElements.set(res.totalElements ?? 0);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load users.');
        this.isLoading.set(false);
      },
    });
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(id).subscribe({
        next: () => {
          this.users.update(users => users.filter(u => u.id !== id));
          this.totalElements.update(total => total - 1);
        },
        error: () => {
          this.errorMessage.set('Failed to delete user.');
        }
      });
    }
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.loadUsers(newPage);
    }
  }
}
