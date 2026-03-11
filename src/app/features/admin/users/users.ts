import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../core/services/user/user';
import { UserResponse } from '../../../core/models/user/user-response.model';
import { UserRequest } from '../../../core/models/user/user-request.model';
import { PaginatedResponse } from '../../../core/models/paginated-response.model';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit{

  private user = inject(User);

  users = signal<UserResponse[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);
  totalElements = signal(0);
  isLoading = signal(true);

  searchId = signal<number | null>(null);
  newUser: UserRequest = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'CUSTOMER'
  };

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(page: number = 0) {
    this.isLoading.set(true);
    this.user.getUsers(this.searchId() ?? undefined, page, 10).subscribe({
      next: (res: PaginatedResponse<UserResponse>) => {
        this.users.set(res.content || []);
        this.currentPage.set(res.number);
        this.totalPages.set(res.totalPages);
        this.totalElements.set(res.totalElements);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.isLoading.set(false);
      }
    });
  }

  onSearch() {
    this.loadUsers(0);
  }

  createUser() {
    if (!this.newUser.firstName || !this.newUser.email) return;

    this.user.createUser(this.newUser).subscribe({
      next: () => {
        this.newUser = { firstName: '', lastName: '', email: '', password: '', role: 'CUSTOMER' };
        this.loadUsers(this.currentPage());
      },
      error: (err) => console.error('Failed to create user', err)
    });
  }

  changePage(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.loadUsers(newPage);
    }
  }

}
