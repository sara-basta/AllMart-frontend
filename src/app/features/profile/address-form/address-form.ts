import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Address } from '../../../core/services/address/address';
@Component({
  selector: 'app-address-form',
  imports: [ReactiveFormsModule],
  templateUrl: './address-form.html',
  styleUrl: './address-form.css',
})
export class AddressForm {
  private fb = inject(FormBuilder);
  private address = inject(Address);
  private router = inject(Router);

  addressForm: FormGroup = this.fb.group({
    street: ['', [Validators.required, Validators.minLength(5)]],
    city: ['', [Validators.required]],
    zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]]
  });

  onSubmit() {
    if (this.addressForm.valid) {
      this.address.addAddress(this.addressForm.value);
      this.router.navigate(['/profile']);
    }
  }

  cancel() {
    this.router.navigate(['/profile']);
  }
}
