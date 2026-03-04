import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../core/services/user/user';
import { Address } from '../../core/services/address/address';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit{
  public user = inject(User);
  private address = inject(Address);

  userAddresses = this.address.userAddresses;

  ngOnInit() {
    this.address.loadMyAddresses();
  }

  removeAddress(id: number) {
    if (confirm('Are you sure you want to delete this address?')) {
      this.address.deleteAddress(id);
    }
  }
}
