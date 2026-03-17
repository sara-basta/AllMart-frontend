import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { User } from '../../core/services/user/user';
import { Address } from '../../core/services/address/address';
import { Order } from '../../core/services/order/order';
import { OrderResponse } from '../../core/models/order/order-response.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, CommonModule, DatePipe, NgClass,ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit{
  public user = inject(User);
  private address = inject(Address);
  private order = inject(Order);
  private fb = inject(FormBuilder);

  userAddresses = this.address.userAddresses;
  orders = signal<OrderResponse[]>([]);
  isLoadingOrders = signal<boolean>(true);
  activeTab = signal<'profile' | 'orders' | 'security'>('profile');

  isEditingProfile = signal(false);
  isSavingProfile = signal(false);
  profileForm!: FormGroup;
  editingAddressId = signal<number | null>(null);
  addressForm!: FormGroup;

  selectedOrder = signal<OrderResponse | null>(null);
  isLoadingDetail = signal(false);

  currentPage = signal<number>(0);
  totalPages = signal<number>(0);
  totalElements = signal<number>(0);
  pageSize = 10;

  isChangingPassword = signal(false);
  passwordSuccessMsg = signal<string | null>(null);
  passwordErrorMsg = signal<string | null>(null);

  passwordForm!: FormGroup;

  constructor() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]]
    });

    this.addressForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required]
    });

    this.passwordForm = this.fb.group({
    oldPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('newPassword')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  
  return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onChangePassword() {
  if (this.passwordForm.invalid) return;

  this.isChangingPassword.set(true);
  this.passwordErrorMsg.set(null);
  this.passwordSuccessMsg.set(null);

  this.user.changePassword(this.passwordForm.value).subscribe({
    next: (res) => {
      this.isChangingPassword.set(false);
      this.passwordSuccessMsg.set(res.message || 'Password updated successfully.');
      this.passwordForm.reset();
      
      setTimeout(() => this.passwordSuccessMsg.set(null), 4000);
    },
    error: (err) => {
      this.isChangingPassword.set(false);
      this.passwordErrorMsg.set(err.error?.message || 'Failed to update security credentials.');
    }
  });
 }

  ngOnInit() {
    this.address.loadMyAddresses();
    this.loadOrderHistory(this.currentPage());
  }

  removeAddress(id: number) {
    if (confirm('Are you sure you want to delete this address?')) {
      this.address.deleteAddress(id);
    }
  }

  startEditAddress(address: any) {
    this.editingAddressId.set(address.id);
    this.addressForm.patchValue({
      street: address.Street || address.street, 
      city: address.city,
      zipCode: address.zipCode
    });
  }

  cancelEditAddress() {
    this.editingAddressId.set(null);
    this.addressForm.reset();
  }

  saveAddress() {
    if (this.addressForm.invalid || !this.editingAddressId()) return;

    const id = this.editingAddressId()!;
    this.address.updateAddress(id, this.addressForm.value).subscribe({
      next: () => {
        this.address.loadMyAddresses(); 
        this.cancelEditAddress();
      },
      error: (err) => console.error('Failed to update address', err)
    });
  }

  loadOrderHistory(page: number = 0) {
    this.isLoadingOrders.set(true);
    this.order.getHistory(page, this.pageSize).subscribe({
      next: (res: any) => {
        this.orders.set(res.content); 
        this.totalPages.set(res.page.totalPages);
        this.totalElements.set(res.page.totalElements);
        this.currentPage.set(res.page.number);
        this.isLoadingOrders.set(false);
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.isLoadingOrders.set(false);
      }
    });
  }

  nextPage() {
    if (this.currentPage() < this.totalPages() - 1) {
      this.loadOrderHistory(this.currentPage() + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 0) {
      this.loadOrderHistory(this.currentPage() - 1);
    }
  }

  onCancelOrder(orderId: number) {
    this.order.cancelOrder(orderId).subscribe({
        next: () => {
          this.orders.update(orders =>
            orders.map(
              o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o
            )
          );
        },
        error: (err) => {
          console.error('Failed to cancel order:', err);
        }
    });
  }

  toggleEditProfile() {
    const currentUser = this.user.currentUserSignal();
    if (currentUser && !this.isEditingProfile()) {
      this.profileForm.patchValue({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName
      });
    }
    this.isEditingProfile.set(!this.isEditingProfile());
  }

  saveProfile() {
    if (this.profileForm.invalid) return;

    this.isSavingProfile.set(true);
    this.user.updateProfile(this.profileForm.value).subscribe({
      next: (updatedUser) => {
        this.user.currentUserSignal.set(updatedUser);
        this.isEditingProfile.set(false);
        this.isSavingProfile.set(false);
      },
      error: (err) => {
        console.error('Failed to update profile', err);
        this.isSavingProfile.set(false);
      }
    });
  }

  viewOrderDetails(orderId: number) {
    this.isLoadingDetail.set(true);
    this.order.getOrderById(orderId).subscribe({
        next: (data) => {
        this.selectedOrder.set(data);
        this.isLoadingDetail.set(false);
      },
      error: (err) => {
        console.error('Error fetching order details', err);
        this.isLoadingDetail.set(false);
      }
    });
  }

  backToHistory() {
    this.selectedOrder.set(null);
  }
}
