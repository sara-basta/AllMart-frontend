import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../core/services/user/user';
import { Address } from '../../core/services/address/address';
import { Order } from '../../core/services/order/order';
import { OrderResponse } from '../../core/models/order/order-response.model';

import { ProfileDetails } from './profile-details/profile-details';
import { AddressManager } from './address-manager/address-manager';
import { OrderHistory } from './order-history/order-history';
import { SecuritySettings } from './security-settings/security-settings';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ProfileDetails, AddressManager, OrderHistory, SecuritySettings],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit{
  public user = inject(User);
  private address = inject(Address);
  private order = inject(Order);

  activeTab = signal<'profile' | 'orders' | 'security'>('profile');

  isSavingProfile = signal(false);
  userAddresses = this.address.userAddresses;

  orders = signal<OrderResponse[]>([]);
  isLoadingOrders = signal<boolean>(true);
  selectedOrder = signal<OrderResponse | null>(null);
  currentPage = signal<number>(0);
  totalPages = signal<number>(0);
  totalElements = signal<number>(0);
  pageSize = 10;

  isChangingPassword = signal(false);
  passwordSuccessMsg = signal<string | null>(null);
  passwordErrorMsg = signal<string | null>(null);

  ngOnInit() {
    this.address.loadMyAddresses();
    this.loadOrderHistory(this.currentPage());
  }

  handleSaveProfile(data: any) {
    this.isSavingProfile.set(true);
    this.user.updateProfile(data).subscribe({
      next: (updatedUser) => {
        this.user.currentUserSignal.set(updatedUser);
        this.isSavingProfile.set(false);
      },
      error: (err) => {
        console.error('Failed to update profile', err);
        this.isSavingProfile.set(false);
      }
    });
  }

  handleUpdateAddress(event: {id: number, data: any}) {
    this.address.updateAddress(event.id, event.data).subscribe({
      next: () => this.address.loadMyAddresses(),
      error: (err) => console.error('Failed to update address', err)
    });
  }

  handleDeleteAddress(id: number) {
    this.address.deleteAddress(id);
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

  handleCancelOrder(orderId: number) {
    this.order.cancelOrder(orderId).subscribe({
      next: () => {
        this.orders.update(orders => orders.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));
        const currentSelected = this.selectedOrder();
        if (currentSelected?.id === orderId) this.selectedOrder.set({ ...currentSelected, status: 'CANCELLED' });
      },
      error: (err) => console.error('Failed to cancel order:', err)
    });
  }

  handleViewOrder(orderId: number) {
    this.order.getOrderById(orderId).subscribe({
      next: (data) => this.selectedOrder.set(data),
      error: (err) => console.error('Error fetching order', err)
    });
  }

  handleChangePassword(data: any) {
    this.isChangingPassword.set(true);
    this.passwordErrorMsg.set(null);
    this.passwordSuccessMsg.set(null);

    this.user.changePassword(data).subscribe({
      next: (res) => {
        this.isChangingPassword.set(false);
        this.passwordSuccessMsg.set(res.message || 'Password updated.');
        setTimeout(() => this.passwordSuccessMsg.set(null), 4000);
      },
      error: (err) => {
        this.isChangingPassword.set(false);
        this.passwordErrorMsg.set(err.error?.message || 'Update failed.');
      }
    });
  }
}
